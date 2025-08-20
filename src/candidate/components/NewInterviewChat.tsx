import { useState, useEffect, useRef } from 'react';
import { AuthForm } from './AuthForm';
import { EmailVerification } from './EmailVerification';
import { QuestionHeader } from './QuestionHeader';
import { SymmetricAudioWaves } from './SymmetricAudioWaves';
import { WMTLogo, HelpButton, HelpModal, Button } from './';
import { InterviewChatMessage } from './InterviewChatMessage';
import { MicrophoneTestNew } from './MicrophoneTestNew';
import { InstructionsModal } from './InstructionsModal';
import { RulesScreen } from './interview/RulesScreen';
import { CompleteScreen } from './interview/CompleteScreen';
import { LiveTranscription } from './LiveTranscription';
import { CompanyQuestionsButtons } from './CompanyQuestionsButtons';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgress } from './CircularProgress';

// Import types, constants, and utilities
import { InterviewStage, UserData, ChatMessage, CompanyQuestion } from './interview/types';
import { questions, jobPosition, companyQuestions } from './interview/constants';
import { createMessage, resetMessageCounter } from './interview/utils';

// КОНФИГУРАЦИЯ ДЛЯ РАЗРАБОТКИ - установите нужный экран для тестирования
const DEV_CONFIG = {
  // Установите начальный экран для тестирования:
  // 'auth' | 'email-verification' | 'rules' | 'mic-test' | 'instructions' | 'interview' | 'mic-check' | 'questions' | 'company-questions' | 'complete'
  startFromStage: 'questions' as InterviewStage, // <-- Измените здесь для тестирования нужного экрана
  
  // Мокаем данные пользователя для пропуска форм
  mockUserData: {
    firstName: 'Александр',
    lastName: 'Петров',
    email: 'alex.petrov@example.com',
    phone: '+7 (999) 123-45-67'
  } as UserData
};

export function NewInterviewChat() {
  // Начинаем с нужного экрана для разработки
  const [stage, setStage] = useState<InterviewStage>(DEV_CONFIG.startFromStage);
  const [userData, setUserData] = useState<UserData | null>(
    DEV_CONFIG.startFromStage !== 'auth' ? DEV_CONFIG.mockUserData : null
  );
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [answers, setAnswers] = useState<Array<{questionId: string, audioBlob: Blob | null, duration: number}>>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [questionTimeLimit] = useState(150); // 2:30 мин для каждого вопроса
  const [transcriptionText, setTranscriptionText] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Инициализация интервью
  useEffect(() => {
    if (stage === 'interview') {
      resetMessageCounter();
      setMessages([]);
      
      setTimeout(() => {
        addMessage({
          type: 'ai',
          content: `Привет, ${userData?.firstName}! Я Ксения, ваш ИИ-интервьюер. Сегодня мы проведем интервью на позицию ${jobPosition.title}. Для начала давайте проверим ваш микрофон.`,
          isTyping: false
        });
        setIsAISpeaking(true);
        
        setTimeout(() => {
          setIsAISpeaking(false);
          setStage('mic-check');
        }, 3000);
      }, 1000);
    }
    
    // Инициализация для демонстрации этапа вопросов
    if (stage === 'questions') {
      resetMessageCounter();
      setMessages([]);
      
      setTimeout(() => {
        addMessage({
          type: 'ai',
          content: `Привет, ${userData?.firstName}! Готовы начать интервью?`,
          isTyping: false
        });
        
        setTimeout(() => {
          askCurrentQuestion();
        }, 2000);
      }, 500);
    }
  }, [stage, userData]);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage = createMessage(message);
    setMessages(prev => [...prev, newMessage]);
  };

  // Event handlers
  const handleAuthComplete = (data: UserData) => {
    setUserData(data);
    setStage('email-verification');
  };

  const handleEmailVerified = () => setStage('rules');
  const handleGoBackToAuth = () => setStage('auth');

  const handleMicTestComplete = () => {
    setStage('instructions');
    setIsInstructionsModalOpen(true);
  };

  // Тест микрофона в интервью
  const handleStartMicTest = () => {
    setIsMicTesting(true);
    setTranscriptionText('');
    
    // Симуляция транскрибации
    const words = ['Привет', 'меня', 'зовут', userData?.firstName || 'Пользователь', 'и', 'я', 'тестирую', 'микрофон'];
    let currentIndex = 0;
    
    const addWord = () => {
      if (currentIndex < words.length && isMicTesting) {
        setTranscriptionText(prev => prev + (prev ? ' ' : '') + words[currentIndex]);
        currentIndex++;
        setTimeout(addWord, 500 + Math.random() * 500);
      } else if (currentIndex >= words.length) {
        setTimeout(() => {
          setIsMicTesting(false);
          handleMicTestSuccess();
        }, 1000);
      }
    };
    
    setTimeout(addWord, 500);
  };

  const handleMicTestSuccess = () => {
    const userMessage = createMessage({
      type: 'user',
      content: transcriptionText,
      isRecorded: true
    });
    
    setMessages(prev => [...prev, userMessage]);
    setTranscriptionText('');
    
    setTimeout(() => {
      addMessage({
        type: 'ai',
        content: 'Отлично! Я хорошо вас слышу. Микрофон работает правильно. Теперь переходим к вопросам интервью.',
        isTyping: false
      });
      
      setIsAISpeaking(true);
      setTimeout(() => {
        setIsAISpeaking(false);
        setStage('questions');
        askCurrentQuestion();
      }, 3000);
    }, 1000);
  };

  const startInterview = () => {
    setStage('interview');
    setIsInstructionsModalOpen(false);
  };

  const askCurrentQuestion = () => {
    if (currentQuestion >= questions.length) {
      setStage('company-questions');
      
      addMessage({
        type: 'ai',
        content: 'Спасибо за ваши ответы! Теперь у вас есть возможность задать вопросы о компании и позиции.',
        isTyping: false
      });
      return;
    }

    const question = questions[currentQuestion];
    setIsAISpeaking(true);
    
    addMessage({
      type: 'ai',
      content: question.text,
      category: question.category,
      isTyping: false
    });

    // Stop AI speaking animation after question is displayed
    setTimeout(() => {
      setIsAISpeaking(false);
    }, 2000);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    setTranscriptionText('');
    
    // Start recording timer
    const timer = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    
    // Store timer to clear it later
    (window as any).recordingTimer = timer;
    
    // Симуляция транскрибации ответа в реальном времени
    const sampleAnswers = [
      'Я работаю в сфере веб-разработки уже более трех лет',
      'Начинал с изучения HTML и CSS, затем перешел к JavaScript',
      'Мне особенно интересны современные фреймворки как React и Vue',
      'В последнее время изучаю TypeScript и Node.js для fullstack разработки'
    ];
    
    const answer = sampleAnswers[Math.floor(Math.random() * sampleAnswers.length)];
    const words = answer.split(' ');
    let currentIndex = 0;
    
    const addWord = () => {
      if (currentIndex < words.length && isRecording) {
        setTranscriptionText(prev => prev + (prev ? ' ' : '') + words[currentIndex]);
        currentIndex++;
        setTimeout(addWord, 300 + Math.random() * 400);
      }
    };
    
    setTimeout(addWord, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    // Clear recording timer
    if ((window as any).recordingTimer) {
      clearInterval((window as any).recordingTimer);
      (window as any).recordingTimer = null;
    }
    
    const currentQ = questions[currentQuestion];
    const duration = recordingDuration;
    
    // Add user message with transcription
    const userMessage = createMessage({
      type: 'user',
      content: transcriptionText,
      isRecorded: true,
      duration
    });
    
    setMessages(prev => [...prev, userMessage]);
    
    // Save answer
    setAnswers(prev => [...prev, { 
      questionId: currentQ.id, 
      audioBlob: new Blob(), // Mock blob to indicate answer was given
      duration 
    }]);
    
    // Reset states
    setRecordingDuration(0);
    setTranscriptionText('');

    // Move to next question
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleSkipQuestion = () => {
    const currentQ = questions[currentQuestion];
    
    // Clear recording timer if running
    if ((window as any).recordingTimer) {
      clearInterval((window as any).recordingTimer);
      (window as any).recordingTimer = null;
    }
    
    // Save skipped answer
    setAnswers(prev => [...prev, { 
      questionId: currentQ.id, 
      audioBlob: null,
      duration: 0 
    }]);
    
    setIsRecording(false);
    setRecordingDuration(0);
    setTranscriptionText('');

    // Add skip message
    addMessage({
      type: 'user',
      content: 'Пропустить вопрос',
      isRecorded: true
    });

    // Move to next question
    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestion + 1;
    
    if (nextIndex >= questions.length) {
      setStage('company-questions');
      
      setTimeout(() => {
        addMessage({
          type: 'ai',
          content: 'Спасибо за ваши ответы! Теперь у вас есть возможность задать вопросы о компании и позиции.',
          isTyping: false
        });
      }, 1000);
      return;
    }
    
    setCurrentQuestion(nextIndex);
    
    // Add transition message and ask next question
    setTimeout(() => {
      addMessage({
        type: 'ai',
        content: 'Переходим к следующему вопросу.',
        isTyping: false
      });
      
      setTimeout(() => {
        askCurrentQuestion();
      }, 1500);
    }, 1000);
  };

  const handleTimeUp = () => {
    // Автоматически пропустить вопрос при истечении времени
    addMessage({
      type: 'ai',
      content: 'Время на вопрос истекло. Переходим к следующему вопросу.',
      isTyping: false
    });
    
    // Сохранить пропущенный ответ
    const currentQ = questions[currentQuestion];
    setAnswers(prev => [...prev, { 
      questionId: currentQ.id, 
      audioBlob: null,
      duration: 0 
    }]);
    
    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleCompanyQuestionSelect = (question: CompanyQuestion) => {
    addMessage({
      type: 'user',
      content: question.text,
      isRecorded: false
    });
    
    // Симулируем ответ ИИ
    setTimeout(() => {
      const responses: Record<string, string> = {
        '1': 'В нашей команде мы используем React, TypeScript, Next.js для фронтенда и Node.js с PostgreSQL для бэкенда. Также активно применяем Docker и AWS для деплоя.',
        '2': 'У нас agile-подход с двухнедельными спринтами. Ежедневные стендапы, code review обязательны. Используем Git Flow и автоматизированное тестирование.',
        '3': 'Мы предоставляем бюджет на обучение, внутренние лекции, менторство. Есть четкий career path и возможность роста в техническом или управленческом направлении.',
        '4': 'Обычно день начинается с стендапа, затем разработка фич или исправление багов. Во второй половине дня часто проводим код-ревью и планирование задач.',
        '5': 'Да, у каждого нового сотрудника есть ментор на первые 3 месяца. Также проводим onboarding программу с изучением наших процессов и технологий.'
      };
      
      addMessage({
        type: 'ai',
        content: responses[question.id] || 'Спасибо за интересный вопрос! Я передам его HR-менеджеру для более детального ответа.',
        isTyping: false
      });
    }, 1500);
  };

  const handleNoQuestions = () => {
    addMessage({
      type: 'user',
      content: 'У меня нет вопросов',
      isRecorded: false
    });
    
    setTimeout(() => {
      addMessage({
        type: 'ai',
        content: `Спасибо за интервью, ${userData?.firstName}! Мы обработаем ваши ответы и свяжемся с вами в ближайшее время.`,
        isTyping: false
      });
      
      setTimeout(() => {
        setStage('complete');
      }, 3000);
    }, 1000);
  };

  // Render screens based on stage
  if (stage === 'auth') {
    return <AuthForm onContinue={handleAuthComplete} jobPosition={jobPosition} />;
  }

  if (stage === 'email-verification') {
    return <EmailVerification email={userData?.email || ''} onContinue={handleEmailVerified} onGoBack={handleGoBackToAuth} jobPosition={jobPosition} />;
  }

  if (stage === 'rules') {
    return (
      <RulesScreen 
        jobPosition={jobPosition}
        onContinue={() => setStage('mic-test')}
        isHelpModalOpen={isHelpModalOpen}
        onToggleHelpModal={setIsHelpModalOpen}
      />
    );
  }

  if (stage === 'mic-test') {
    return <MicrophoneTestNew onComplete={handleMicTestComplete} onSkip={handleMicTestComplete} />;
  }

  if (stage === 'complete') {
    return <CompleteScreen userData={userData} jobPosition={jobPosition} />;
  }

  // Interview screens - основной интерфейс
  return (
    <div className="bg-interview-bg min-h-screen w-full">
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-col gap-4 p-6 w-full h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <WMTLogo size="medium" />
            <HelpButton onClick={() => setIsHelpModalOpen(true)} />
          </div>

          {/* Main Content Container */}
          <div className="flex-1 bg-white rounded-[44px] overflow-hidden">
            <div className="w-full h-full flex flex-col">
              


              {/* Chat Area */}
              <div className="flex-1 p-6 overflow-hidden">
                <div className="w-full h-full flex flex-col">
                  
                  {/* Messages Container */}
                  <div className="flex-1 overflow-hidden">
                    <div 
                      ref={chatContainerRef}
                      className="flex-1 overflow-y-auto space-y-4 h-full bg-interview-substrate rounded-[32px] p-6"
                    >
                      <AnimatePresence>
                        {messages.map((message, index) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ 
                              duration: 0.3,
                              delay: index * 0.1
                            }}
                          >
                            <>
                              {/* Question Progress - только для AI сообщений с категорией */}
                              {message.type === 'ai' && message.category && (
                                <div className="mb-3">
                                  <QuestionHeader 
                                    currentStep={currentQuestion}
                                    totalSteps={questions.length}
                                  />
                                </div>
                              )}
                              
                              <InterviewChatMessage
                                type={message.type}
                                content={message.content}
                                isTyping={message.isTyping}
                                category={message.category}
                                duration={message.duration}
                                isRecorded={message.isRecorded}
                              />
                            </>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {/* Live Transcription during recording */}
                      {(isRecording || isMicTesting) && transcriptionText && (
                        <LiveTranscription 
                          text={transcriptionText}
                          isActive={isRecording || isMicTesting}
                        />
                      )}
                      
                      {/* Company Questions */}
                      {stage === 'company-questions' && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <CompanyQuestionsButtons
                            questions={companyQuestions}
                            onQuestionSelect={handleCompanyQuestionSelect}
                            onNoQuestions={handleNoQuestions}
                          />
                        </motion.div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* AI Assistant Area */}
                  <div className="bg-interview-substrate rounded-[32px] p-6 mt-6">
                    <div className="flex justify-center">
                      <SymmetricAudioWaves 
                        isSpeaking={isAISpeaking}
                        size="large"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6">
                <AnimatePresence>
                  {/* Mic Test Button */}
                  {stage === 'mic-check' && !isMicTesting && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="flex justify-center"
                    >
                                             <button
                         onClick={handleStartMicTest}
                         className="bg-[var(--interview-accent)] hover:bg-[var(--interview-accent-hover)] text-white px-8 py-4 font-medium shadow-md transition-all duration-200 hover:shadow-lg text-lg"
                         style={{ borderRadius: '30px', height: '56px' }}
                       >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-white rounded-full opacity-90"></div>
                          <span>Тест микрофона</span>
                        </div>
                      </button>
                    </motion.div>
                  )}

                  {/* Question Action Buttons */}
                  {stage === 'questions' && !isAISpeaking && currentQuestion < questions.length && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="flex justify-center gap-4"
                    >
                      {isRecording ? (
                                                 <button
                           onClick={handleStopRecording}
                           className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 font-medium shadow-md transition-all duration-200 hover:shadow-lg text-lg"
                           style={{ borderRadius: '30px', height: '56px' }}
                         >
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-white rounded-sm animate-pulse"></div>
                            <span>Остановить запись</span>
                            <span className="text-xs opacity-80">
                              ({Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')})
                            </span>
                          </div>
                        </button>
                      ) : (
                        <>
                                                     <button
                             onClick={handleStartRecording}
                             className="bg-[var(--interview-accent)] hover:bg-[var(--interview-accent-hover)] text-white px-8 py-4 font-medium shadow-md transition-all duration-200 hover:shadow-lg text-lg"
                             style={{ borderRadius: '30px', height: '56px' }}
                           >
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                              <span>Записать ответ</span>
                            </div>
                          </button>
                          
                                                     <button
                             onClick={handleSkipQuestion}
                             className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-8 py-4 font-medium shadow-md transition-all duration-200 bg-white text-lg"
                             style={{ borderRadius: '30px', height: '56px' }}
                           >
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                              <span>Пропустить вопрос</span>
                            </div>
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
      />

      <InstructionsModal
        isOpen={isInstructionsModalOpen}
        onClose={() => setIsInstructionsModalOpen(false)}
        onStartInterview={startInterview}
      />
    </div>
  );
}
