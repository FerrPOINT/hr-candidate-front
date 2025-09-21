import { motion } from 'framer-motion';
import { Bot, User, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { QuestionTimer } from './QuestionTimer';

interface InterviewChatMessageProps {
  type: 'ai' | 'user';
  content: string;
  isTyping?: boolean;
  category?: string;
  duration?: number;
  isRecorded?: boolean;
  isSaved?: boolean;
  recordingTime?: number;
  questionTimeLimit?: number;
  onTimeUp?: () => void;
  isQuestionActive?: boolean;
  className?: string;
}

export function InterviewChatMessage({ 
  type, 
  content, 
  isTyping = false,
  category,
  duration,
  isRecorded = false,
  isSaved = false,
  recordingTime,
  questionTimeLimit,
  onTimeUp,
  isQuestionActive = false,
  className = ""
}: InterviewChatMessageProps) {
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className={`flex gap-3 w-full ${type === 'user' ? 'justify-end' : 'justify-start'} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      
      {/* Avatar - only for AI messages */}
      {type === 'ai' && (
        <div className="flex-shrink-0">
          <Avatar className="w-10 h-10 border-2 border-interview-accent/20 shadow-sm">
            <AvatarFallback className="bg-interview-accent/10 text-interview-accent">
              <Bot className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-[70%] ${type === 'user' ? 'order-first' : ''}`}>
        


        {/* Message Bubble */}
        <motion.div 
          className={`rounded-[20px] p-4 relative ${ 
            type === 'ai' 
              ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
              : isRecorded 
                ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
                : 'bg-interview-accent text-white shadow-sm'
          }`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          
          {/* AI message content */}
          {type === 'ai' && (
            <>
              {isTyping ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-900">Печатает</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-interview-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-interview-accent/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-interview-accent/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              ) : (
                <>
                  <p className="leading-relaxed text-gray-900 mb-0">
                    {content}
                  </p>
                  
                  {/* Таймер вопроса для активных AI вопросов с категорией */}
                  {category && isQuestionActive && questionTimeLimit && (
                    <div className="mt-4">
                      <QuestionTimer 
                        timeLimit={questionTimeLimit}
                        onTimeUp={onTimeUp}
                        isActive={isQuestionActive}
                      />
                    </div>
                  )}
                  
                  {/* Recording time display for AI questions when user is recording */}
                  {recordingTime !== undefined && (
                    <motion.div 
                      className="text-center mt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-2 rounded-full">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-600 font-mono">
                          {formatDuration(recordingTime)}
                        </span>
                      </div>
                    </motion.div>
                  )}
                  {/* Saved status for answered questions */}
                  {isSaved && (
                    <motion.div 
                      className="flex items-center justify-center gap-2 mt-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 text-sm">Сохранено</span>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </>
          )}

          {/* User message content */}
          {type === 'user' && !isRecorded && (
            <p className="leading-relaxed text-white">
              {content}
            </p>
          )}
        </motion.div>


      </div>

      {/* Avatar for user messages */}
      {type === 'user' && (
        <div className="flex-shrink-0">
          <Avatar className="w-10 h-10 border-2 border-gray-200 shadow-sm">
            <AvatarFallback className="bg-gray-100 text-gray-600">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </motion.div>
  );
}
