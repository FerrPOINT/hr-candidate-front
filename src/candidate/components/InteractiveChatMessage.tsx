import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AudioVisualizer } from './AudioVisualizer';
import { 
  User, 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  Play, 
  Pause, 
  CheckCircle, 
  SkipForward,
  Clock,
  MessageSquare
} from 'lucide-react';

interface InteractiveChatMessageProps {
  message: {
    id: string;
    text: string;
    sender: 'ai' | 'user';
    timestamp?: string;
    type?: 'welcome' | 'question' | 'answer' | 'system' | 'action';
    actions?: Array<{
      id: string;
      label: string;
      type: 'primary' | 'secondary' | 'danger';
      onClick: () => void;
    }>;
    isRecording?: boolean;
    hasAudio?: boolean;
    audioLength?: number;
    questionNumber?: number;
    totalQuestions?: number;
  };
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onSendAnswer?: () => void;
  onPlayAudio?: () => void;
}

export function InteractiveChatMessage({ 
  message, 
  onStartRecording, 
  onStopRecording, 
  onSendAnswer,
  onPlayAudio 
}: InteractiveChatMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
    onPlayAudio?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="w-10 h-10">
          <AvatarFallback className={`${
            message.sender === 'ai' 
              ? 'bg-[#e16349] text-white' 
              : 'bg-secondary text-secondary-foreground'
          }`}>
            {message.sender === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
        {/* Message bubble */}
        <div className={`rounded-[20px] p-4 ${
          message.sender === 'ai' 
            ? 'bg-white border border-muted' 
            : 'bg-[#e16349] text-white'
        }`}>
          {/* Question header for AI questions */}
          {message.type === 'question' && message.questionNumber && (
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-muted">
              <Badge variant="outline" className="bg-[#e16349]/10 text-[#e16349] border-[#e16349]/20">
                Вопрос {message.questionNumber} из {message.totalQuestions}
              </Badge>
            </div>
          )}

          <p className={`${message.sender === 'ai' ? 'text-foreground' : 'text-white'}`}>
            {message.text}
          </p>

          {/* Audio player for user answers */}
          {message.hasAudio && message.sender === 'user' && (
            <div className="mt-3 p-3 bg-white/10 rounded-[12px] flex items-center gap-3">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
                onClick={handlePlayAudio}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <div className="flex-1 h-8 bg-white/20 rounded-full flex items-center px-2">
                <AudioVisualizer isActive={isPlaying} color="white" />
              </div>
              <span className="text-white text-sm">
                {message.audioLength ? formatTime(message.audioLength) : '0:00'}
              </span>
            </div>
          )}
        </div>

        {/* Recording indicator */}
        {message.isRecording && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-[12px] flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-700 text-sm">Идет запись...</span>
            <div className="flex-1">
              <AudioVisualizer isActive={true} color="#ef4444" />
            </div>
            <Button
              size="sm"
              onClick={onStopRecording}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <MicOff className="w-4 h-4 mr-1" />
              Остановить
            </Button>
          </div>
        )}

        {/* Action buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.actions.map((action) => (
              <Button
                key={action.id}
                onClick={action.onClick}
                variant={action.type === 'primary' ? 'default' : 'outline'}
                size="sm"
                className={`rounded-[12px] ${
                  action.type === 'primary' 
                    ? 'bg-[#e16349] hover:bg-[#d55a42] text-white' 
                    : action.type === 'danger'
                      ? 'border-red-200 text-red-600 hover:bg-red-50'
                      : 'border-muted hover:bg-secondary'
                }`}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        {message.timestamp && (
          <div className={`mt-2 text-xs text-muted-foreground ${
            message.sender === 'user' ? 'text-right' : 'text-left'
          }`}>
            {message.timestamp}
          </div>
        )}
      </div>
    </div>
  );
}
