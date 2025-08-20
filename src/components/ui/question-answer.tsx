import React from 'react';
import { LucideCheckIcon, LucideXIcon, FlashlightLineIcon, LucideMessageCircleIcon, ArrowDownSLineIcon, ArrowUpSLineIcon } from './figma-icons-v5';

interface QuestionAnswerProps {
  questionNumber: number;
  questionText: string;
  answer?: string;
  aiComment: string;
  rating: number;
  isPassed: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

/**
 * Question Answer Component
 * Точное воспроизведение блока вопроса и ответа из Figma дизайна
 */
export function QuestionAnswer({
  questionNumber,
  questionText,
  answer,
  aiComment,
  rating,
  isPassed,
  isExpanded = false,
  onToggle
}: QuestionAnswerProps) {
  return (
    <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
          {/* Question Header */}
          <div className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full">
            <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
              <div className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[20px] text-left text-nowrap">
                  <p className="block leading-[28px] whitespace-pre">Вопрос {questionNumber}</p>
                </div>
                
                <div className={`${isPassed ? 'bg-[#38c793]' : 'bg-[#df1c41]'} box-border content-stretch flex flex-row gap-2.5 items-center justify-start overflow-clip p-[4px] relative rounded-[100px] shrink-0`}>
                  {isPassed ? <LucideCheckIcon size={16} /> : <LucideXIcon size={16} />}
                </div>
              </div>
              
              <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start pl-3.5 pr-2 py-2 relative rounded-3xl shrink-0">
                <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0">
                  <div className="css-sb4kmc font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                    <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">Вес вопроса:</p>
                  </div>
                  
                  <div className="bg-[#ffffff] relative rounded-[20px] shrink-0">
                    <div className="box-border content-stretch flex flex-row gap-0.5 items-center justify-start overflow-clip p-[6px] relative">
                      <FlashlightLineIcon size={20} />
                    </div>
                    <div
                      aria-hidden="true"
                      className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left tracking-[-0.176px] w-full">
              <p className="block leading-[24px]">{questionText}</p>
            </div>
          </div>

          {/* AI Comment */}
          <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-0 relative shrink-0 w-full">
            <div className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0 w-full">
              <LucideMessageCircleIcon />
              <div className="css-7dow9l font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[12px] text-left text-nowrap">
                <p className="block leading-[16px] whitespace-pre">ИИ комментарий</p>
              </div>
            </div>
            
            <div className="css-5cyu6a font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left tracking-[-0.084px] w-full">
              <p className="block leading-[20px]">{aiComment}</p>
            </div>
          </div>

          {/* Rating and Toggle Button */}
          <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
            <div className="css-7dow9l font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[12px] text-left text-nowrap">
              <p className="block leading-[16px] whitespace-pre">Оценка: {rating}</p>
            </div>
            
            <button
              onClick={onToggle}
              className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[10px] relative rounded-3xl shrink-0 hover:bg-gray-50 transition-colors"
            >
              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                <div className="css-pqa1oh font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[12px] text-center text-nowrap">
                  <p className="block leading-[16px] whitespace-pre">
                    {isExpanded ? 'Скрыть ответ' : 'Показать ответ'}
                  </p>
                </div>
              </div>
              {isExpanded ? <ArrowUpSLineIcon /> : <ArrowDownSLineIcon />}
            </button>
          </div>

          {/* Candidate Answer (when expanded) */}
          {isExpanded && answer && (
            <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full">
              <div className="css-5cyu6a font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left tracking-[-0.084px] w-full">
                <p className="block leading-[20px]">{answer}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}