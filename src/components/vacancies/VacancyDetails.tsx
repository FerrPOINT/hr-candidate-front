import React from 'react';
import { ArrowDownSLineIconV7 } from '../ui/figma-icons-v7';

interface VacancyDetailsProps {
  selectedPosition: any;
  currentVacancyStatus: "active" | "paused" | "archived";
  setCurrentVacancyStatus: (status: "active" | "paused" | "archived") => void;
  vacancyStatusDropdownOpen: boolean;
  setVacancyStatusDropdownOpen: (open: boolean) => void;
}

export function VacancyDetails({
  selectedPosition,
  currentVacancyStatus,
  setCurrentVacancyStatus,
  vacancyStatusDropdownOpen,
  setVacancyStatusDropdownOpen
}: VacancyDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-[#10b981]';
      case 'paused': return 'text-[#f59e0b]';
      case 'archived': return 'text-[#6b7280]';
      default: return 'text-[#6b7280]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'paused': return 'Приостановлена';
      case 'archived': return 'Архивирована';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
          <div className="box-border content-stretch flex flex-row items-start justify-between p-0 relative shrink-0 w-full">
            <div className="box-border content-stretch flex flex-row gap-[68px] items-center justify-start p-0 relative shrink-0">
              <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[181px]">
                <div className="box-border content-stretch flex flex-row font-['Inter:Regular',_sans-serif] font-normal gap-2 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px]">
                  <div className="css-bbeeyw relative shrink-0 text-[#525866]">
                    <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                      Созданно
                    </p>
                  </div>
                </div>
                <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap tracking-[-0.176px]">
                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                    15.07.2024
                  </p>
                </div>
              </div>

              <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[181px]">
                <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-left text-nowrap tracking-[-0.176px]">
                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                    Топик
                  </p>
                </div>
                <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap tracking-[-0.176px]">
                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                    Frontend
                  </p>
                </div>
              </div>

              <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[181px]">
                <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-left text-nowrap tracking-[-0.176px]">
                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                    Минимальный балл
                  </p>
                </div>
                <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap tracking-[-0.176px]">
                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                    7
                  </p>
                </div>
              </div>

              <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[181px]">
                <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-left text-nowrap tracking-[-0.176px]">
                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                    Средний балл
                  </p>
                </div>
                <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap tracking-[-0.176px]">
                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                    8.2
                  </p>
                </div>
              </div>

              <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[181px]">
                <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-left text-nowrap tracking-[-0.176px]">
                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                    Исполнитель
                  </p>
                </div>
                <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap tracking-[-0.176px]">
                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                    Наталья
                  </p>
                </div>
              </div>
            </div>

            <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0">
              <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-left text-nowrap tracking-[-0.176px]">
                <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                  Статус
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setVacancyStatusDropdownOpen(!vacancyStatusDropdownOpen)}
                  className="flex items-center gap-2 bg-white border border-[#e2e4e9] rounded-lg px-3 py-2 hover:bg-[#f6f8fa] transition-colors"
                >
                  <span className={`text-[14px] font-medium ${getStatusColor(currentVacancyStatus)}`}>
                    {getStatusText(currentVacancyStatus)}
                  </span>
                  <ArrowDownSLineIconV7 />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 