import { useState, useEffect, useRef } from 'react';
import { ReferenceStyleMessage, MicrophoneTestVisual, RecordingControls } from './ReferenceStyleMessage';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import svgPaths from "../imports/svg-2hi4ux9070";
import { 
  Mic, 
  Send, 
  Bot, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  Headphones,
  Play,
  HelpCircle
} from 'lucide-react';

type InterviewStage = 'welcome' | 'company-info' | 'mic-test' | 'interview' | 'complete';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: string;
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
}

const questions = [
  "Расскажите о себе и своем опыте работы в сфере разработки",
  "Какие технологии и фреймворки вы используете в своей работе?",
  "Опишите самый сложный проект, над которым вы работали",
  "Как вы подходите к решению технических проблем?",
  "Почему вы хотите работать именно в нашей компании?"
];

export function InterviewChat() {
  const [stage, setStage] = useState<InterviewStage>('welcome');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMessage, setRecordingMessage] = useState<string | null>(null);
  const [hasRecordedAnswer, setHasRecordedAnswer] = useState(false);
  const [micTestStep, setMicTestStep] = useState<'intro' | 'testing' | 'complete'>('intro');
  const [showFAQ, setShowFAQ] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const updateLastMessage = (updates: Partial<ChatMessage>) => {
    setMessages(prev => {
      const newMessages = [...prev];
      const lastIndex = newMessages.length - 1;
      if (lastIndex >= 0) {
        newMessages[lastIndex] = { ...newMessages[lastIndex], ...updates };
      }
      return newMessages;
    });
  };

  // Initialize welcome
  useEffect(() => {
    if (stage === 'welcome') {
      setTimeout(() => {
        addMessage({
          text: "Привет! Я ваш AI-ассистент для проведения интервью на позицию Frontend Разработчик. Меня зовут Алекс, и я буду задавать вам вопросы в течение примерно 15 минут.",
          sender: 'ai',
          type: 'welcome'
        });
      }, 500);

      setTimeout(() => {
        addMessage({
          text: "Процесс будет проходить следующим образом:\n• Я расскажу о компании\n• Протестируем ваш микрофон\n• Зададу 5 основных вопросов\n• Вы сможете задать свои вопросы",
          sender: 'ai',
          type: 'system',
          actions: [
            {
              id: 'start',
              label: 'Начать интервью',
              type: 'primary',
              onClick: () => setStage('company-info')
            }
          ]
        });
      }, 2000);
    }
  }, [stage]);

  // Company info stage
  useEffect(() => {
    if (stage === 'company-info') {
      setTimeout(() => {
        addMessage({
          text: "Отлично! Сначала немного о нашей компании. Мы - динамично развивающаяся IT-компания, которая создает инновационные решения для бизнеса. У нас дружная команда профессионалов и множество интересных проектов.",
          sender: 'ai',
          type: 'system'
        });
      }, 500);

      setTimeout(() => {
        addMessage({
          text: "Есть ли у вас вопросы о компании перед началом интервью?",
          sender: 'ai',
          type: 'action',
          actions: [
            {
              id: 'company-questions',
              label: 'Задать вопрос о компании',
              type: 'secondary',
              onClick: handleCompanyQuestions
            },
            {
              id: 'no-questions',
              label: 'Вопросов нет, продолжаем',
              type: 'primary',
              onClick: () => setStage('mic-test')
            }
          ]
        });
      }, 2500);
    }
  }, [stage]);

  // Mic test stage
  useEffect(() => {
    if (stage === 'mic-test' && micTestStep === 'intro') {
      setTimeout(() => {
        addMessage({
          text: "Замечательно! Теперь давайте проверим ваш микрофон. Это важно для качественной записи ваших ответов.",
          sender: 'ai',
          type: 'system',
          actions: [
            {
              id: 'start-mic-test',
              label: 'Начать тест микрофона',
              type: 'primary',
              onClick: startMicTest
            }
          ]
        });
      }, 500);
    }
  }, [stage, micTestStep]);

  // Interview stage
  useEffect(() => {
    if (stage === 'interview') {
      if (currentQuestion === 0) {
        setTimeout(() => {
          addMessage({
            text: "Отлично! Микрофон работает хорошо. Теперь перейдем к основным вопросам интервью. Отвечайте подробно и не торопитесь.",
            sender: 'ai',
            type: 'system'
          });
        }, 500);

        setTimeout(() => {
          askCurrentQuestion();
        }, 2000);
      } else {
        askCurrentQuestion();
      }
    }
  }, [stage, currentQuestion]);

  const handleCompanyQuestions = () => {
    addMessage({
      text: "Вопрос о компании",
      sender: 'user',
      type: 'answer'
    });

    setTimeout(() => {
      addMessage({
        text: "Спасибо за вопрос! Мы ценим любознательность. Наша команда всегда готова делиться знаниями и помогать друг другу. У нас гибкий график, современные технологии и возможности для профессионального роста.",
        sender: 'ai',
        type: 'system',
        actions: [
          {
            id: 'more-questions',
            label: 'Еще вопрос',
            type: 'secondary',
            onClick: handleCompanyQuestions
          },
          {
            id: 'continue',
            label: 'Продолжить интервью',
            type: 'primary',
            onClick: () => setStage('mic-test')
          }
        ]
      });
    }, 1500);
  };

  const startMicTest = () => {
    setMicTestStep('testing');
    addMessage({
      text: "Говорите что-нибудь в микрофон в течение 3 секунд...",
      sender: 'ai',
      type: 'system',
      isRecording: true
    });

    // Simulate mic test
    setTimeout(() => {
      updateLastMessage({ isRecording: false });
      setMicTestStep('complete');
      
      setTimeout(() => {
        addMessage({
          text: "Отлично! Качество записи хорошее. Микрофон настроен правильно.",
          sender: 'ai',
          type: 'system',
          actions: [
            {
              id: 'start-interview',
              label: 'Приступить к вопросам',
              type: 'primary',
              onClick: () => setStage('interview')
            }
          ]
        });
      }, 1000);
    }, 3000);
  };

  const askCurrentQuestion = () => {
    setTimeout(() => {
      addMessage({
        text: questions[currentQuestion],
        sender: 'ai',
        type: 'question',
        questionNumber: currentQuestion + 1,
        totalQuestions: questions.length,
        actions: [
          {
            id: 'record-answer',
            label: 'Записать ответ',
            type: 'primary',
            onClick: startRecording
          },
          {
            id: 'skip-question',
            label: 'Пропустить вопрос',
            type: 'secondary',
            onClick: skipQuestion
          }
        ]
      });
    }, 500);
  };

  const startRecording = () => {
    setIsRecording(true);
    setHasRecordedAnswer(false);
    const messageId = Date.now().toString();
    setRecordingMessage(messageId);
    
    addMessage({
      text: "Запись ответа...",
      sender: 'ai',
      type: 'system',
      isRecording: true
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    updateLastMessage({ isRecording: false });
    setHasRecordedAnswer(true);

    setTimeout(() => {
      addMessage({
        text: "Ваш ответ записан",
        sender: 'user',
        type: 'answer',
        hasAudio: true,
        audioLength: Math.floor(Math.random() * 120) + 30 // 30-150 seconds
      });

      setTimeout(() => {
        addMessage({
          text: "Спасибо за ответ! Переходим к следующему вопросу.",
          sender: 'ai',
          type: 'system',
          actions: [
            {
              id: 'next-question',
              label: 'Следующий вопрос',
              type: 'primary',
              onClick: nextQuestion
            }
          ]
        });
      }, 1000);
    }, 1500);
  };

  const skipQuestion = () => {
    addMessage({
      text: "Вопрос пропущен",
      sender: 'user',
      type: 'answer'
    });

    setTimeout(() => {
      addMessage({
        text: "Понятно, переходим к следующему вопросу.",
        sender: 'ai',
        type: 'system',
        actions: [
          {
            id: 'next-question',
            label: 'Следующий вопрос',
            type: 'primary',
            onClick: nextQuestion
          }
        ]
      });
    }, 1000);
  };

  const nextQuestion = () => {
    const next = currentQuestion + 1;
    if (next >= questions.length) {
      completeInterview();
    } else {
      setCurrentQuestion(next);
    }
  };

  const showFAQQuestions = () => {
    const faqList = [
      "• Когда будет известен результат?",
      "• Какие следующие этапы отбора?", 
      "• Могу ли я получить обратную связь?",
      "• Как с вами связаться?",
      "• Что делать, если есть вопросы?"
    ];

    addMessage({
      text: `Вот самые популярные вопросы от кандидатов:\n\n${faqList.join('\n')}`,
      sender: 'ai',
      type: 'system',
      actions: [
        {
          id: 'ask-faq',
          label: 'Задать один из вопросов',
          type: 'secondary',
          onClick: () => handleFAQQuestion("", "")
        },
        {
          id: 'finish-final',
          label: 'Завершить интервью',
          type: 'primary',
          onClick: () => setStage('complete')
        }
      ]
    });
  };

  const handleFAQQuestion = (question: string, answer: string) => {
    addMessage({
      text: question,
      sender: 'user',
      type: 'answer'
    });

    setTimeout(() => {
      addMessage({
        text: answer,
        sender: 'ai',
        type: 'system',
        actions: [
          {
            id: 'another-question',
            label: 'Задать еще вопрос',
            type: 'secondary',
            onClick: showFAQQuestions
          },
          {
            id: 'finish-final',
            label: 'Завершить интервью',
            type: 'primary',
            onClick: () => setStage('complete')
          }
        ]
      });
    }, 1500);
  };

  const completeInterview = () => {
    setTimeout(() => {
      addMessage({
        text: "Отлично! Это были все основные вопросы. Спасибо за подробные ответы!",
        sender: 'ai',
        type: 'system'
      });
    }, 500);

    setTimeout(() => {
      addMessage({
        text: "Интервью завершено! Мы обязательно изучим ваши ответы и свяжемся с вами в течение 3-5 рабочих дней.",
        sender: 'ai',
        type: 'system',
        actions: [
          {
            id: 'faq',
            label: 'Часто задаваемые вопросы',
            type: 'secondary',
            onClick: showFAQQuestions
          },
          {
            id: 'finish',
            label: 'Завершить сессию',
            type: 'primary',
            onClick: () => {
              addMessage({
                text: "Спасибо за участие в интервью! До встречи! 👋",
                sender: 'ai',
                type: 'system'
              });
              setStage('complete');
            }
          }
        ]
      });
    }, 2000);
  };

  const progress = stage === 'interview' ? ((currentQuestion) / questions.length) * 100 : 0;

  // Final screen when interview is complete
  if (stage === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#ffeee8] to-[#fff5f1] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-8 p-8">
          <div className="w-24 h-24 bg-[#e16349]/10 border-2 border-[#e16349]/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-[#e16349]" />
          </div>
          <div>
            <h2 
              className="text-[#000000] mb-6 text-2xl font-thin"
              style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            >
              Интервью завершено!
            </h2>
            <p 
              className="text-gray-600 mb-8 text-lg font-thin leading-[20.8px]"
              style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            >
              Спасибо за ваше время и интересные ответы. Мы свяжемся с вами в ближайшее время.
            </p>
            <div className="space-y-4">
              <div className="p-6 bg-[rgba(225,99,73,0.1)] border border-[#e16349]/20 rounded-[12px]">
                <p 
                  className="text-[#000000] font-thin"
                  style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                >
                  📧 Результат будет отправлен на указанную почту
                </p>
              </div>
              <div className="p-6 bg-[rgba(225,99,73,0.1)] border border-[#e16349]/20 rounded-[12px]">
                <p 
                  className="text-[#000000] font-thin"
                  style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                >
                  ⏰ Ответ в течение 3-5 рабочих дней
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f6] via-[#fff5f1] to-[#ffeee8] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(225,99,73,0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(225,99,73,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 60px 60px'
        }} />
      </div>

      {/* Header with blur */}
      <div className="absolute top-0 left-0 right-0 backdrop-blur-[10px] backdrop-filter bg-white/85 border-b border-[#e16349]/15 p-6 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#e16349] to-[#d55a42] rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 
                className="text-[#000000] font-thin text-xl" 
                style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
              >
                AI Интервью
              </h1>
              <p 
                className="text-gray-600 font-thin"
                style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
              >
                Frontend Разработчик
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {stage === 'interview' && (
              <div className="flex items-center gap-3">
                <Progress value={progress} className="w-40 bg-[#e16349]/20" />
                <span 
                  className="text-gray-600 font-thin text-lg"
                  style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                >
                  {currentQuestion}/{questions.length}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12">
                <svg
                  className="block w-full h-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 15 15"
                >
                  <path
                    d={svgPaths.p19285b00}
                    fill="#e16349"
                  />
                </svg>
              </div>
              <span 
                className="text-[#e16349] font-thin text-lg"
                style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
              >
                Помощь
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className={`pt-24 ${isRecording ? 'pb-64' : 'pb-32'} h-screen overflow-hidden relative z-0`}>
        <div className="max-w-6xl mx-auto h-full">
          <ScrollArea className="h-full px-12 py-8">
            <div className="max-w-[900px] mx-auto space-y-6">
              {messages.map((message) => (
                <ReferenceStyleMessage
                  key={message.id}
                  message={message}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                />
              ))}
              
              {/* Microphone test visual */}
              {stage === 'mic-test' && micTestStep === 'intro' && (
                <div className="flex justify-start w-full mb-6">
                  <div className="flex gap-4 max-w-[720px]">
                    <div className="flex-shrink-0 mt-2">
                      <Avatar className="w-12 h-12 border-2 border-[#e16349]/20">
                        <AvatarFallback className="bg-[#e16349] text-white font-thin">
                          <Bot className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white border border-gray-200 shadow-sm rounded-[32px] p-8">
                        <MicrophoneTestVisual />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Recording Controls - replaces action buttons when recording */}
      {isRecording ? (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <RecordingControls isRecording={isRecording} onStopRecording={stopRecording} />
        </div>
      ) : (
        /* Fixed bottom action buttons */
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 to-white/80 backdrop-blur-[10px] backdrop-filter border-t border-gray-200/50 p-8 z-10">
          <div className="max-w-[800px] mx-auto flex justify-center">
            {/* Show action buttons based on current state */}
            {messages.length > 0 && messages[messages.length - 1].actions && (
              <div className="flex gap-6">
                {messages[messages.length - 1].actions!.map((action) => (
                  <Button
                    key={action.id}
                    onClick={action.onClick}
                    className={`rounded-[44px] px-12 py-6 font-thin text-lg min-w-[200px] h-16 shadow-lg transition-all duration-200 ${
                      action.type === 'primary' 
                        ? 'bg-[#e16349] hover:bg-[#d55a42] text-white border-3 border-[#e16349] hover:shadow-xl hover:scale-105' 
                        : action.type === 'danger'
                          ? 'bg-red-500 hover:bg-red-600 text-white border-3 border-red-500 hover:shadow-xl hover:scale-105'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-3 border-gray-300 hover:shadow-lg hover:scale-105'
                    }`}
                    style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
