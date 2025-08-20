import { CheckCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  isComplete?: boolean;
}

export function ProgressIndicator({ current, total, isComplete = false }: ProgressIndicatorProps) {
  const progress = (current / total) * 100;

  return (
    <div className="w-full bg-white rounded-[20px] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isComplete ? (
            <CheckCircle className="w-6 h-6 text-green-500 animate-pulse" />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-[#e16349] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#e16349] animate-pulse" />
            </div>
          )}
          <span className="font-medium text-foreground">
            {isComplete ? 'Интервью завершено' : `Вопрос ${current} из ${total}`}
          </span>
        </div>
        <span className="text-muted-foreground font-medium">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-[#e16349] to-[#f17c5a] h-3 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
