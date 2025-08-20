import React from 'react';

interface CandidateResultsProps {
  selectedCandidate: any;
  selectedPositionId: number | null;
  onCreateInterview?: (positionId: number) => void;
  expandedAnswers: {[key: number]: boolean};
  toggleAnswer: (questionNumber: number) => void;
}

export function CandidateResults({
  selectedCandidate,
  selectedPositionId,
  onCreateInterview,
  expandedAnswers,
  toggleAnswer
}: CandidateResultsProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Карточка 1: Имя кандидата и действия */}
      <div className="bg-[#f5f6f1] relative rounded-[44px] shrink-0 w-full">
        <div className="relative size-full">
          <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
            {/* Header with Actions */}
            <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
              <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[32px] text-center text-nowrap">
                <p className="block leading-[40px] whitespace-pre">
                  {selectedCandidate?.name || 'Виктор Хомула'}
                </p>
              </div>
              
              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
                {/* Download PDF */}
                <button className="bg-[#ffffff] relative rounded-3xl shrink-0 hover:bg-[#f6f8fa] transition-colors cursor-pointer">
                  <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip px-2.5 py-3.5 relative">
                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                      <div className="css-1tg14q font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">Скачать pdf</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute border border-[#e16349] border-solid inset-0 pointer-events-none rounded-3xl" />
                </button>
                
                {/* Share Button */}
                <button className="bg-[#e16349] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0 hover:bg-[#d14a31] transition-colors cursor-pointer">
                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                    <div className="css-rpndqk font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                      <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">Поделиться</p>
                    </div>
                  </div>
                </button>
                
                {/* Interview Link */}
                <button className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0 hover:bg-[#f6f8fa] transition-colors cursor-pointer">
                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                    <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                      <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">Ссылка на интервью</p>
                    </div>
                  </div>
                </button>
                
                {/* Create Interview */}
                <button 
                  onClick={() => onCreateInterview?.(selectedPositionId || 0)}
                  className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0 hover:bg-[#f6f8fa] transition-colors cursor-pointer border border-[#e16349]"
                >
                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                    <div className="css-1tg14q font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                      <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">Создать интервью</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Candidate Stats */}
            <div className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full">
              <div className="relative size-full">
                <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
                  <div className="box-border content-stretch flex flex-row gap-16 items-center justify-start p-0 relative shrink-0 w-full">
                    {/* Rating */}
                    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px]">
                      <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866]">
                        <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Оценка</p>
                      </div>
                      <div className="css-o3fd0r font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#38c793]">
                        <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">7</p>
                      </div>
                    </div>

                    {/* Passed */}
                    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px]">
                      <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866]">
                        <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Пройдено</p>
                      </div>
                      <div className="css-o3fd0r font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#38c793]">
                        <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Да</p>
                      </div>
                    </div>

                    {/* Questions Answered */}
                    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px]">
                      <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866]">
                        <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Вопросов отвечено</p>
                      </div>
                      <div className="css-8vheua font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#000000]">
                        <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">10/10</p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[211px]">
                      <div className="box-border content-stretch flex flex-row items-center justify-between leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] w-full">
                        <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866]">
                          <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Email</p>
                        </div>
                        <div className="css-8vheua font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#000000]">
                          <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">torvik331@gmail.com</p>
                        </div>
                      </div>
                      
                      <div className="box-border content-stretch flex flex-row items-center justify-between leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] w-full">
                        <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866]">
                          <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Телефон</p>
                        </div>
                        <div className="css-8vheua font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#000000]">
                          <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">+79110165306</p>
                        </div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-52">
                      <div className="box-border content-stretch flex flex-row items-center justify-between leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] w-full">
                        <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866]">
                          <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Создано</p>
                        </div>
                        <div className="css-8vheua font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#000000]">
                          <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">18.07.25, 14:04</p>
                        </div>
                      </div>
                      
                      <div className="box-border content-stretch flex flex-row items-center justify-between leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] w-full">
                        <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866]">
                          <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Завершено</p>
                        </div>
                        <div className="css-8vheua font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#000000]">
                          <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">19.07.25, 19:20</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Карточка 2: Краткие итоги */}
      <div className="bg-[#f5f6f1] relative rounded-[44px] shrink-0 w-full">
        <div className="relative size-full">
          <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-[24px] relative w-full">
            <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[20px] text-left w-full">
              <p className="block leading-[28px]">Краткие итоги</p>
            </div>
            
            <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
              <div className="flex flex-row items-center justify-center relative size-full">
                <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-[24px] relative w-full">
                  <div className="basis-0 css-5cyu6a font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#000000] text-[14px] text-left tracking-[-0.084px]">
                    <p className="block leading-[20px]">
                      Кандидат продемонстрировал хороший опыт работы и понимание ключевых технологий, однако в ответах не хватало глубины и конкретики. Он четко объяснил причины смены работы и критерии выбора нового работодателя. Тем не менее, в некоторых ответах наблюдается подглядывание, что вызывает определенные сомнения. Общая оценка 7 из 10, что соответствует минимальным требованиям для позиции. Рекомендуется обратить внимание на углубление знаний в некоторых областях.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Карточка 3: Детали */}
      <div className="bg-[#f5f6f1] relative rounded-[44px] shrink-0 w-full">
        <div className="relative size-full">
          <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
            <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[20px] text-left w-full">
              <p className="block leading-[28px]">Детали</p>
            </div>
            
            {/* Вопрос 1 */}
            <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
              <div className="flex flex-row items-center justify-center relative size-full">
                <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-[24px] relative w-full">
                  <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
                    <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left">
                      <p className="block leading-[24px]">Вопрос 1</p>
                    </div>
                    <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                      <p className="block leading-[20px]">Вес вопроса: 7</p>
                    </div>
                  </div>
                  
                  <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left">
                    <p className="block leading-[20px]">
                      Расскажите о вашем опыте работы и о проектах на последних двух местах работы.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                      <p className="block leading-[20px]">Ответ кандидата:</p>
                    </div>
                    <button
                      onClick={() => toggleAnswer(1)}
                      className="text-[#e16349] text-[14px] hover:opacity-75 transition-opacity"
                    >
                      {expandedAnswers[1] ? 'Скрыть ответ' : 'Показать ответ'}
                    </button>
                  </div>
                  
                  {expandedAnswers[1] && (
                    <div className="bg-[#f8f9fa] rounded-[16px] p-4">
                      <p className="text-[#000000] text-[14px] leading-[20px]">
                        Я работал в компании "ТехСол" в течение 3 лет в качестве Frontend разработчика. Основной проект - это веб-приложение для управления складом с использованием React, TypeScript и Redux. Мы интегрировали систему с различными API для отслеживания товаров, управления заказами и генерации отчетов. Также участвовал в проекте по созданию мобильного приложения на React Native для водителей-курьеров.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Вопрос 2 */}
            <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
              <div className="flex flex-row items-center justify-center relative size-full">
                <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-[24px] relative w-full">
                  <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
                    <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left">
                      <p className="block leading-[24px]">Вопрос 2</p>
                    </div>
                    <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                      <p className="block leading-[20px]">Вес вопроса: 8</p>
                    </div>
                  </div>
                  
                  <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left">
                    <p className="block leading-[20px]">
                      Какие технологии и фреймворки вы используете в своей работе?
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                      <p className="block leading-[20px]">Ответ кандидата:</p>
                    </div>
                    <button
                      onClick={() => toggleAnswer(2)}
                      className="text-[#e16349] text-[14px] hover:opacity-75 transition-opacity"
                    >
                      {expandedAnswers[2] ? 'Скрыть ответ' : 'Показать ответ'}
                    </button>
                  </div>
                  
                  {expandedAnswers[2] && (
                    <div className="bg-[#f8f9fa] rounded-[16px] p-4">
                      <p className="text-[#000000] text-[14px] leading-[20px]">
                        Основные технологии: React, TypeScript, Redux, Node.js, Express. Также использую Webpack, Jest для тестирования, и различные библиотеки для UI компонентов. В последнем проекте работал с GraphQL и Apollo Client для работы с API.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Вопрос 3 */}
            <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
              <div className="flex flex-row items-center justify-center relative size-full">
                <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-[24px] relative w-full">
                  <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
                    <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left">
                      <p className="block leading-[24px]">Вопрос 3</p>
                    </div>
                    <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                      <p className="block leading-[20px]">Вес вопроса: 6</p>
                    </div>
                  </div>
                  
                  <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left">
                    <p className="block leading-[20px]">
                      Расскажите о вашем подходе к тестированию кода.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                      <p className="block leading-[20px]">Ответ кандидата:</p>
                    </div>
                    <button
                      onClick={() => toggleAnswer(3)}
                      className="text-[#e16349] text-[14px] hover:opacity-75 transition-opacity"
                    >
                      {expandedAnswers[3] ? 'Скрыть ответ' : 'Показать ответ'}
                    </button>
                  </div>
                  
                  {expandedAnswers[3] && (
                    <div className="bg-[#f8f9fa] rounded-[16px] p-4">
                      <p className="text-[#000000] text-[14px] leading-[20px]">
                        Я использую Jest для unit тестирования, React Testing Library для тестирования компонентов, и Cypress для e2e тестов. Стараюсь покрывать тестами критически важную бизнес-логику и пользовательские сценарии. Также практикую TDD подход для сложных алгоритмов.
                      </p>
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