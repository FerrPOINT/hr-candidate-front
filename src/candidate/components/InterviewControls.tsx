import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Mic, Square, SkipForward, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InterviewControlsProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSkipQuestion: () => void;
  isRecording: boolean;
  maxDuration: number; // in seconds
  className?: string;
}

export function InterviewControls({
  onStartRecording,
  onStopRecording,
  onSkipQuestion,
  isRecording,
  maxDuration,
  className = ""
}: InterviewControlsProps) {
  const [timeLeft, setTimeLeft] = useState(maxDuration);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Answer timer (counts down from maxDuration)
  useEffect(() => {
    setTimeLeft(maxDuration);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    timerRef.current = timer;
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [maxDuration]);

  // Auto skip when timer reaches 0
  useEffect(() => {
    if (timeLeft === 0) {
      onSkipQuestion();
    }
  }, [timeLeft, onSkipQuestion]);

  // Recording timer (counts up while recording)
  useEffect(() => {
    if (isRecording) {
      setRecordingDuration(0);
      
      const recordingTimer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      recordingTimerRef.current = recordingTimer;
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingDuration(0);
    }
    
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 30) return 'text-red-500';
    if (timeLeft <= 60) return 'text-orange-500';
    return 'text-gray-600';
  };

  const handleRecordingAction = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Timer Display */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className={`w-4 h-4 ${getTimerColor()}`} />
          <span className={`font-mono text-lg font-medium ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <p className="text-gray-500 text-sm">времени на ответ</p>
        
        {/* Recording duration when recording */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mt-2"
            >
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="font-mono text-red-500 font-medium">
                  {formatTime(recordingDuration)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Control Buttons */}
      <motion.div 
        className="flex items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        
        {/* Record/Stop Button */}
        <Button
          onClick={handleRecordingAction}
          className={`w-16 h-16 rounded-full text-white shadow-lg transition-all ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-[#e16349] hover:bg-[#d55a42] hover:scale-105'
          }`}
        >
          {isRecording ? (
            <Square className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>

        {/* Skip Button */}
        <Button
          onClick={onSkipQuestion}
          variant="outline" 
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
        >
          <SkipForward className="w-5 h-5 text-gray-600" />
          <span className="text-gray-600 font-medium">Пропустить</span>
        </Button>
      </motion.div>

      {/* Instructions */}
      <motion.p 
        className="text-center text-gray-600 text-sm max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {isRecording 
          ? 'Говорите четко и развернуто. Нажмите квадрат для завершения записи.'
          : 'Нажмите на микрофон для записи ответа или пропустите вопрос'
        }
      </motion.p>

    </div>
  );
}
