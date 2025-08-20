import { motion } from 'framer-motion';

interface ProminentProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProminentProgress({ currentStep, totalSteps, className = "" }: ProminentProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const remaining = totalSteps - currentStep - 1;
  
  // Мотивирующие сообщения в зависимости от прогресса
  const getMotivationText = () => {
    if (progress < 30) return "Отличное начало! 🚀";
    if (progress < 70) return "Уже на полпути! 💪";
    if (progress < 90) return "Почти готово! 🎯";
    return "Финишная прямая! 🏁";
  };

  const getRemainingText = () => {
    if (remaining === 0) return "Последний вопрос!";
    if (remaining === 1) return "Остался 1 вопрос";
    if (remaining < 5) return `Осталось ${remaining} вопроса`;
    return `Осталось ${remaining} вопросов`;
  };

  return (
    <motion.div 
      className={`w-full ${className}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Основная карточка прогресса */}
      <div className="bg-white rounded-[20px] p-6 shadow-lg border border-[#e2e4e9]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {getMotivationText()}
            </h3>
            <p className="text-sm text-gray-600">
              {getRemainingText()}
            </p>
          </div>
          
          {/* Круговой индикатор */}
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e2e4e9"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e16349"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 40}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - progress / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium text-[#e16349]">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Линейный прогресс-бар */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Прогресс интервью</span>
            <span className="font-medium text-[#e16349]">
              {currentStep + 1} из {totalSteps}
            </span>
          </div>
          
          <div className="w-full h-3 bg-[#f5f6f1] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#e16349] to-[#f97316] rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Анимированный блеск */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ 
                  x: ['-100%', '100%']
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 3
                }}
              />
            </motion.div>
          </div>
        </div>
        
        {/* Мини-этапы */}
        <div className="flex justify-between mt-4 px-1">
          {Array.from({ length: Math.min(totalSteps, 8) }, (_, i) => {
            const stepIndex = Math.floor((i * totalSteps) / Math.min(totalSteps, 8));
            const isActive = stepIndex <= currentStep;
            
            return (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-[#e16349]' : 'bg-[#e2e4e9]'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
