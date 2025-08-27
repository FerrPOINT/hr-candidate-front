import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionResponseInterface, COMPANY_QUESTIONS, Question } from './QuestionResponseInterface';

interface CandidateQuestionsProps {
  onComplete: () => void;
  onAISpeakingChange?: (isSpeaking: boolean) => void;
  onNewMessage?: () => void;
  onAddAiMessage?: (content: string) => void;
  onAddUserMessage?: (content: string) => void;
  questionsOverride?: Question[]; // опциональный список вопросов из API
}

interface DialogHistory {
  id: string;
  question: Question;
  timestamp: Date;
}

export function CandidateQuestions({ onComplete, onAISpeakingChange, onNewMessage, onAddAiMessage, onAddUserMessage, questionsOverride }: CandidateQuestionsProps) {
  const [showIntroMessages, setShowIntroMessages] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showQuestionButtons, setShowQuestionButtons] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());
  const [showFinalMessages, setShowFinalMessages] = useState(false);
  const [finalMessageIndex, setFinalMessageIndex] = useState(0);
  const [dialogHistory, setDialogHistory] = useState<DialogHistory[]>([]);

  // Интро-сообщения отключены: сразу показываем кнопки
  useEffect(() => {
    setShowIntroMessages(false);
    setShowQuestionButtons(true);
    // Прокрутить вниз, чтобы список был в зоне видимости
    setTimeout(() => {
      onNewMessage?.();
    }, 0);
  }, []);

  // Финальные сообщения отключены: завершаем без отправки AI-сообщений
  useEffect(() => {
    if (!showFinalMessages) return;
    const t = setTimeout(() => {
      onAISpeakingChange?.(false);
      onComplete?.();
    }, 300);
    return () => clearTimeout(t);
  }, [showFinalMessages, onAISpeakingChange, onComplete]);

  const handleQuestionSelect = useCallback((question: Question) => {
    console.log('CandidateQuestions: Selecting question:', question.question);
    
    if (selectedQuestion?.id === question.id) {
      console.log('Same question selected, ignoring');
      return;
    }
    
    // Сохраняем предыдущий диалог в историю
    if (selectedQuestion) {
      setDialogHistory(prev => [
        ...prev,
        {
          id: `dialog-${selectedQuestion.id}-${Date.now()}`,
          question: selectedQuestion,
          timestamp: new Date()
        }
      ]);
    }
    
    setSelectedQuestion(question);
    setAskedQuestions(prev => new Set([...prev, question.id]));
    setShowQuestionButtons(false);
    
    // В общий чат: вопрос пользователя и ответ AI
    onAddUserMessage?.(question.question);
    onAddAiMessage?.(question.answer);
    
    // Уведомляем о новом контенте (прокрутка)
    setTimeout(() => onNewMessage?.(), 0);
  }, [selectedQuestion, onNewMessage, onAddAiMessage, onAddUserMessage]);

  const handleFinish = useCallback(() => {
    console.log('CandidateQuestions: Finishing interview');
    
    // Сохраняем текущий диалог в историю
    if (selectedQuestion) {
      setDialogHistory(prev => [
        ...prev,
        {
          id: `dialog-${selectedQuestion.id}-${Date.now()}`,
          question: selectedQuestion,
          timestamp: new Date()
        }
      ]);
    }
    
    // Добавляем сообщение пользователя в общий чат
    onAddUserMessage?.("У меня нет вопросов");
    
    // Скрываем интерфейс вопросов
    setSelectedQuestion(null);
    setShowQuestionButtons(false);
    
    // Финальные AI-сообщения отключены: просто триггерим завершение по флагу
    setTimeout(() => setShowFinalMessages(true), 200);
  }, [selectedQuestion, onAISpeakingChange, onNewMessage, onAddUserMessage]);

  const getAvailableQuestions = useCallback(() => {
    const source = (questionsOverride && questionsOverride.length > 0) ? questionsOverride : COMPANY_QUESTIONS;
    return source.filter(q => !askedQuestions.has(q.id)).slice(0, 6);
  }, [askedQuestions, questionsOverride]);

  const availableQuestions = getAvailableQuestions();

  console.log('CandidateQuestions: Rendering main interface, showIntroMessages:', showIntroMessages, 'showQuestionButtons:', showQuestionButtons, 'dialogHistory length:', dialogHistory.length, 'selectedQuestion:', selectedQuestion?.question);

  return (
    <div className="flex flex-col space-y-4">
      {/* Текущий активный диалог */}
      {selectedQuestion && (
        <QuestionResponseInterface
          selectedQuestion={selectedQuestion}
          onQuestionSelect={handleQuestionSelect}
          onFinish={handleFinish}
          availableQuestions={availableQuestions}
          onNewMessage={onNewMessage}
        />
      )}

      {/* Кнопки вопросов - 16px для карточек */}
      <AnimatePresence>
        {showQuestionButtons && !showFinalMessages && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-8 items-end justify-start w-full"
          >
            {/* Основные вопросы - ИСПРАВЛЕН текст до 16px */}
            <div className="flex flex-wrap gap-2 items-start justify-end w-full">
              {availableQuestions.map((questionData, index) => {
                const isAsked = askedQuestions.has(questionData.id);
                return (
                  <motion.button
                    key={questionData.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    onClick={() => handleQuestionSelect(questionData)}
                    disabled={isAsked}
                    className={`
                      bg-white border border-gray-200 px-6 py-3 
                      rounded-bl-[16px] rounded-tl-[16px] rounded-tr-[16px] 
                      font-Inter font-normal text-black text-[16px] leading-[20px] tracking-[-0.176px]
                      transition-all duration-200
                      ${isAsked
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-md hover:bg-white/95 hover:border-gray-300'
                      }
                    `}
                  >
                    {questionData.question}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Кнопка завершения - ИСПРАВЛЕН текст до 16px */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex flex-row gap-2 items-center justify-start"
            >
                             <button
                 onClick={handleFinish}
                 className="px-6 py-3 rounded-bl-[16px] rounded-tl-[16px] rounded-tr-[16px] font-Inter font-normal text-[16px] leading-[20px] tracking-[-0.176px] bg-[var(--interview-accent)] hover:bg-[var(--interview-accent-hover)] text-white shadow-md transition-all duration-200 hover:shadow-lg"
               >
                У меня нет вопросов
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
