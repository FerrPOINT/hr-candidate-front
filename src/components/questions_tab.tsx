import React from 'react';
import svgPaths from "./imports/svg-86gulrgyxf";

interface QuestionsTabProps {
  activeTab?: 'candidates' | 'text' | 'questions';
  onTabChange?: (tab: 'candidates' | 'text' | 'questions') => void;
}

function SwitchToggleItems({ isActive, children, onClick }: { 
  isActive: boolean; 
  children: React.ReactNode;
  onClick?: () => void;
}) {
  if (isActive) {
    return (
      <div
        className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1.5 items-center justify-center overflow-clip px-3 py-2.5 relative rounded-[20px] shadow-[0px_6px_10px_0px_rgba(27,28,29,0.06),0px_2px_4px_0px_rgba(27,28,29,0.02)] shrink-0 cursor-pointer"
        onClick={onClick}
      >
        <div className="css-cf07vu font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[14px] text-left text-nowrap tracking-[-0.084px]">
          <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
            {children}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#f5f6f1] box-border content-stretch flex flex-row gap-1.5 items-center justify-center overflow-clip px-3 py-2.5 relative rounded-[20px] shrink-0 cursor-pointer"
      onClick={onClick}
    >
      <div className="css-z8d4os font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#868c98] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          {children}
        </p>
      </div>
    </div>
  );
}

function ViewToggle({ activeTab, onTabChange }: QuestionsTabProps) {
  return (
    <div
      className="bg-[#f5f6f1] relative rounded-3xl shrink-0 w-full"
    >
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start overflow-clip p-[4px] relative">
          <SwitchToggleItems 
            isActive={activeTab === 'candidates'}
            onClick={() => onTabChange?.('candidates')}
          >
            Собеседования
          </SwitchToggleItems>
          <SwitchToggleItems 
            isActive={activeTab === 'text'}
            onClick={() => onTabChange?.('text')}
          >
            Текст вакансии
          </SwitchToggleItems>
          <SwitchToggleItems 
            isActive={activeTab === 'questions'}
            onClick={() => onTabChange?.('questions')}
          >
            Вопросы собеседования
          </SwitchToggleItems>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-3xl"
      />
    </div>
  );
}

function ContentDivider() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-0 py-[1.5px] relative shrink-0 w-full"
    >
      <div
        className="basis-0 bg-[#e2e4e9] grow h-px min-h-px min-w-px shrink-0"
      />
    </div>
  );
}

function QuestionRow({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="box-border content-stretch flex flex-row gap-6 items-center justify-start leading-[0] not-italic px-0 py-3 relative rounded-2xl shrink-0 text-[#000000] text-[14px] text-left tracking-[-0.084px] w-full">
      <div className="css-5cyu6a font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-nowrap">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          {number}
        </p>
      </div>
      <div className="basis-0 css-5cyu6a font-['Inter:Regular',_sans-serif] font-normal grow min-h-px min-w-px relative shrink-0">
        <p className="block leading-[20px]">
          {children}
        </p>
      </div>
    </div>
  );
}

function QuestionsList() {
  const questions = [
    "Можете объяснить, как вы подходите к оптимизации запросов в Oracle Database для повышения производительности сложной ETL-задачи в хранилище данных?",
    "Расскажите про свой опыт работы с ODI, что приходилось делать, с какими версиями работать.",
    "Каковы ключевые преимущества использования архитектуры Data Vault в хранилищах данных?",
    "Как вы подходите к проектированию и внедрению OLAP-моделей в хранилище данных?",
    "Расскажите, как вы подходите к проектированию архитектуры хранилища данных на Oracle с учетом требований бизнес-аналитики и как это встраивается в общую стратегию обработки больших данных?",
    "Какие существуют виды партиционирования в Oracle Database и в каких сценариях вы применяете каждый из них?",
    "Как вы бы подошли к задаче поиска и удаления дубликатов в большой таблице в хранилище данных?"
  ];

  return (
    <div className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start px-6 py-3 relative w-full">
          {questions.map((question, index) => (
            <React.Fragment key={index}>
              <QuestionRow number={index + 1}>
                {question}
              </QuestionRow>
              {index < questions.length - 1 && <ContentDivider />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export function QuestionsTab({ activeTab = 'questions', onTabChange }: QuestionsTabProps) {
  return <QuestionsList />;
} 