import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressBar({ currentStep, totalSteps, className = "" }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Вопрос</span>
          <span className="text-sm font-medium text-[#e16349]">
            {currentStep + 1}
          </span>
          <span className="text-sm text-gray-400">из</span>
          <span className="text-sm text-gray-600">{totalSteps}</span>
        </div>
        
        <div className="text-sm font-medium text-[#e16349]">
          {Math.round(progress)}%
        </div>
      </div>
      
      {/* Progress Track */}
      <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-[#e16349] rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut" 
          }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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
  );
}
