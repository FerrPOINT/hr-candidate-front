import { motion } from 'framer-motion';

interface CompactProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function CompactProgress({ currentStep, totalSteps, className = "" }: CompactProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Progress Info */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-[#e16349]">
          {currentStep + 1}/{totalSteps}
        </span>
        <span className="text-gray-500">•</span>
        <span className="text-gray-600">
          {Math.round(progress)}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="flex-1 h-1.5 bg-[#e2e4e9] rounded-full overflow-hidden max-w-xs">
        <motion.div
          className="h-full bg-[#e16349] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            duration: 0.5, 
            ease: "easeOut" 
          }}
        />
      </div>
    </div>
  );
}
