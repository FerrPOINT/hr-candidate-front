import React from 'react';
import { SynergyLogoFigma } from '../ui/synergy-logo-figma';

interface VacancyCreationFormProps {
  isEditMode: boolean;
  editVacancyData: any;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  handleBackToList: () => void;
  questions: Array<{
    id: string;
    text: string;
    evaluationCriteria: string;
    weight: number;
    isRequired: boolean;
    order: number;
  }>;
  setQuestions: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    text: string;
    evaluationCriteria: string;
    weight: number;
    isRequired: boolean;
    order: number;
  }>>>;
  moveQuestion: (dragIndex: number, hoverIndex: number) => void;
  QuestionCardWrapper: React.ComponentType<{ question: any; index: number }>;
}

export function VacancyCreationForm({
  isEditMode,
  editVacancyData,
  jobDescription,
  setJobDescription,
  handleBackToList,
  questions,
  setQuestions,
  moveQuestion,
  QuestionCardWrapper
}: VacancyCreationFormProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* AI Assistant Section */}
      <div className="bg-[#f5f6f1] rounded-[44px] p-6 w-full">
        <div className="space-y-6">
          {/* Back button and title */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToList}
              className="bg-white border border-[#e2e4e9] rounded-lg p-2 hover:bg-[#f6f8fa] transition-colors shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] flex items-center justify-center"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 16 16"
                stroke="#525866"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 12L6 8L10 4" />
              </svg>
            </button>
            <h2 className="text-[20px] font-medium text-[#000000]">
              {isEditMode ? `Редактирование: ${editVacancyData?.title || 'Вакансия'}` : 'Добавить позицию'}
            </h2>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0">
              <SynergyLogoFigma />
            </div>
            <div className="bg-[#ffdac2] rounded-br-3xl rounded-tl-3xl rounded-tr-3xl p-4 max-w-md">
              <p className="text-[#000000] text-[16px] leading-[24px]">
                Я помогу! Введите описание вакансии в поле ниже и нажмите Сгенерировать
              </p>
            </div>
          </div>

          <div className="bg-[#f6f8fa] rounded-[32px] border border-[#e2e4e9] min-h-[210px] p-6">
            <textarea
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(e.target.value)
              }
              placeholder="Введите описание или ключевые навыки"
              className="w-full h-full min-h-[160px] resize-none border-none outline-none bg-transparent text-[#868c98] text-[16px] leading-[24px]"
            />
          </div>

          <button
            onClick={() => {
              // TODO: Implement AI generation logic
              console.log(
                "Generating with AI:",
                jobDescription,
              );
            }}
            className="bg-gradient-to-b from-[#e16349] to-[#df1c41] text-white px-6 py-4 rounded-[20px] font-medium"
          >
            Сгенерировать
          </button>
        </div>
      </div>

      {/* Vacancy Details Section */}
      <div className="bg-[#f5f6f1] rounded-[44px] p-6 w-full">
        <div className="space-y-6">
          <h3 className="text-[18px] font-medium text-[#000000]">Детали вакансии</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-[#525866]">Название вакансии</label>
              <input
                type="text"
                placeholder="Введите название"
                className="w-full p-3 border border-[#e2e4e9] rounded-lg focus:border-[#e16349] focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-[#525866]">Уровень</label>
              <select className="w-full p-3 border border-[#e2e4e9] rounded-lg focus:border-[#e16349] focus:outline-none">
                <option>Junior</option>
                <option>Middle</option>
                <option>Senior</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-[#525866]">Минимальный балл</label>
              <input
                type="number"
                min="1"
                max="10"
                defaultValue={5}
                className="w-full p-3 border border-[#e2e4e9] rounded-lg focus:border-[#e16349] focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-[#525866]">Время на ответ</label>
              <select className="w-full p-3 border border-[#e2e4e9] rounded-lg focus:border-[#e16349] focus:outline-none">
                <option>1 мин</option>
                <option>2 мин</option>
                <option>3 мин</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-medium text-[#525866]">Тип вопросов</label>
            <select className="w-full p-3 border border-[#e2e4e9] rounded-lg focus:border-[#e16349] focus:outline-none">
              <option>В основном хард-скиллы</option>
              <option>Смешанные</option>
              <option>В основном софт-скиллы</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="bg-[#f5f6f1] rounded-[44px] p-6 w-full">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-medium text-[#000000]">Вопросы для интервью</h3>
            <div className="flex gap-2">
              <button className="bg-[#e16349] text-white px-4 py-2 rounded-lg hover:bg-[#d14a31] transition-colors">
                Сгенерировать с AI
              </button>
              <button className="bg-white text-[#e16349] border border-[#e16349] px-4 py-2 rounded-lg hover:bg-[#fef2f2] transition-colors">
                Добавить вручную
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {questions.map((question, index) => (
              <QuestionCardWrapper
                key={question.id}
                question={question}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 