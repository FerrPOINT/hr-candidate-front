import { motion } from 'framer-motion';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function StepProgress({ currentStep, totalSteps, className = "" }: StepProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;
          
          return (
            <div key={step} className="flex items-center">
              {/* Step Circle */}
              <motion.div
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted 
                    ? 'bg-[#e16349] text-white shadow-md' 
                    : isCurrent 
                      ? 'bg-[#e16349] text-white shadow-lg ring-4 ring-[#e16349]/20' 
                      : 'bg-white border-2 border-[#e2e4e9] text-gray-400'
                  }
                `}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: isCurrent ? 1.1 : 1, 
                  opacity: 1 
                }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.05
                }}
                whileHover={{ scale: isCurrent ? 1.15 : 1.05 }}
              >
                {/* Step number */}
                <span className={`text-sm font-medium ${
                  isCompleted || isCurrent ? 'text-white' : 'text-gray-400'
                }`}>
                  {step}
                </span>
                
                {/* Current step pulse effect */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[#e16349]/30"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.2, 0.5] 
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
              
              {/* Connector Line */}
              {index < totalSteps - 1 && (
                <motion.div 
                  className={`
                    w-6 h-0.5 mx-1 transition-all duration-500
                    ${isCompleted 
                      ? 'bg-[#e16349]' 
                      : 'bg-[#e2e4e9]'
                    }
                  `}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.1 + 0.2
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress Text */}
      <div className="ml-4 text-center">
        <p className="text-gray-600 text-sm">
          <span className="font-medium text-[#e16349]">{currentStep + 1}</span>
          <span className="mx-1">из</span>
          <span className="font-medium">{totalSteps}</span>
        </p>
      </div>
    </div>
  );
}
