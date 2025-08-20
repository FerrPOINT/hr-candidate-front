import React from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = React.memo(({
  currentStep,
  totalSteps,
  isLoading,
  onBack,
  onNext
}) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between">
      <Button
        onClick={onBack}
        disabled={currentStep === 0}
        className="px-6 py-3 bg-[#868c98] text-white rounded-xl hover:bg-[#6c737f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Назад
      </Button>
      
      <Button
        onClick={onNext}
        disabled={isLoading}
        className="px-6 py-3 bg-[#e16349] text-white rounded-xl hover:bg-[#d14a31] disabled:opacity-50 transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Загрузка...
          </span>
        ) : isLastStep ? 'Завершить' : 'Далее'}
      </Button>
    </div>
  );
});

NavigationButtons.displayName = 'NavigationButtons';
