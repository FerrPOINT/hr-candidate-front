import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = React.memo(({ currentStep, totalSteps }) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="bg-white rounded-[32px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#0a0d14]">Прогресс</h2>
        <span className="text-sm text-[#525866]">
          {currentStep + 1} из {totalSteps}
        </span>
      </div>
      <div className="w-full bg-[#e2e4e9] rounded-full h-3">
        <div 
          className="bg-[#e16349] h-3 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';
