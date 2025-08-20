import { motion } from 'framer-motion';

interface MinimalProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function MinimalProgress({ currentStep, totalSteps, className = "" }: MinimalProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-medium text-[#e16349]">
            {String(currentStep + 1).padStart(2, '0')}
          </span>
          <span className="text-sm text-gray-400 mb-1">
            /{String(totalSteps).padStart(2, '0')}
          </span>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Прогресс
          </div>
          <div className="text-lg font-medium text-[#e16349]">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
      
      {/* Thin Progress Line */}
      <div className="w-full h-1 bg-[#e2e4e9] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#e16349] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            duration: 0.6, 
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      </div>
    </div>
  );
}
