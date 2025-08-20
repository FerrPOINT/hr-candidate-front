import { motion } from 'framer-motion';

interface BlockProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function BlockProgress({ currentStep, totalSteps, className = "" }: BlockProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i);
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center gap-3">
        {/* Progress Blocks */}
        <div className="flex gap-1">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <motion.div
                key={step}
                className={`
                  h-2 transition-all duration-500 rounded-full
                  ${isCompleted 
                    ? 'bg-[#e16349] w-8' 
                    : isCurrent 
                      ? 'bg-[#e16349] w-12' 
                      : 'bg-[#e2e4e9] w-4'
                  }
                `}
                initial={{ width: 16, opacity: 0 }}
                animate={{ 
                  width: isCompleted ? 32 : isCurrent ? 48 : 16,
                  opacity: 1 
                }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.05
                }}
              />
            );
          })}
        </div>
        
        {/* Progress Text */}
        <div className="ml-4">
          <p className="text-gray-600 text-sm">
            <span className="font-medium text-[#e16349]">{currentStep + 1}</span>
            <span className="mx-1">/</span>
            <span>{totalSteps}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
