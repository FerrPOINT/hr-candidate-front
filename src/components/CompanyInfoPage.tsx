import React from 'react';
import { 
  AddFillIconV6, 
  FlashlightLineIconV6, 
  ArrowDownSLineIconV6, 
  LucideSparklesIconV6, 
  DeleteBinLineIconV6, 
  LucideRotateCcwIcon, 
  LucideRotateCwIcon 
} from './ui/figma-icons-v6';

// Используем общую константу размера
const MAIN_CONTENT_WIDTH = 1100;

/**
 * Company Info Page Component
 * Точное воспроизведение страницы "О компании" из Figma дизайна
 */
export function CompanyInfoPage() {
  return (
    <div className="bg-[#f5f6f1] box-border content-stretch flex flex-col gap-10 items-start justify-start p-[24px] relative rounded-[44px] shrink-0 w-full">
      {/* Page Title and Description */}
      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[#000000] text-left w-full">
        <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] relative shrink-0 text-[32px] w-full">
          <p className="block leading-[40px]">О компании</p>
        </div>
        <div className="css-8vheua font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[16px] tracking-[-0.176px] w-full">
          <p className="block leading-[24px]">
            В данном разделе вы можете добавить вопросы и ответы о компании или
            вакансии, которые будут показаны кандидату после завершения интервью.
          </p>
        </div>
      </div>

      {/* Company Description Input */}
      <div className="bg-[#ffffff] h-[210px] relative rounded-[32px] shrink-0 w-full" data-name="Input">
        <div className="overflow-clip relative size-full">
          <div className="box-border content-stretch flex flex-col gap-2 h-[210px] items-start justify-start p-[24px] relative w-full">
            <div className="basis-0 css-lkao9s font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#868c98] text-[16px] text-left tracking-[-0.176px] w-full">
              <p className="block leading-[24px]">Введите описание компании</p>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
        />
      </div>

      {/* First Question Block */}
      <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
        <div className="relative size-full">
          <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
            <div className="box-border content-stretch flex flex-col gap-[18px] items-start justify-start p-0 relative shrink-0 w-full">
              {/* Question Header */}
              <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-0 relative shrink-0 w-full">
                <div className="basis-0 box-border content-stretch flex flex-row gap-[842px] grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                  <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[20px] text-left text-nowrap">
                    <p className="block leading-[28px] whitespace-pre">Вопрос 1/5</p>
                  </div>
                </div>
              </div>

              {/* Question Input */}
              <div className="box-border content-stretch flex flex-col gap-1 h-[116px] items-center justify-start p-0 relative shrink-0 w-full" data-name="Text Area [1.0]">
                <div className="basis-0 bg-[#ffffff] grow min-h-px min-w-px relative rounded-[32px] shrink-0 w-full" data-name="Input">
                  <div className="overflow-clip relative size-full">
                    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-[24px] relative size-full">
                      <div className="css-lkao9s font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#868c98] text-[16px] text-left tracking-[-0.176px] w-full">
                        <p className="block leading-[24px]">Введите вопрос, который кандидат может задать системе</p>
                      </div>
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                  />
                </div>
              </div>
            </div>

            {/* Actions Row */}
            <div className="relative shrink-0 w-full">
              <div className="flex flex-row items-center relative size-full">
                <div className="box-border content-stretch flex flex-row items-center justify-between px-6 py-0 relative w-full">
                  {/* Navigation Icons */}
                  <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0">
                    <div className="bg-muted/50 border border-border rounded-lg flex flex-row gap-0.5 items-center justify-center relative shrink-0 p-[5px] m-[5px]">
                      <button
                        disabled
                        className="relative shrink-0 size-4 cursor-pointer transition-all rounded-sm opacity-30 cursor-not-allowed"
                        data-name="chevron-left"
                      >
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                          <path d="M10 4L6 8L10 12" stroke="#a1a1aa" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                        </svg>
                      </button>
                      <button
                        disabled
                        className="relative shrink-0 size-4 cursor-pointer transition-all rounded-sm opacity-30 cursor-not-allowed"
                        data-name="chevron-right"
                      >
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                          <path d="M6 4L10 8L6 12" stroke="#a1a1aa" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                        </svg>
                      </button>
                    </div>

                  </div>

                  {/* Flashlight Icon */}
                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">

                    {/* Action Buttons */}
                    <div className="box-border content-stretch flex flex-row gap-6 items-center justify-start p-0 relative shrink-0 w-full">
                      {/* Regenerate Button */}
                      <button
                          onClick={() => {
                            // TODO: Implement regenerate functionality
                            console.log('Regenerate clicked');
                          }}
                          className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
                      >
                        <LucideSparklesIconV6 />
                        <div
                            className="bg-clip-text bg-gradient-to-b css-10jxy7 font-['Inter:Regular',_sans-serif] font-normal from-[#e16349] from-[43.75%] leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap to-[#df1c41] to-[109.37%] tracking-[-0.084px]"
                            style={{ WebkitTextFillColor: "transparent" }}
                        >
                          <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">Сгенерировать снова</p>
                        </div>
                      </button>

                      {/* Delete Button */}
                      <button
                          onClick={() => {
                            // TODO: Implement delete functionality
                            console.log('Delete clicked');
                          }}
                          className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
                      >
                        <DeleteBinLineIconV6 />
                        <div className="css-cf07vu font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#e16349] text-[14px] text-center text-nowrap tracking-[-0.084px]">
                          <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">Удалить</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Answer Input */}
            <div className="box-border content-stretch flex flex-col gap-1 h-[116px] items-center justify-start p-0 relative shrink-0 w-full" data-name="Text Area [1.0]">
              <div className="basis-0 bg-[#ffffff] grow min-h-px min-w-px relative rounded-[32px] shrink-0 w-full" data-name="Input">
                <div className="overflow-clip relative size-full">
                  <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-[24px] relative size-full">
                    <div className="css-lkao9s font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#868c98] text-[16px] text-left tracking-[-0.176px] w-full">
                      <p className="block leading-[24px]">Введите ответ на вопрос</p>
                    </div>
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
        {/* Add Manual Button */}
        <button 
          onClick={() => {
            // TODO: Implement add manual functionality
            console.log('Add manual clicked');
          }}
          className="bg-[#ffffff] relative rounded-3xl shrink-0 cursor-pointer hover:bg-[#f6f8fa] transition-colors"
          data-name="Buttons [1.0]"
        >
          <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip px-3.5 py-5 relative">
            <AddFillIconV6 />
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
              <div className="css-1tg14q font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">Добавить вручную</p>
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute border border-[#e16349] border-solid inset-0 pointer-events-none rounded-3xl"
          />
        </button>
        
        {/* Generate with AI Button */}
        <button
          onClick={() => {
            // TODO: Implement AI generation functionality
            console.log('Generate with AI clicked');
          }}
          className="bg-gradient-to-b box-border content-stretch flex flex-row from-[#e16349] gap-1 items-center justify-center overflow-clip px-3.5 py-5 relative rounded-3xl shrink-0 to-[#df1c41] to-[134.62%] hover:from-[#d14a31] hover:to-[#c81636] transition-colors cursor-pointer"
          data-name="Buttons [1.0]"
        >
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
            <div className="css-rpndqk font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[-0.176px]">
              <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">Сгенерировать с AI</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}