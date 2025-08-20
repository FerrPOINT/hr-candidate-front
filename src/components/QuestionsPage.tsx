import React from 'react';
// import svgPaths from "../imports/svg-86gulrgyxf";

// Простая заглушка для svgPaths
const svgPaths = {};

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
            Кандидаты
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
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          {children}
        </p>
      </div>
    </div>
  );
}

export function QuestionsPage() {
  const [activeTab, setActiveTab] = React.useState<'candidates' | 'text' | 'questions'>('questions');

  return (
    <div className="bg-[#e9eae2] relative min-h-screen">
      <div className="relative h-full">
        <div className="[flex-flow:wrap] box-border content-start flex gap-6 items-stretch justify-start p-0 relative w-full h-full">
          {/* Центрирующий контейнер для контента (ширина и отступы задаёт Layout) */}
          <div className="w-full h-full">
            <div className="flex gap-6 w-full h-full">
              {/* Questions Sidebar - Левая панель с заголовком и табами */}
              <div className="bg-[#f5f6f1] box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative rounded-[44px] shrink-0 w-[460px] h-full self-stretch">
                {/* Sidebar Header */}
                <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-2 py-0 relative shrink-0">
                  <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[32px] text-center text-nowrap">
                    <p className="block leading-[40px] whitespace-pre">Вопросы</p>
                  </div>
                </div>
                
                {/* View Toggle */}
                <div className="w-full">
                  <ViewToggle activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
              </div>

              {/* Main Content - Правая панель с контентом вкладок */}
              				<div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-[1110px] flex-1">
                {/* Tab Content */}
                <div className="w-full">
                  {activeTab === 'candidates' && (
                    <div className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full p-[24px]">
                      <h3 className="text-xl font-semibold mb-4">Кандидаты</h3>
                      <p className="text-gray-600">Список кандидатов будет отображаться здесь</p>
                    </div>
                  )}
                  {activeTab === 'text' && (
                    <div className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full p-[24px]">
                      <h3 className="text-xl font-semibold mb-4">Текст вакансии</h3>
                      <p className="text-gray-600">Текст вакансии будет отображаться здесь</p>
                    </div>
                  )}
                  {activeTab === 'questions' && (
                    <div className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full p-[24px]">
                      <h3 className="text-xl font-semibold mb-4">Вопросы собеседования</h3>
                      <div className="space-y-2">
                        <QuestionRow number={1}>
                          Расскажите о вашем опыте работы с React
                        </QuestionRow>
                        <ContentDivider />
                        <QuestionRow number={2}>
                          Какие паттерны проектирования вы используете?
                        </QuestionRow>
                        <ContentDivider />
                        <QuestionRow number={3}>
                          Как вы решаете проблемы с производительностью?
                        </QuestionRow>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}