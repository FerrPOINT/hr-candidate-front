import { motion } from 'framer-motion';

interface ReassuranceProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ReassuranceProgress({ currentStep, totalSteps, className = "" }: ReassuranceProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const remaining = totalSteps - currentStep - 1;
  
  // Успокаивающие сообщения
  const getReassuranceText = () => {
    if (progress < 25) return "Не волнуйтесь, это займет всего несколько минут ⏰";
    if (progress < 50) return "Отлично! Вы уже прошли четверть пути 👍";
    if (progress < 75) return "Больше половины позади! Продолжайте в том же духе 💪";
    return "Осталось совсем немного! Вы почти у цели 🎯";
  };

  const getProgressText = () => {
    if (remaining === 0) return "Финальный вопрос";
    if (remaining === 1) return "Остался всего 1 вопрос";
    if (remaining <= 3) return `Осталось всего ${remaining} вопроса`;
    return `${remaining} из ${totalSteps} вопросов`;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white rounded-[20px] p-5 shadow-sm border border-[#e2e4e9]">
        {/* Header с иконкой безопасности */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="9"/>
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Интервью в процессе</h4>
            <p className="text-sm text-gray-600">{getReassuranceText()}</p>
          </div>
        </div>
        
        {/* Простой прогресс */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{getProgressText()}</span>
            <span className="text-sm font-medium text-[#e16349]">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="w-full h-2 bg-[#f5f6f1] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#e16349] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          
          {/* Заверения */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>💡 Можете пропустить любой вопрос</span>
            <span>🔒 Ваши данные защищены</span>
          </div>
        </div>
      </div>
    </div>
  );
}
