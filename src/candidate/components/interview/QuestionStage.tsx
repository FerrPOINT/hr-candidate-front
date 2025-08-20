import React from 'react';
import { Button } from '../ui/button';
import { Mic, Play, Pause } from 'lucide-react';

interface QuestionStageProps {
  question: string;
  isPlaying: boolean;
  isRecording: boolean;
  onPlaybackToggle: () => void;
  onRecordingToggle: () => void;
}

export const QuestionStage: React.FC<QuestionStageProps> = React.memo(({
  question,
  isPlaying,
  isRecording,
  onPlaybackToggle,
  onRecordingToggle
}) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-[#e16349] rounded-full flex items-center justify-center mr-4">
          <span className="text-white text-lg">🤖</span>
        </div>
        <div>
          <p className="font-medium text-[#0a0d14]">AI Интервьюер</p>
          <p className="text-sm text-[#525866]">Задает вопрос</p>
        </div>
      </div>
      
      <div className="bg-[#f8f9fa] rounded-xl p-4 mb-4">
        <p className="text-[#525866]">
          {question}
        </p>
      </div>
      
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button
          onClick={onPlaybackToggle}
          className="bg-[#e16349] hover:bg-[#d55a42] text-white px-4 py-2 rounded-xl"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? ' Пауза' : ' Воспроизвести'}
        </Button>
      </div>
      
      <div className="bg-[#e9eae2] rounded-xl p-4">
        <div className="text-center">
          <Button
            onClick={onRecordingToggle}
            className={`${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-[#35b9e9] hover:bg-[#2a9bd8]'
            } text-white px-6 py-3 rounded-xl transition-colors`}
          >
            <Mic className="w-4 h-4 mr-2" />
            {isRecording ? 'Остановить запись' : 'Начать запись ответа'}
          </Button>
        </div>
      </div>
    </div>
  );
});

QuestionStage.displayName = 'QuestionStage';
