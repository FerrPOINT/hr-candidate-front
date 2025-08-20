import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AudioVisualizer } from './AudioVisualizer';
import svgPaths from "../imports/svg-2hi4ux9070";
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

interface ReferenceStyleMessageProps {
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

export function ReferenceStyleMessage({ 
  message, 
  onStartRecording, 
  onStopRecording, 
  onSendAnswer,
  onPlayAudio 
}: ReferenceStyleMessageProps) {
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
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} w-full mb-6`}>
      <div className={`flex gap-4 max-w-[720px] ${message.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
        {/* Avatar for AI messages */}
        {message.sender === 'ai' && (
          <div className="flex-shrink-0 mt-2">
            <Avatar className="w-12 h-12 border-2 border-[#e16349]/20">
              <AvatarFallback className="bg-[#e16349] text-white">
                <svg
                  className="w-6 h-6"
                  fill="white"
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 15 15"
                >
                  <path d={svgPaths.p19285b00} />
                </svg>
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        <div className="flex-1">
          {/* Message bubble */}
          <div
            className={`${
              message.sender === 'ai' 
                ? 'bg-white border border-gray-200/80 shadow-sm' 
                : 'bg-[#e16349] text-white shadow-md'
            } rounded-[32px] p-8 relative`}
          >
            {/* Question header for AI questions */}
            {message.type === 'question' && message.questionNumber && (
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                <Badge variant="outline" className="bg-[#e16349]/10 text-[#e16349] border-[#e16349]/30 rounded-[20px] px-4 py-1">
                  <span style={{ 
                    fontFamily: 'Inter', 
                    fontWeight: 'var(--font-weight-medium)', 
                    fontSize: 'var(--text-sm)' 
                  }}>
                    Вопрос {message.questionNumber} из {message.totalQuestions}
                  </span>
                </Badge>
              </div>
            )}

            <div 
              className={`${
                message.sender === 'ai' ? 'text-[#000000]' : 'text-white'
              }`}
              style={{ 
                fontFamily: 'Inter', 
                fontWeight: 'var(--font-weight-normal)',
                fontSize: 'var(--text-base)',
                lineHeight: '1.5'
              }}
            >
              {message.text.split('\n').map((line, index) => (
                <p key={index} className={`${index > 0 ? 'mt-4' : ''}`}>
                  {line}
                </p>
              ))}
            </div>

            {/* Audio player for user answers */}
            {message.hasAudio && message.sender === 'user' && (
              <div className="mt-6 p-6 bg-white/20 backdrop-blur-sm rounded-[20px] border border-white/30">
                <div className="flex items-center gap-4 mb-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 w-12 h-12 p-0 rounded-full"
                    onClick={handlePlayAudio}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                  <span 
                    className="text-white/90"
                    style={{ 
                      fontFamily: 'Inter', 
                      fontWeight: 'var(--font-weight-normal)',
                      fontSize: 'var(--text-base)'
                    }}
                  >
                    Ваш ответ записан
                  </span>
                  <span 
                    className="text-white/80 ml-auto"
                    style={{ 
                      fontFamily: 'Inter', 
                      fontWeight: 'var(--font-weight-normal)',
                      fontSize: 'var(--text-base)'
                    }}
                  >
                    {message.audioLength ? formatTime(message.audioLength) : '0:00'}
                  </span>
                </div>
                <div className="h-12 bg-white/10 rounded-[12px] p-2">
                  <AudioVisualizer isActive={isPlaying} color="white" />
                </div>
              </div>
            )}
          </div>

          {/* Timestamp */}
          {message.timestamp && (
            <div className={`mt-3 text-gray-400 ${
              message.sender === 'user' ? 'text-right' : 'text-left ml-16'
            }`} style={{ 
              fontFamily: 'Inter', 
              fontWeight: 'var(--font-weight-normal)',
              fontSize: 'var(--text-sm)'
            }}>
              {message.timestamp}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Microphone test visual component
export function MicrophoneTestVisual() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Heading */}
      <div className="mb-6">
        <div
          className="text-center uppercase"
          style={{ 
            fontFamily: 'Inter Display', 
            fontWeight: 'var(--font-weight-medium)',
            fontSize: '1.25rem',
            lineHeight: '1.2'
          }}
        >
          <p className="text-[#000000]">Проверим микрофон</p>
        </div>
      </div>

      {/* Description */}
      <div className="text-center mb-8 px-4">
        <div
          className="text-[#000000]"
          style={{ 
            fontFamily: 'Inter', 
            fontWeight: 'var(--font-weight-normal)',
            fontSize: 'var(--text-base)',
            lineHeight: '1.5'
          }}
        >
          <p className="mb-2">Нажми кнопку "Тест Микрофона", чтобы</p>
          <p className="mb-2">проверить микрофон. Обрати внимание,</p>
          <p className="mb-2">когда интервью начнется уже нельзя</p>
          <p>будет перезагружать страницу.</p>
        </div>
      </div>

      {/* Microphone visualization */}
      <div className="mb-12 h-16 w-64 flex items-center justify-center">
        <svg
          className="block w-64 h-16"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 256 64"
        >
          <g>
            <path
              d="M45 29.7778V34.2222"
              stroke="#323232"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            <path
              d="M53 29.3333V34.6667"
              stroke="#323232"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            <path
              d="M45 25.3333V38.6667"
              stroke="#323232"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            <path
              d="M37 30.6667V33.3333"
              stroke="#323232"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            <path
              d="M29 28V36"
              stroke="#323232"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            <path
              d={svgPaths.p36a1e080}
              stroke="#323232"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              transform="scale(1.5)"
            />
            <path
              d={svgPaths.p9c8300}
              stroke="#323232"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              transform="scale(1.5)"
            />
            <path
              clipRule="evenodd"
              d={svgPaths.p1a6ff880}
              fillRule="evenodd"
              stroke="#323232"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              transform="translate(60, 10) scale(1.2)"
            />
            <path
              d={svgPaths.p29ad75c0}
              stroke="#323232"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              transform="translate(60, 10) scale(1.2)"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

// Recording controls component for bottom area
export function RecordingControls({ 
  isRecording, 
  onStopRecording 
}: { 
  isRecording: boolean; 
  onStopRecording: () => void; 
}) {
  if (!isRecording) return null;

  return (
    <div className="p-8">
      <div className="max-w-[800px] mx-auto">
        <div className="bg-gradient-to-r from-red-50/80 to-orange-50/80 border-2 border-[#e16349]/30 rounded-[32px] p-8 backdrop-blur-sm">
          {/* Recording indicator */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-6 h-6 bg-[#e16349] rounded-full animate-pulse" />
              <div className="absolute inset-0 w-6 h-6 bg-[#e16349] rounded-full animate-ping opacity-75" />
            </div>
            <span 
              className="text-[#e16349]"
              style={{ 
                fontFamily: 'Inter Display', 
                fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--text-h4)',
                lineHeight: '1.2'
              }}
            >
              Идет запись ответа...
            </span>
          </div>
          
          {/* Audio visualizer */}
          <div className="mb-8 h-20 bg-[#e16349]/10 rounded-[20px] p-4">
            <AudioVisualizer isActive={true} color="#e16349" />
          </div>
          
          {/* Stop recording button */}
          <div className="flex justify-center">
            <Button
              onClick={onStopRecording}
              className="bg-[#e16349] hover:bg-[#d55a42] text-white rounded-[44px] px-12 py-6 border-3 border-[#e16349] min-w-[280px] h-16"
              style={{ 
                fontFamily: 'Inter', 
                fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--text-base)'
              }}
            >
              <Send className="w-6 h-6 mr-4" />
              Отправить ответ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
