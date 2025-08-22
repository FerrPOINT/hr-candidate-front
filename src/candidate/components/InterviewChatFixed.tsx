import { useState, useEffect, useRef } from 'react';
import { AuthForm } from './AuthForm';
import { EmailVerification } from './EmailVerification';
import { Button } from './';
import { Progress } from './ui/progress';
import { AIAvatarWithWaves } from './AIAvatarWithWaves';
import { TypewriterText } from './TypewriterText';
import { VoiceRecorder } from './VoiceRecorder';
import { WMTLogo } from './';
import { HelpButton, HelpModal } from './';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock,
  Mic,
  MessageSquare
} from 'lucide-react';

type InterviewStage = 'auth' | 'email-verification' | 'rules' | 'interview' | 'complete';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

interface JobPosition {
  title: string;
  department: string;
  company: string;
  type: string;
  questionsCount: number;
}

interface Question {
  id: string;
  text: string;
  category: string;
  maxDuration: number;
}

const questions: Question[] = [
  {
    id: '1',
    text: 'Расскажите о себе и своем опыте работы в сфере разработки. Что вас привело в эту сферу и какие технологии вам наиболее интересны?',
    category: 'О себе',
    maxDuration: 180
  },
  {
    id: '2', 
    text: 'Опишите самый сложный проект, над которым вы работали. Какие технические вызовы вы преодолели и что нового узнали?',
    category: 'Опыт работы',
    maxDuration: 180
  },
  {
    id: '3',
    text: 'Как вы подходите к изучению новых технологий? Приведите пример последней технологии, которую вы освоили.',
    category: 'Развитие',
    maxDuration: 150
  },
  {
    id: '4',
    text: 'Расскажите о ситуации, когда вам пришлось работать в команде над сложной задачей. Как вы организовывали работу?',
    category: 'Командная работа',
    maxDuration: 150
  },
  {
    id: '5',
    text: 'Почему вы хотите работать именно в нашей компании? Что вас привлекает в позиции Frontend Разработчика?',
    category: 'Мотивация',
    maxDuration: 120
  }
];

const jobPosition: JobPosition = {
  title: "Frontend Разработчик",
  department: "Разработка", 
  company: "WMT group",
  type: "Полная занятость",
  questionsCount: questions.length
};



export function InterviewChat() {
  const [stage, setStage] = useState<InterviewStage>('auth');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [interviewStep, setInterviewStep] = useState<'welcome' | 'question' | 'next'>('welcome');
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [answers, setAnswers] = useState<Array<{questionId: string, audioBlob: Blob, duration: number}>>([]);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleAuthComplete = (data: UserData) => {
    setUserData(data);
    setStage('email-verification');
  };

  const handleEmailVerified = () => {
    setStage('rules');
  };

  const handleGoBackToAuth = () => {
    setStage('auth');
  };

  const startInterview = () => {
    setStage('interview');
    setTimeout(() => {
      setIsAISpeaking(true);
      setTimeout(() => {
        setIsAISpeaking(false);
        setInterviewStep('question');
      }, 3000);
    }, 1000);
  };

  const handleRecordingComplete = (audioBlob: Blob, duration: number) => {
    const currentQ = questions[currentQuestion];
    setAnswers(prev => [...prev, { 
      questionId: currentQ.id, 
      audioBlob, 
      duration 
    }]);
    
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestion + 1;
    if (nextIndex >= questions.length) {
      setStage('complete');
      return;
    }
    
    setCurrentQuestion(nextIndex);
    setInterviewStep('next');
    
    setTimeout(() => {
      setIsAISpeaking(true);
      setInterviewStep('question');
      
      setTimeout(() => {
        setIsAISpeaking(false);
      }, 2000);
    }, 1000);
  };

  const skipCurrentQuestion = () => {
    // Record a "skipped" answer
    const currentQ = questions[currentQuestion];
    const emptyBlob = new Blob([], { type: 'audio/wav' });
    setAnswers(prev => [...prev, { 
      questionId: currentQ.id, 
      audioBlob: emptyBlob, 
      duration: 0 
    }]);
    
    handleNextQuestion();
  };

  // Auth screen
  if (stage === 'auth') {
    return <AuthForm onContinue={handleAuthComplete} interviewId={1} />;
  }

  // Email verification screen  
  if (stage === 'email-verification') {
    return <EmailVerification email={userData?.email || ''} onContinue={handleEmailVerified} onGoBack={handleGoBackToAuth} interviewId={1} />;
  }

  // Rules screen
  if (stage === 'rules') {
    return (
      <div className="bg-[#e9eae2] min-h-screen w-full">
        <div className="w-full h-full flex flex-col">
          <div className="flex flex-col gap-4 p-6 w-full h-full">
            
            {/* Header */}
            <div className="flex items-center justify-between w-full">
              <WMTLogo size="medium" />
              <HelpButton onClick={() => setIsHelpModalOpen(true)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 mt-8">
              <div className="bg-[#f5f6f1] rounded-[44px] w-full max-w-3xl">
                <div className="w-full h-full">
                  <div className="flex flex-col gap-6 p-6 w-full">
                    
                    <div className="bg-white rounded-[32px] w-full">
                      <div className="w-full h-full">
                        <div className="flex flex-col gap-5 p-6 w-full text-center">
                          
                          <div className="bg-[#e16349]/10 border border-[#e16349]/20 rounded-[20px] p-5 w-full">
                            <h4 className="text-[#e16349] mb-2">
                              {jobPosition.title}
                            </h4>
                            <p className="text-gray-600">
                              {jobPosition.company} • {jobPosition.questionsCount} вопросов
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-600 mb-4">
                              Перед началом интервью ознакомьтесь с краткой информацией о процессе
                            </p>
                          </div>

                          {/* Rules Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <div className="bg-gray-50 rounded-[20px] p-4 text-center">
                              <div className="w-12 h-12 bg-[#e16349]/10 border border-[#e16349]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Clock className="w-6 h-6 text-[#e16349]" />
                              </div>
                              <p className="text-gray-600 text-sm mb-1">
                                Продолжительность
                              </p>
                              <div className="text-lg font-medium text-[#000000]">
                                15-20 минут
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-[20px] p-4 text-center">
                              <div className="w-12 h-12 bg-[#e16349]/10 border border-[#e16349]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Mic className="w-6 h-6 text-[#e16349]" />
                              </div>
                              <p className="text-gray-600 text-sm mb-1">
                                Формат
                              </p>
                              <div className="text-lg font-medium text-[#000000]">
                                Голосовые ответы
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-[20px] p-4 text-center">
                              <div className="w-12 h-12 bg-[#e16349]/10 border border-[#e16349]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <MessageSquare className="w-6 h-6 text-[#e16349]" />
                              </div>
                              <p className="text-gray-600 text-sm mb-1">
                                Количество
                              </p>
                              <div className="text-lg font-medium text-[#000000]">
                                {jobPosition.questionsCount} вопросов
                              </div>
                            </div>
                          </div>

                          {/* Tips */}
                          <div className="bg-[#e16349]/5 border border-[#e16349]/20 rounded-[20px] p-4 w-full">
                            <div className="flex items-start gap-3">
                              <div className="w-5 h-5 bg-[#e16349]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 bg-[#e16349] rounded-full"></div>
                              </div>
                              <div className="text-left">
                                <p className="text-[#e16349] text-sm">
                                  <span className="font-medium">Совет:</span> Используйте наушники или внешний микрофон для лучшего качества записи
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Start Button */}
                          <div className="pt-3 w-full">
                            <Button
                              onClick={startInterview}
                              className="bg-[#e16349] hover:bg-[#d55a42] text-white rounded-3xl px-8 py-4 w-full h-16 text-lg font-medium shadow-md transition-all"
                            >
                              Начать интервью
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
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
      </div>
    );
  }

  // Complete screen
  if (stage === 'complete') {
    return (
      <div className="bg-[#e9eae2] min-h-screen w-full">
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center justify-center p-8 min-h-screen">
            <motion.div 
              className="bg-[#f5f6f1] rounded-[44px] max-w-2xl w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="w-full h-full">
                <div className="flex flex-col gap-8 items-center justify-center p-8 text-center">
                  
                  <motion.div 
                    className="w-24 h-24 bg-[#e16349]/10 border-2 border-[#e16349]/30 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-[#e16349]" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <h4 className="text-[#000000] mb-6">
                      Интервью завершено!
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Спасибо за ваше время и интересные ответы, {userData?.firstName}.
                    </p>
                    <p className="text-gray-600">
                      Мы свяжемся с вами по поводу позиции <strong>{jobPosition.title}</strong> в ближайшее время.
                    </p>
                  </motion.div>

                  <motion.div 
                    className="space-y-4 w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <div className="bg-white rounded-[20px] p-6">
                      <p className="text-[#000000]">
                        📧 Результат будет отправлен на {userData?.email}
                      </p>
                    </div>
                    <div className="bg-white rounded-[20px] p-6">
                      <p className="text-[#000000]">
                        ⏰ Ответ в течение 3-5 рабочих дней
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Interview screen - The WOW experience
  return (
    <div className="bg-[#e9eae2] min-h-screen w-full overflow-hidden">
      <div className="w-full h-full flex flex-col min-h-screen">
        
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between p-4 w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WMTLogo size="medium" />
          <HelpButton onClick={() => setIsHelpModalOpen(true)} />
        </motion.div>

        {/* Progress bar */}
        <motion.div 
          className="px-4 pb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Progress 
            value={(currentQuestion / questions.length) * 100} 
            className="w-full h-2 bg-white/50" 
          />
        </motion.div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col p-6 relative">
          
          {/* Content area - top section */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {interviewStep === 'welcome' && (
                <motion.div
                  key="welcome"
                  className="text-center w-full max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-white rounded-[32px] shadow-lg p-8">
                    <TypewriterText
                      text={`Привет, ${userData?.firstName}! Я Ксения, ваш ИИ-интервьюер. Сегодня мы проведем интервью на позицию ${jobPosition.title}.`}
                      className="text-lg text-gray-800"
                      onComplete={() => {
                        setTimeout(() => {
                          setIsAISpeaking(false);
                        }, 1000);
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Question display */}
              {interviewStep === 'question' && (
                <motion.div
                  key={`question-${currentQuestion}`}
                  className="w-full max-w-3xl text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Question category */}
                  <motion.div 
                    className="inline-block bg-[#e16349]/10 border border-[#e16349]/20 rounded-2xl px-4 py-2 mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <span className="text-[#e16349] font-medium">
                      {questions[currentQuestion].category}
                    </span>
                  </motion.div>

                  {/* Question card */}
                  <motion.div 
                    className="bg-white rounded-[32px] shadow-lg p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <TypewriterText
                      text={questions[currentQuestion].text}
                      className="text-xl text-gray-800 leading-relaxed"
                      onComplete={() => {
                        setTimeout(() => {
                          setIsAISpeaking(false);
                        }, 300);
                      }}
                    />
                  </motion.div>
                </motion.div>
              )}

              {/* Next question transition */}
              {interviewStep === 'next' && (
                <motion.div
                  key="next"
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-white rounded-[32px] shadow-lg p-6 max-w-md mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-700">Переходим к следующему вопросу...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom section - AI Avatar and Voice Recorder */}
          <div className="flex flex-col items-center gap-8 pb-4">
            {/* AI Avatar - Always at bottom */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <AIAvatarWithWaves 
                isSpeaking={isAISpeaking || interviewStep === 'welcome'}
                size="medium"
              />
            </motion.div>

            {/* Voice recorder - Only show during question phase */}
            <AnimatePresence>
              {interviewStep === 'question' && !isAISpeaking && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="w-full max-w-lg"
                >
                  <VoiceRecorder
                    onRecordingComplete={handleRecordingComplete}
                    onSkipQuestion={skipCurrentQuestion}
                    maxDuration={questions[currentQuestion].maxDuration}
                    className="w-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Background decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-[#e16349]/5 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-40 h-40 bg-[#e16349]/5 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <HelpModal 
          isOpen={isHelpModalOpen} 
          onClose={() => setIsHelpModalOpen(false)} 
        />

      </div>
    </div>
  );
}
