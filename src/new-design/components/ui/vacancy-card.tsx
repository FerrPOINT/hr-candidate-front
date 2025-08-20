import React from 'react';
import { FluentPeople20RegularV7 } from './figma-icons-v7';

interface VacancyCardProps {
  id: string;
  title: string;
  department?: string;
  manager?: string;
  level?: string;
  candidateCount: number;
  status: 'active' | 'paused' | 'archived';
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function VacancyCard({
  id,
  title,
  department,
  manager,
  level,
  candidateCount,
  status,
  isSelected = false,
  onClick,
  className = ''
}: VacancyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#38C793';
      case 'paused': return '#F27B2C';
      case 'archived': return '#DF1C41';
      default: return '#38C793';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Активная';
      case 'paused': return 'Пауза';
      case 'archived': return 'Архив';
      default: return 'Активная';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'intern': return '#E8F5E8'; // Светло-зеленый (самый младший)
      case 'junior': return '#B8E6B8'; // Зеленый
      case 'middle': return '#FFF3E0'; // Светло-оранжевый
      case 'senior': return '#FFCCBC'; // Оранжевый
      case 'lead': return '#FFCDD2'; // Светло-красный (самый старший)
      default: return '#FFF3E0'; // Middle по умолчанию
    }
  };

  const getLevelLetter = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'junior': return 'J';
      case 'middle': return 'M';
      case 'lead': return 'L';
      case 'senior': return 'S';
      case 'intern': return 'I';
      default: return 'M';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`bg-[#ffffff] box-border content-stretch flex flex-col gap-3 items-start justify-start p-[16px] relative rounded-[32px] shrink-0 w-[412px] cursor-pointer hover:shadow-lg transition-shadow ${
        isSelected ? 'border border-[#e16349]' : ''
      } ${className}`}
    >
      <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-0 relative shrink-0 w-full">
        <div className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start min-h-px min-w-0 p-0 relative">
          <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative text-[#000000] text-[18px] text-left w-full">
            <p className="block leading-[22px] line-clamp-2 whitespace-normal break-words">{title}</p>
          </div>
          <div className="css-uh5y02 font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866] text-[14px] tracking-[-0.176px]">
            <p className="block leading-[20px]">Разработка, Javascript, React...</p>
          </div>
        </div>
        
        <div className="relative rounded-full shrink-0 size-6 flex items-center justify-center" style={{ backgroundColor: getLevelColor(level || '') }}>
          <span className="text-white font-bold text-[14px] leading-none">{getLevelLetter(level || '')}</span>
        </div>
      </div>

      <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
        <div className="bg-[#f6f8fa] box-border content-stretch flex flex-row items-center justify-start px-1.5 py-1 relative rounded-2xl shrink-0">
          <FluentPeople20RegularV7 />
          <div className="css-8vheua font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-center tracking-[-0.176px] w-[30px]">
            <p className="adjustLetterSpacing block leading-[20px]">{candidateCount}</p>
          </div>
        </div>
        
        <div className="bg-[#ffffff] relative rounded-2xl shrink-0">
          <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip pl-1 pr-2 py-1.5 relative">
            <div className="relative shrink-0 size-3">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                <circle cx="6" cy="6" fill={getStatusColor(status)} r="2.5" />
              </svg>
            </div>
            <div className="css-5e50oj font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[11px] text-left text-nowrap">
              <p className="block leading-[14px] whitespace-pre">{getStatusLabel(status)}</p>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute border border-[#e2e4e9] border-solid inset-0 pointer-events-none rounded-2xl"
          />
        </div>
      </div>
    </button>
  );
} 