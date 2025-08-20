import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Mic, MicOff, Square, CheckCircle, SkipForward } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface QuestionCardProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (status: 'completed' | 'skipped') => void;
  answerStatus?: 'completed' | 'skipped';
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
  onNext: () => void;
}

export function QuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer, 
  answerStatus, 
  isRecording, 
  onRecordingChange,
  onNext 
}: QuestionCardProps) {
  const [timeLeft, setTimeLeft] = useState(150); // 2:30 in seconds
  const [hasStartedRecording, setHasStartedRecording] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRecording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleStopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRecording, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    onRecordingChange(true);
    setHasStartedRecording(true);
  };

  const handleStopRecording = () => {
    onRecordingChange(false);
  };

  const handleSaveAnswer = () => {
    onAnswer('completed');
    handleNext();
  };

  const handleSkip = () => {
    onAnswer('skipped');
    handleNext();
  };

  const handleNext = () => {
    setTimeLeft(150);
    setHasStartedRecording(false);
    onNext();
  };

  if (answerStatus) {
    return (
      <div className="w-full">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-foreground mb-8 leading-relaxed">{question}</h2>
          
          <div className="flex items-center justify-center gap-2">
            {answerStatus === 'completed' ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-500">Сохранено</span>
              </>
            ) : (
              <>
                <SkipForward className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-orange-500">Пропущено</span>
              </>
            )}
          </div>

          {questionNumber < totalQuestions && (
            <Button onClick={onNext} className="mt-6 bg-[#e16349] hover:bg-[#d55a42]">
              Следующий вопрос
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h2 className="text-foreground mb-8 leading-relaxed">{question}</h2>
        
        {/* Timer */}
        <div className="flex items-center justify-center gap-2 text-2xl font-mono">
          <span className={`${timeLeft <= 30 ? 'text-red-500' : 'text-foreground'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Audio Visualizer */}
        {isRecording && (
          <div className="py-4 bg-secondary rounded-[20px] p-4">
            <AudioVisualizer isActive={true} />
          </div>
        )}

        {/* Recording Controls */}
        <div className="flex items-center justify-center gap-4">
          {!hasStartedRecording ? (
            <Button 
              onClick={handleStartRecording}
              size="lg"
              className="flex items-center gap-2 bg-[#e16349] hover:bg-[#d55a42] rounded-[12px]"
            >
              <Mic className="w-5 h-5" />
              Начать запись
            </Button>
          ) : isRecording ? (
            <Button 
              onClick={handleStopRecording}
              size="lg"
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-[12px]"
            >
              <Square className="w-4 h-4" />
              Остановить запись
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button 
                onClick={handleSaveAnswer}
                size="lg"
                className="flex items-center gap-2 bg-[#e16349] hover:bg-[#d55a42] rounded-[12px]"
              >
                <CheckCircle className="w-5 h-5" />
                Сохранить ответ
              </Button>
              <Button 
                onClick={handleStartRecording}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 bg-white border-[#e16349] text-[#e16349] hover:bg-[#e16349] hover:text-white rounded-[12px]"
              >
                <Mic className="w-5 h-5" />
                Записать заново
              </Button>
            </div>
          )}
        </div>

        {/* Skip Option */}
        {!isRecording && (
          <Button 
            onClick={handleSkip}
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="w-4 h-4" />
            Пропустить вопрос
          </Button>
        )}

        {/* Recording Status */}
        {isRecording && (
          <p className="text-muted-foreground">
            Говорите четко в микрофон. Запись остановится автоматически через {formatTime(timeLeft)}.
          </p>
        )}
      </div>
    </div>
  );
}
