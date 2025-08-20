import React from 'react';

interface TabOption {
  id: string;
  label: string;
}

interface TabToggleProps {
  options: TabOption[];
  activeTab: string;
  onTabChange: (tabId: any) => void;
  className?: string;
  radius?: string;
}

export function TabToggle({ 
  options, 
  activeTab, 
  onTabChange, 
  className = '',
  radius = 'rounded-[20px]'
}: TabToggleProps) {
  return (
    <div className={`bg-[#f5f6f1] box-border content-stretch flex flex-row gap-0 items-center justify-start p-1 relative ${radius} ${className}`}>
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onTabChange(option.id)}
          className={`basis-0 grow min-h-px min-w-px relative ${radius} shrink-0 cursor-pointer transition-all duration-200 ${
            activeTab === option.id 
              ? "bg-[#ffffff] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.06),0px_1px_2px_0px_rgba(0,0,0,0.02)]" 
              : "bg-transparent hover:bg-[#ffffff]/50"
          }`}
        >
          <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
            <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-center px-4 py-2 relative w-full">
              <div
                className={`font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap tracking-[-0.176px] transition-colors duration-200 ${
                  activeTab === option.id ? "text-[#e16349]" : "text-[#868c98]"
                }`}
              >
                <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                  {option.label}
                </p>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
} 