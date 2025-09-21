import { motion } from 'framer-motion';

interface CircularProgressProps {
  currentStep: number;
  totalSteps: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function CircularProgress({ 
  currentStep, 
  totalSteps, 
  size = 'md',
  className = "" 
}: CircularProgressProps) {
  const progress = (currentStep / totalSteps) * 100;
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const sizeClasses = {
    xs: 'w-16 h-2', // Линейная полоска для маленького размера
    sm: 'w-16 h-16',
    md: 'w-20 h-20', 
    lg: 'w-24 h-24'
  };
  
  
  // Для размера xs показываем линейный прогресс
  if (size === 'xs') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`relative ${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden`}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: 'var(--interview-accent)' }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center gap-4">
        {/* Circular Progress */}
        <div className={`relative ${sizeClasses[size]}`}>
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e2e4e9"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="var(--interview-accent)"
              strokeWidth="6"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          
          {/* Empty center - just the circle indicator */}
        </div>
        

      </div>
    </div>
  );
}
