import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionResponseInterface, COMPANY_QUESTIONS, Question } from './QuestionResponseInterface';

interface CandidateQuestionsProps {
  onComplete: () => void;
  onAISpeakingChange?: (isSpeaking: boolean) => void;
  onNewMessage?: () => void;
  onAddAiMessage?: (content: string) => void;
  onAddUserMessage?: (content: string) => void;
}

interface DialogHistory {
  id: string;
  question: Question;
  timestamp: Date;
}

export function CandidateQuestions({ onComplete, onAISpeakingChange, onNewMessage, onAddAiMessage, onAddUserMessage }: CandidateQuestionsProps) {
  const [showIntroMessages, setShowIntroMessages] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showQuestionButtons, setShowQuestionButtons] = useState(false); // Изменено на false
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());
  const [showFinalMessages, setShowFinalMessages] = useState(false);
  const [finalMessageIndex, setFinalMessageIndex] = useState(0);
  const [dialogHistory, setDialogHistory] = useState<DialogHistory[]>([]);

  // Мемоизированные сообщения
  const introMessages = useMemo(() => [
    "Хорошая работа! Спасибо!",
    "Мы рассмотрим твои ответы и свяжемся с тобой как можно скорее.", 
    "А пока возможно есть вопросы, на которые я могла бы ответить ? Выбери из списка ниже."
  ], []);

  const finalMessages = useMemo(() => [
    "Отлично! Я записала всю информацию и передам ее твоему рекрутеру. Если у тебя в будущем появятся вопросы, не стесняйся обращаться к нам.",
    "Хорошего дня!"
  ], []);

  // Интро: отправляем в чат по одному
  useEffect(() => {
    if (!showIntroMessages || currentMessageIndex >= introMessages.length) {
      if (showIntroMessages && currentMessageIndex >= introMessages.length) {
        const timer = setTimeout(() => {
          setShowIntroMessages(false);
          setShowQuestionButtons(true);
          onNewMessage?.();
        }, 800);
        return () => clearTimeout(timer);
      }
      return;
    }

    const timer = setTimeout(() => {
      const content = introMessages[currentMessageIndex];
      onAddAiMessage?.(content);
      setCurrentMessageIndex(prev => prev + 1);
      onNewMessage?.();
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [showIntroMessages, currentMessageIndex, introMessages, onAddAiMessage, onNewMessage]);

  // Финальные сообщения: отправляем в чат
  useEffect(() => {
    if (!showFinalMessages || finalMessageIndex >= finalMessages.length) {
      if (showFinalMessages && finalMessageIndex >= finalMessages.length) {
        const timer = setTimeout(() => {
          onAISpeakingChange?.(false);
          onComplete?.();
        }, 1500);
        return () => clearTimeout(timer);
      }
      return;
    }

    const timer = setTimeout(() => {
      const content = finalMessages[finalMessageIndex];
      onAddAiMessage?.(content);
      setFinalMessageIndex(prev => prev + 1);
      onNewMessage?.();
    }, 1800);
    
    return () => clearTimeout(timer);
  }, [showFinalMessages, finalMessageIndex, finalMessages, onAISpeakingChange, onNewMessage, onAddAiMessage, onComplete]);

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
    
    // Уведомляем о новом контенте
    setTimeout(() => {
      onNewMessage?.();
    }, 100);
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
    
    // Показываем финальные сообщения AI после сообщения пользователя
    setTimeout(() => {
      setShowFinalMessages(true);
      setFinalMessageIndex(0);
      onAISpeakingChange?.(true);
      setTimeout(() => {
        onNewMessage?.();
      }, 100);
    }, 800);
  }, [selectedQuestion, onAISpeakingChange, onNewMessage, onAddUserMessage]);

  const getAvailableQuestions = useCallback(() => {
    return COMPANY_QUESTIONS.filter(q => !askedQuestions.has(q.id)).slice(0, 6);
  }, [askedQuestions]);

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
