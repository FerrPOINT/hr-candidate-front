
import { CircularProgress } from './CircularProgress';

interface QuestionHeaderProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function QuestionHeader({ 
  currentStep, 
  totalSteps, 
  className = "" 
}: QuestionHeaderProps) {
  return (
    <div className={`flex items-center gap-3 justify-start w-full ${className}`}>
      <CircularProgress 
        currentStep={currentStep}
        totalSteps={totalSteps}
        size="xs"
      />
      <span className="text-sm text-gray-600">
        Вопрос {currentStep + 1} из {totalSteps}
      </span>
    </div>
  );
}
