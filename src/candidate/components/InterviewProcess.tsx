import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from './';
import { HelpModal, HelpButton, WMTLogo } from './';
import { InstructionsModal } from './InstructionsModal';
import { AIAvatarWithWaves } from './AIAvatarWithWaves';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import types and utilities
import { ProcessStage, AIMessage, QuestionCard } from './interview/types';
import { processQuestions, readingText } from './interview/constants';
import { createQuestionCard, markQuestionAsCompleted, updateQuestionTime } from './interview/utils';

// Import components
import { MessageBubble } from './interview/MessageBubble';
import { QuestionProgressIndicator } from './interview/QuestionProgressIndicator';
import { QuestionCardComponent } from './interview/QuestionCardComponent';
import { MicrophoneTestCard } from './interview/MicrophoneTestCard';
import { ReadingTestCard } from './interview/ReadingTestCard';
import { CandidateQuestions } from './CandidateQuestions';

export function InterviewProcess() {
  const [stage, setStage] = useState<ProcessStage>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(150);
  const [isRecording, setIsRecording] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [messages, setMessages] = useState<(AIMessage | { id: string; content: string; isVisible: boolean; isNew: boolean; isUser: boolean })[]>([]);
  const [questionCards, setQuestionCards] = useState<QuestionCard[]>([]); // Оставляем для совместимости
  const [userResponse, setUserResponse] = useState(''); // Оставляем для совместимости
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(true);
  const [showMicrophoneCard, setShowMicrophoneCard] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Мемоизированные welcome сообщения
  const welcomeMessages = useMemo(() => [
    { id: '1', content: 'Привет !', isVisible: false },
    { id: '2', content: 'Я твой виртуальный интервьюер.', isVisible: false },
    { id: '3', content: 'Я запрограммирована оценить твои знания с помощью ряда фундаментальных вопросов. Для ответа на каждый вопрос у тебя будет 2 минуты 30 секунд.', isVisible: false },
    { id: '4', content: 'Чтобы записать ответ, нужно будет использовать микрофон. Давай проверим, что он включен и работает.', isVisible: false }
  ], []);

  // НАДЕЖНАЯ функция автоскролла с несколькими попытками
  const scrollToBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Несколько попыток скролла для надежности
    const scroll = () => {
      container.scrollTop = container.scrollHeight;
    };

    // Немедленная попытка
    scroll();
    
    // Попытка через requestAnimationFrame
    requestAnimationFrame(scroll);
    
    // Попытка через setTimeout
    setTimeout(scroll, 50);
    
    // Финальная попытка через больший timeout
    setTimeout(scroll, 200);
  }, []);

  // Initialize welcome messages
  useEffect(() => {
    console.log('🟢 InterviewProcess: Initializing welcome messages');
    
    setMessages(welcomeMessages);
    setCurrentMessageIndex(0);
    setIsAISpeaking(true);
    setShowMicrophoneCard(false);
    
    const showNextMessage = (index: number) => {
      console.log(`📝 Showing message ${index + 1}/${welcomeMessages.length}`);
      
      if (index < welcomeMessages.length) {
        setMessages(prev => prev.map((msg, i) => 
          i === index ? { ...msg, isVisible: true, isNew: true } : msg
        ));
        setCurrentMessageIndex(index);
        
        // Скролл после сообщения
        scrollToBottom();
        
        setTimeout(() => {
          setMessages(prev => prev.map((msg, i) => 
            i === index ? { ...msg, isNew: false } : msg
          ));
        }, 500);
        
        const delay = Math.max(1000, welcomeMessages[index].content.length * 50);
        messageTimerRef.current = setTimeout(() => {
          showNextMessage(index + 1);
        }, delay);
      } else {
        console.log('📝 All messages shown, adding microphone card to messages');
        messageTimerRef.current = setTimeout(() => {
          const microphoneCard = { 
            id: 'microphone-card', 
            content: 'microphone-card', 
            isVisible: true, 
            isNew: true,
            type: 'microphone-card'
          } as any;
          setMessages(prev => [...prev, microphoneCard]);
          setShowMicrophoneCard(true);
          setIsAISpeaking(false);
          
          // Агрессивный скролл после добавления карточки
          setTimeout(() => scrollToBottom(), 10);
          setTimeout(() => scrollToBottom(), 100);
          setTimeout(() => scrollToBottom(), 300);
        }, 1000);
      }
    };

    messageTimerRef.current = setTimeout(() => {
      showNextMessage(0);
    }, 1000);

    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, [welcomeMessages, scrollToBottom]);

  // Простой автоскролл при изменении контента
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);



  // Timer logic
  useEffect(() => {
    if ((stage === 'question' || stage === 'recording-answer') && timerStarted && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          console.log(`⏰ Timer tick: ${newTime} seconds remaining`, { stage, timerStarted });
          setQuestionCards(prev => updateQuestionTime(prev, newTime));
          return newTime;
        });
      }, 1000);
    } else if (timeRemaining === 0 && (stage === 'question' || stage === 'recording-answer') && timerStarted) {
      // Время истекло - переходим к следующему вопросу
      console.log('⏰ Time up for question', currentQuestionIndex + 1);
      
             if (currentQuestionIndex < processQuestions.length - 1) {
         const nextIndex = currentQuestionIndex + 1;
         setCurrentQuestionIndex(nextIndex);
         setTimeRemaining(150);
         setStage('question');
         setIsAISpeaking(true);
         setTimerStarted(true); // Запускаем таймер сразу
         
         // Добавляем следующий вопрос
         const newQuestionCard = createQuestionCard(nextIndex, processQuestions);
         setQuestionCards(prev => [...prev, newQuestionCard]);
         
         const questionCardMsg = { 
           id: `question-card-${nextIndex}`, 
           content: `question-card-${nextIndex}`, 
           isVisible: true, 
           isNew: true,
           type: 'question-card',
           questionCard: newQuestionCard
         } as any;
         setMessages(prev => [...prev, questionCardMsg]);
         
         // Агрессивный скролл после добавления карточки
         setTimeout(() => scrollToBottom(), 10);
         setTimeout(() => scrollToBottom(), 100);
         setTimeout(() => scrollToBottom(), 300);
         
         setTimeout(() => {
           setQuestionCards(prev => prev.map(card =>
             card.id === newQuestionCard.id ? { ...card, isNew: false } : card
           ));
           setMessages(prev => prev.map(msg => 
             msg.id === `question-card-${nextIndex}` ? { ...msg, isNew: false } : msg
           ));
         }, 500);
         
         setTimeout(() => {
           setIsAISpeaking(false);
         }, 2000);
      } else {
        console.log('✅ All questions completed, moving to candidate questions');
        setStage('candidate-questions');
        setIsAISpeaking(false);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, stage, timerStarted, currentQuestionIndex]);

  const addQuestionCard = useCallback((questionIndex: number) => {
    console.log(`➕ Adding question card ${questionIndex + 1}`);
    const newQuestionCard = createQuestionCard(questionIndex, processQuestions);
    setQuestionCards(prev => [...prev, newQuestionCard]);
    
    // Добавляем question card в сообщения
    const questionCardMsg = { 
      id: `question-card-${questionIndex}`, 
      content: `question-card-${questionIndex}`, 
      isVisible: true, 
      isNew: true,
      type: 'question-card',
      questionCard: newQuestionCard
    } as any;
    setMessages(prev => [...prev, questionCardMsg]);
    
    // Агрессивный скролл после добавления карточки
    setTimeout(() => scrollToBottom(), 10);
    setTimeout(() => scrollToBottom(), 100);
    setTimeout(() => scrollToBottom(), 300);
    
    setTimeout(() => {
      setQuestionCards(prev => prev.map(card =>
        card.id === newQuestionCard.id ? { ...card, isNew: false } : card
      ));
      setMessages(prev => prev.map(msg => 
        msg.id === `question-card-${questionIndex}` ? { ...msg, isNew: false } : msg
      ));
    }, 500);
  }, []);

  const completeQuestion = useCallback((questionIndex: number) => {
    console.log(`✅ Completing question ${questionIndex + 1}`);
    setQuestionCards(prev => markQuestionAsCompleted(prev, questionIndex));
  }, []);

  // Event handlers
  const handleMicrophoneTest = useCallback(() => {
    console.log('🎤 Starting microphone test');
    setStage('recording-test');
    setIsRecording(true);
    setIsAISpeaking(false);
    
    // Добавляем сообщение с просьбой прочитать предложение (появляется после нажатия кнопки)
    const readingMessage = { 
      id: 'reading-message', 
      content: 'Прочитай предложение "Хотите понять других – пристальнее смотрите в самого себя."', 
      isVisible: true, 
      isNew: true
    } as any;
    setMessages(prev => [...prev, readingMessage]);
    
    // Агрессивный скролл после добавления сообщения
    setTimeout(() => scrollToBottom(), 10);
    setTimeout(() => scrollToBottom(), 100);
    setTimeout(() => scrollToBottom(), 300);
  }, []);

  const handleContinueToInstructions = useCallback(() => {
    console.log('📋 Opening instructions modal');
    setShowContinueButton(false);
    setIsInstructionsModalOpen(true);
  }, []);

  const handleStopMicrophoneTest = useCallback(() => {
    console.log('⏹️ Stopping microphone test');
    setIsRecording(false);
    setIsTranscribing(true);
    
    setTimeout(() => {
      setIsTranscribing(false);
      const userMsg = { 
        id: 'user-response', 
        content: "Привет, привет. Меня хорошо слышно ?", 
        isVisible: true, 
        isNew: true, 
        isUser: true 
      } as any;
      setMessages(prev => [...prev, userMsg]);
      setUserResponse("Привет, привет. Меня хорошо слышно ?");
      
      // Агрессивный скролл после добавления сообщения
      setTimeout(() => scrollToBottom(), 10);
      setTimeout(() => scrollToBottom(), 100);
      setTimeout(() => scrollToBottom(), 300);
      
      console.log('✨ User response recorded, showing success messages');
      
      setTimeout(() => {
        const firstMessage = { id: 'success1', content: 'Все в порядке! Я слышу тебя хорошо.🥳', isVisible: true, isNew: true };
        setMessages(prev => [...prev, firstMessage]);
        
        // Агрессивный скролл после добавления сообщения
        setTimeout(() => scrollToBottom(), 10);
        setTimeout(() => scrollToBottom(), 100);
        setTimeout(() => scrollToBottom(), 300);
        
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === 'success1' ? { ...msg, isNew: false } : msg
          ));
        }, 500);
        
        setIsAISpeaking(true);
        
        setTimeout(() => {
          const secondMessage = { id: 'success2', content: 'Как будешь готов - нажми на кнопку ниже, чтобы начать интервью', isVisible: true, isNew: true };
          setMessages(prev => [...prev, secondMessage]);
          
          // Агрессивный скролл после добавления сообщения
          setTimeout(() => scrollToBottom(), 10);
          setTimeout(() => scrollToBottom(), 100);
          setTimeout(() => scrollToBottom(), 300);
          
          setTimeout(() => {
            setMessages(prev => prev.map(msg => 
              msg.id === 'success2' ? { ...msg, isNew: false } : msg
            ));
          }, 500);
          
          setTimeout(() => {
            setIsAISpeaking(false);
            setShowContinueButton(true);
            console.log('▶️ Continue button shown');
          }, 2000);
        }, 2000);
      }, 1000);
    }, 2000);
  }, []);

  const handleStartInterview = useCallback(() => {
    console.log('🚀 Starting interview');
    setIsInstructionsModalOpen(false);
    setStage('question');
    setTimeRemaining(150);
    setCurrentQuestionIndex(0);
    setIsAISpeaking(true);
    setTimerStarted(true); // Запускаем таймер сразу
    
    addQuestionCard(0);
    
    setTimeout(() => {
      setIsAISpeaking(false);
      console.log('⏰ Timer started for question 1');
    }, 2000);
  }, [addQuestionCard]);

  const handleRecordAnswer = useCallback(() => {
    console.log('🎙️ Starting to record answer for question', currentQuestionIndex + 1);
    setStage('recording-answer');
    setIsRecording(true);
    setIsAISpeaking(false);
    // НЕ трогаем таймер - он должен продолжать работать как есть
  }, [currentQuestionIndex]);

  const handleSkipQuestion = useCallback(() => {
    console.log(`⏭️ Skipping question ${currentQuestionIndex + 1}`);
    completeQuestion(currentQuestionIndex);
    
         if (currentQuestionIndex < processQuestions.length - 1) {
       const nextIndex = currentQuestionIndex + 1;
       setCurrentQuestionIndex(nextIndex);
       setTimeRemaining(150);
       setStage('question');
       setIsAISpeaking(true);
       setTimerStarted(true); // Запускаем таймер сразу
       
       addQuestionCard(nextIndex);
       
       setTimeout(() => {
         setIsAISpeaking(false);
         console.log('⏰ Timer started for question', nextIndex + 1);
       }, 2000);
    } else {
      console.log('✅ All questions completed, moving to candidate questions');
      setStage('candidate-questions');
      setIsAISpeaking(false);
    }
  }, [currentQuestionIndex, completeQuestion, addQuestionCard]);

  const handleStopRecording = useCallback(() => {
    console.log('⏹️ Stopping recording for question', currentQuestionIndex + 1);
    setIsRecording(false);
    setIsTranscribing(true);
    
    // Симуляция транскрипции
    setTimeout(() => {
      setIsTranscribing(false);
      setIsSavingAnswer(true);
      console.log('💾 Saving answer for question', currentQuestionIndex + 1);
      
      // Симуляция сохранения
      setTimeout(() => {
        setIsSavingAnswer(false);
        completeQuestion(currentQuestionIndex);
        console.log('✅ Answer saved and question completed');
        
                 // Переход к следующему вопросу или завершение
         if (currentQuestionIndex < processQuestions.length - 1) {
           const nextIndex = currentQuestionIndex + 1;
           console.log(`➡️ Moving to question ${nextIndex + 1}`);
           setCurrentQuestionIndex(nextIndex);
           setTimeRemaining(150);
           setStage('question');
           setIsAISpeaking(true);
           setTimerStarted(true); // Запускаем таймер сразу
           
           addQuestionCard(nextIndex);
           
           setTimeout(() => {
             setIsAISpeaking(false);
           }, 2000);
        } else {
          console.log('✅ All questions completed, moving to candidate questions');
          setStage('candidate-questions');
          setIsAISpeaking(false);
        }
      }, 1000);
    }, 2000);
  }, [currentQuestionIndex, completeQuestion, addQuestionCard]);

  const handleCandidateQuestionsComplete = useCallback(() => {
    console.log('🎉 Interview completed');
    setIsAISpeaking(false);
  }, []);

  // Добавляем AI сообщение в чат
  const handleAddAiMessage = useCallback((content: string) => {
    const msg = { 
      id: `ai-${Date.now()}`, 
      content, 
      isVisible: true, 
      isNew: true 
    } as AIMessage;
    setMessages(prev => [...prev, msg]);
    
    // Агрессивный скролл после добавления сообщения
    setTimeout(() => scrollToBottom(), 10);
    setTimeout(() => scrollToBottom(), 100);
    setTimeout(() => scrollToBottom(), 300);
    
    setTimeout(() => {
      setMessages(prev => prev.map(m => (m.id === msg.id ? { ...m, isNew: false } : m)));
    }, 500);
  }, [scrollToBottom]);

  // Добавляем пользовательское сообщение в чат
  const handleAddUserMessage = useCallback((content: string) => {
    const msg = { 
      id: `user-${Date.now()}`, 
      content, 
      isVisible: true, 
      isNew: true, 
      isUser: true 
    } as any;
    setMessages(prev => [...prev, msg]);
    
    // Агрессивный скролл после добавления сообщения
    setTimeout(() => scrollToBottom(), 10);
    setTimeout(() => scrollToBottom(), 100);
    setTimeout(() => scrollToBottom(), 300);
    
    setTimeout(() => {
      setMessages(prev => prev.map(m => (m.id === msg.id ? { ...m, isNew: false } : m)));
    }, 500);
  }, [scrollToBottom]);

  // Обработка AI речи для candidate-questions этапа
  useEffect(() => {
    if (stage === 'candidate-questions') {
      console.log('💬 Starting candidate questions phase');
      setIsAISpeaking(true);
      
      const speakingTimer = setTimeout(() => {
        setIsAISpeaking(false);
      }, 8000);
      
      return () => clearTimeout(speakingTimer);
    }
  }, [stage]);

  const handleAISpeakingChange = useCallback((isSpeaking: boolean) => {
    setIsAISpeaking(isSpeaking);
  }, []);

  const handleNewMessage = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  // Debug info for current state
  console.log('🎯 Current state:', {
    stage,
    currentQuestionIndex,
    isRecording,
    isTranscribing,
    isSavingAnswer,
    isAISpeaking,
    timerStarted,
    timeRemaining
  });

  // Функция для определения, нужно ли показывать аватар
  const shouldShowAvatar = () => {
    // Показываем аватар когда AI говорит
    if (isAISpeaking && !isTranscribing && !isSavingAnswer) {
      return true;
    }
    
    // Показываем аватар в состоянии молчания на этапе candidate-questions
    if (stage === 'candidate-questions' && !isTranscribing && !isSavingAnswer) {
      return true;
    }
    
    return false;
  };

  // Единый рендеринг всех сообщений
  const renderMessages = () => {
    return (
      <div className="flex flex-col space-y-4">
        {messages.map((message) => (
          message.isVisible && (
            <div key={message.id}>
              {('type' in message && message.type === 'microphone-card') ? (
                <div className="flex justify-start">
                  <MicrophoneTestCard />
                </div>
              ) : ('type' in message && message.type === 'reading-card') ? (
                <div className="flex justify-start">
                  <ReadingTestCard />
                </div>
              ) : ('type' in message && message.type === 'question-card' && 'questionCard' in message) ? (
                <div key={(message.questionCard as any).id}>
                  <QuestionProgressIndicator questionIndex={(message.questionCard as any).questionIndex} />
                                     <QuestionCardComponent 
                     questionCard={{
                       ...(message.questionCard as any),
                       timeRemaining: (message.questionCard as any).questionIndex === currentQuestionIndex && (stage === 'question' || stage === 'recording-answer') ? timeRemaining : null,
                       status: (message.questionCard as any).questionIndex === currentQuestionIndex && (stage === 'question' || stage === 'recording-answer') ? 'active' : 'completed'
                     }} 
                   />
                </div>
              ) : (
                <div className={`flex ${('isUser' in message && message.isUser) ? 'justify-end' : 'justify-start'}`}>
                  {message.id === 'reading-message' ? (
                    <div className="bg-white rounded-br-[24px] rounded-tl-[24px] rounded-tr-[24px] border border-[#e2e4e9] px-8 py-6 max-w-[421px]">
                      <h3 className="text-[#e16349] text-[16px] leading-[24px] tracking-[0.96px] uppercase font-medium font-Inter mb-3">
                        Прочитай предложение
                      </h3>
                      <p className="text-[#0a0d14] text-[16px] leading-[24px] tracking-[-0.176px] font-medium font-Inter">
                        {message.content}
                      </p>
                    </div>
                  ) : (
                    <MessageBubble 
                      content={message.content} 
                      isNew={message.isNew} 
                      isUser={'isUser' in message ? message.isUser : false}
                    />
                  )}
                </div>
              )}
            </div>
          )
        ))}
        
        {/* Показываем CandidateQuestions только на соответствующем этапе */}
        {stage === 'candidate-questions' && (
          <CandidateQuestions 
            onComplete={handleCandidateQuestionsComplete}
            onAISpeakingChange={handleAISpeakingChange}
            onNewMessage={handleNewMessage}
            onAddAiMessage={handleAddAiMessage}
            onAddUserMessage={handleAddUserMessage}
          />
        )}
      </div>
    );
  };

  // Render stage content
  const renderStageContent = () => {
    console.log(`🎬 Rendering stage: ${stage}`);
    
    switch (stage) {
      case 'welcome':
      case 'recording-test':
      case 'question':
      case 'recording-answer':
      case 'question-completed':
      case 'candidate-questions':
        return renderMessages();

      default:
        return null;
    }
  };

  // Кастомная кнопка "Остановить запись" по образцу из Figma
  const RecordingButton = () => (
    <button
      onClick={stage === 'recording-test' ? handleStopMicrophoneTest : handleStopRecording}
      className="bg-[#df1c41] relative rounded-[60px] h-16 w-auto hover:bg-[#c7193a] transition-colors duration-200 pulse-recording"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start pl-2 pr-8 py-2 relative size-full">
          {/* Белый круг с красным квадратом */}
          <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-center overflow-clip p-[8px] relative rounded-[100px] shrink-0 size-12">
            <div className="bg-[#df1c41] rounded shrink-0 size-5" />
          </div>
          {/* Текст */}
          <div className="flex flex-col font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[18px] text-center text-nowrap tracking-[-0.27px]">
            <p className="block leading-[24px] whitespace-pre font-Inter">Остановить запись</p>
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--interview-bg)' }}>
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-col gap-4 p-6 w-full h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between w-full h-16">
            <WMTLogo size="medium" />
            <HelpButton onClick={() => setIsHelpModalOpen(true)} />
          </div>

          {/* Main Content Area - с правильной высотой и z-index */}
          <div 
            className="overflow-hidden relative z-40"
            style={{ 
              height: 'calc(100vh - 64px - 96px - 128px - 48px)', // 100vh - header(64px) - downbar(96px) - footer(128px) - padding(48px)
              maxHeight: 'calc(100vh - 64px - 96px - 128px - 48px)'
            }}
          >
            <div 
              ref={scrollContainerRef}
              className="h-full overflow-y-auto px-6 pb-4 custom-scroll-container"
            >
              <div className="max-w-4xl mx-auto">
                {renderStageContent()}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Fixed Downbar - с анимацией */}
          <div className="fixed bottom-32 left-0 right-0 pointer-events-none z-50">
            <div className="w-full max-w-2xl mx-auto px-6 pointer-events-auto">
              <AnimatePresence mode="wait">
                {/* AI Avatar */}
                {shouldShowAvatar() && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    className="flex justify-center"
                    key="avatar"
                  >
                    <AIAvatarWithWaves 
                      size={stage === 'question-completed' ? 'small' : 'large'} 
                      isSpeaking={isAISpeaking}
                    />
                  </motion.div>
                )}
                
                {/* Loader */}
                {(isTranscribing || isSavingAnswer) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    className="flex justify-center"
                    key="loader"
                  >
                    <div className="text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--interview-accent)' }}>
                      <Loader2 className="w-12 h-12 animate-spin" strokeWidth={2} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Fixed Footer - с кнопками */}
          <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-50">
            {/* Gradient Background */}
            <div className="bottom-controls-gradient h-32" />
            
            {/* Controls Container */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
              <div className="w-full max-w-2xl mx-auto px-6 pb-8 pointer-events-auto">
                {/* Action Buttons */}
                <div className="flex justify-center">
                  {/* Welcome Stage */}
                  {stage === 'welcome' && showMicrophoneCard && !isAISpeaking && !isTranscribing && !isSavingAnswer && (
                    <Button
                      onClick={handleMicrophoneTest}
                      className="bg-[var(--interview-accent)] hover:bg-[var(--interview-accent-hover)] text-white px-8 py-4 font-medium shadow-md transition-all duration-200 hover:shadow-lg text-lg"
                      style={{ borderRadius: '30px', height: '56px' }}
                    >
                      Тест микрофона
                    </Button>
                  )}

                  {/* Recording Test Stage */}
                  {stage === 'recording-test' && showContinueButton && !isAISpeaking && !isTranscribing && !isSavingAnswer && (
                    <Button
                      onClick={handleContinueToInstructions}
                      className="bg-[var(--interview-accent)] hover:bg-[var(--interview-accent-hover)] text-white px-8 py-4 font-medium shadow-md transition-all duration-200 hover:shadow-lg text-lg"
                      style={{ borderRadius: '30px', height: '56px' }}
                    >
                      Продолжить
                    </Button>
                  )}

                  {/* Question Stage */}
                  {stage === 'question' && !isAISpeaking && !isRecording && !isTranscribing && !isSavingAnswer && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={handleRecordAnswer}
                        className="bg-[var(--interview-accent)] hover:bg-[var(--interview-accent-hover)] text-white px-8 py-4 font-medium shadow-md transition-all duration-200 hover:shadow-lg text-lg"
                        style={{ borderRadius: '30px', height: '56px' }}
                      >
                        Записать ответ
                      </Button>
                      <Button
                        onClick={handleSkipQuestion}
                        className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-8 py-4 font-medium shadow-md transition-all duration-200 bg-white text-lg"
                        style={{ borderRadius: '30px', height: '56px' }}
                      >
                        Пропустить
                      </Button>
                    </div>
                  )}

                  {/* Recording Buttons */}
                  {((stage === 'recording-answer' && isRecording) || (stage === 'recording-test' && isRecording)) && (
                    <RecordingButton />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
      />

      <InstructionsModal
        isOpen={isInstructionsModalOpen}
        onClose={() => setIsInstructionsModalOpen(false)}
        onStartInterview={handleStartInterview}
      />
    </div>
  );
}
