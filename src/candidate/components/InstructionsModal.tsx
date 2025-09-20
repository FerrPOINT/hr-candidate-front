import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './';
import { CheckCircle, MessageSquare, Clock, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartInterview: () => void;
  questionsCount?: number;
  answerTimeSec?: number;
}

const steps = [
  {
    id: 1,
    title: "Добро пожаловать!",
    subtitle: "AI-интервью — это просто",
    content: "Наш умный ассистент проведет с вами дружескую беседу. Никакого стресса — только возможность показать себя с лучшей стороны.",
    icon: Sparkles,
    color: "#8B9DC3",
    bgColor: "rgba(139, 157, 195, 0.06)"
  },
  {
    id: 2,
    title: "Как это работает",
    subtitle: "Всего 4 простых шага",
    content: null,
    icon: MessageSquare,
    color: "#8B9DC3",
    bgColor: "rgba(139, 157, 195, 0.06)"
  },
  {
    id: 3,
    title: "Вы готовы!",
    subtitle: "Время показать себя",
    content: "Помните: здесь нет правильных или неправильных ответов. Просто будьте собой и рассказывайте о своем опыте естественно.",
    icon: CheckCircle,
    color: "#38c793",
    bgColor: "rgba(56, 199, 147, 0.08)"
  }
];

export function InstructionsModal({ isOpen, onClose, onStartInterview, questionsCount = 3, answerTimeSec = 150 }: InstructionsModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Reset to first step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartInterview();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  const formatMmSs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')} мин на ответ`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-[32px] w-full max-w-3xl overflow-hidden relative shadow-2xl"
      >
        {/* Progress bar */}
        <div className="h-1 bg-muted relative overflow-hidden">
          <motion.div
            className="h-full"
            style={{ backgroundColor: 'var(--interview-accent)' }}
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        <div className="p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm"
                  style={{ 
                    background: `linear-gradient(135deg, ${currentStepData.color}, ${currentStepData.color}dd)` 
                  }}
                >
                  <currentStepData.icon className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <h4 className="mb-2 text-black">{currentStepData.title}</h4>
                  <p className="text-gray-600 text-sm">{currentStepData.subtitle}</p>
                </motion.div>
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mb-8"
              >
                {currentStep === 0 && (
                  <div 
                    className="rounded-[20px] p-8 text-center"
                    style={{ backgroundColor: currentStepData.bgColor }}
                  >
                    <p className="text-black mb-8 leading-relaxed text-sm">
                      {currentStepData.content}
                    </p>
                    <div className="flex items-center justify-center gap-8 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatMmSs(answerTimeSec)}</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>{questionsCount} вопроса</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    {/* Steps visualization */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="bg-gray-100 rounded-[16px] p-8 relative overflow-hidden"
                      >
                        <div className="flex items-center gap-5 mb-4">
                          <div className="w-8 h-8 bg-[var(--interview-accent)] rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">1</div>
                          <h5 className="text-black whitespace-nowrap">Слушайте вопрос</h5>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          ИИ-ассистент озвучит вопрос с анимированным аватаром
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="bg-gray-100 rounded-[16px] p-8 relative overflow-hidden"
                      >
                        <div className="flex items-center gap-5 mb-4">
                          <div className="w-8 h-8 bg-[var(--interview-accent)] rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">2</div>
                          <h5 className="text-black whitespace-nowrap">Начните запись</h5>
                        </div>
                        <div className="space-y-3">
                          <p className="text-gray-600 text-xs">Нажмите кнопку:</p>
                          <div className="inline-flex">
                            <button 
                              className="rounded-[32px] px-6 py-2.5 h-10 text-sm leading-[20px] tracking-[-0.084px] font-medium pointer-events-none bg-[var(--interview-accent)] text-white shadow-md"
                            >
                              Записать ответ
                            </button>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                        className="bg-gray-100 rounded-[16px] p-8 relative overflow-hidden"
                      >
                        <div className="flex items-center gap-5 mb-4">
                          <div className="w-8 h-8 bg-[var(--interview-accent)] rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">3</div>
                          <h5 className="text-black">Отвечайте</h5>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          Говорите естественно, приводите примеры из опыта
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                        className="bg-gray-100 rounded-[16px] p-8 relative overflow-hidden"
                      >
                        <div className="flex items-center gap-5 mb-4">
                          <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">4</div>
                          <h5 className="text-black">Завершите</h5>
                        </div>
                        <div className="space-y-3">
                          <p className="text-gray-600 text-xs">Нажмите:</p>
                          <div className="inline-flex">
                            <button 
                              className="bg-[#df1c41] hover:bg-[#c11a3a] text-white rounded-[60px] pl-2 pr-6 py-2 h-10 text-sm leading-[20px] tracking-[-0.084px] font-medium flex items-center gap-3 shadow-lg transition-all duration-200 pointer-events-none"
                            >
                              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                                <div className="bg-[#df1c41] rounded w-3 h-3"></div>
                              </div>
                              Остановить запись
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div 
                    className="rounded-[20px] p-8 border border-gray-300"
                    style={{ backgroundColor: "rgba(245, 246, 241, 1)" }}
                  >
                    <div className="text-center mb-8">
                      <p className="text-black mb-8 leading-relaxed text-sm">
                        {currentStepData.content}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                        className="bg-white border border-gray-300 rounded-[12px] p-5 hover:border-gray-400 transition-colors duration-200"
                      >
                        <div className="text-xl mb-3">💬</div>
                        <p className="text-xs font-medium text-black">Будьте собой</p>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.3 }}
                        className="bg-white border border-gray-300 rounded-[12px] p-5 hover:border-gray-400 transition-colors duration-200"
                      >
                        <div className="text-xl mb-3">⏰</div>
                        <p className="text-xs font-medium text-black">Не торопитесь</p>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.3 }}
                        className="bg-white border border-gray-300 rounded-[12px] p-5 hover:border-gray-400 transition-colors duration-200"
                      >
                        <div className="text-xl mb-3">✨</div>
                        <p className="text-xs font-medium text-black">Показать опыт</p>
                      </motion.div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex items-center justify-between"
          >
            {/* Progress dots */}
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep ? 'bg-[var(--interview-accent)]' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  animate={{ 
                    scale: index === currentStep ? 1.2 : 1,
                    opacity: index === currentStep ? 1 : 0.6
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  className="rounded-[20px] px-6 h-12 text-sm font-medium border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-black transition-all duration-200"
                >
                  Назад
                </Button>
              )}

              <Button
                onClick={handleNext}
                className="rounded-[20px] px-6 h-12 text-sm font-medium bg-[var(--interview-accent)] hover:bg-[var(--interview-accent-hover)] text-white shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {currentStep === steps.length - 1 ? 'Начать интервью' : 'Далее'}
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
