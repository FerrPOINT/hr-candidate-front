import React from 'react';
import { Button } from '../ui/button';
import { Mic } from 'lucide-react';

interface MicrophoneCheckStageProps {
  isRecording: boolean;
  onRecordingToggle: () => void;
}

export const MicrophoneCheckStage: React.FC<MicrophoneCheckStageProps> = React.memo(({
  isRecording,
  onRecordingToggle
}) => {
  return (
    <div className="text-center">
      <div className="w-24 h-24 bg-[#35b9e9] rounded-full mx-auto mb-4 flex items-center justify-center">
        <Mic className="w-12 h-12 text-white" />
      </div>
      <p className="text-[#525866] mb-4">
        Давайте проверим ваш микрофон. Нажмите кнопку ниже для тестовой записи.
      </p>
                     <Button
          onClick={onRecordingToggle}
          className={`${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-[var(--interview-accent)] hover:bg-[var(--interview-accent-hover)]'
          } text-white px-8 py-4 font-medium shadow-md transition-all duration-200 hover:shadow-lg text-lg`}
          style={{ borderRadius: '30px', height: '56px' }}
        >
        {isRecording ? 'Остановить запись' : 'Тест микрофона'}
      </Button>
    </div>
  );
});

MicrophoneCheckStage.displayName = 'MicrophoneCheckStage';
