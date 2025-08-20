import { motion } from 'framer-motion';

interface TimeAwareProgressProps {
  currentStep: number;
  totalSteps: number;
  estimatedTimePerQuestion?: number; // в минутах
  className?: string;
}

export function TimeAwareProgress({ 
  currentStep, 
  totalSteps, 
  estimatedTimePerQuestion = 1.5,
  className = "" 
}: TimeAwareProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const totalEstimatedTime = Math.ceil(totalSteps * estimatedTimePerQuestion);
  const remainingTime = Math.ceil((totalSteps - currentStep - 1) * estimatedTimePerQuestion);
  
  const getTimeText = (minutes: number) => {
    if (minutes < 1) return "меньше минуты";
    if (minutes === 1) return "1 минута";
    if (minutes < 5) return `${minutes} минуты`;
    return `${minutes} минут`;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Компактная информационная панель */}
      <div className="bg-gradient-to-r from-[#e16349]/5 to-[#f97316]/5 rounded-[16px] p-4 border border-[#e16349]/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e16349] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {currentStep + 1}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                Вопрос {currentStep + 1} из {totalSteps}
              </p>
              <p className="text-sm text-gray-600">
                Осталось ~{getTimeText(remainingTime)}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-medium text-[#e16349]">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-gray-500">
              ~{getTimeText(totalEstimatedTime)} всего
            </div>
          </div>
        </div>
        
        {/* Прогресс-бар с временными метками */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-[#e16349] to-[#f97316] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          
          {/* Временные метки */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>Старт</span>
            <span>{getTimeText(Math.ceil(totalEstimatedTime / 2))}</span>
            <span>~{getTimeText(totalEstimatedTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
