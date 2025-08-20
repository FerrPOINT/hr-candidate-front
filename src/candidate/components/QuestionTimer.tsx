import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface QuestionTimerProps {
  timeLimit: number; // в секундах
  onTimeUp?: () => void;
  isActive?: boolean;
  className?: string;
}

export function QuestionTimer({ 
  timeLimit = 150, 
  onTimeUp,
  isActive = true,
  className = "" 
}: QuestionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  // Сброс таймера при изменении лимита времени
  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerStyle = () => {
    if (timeLeft < 30) return {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-600'
    };
    if (timeLeft < 60) return {
      bg: 'bg-orange-50 border-orange-200',
      text: 'text-orange-600'
    };
    return {
      bg: 'bg-gray-50 border-gray-200',
      text: 'text-gray-700'
    };
  };

  const style = getTimerStyle();

  return (
    <div className={`${className}`}>
      <div className={`rounded-lg p-3 ${style.bg}`}>
        <div className="flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={style.text}>
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          <motion.span 
            className={`text-sm font-medium ${style.text}`}
            animate={{ 
              scale: timeLeft < 10 ? [1, 1.05, 1] : 1 
            }}
            transition={{ 
              duration: 0.5, 
              repeat: timeLeft < 10 ? Infinity : 0 
            }}
          >
            {formatTime(timeLeft)}
          </motion.span>
        </div>
      </div>
    </div>
  );
}
