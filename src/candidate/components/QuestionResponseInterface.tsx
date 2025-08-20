import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: string;
  question: string;
  answer: string;
}

const COMPANY_QUESTIONS: Question[] = [
  {
    id: 'who-are-we',
    question: 'Кто мы?',
    answer: 'Мы рады что тебе интересны наши вакансии. Давай познакомимся поближе.\n\nМы - технологическая компания, где создают не просто код, а реальное решение для бизнеса.\nНаша сила - в сочетании экспертизы, гибкости и человеческого подхода. Здесь ценят не только результат, но и людей, которые его достигают.'
  },
  {
    id: 'what-we-do',
    question: 'Чем мы занимаемся?',
    answer: 'Мы разрабатываем инновационные технологические решения для бизнеса. Наша команда создает веб-приложения, мобильные приложения и системы автоматизации, которые помогают компаниям оптимизировать свои процессы и достигать новых высот в цифровой трансформации.'
  },
  {
    id: 'our-values',
    question: 'Наши ценности',
    answer: 'Наши основные ценности - это качество, инновации и командная работа. Мы верим в открытое общение, непрерывное обучение и создание продуктов, которые действительно решают проблемы пользователей. Каждый член команды важен и вносит свой уникальный вклад в общий успех.'
  },
  {
    id: 'what-makes-us-special',
    question: 'Что делает нас особенными?',
    answer: 'Нас отличает индивидуальный подход к каждому проекту и сотруднику. Мы не просто выполняем техническое задание - мы становимся частью бизнеса клиента, понимаем его потребности и предлагаем оптимальные решения. Наша гибкость и адаптивность позволяют быстро реагировать на изменения рынка.'
  },
  {
    id: 'why-great-to-work',
    question: 'Почему у нас круто работать?',
    answer: 'У нас созданы все условия для профессионального роста и комфортной работы. Мы предлагаем гибкий график, возможность удаленной работы, обучение за счет компании, интересные проекты и дружный коллектив. Каждый может влиять на развитие продукта и видеть результаты своей работы.'
  },
  {
    id: 'one-window-principle',
    question: 'Для сотрудников у нас разработан принцип одного окна',
    answer: 'Принцип одного окна означает, что любой вопрос сотрудника решается через одного менеджера или HR-партнера. Не нужно обращаться в разные отделы - ваш персональный координатор поможет с любыми вопросами: от технических до административных, от карьерного роста до личных потребностей.'
  }
];

interface QuestionResponseInterfaceProps {
  selectedQuestion: Question | null;
  onQuestionSelect: (question: Question) => void;
  onFinish: () => void;
  availableQuestions: Question[];
  onNewMessage?: () => void;
}

export function QuestionResponseInterface({ 
  selectedQuestion, 
  onQuestionSelect, 
  onFinish,
  availableQuestions,
  onNewMessage
}: QuestionResponseInterfaceProps) {
  const [showNewQuestions, setShowNewQuestions] = useState(false);

  // Логика показа кнопок после выбора вопроса
  useEffect(() => {
    if (!selectedQuestion) return;
    
    console.log('QuestionResponseInterface: New question selected:', selectedQuestion.question);
    
    // Сбрасываем состояния
    setShowNewQuestions(false);
    
    // Уведомляем о новом вопросе
    onNewMessage?.();
    
    // Показываем кнопки через небольшую задержку
    const buttonsTimer = setTimeout(() => {
      setShowNewQuestions(true);
      onNewMessage?.();
    }, 1000);
    
    return () => clearTimeout(buttonsTimer);
  }, [selectedQuestion?.id, onNewMessage]);

  const handleNewQuestionSelect = useCallback((question: Question) => {
    console.log('Selecting new question:', question.question);
    onQuestionSelect(question);
  }, [onQuestionSelect]);

  const handleFinish = useCallback(() => {
    console.log('Finishing questions');
    onFinish();
  }, [onFinish]);

  if (!selectedQuestion) {
    console.log('QuestionResponseInterface: No selected question, returning null');
    return null;
  }

  console.log('QuestionResponseInterface: Rendering question:', selectedQuestion.question);

  return (
    <motion.div 
      key={selectedQuestion.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col space-y-4 w-full"
    >
      {/* Кнопки для новых вопросов */}
      <AnimatePresence>
        {showNewQuestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-8 items-end justify-start w-full mt-14"
          >
            {/* Основные вопросы - ИСПРАВЛЕН текст до 16px */}
            <div className="flex flex-wrap gap-2 items-start justify-end w-full">
              {availableQuestions
                .filter(q => q.id !== selectedQuestion.id)
                .slice(0, 6)
                .map((questionData) => (
                  <motion.button
                    key={questionData.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    onClick={() => handleNewQuestionSelect(questionData)}
                    className="bg-white border border-gray-200 px-6 py-3 rounded-bl-[16px] rounded-tl-[16px] rounded-tr-[16px] font-Inter font-normal text-black text-[16px] leading-[20px] tracking-[-0.176px] hover:shadow-md hover:bg-white/95 hover:border-gray-300 transition-all duration-200"
                  >
                    {questionData.question}
                  </motion.button>
                ))}
            </div>
            
            {/* Кнопка завершения - ИСПРАВЛЕН текст до 16px */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-row gap-2 items-center justify-start"
            >
                             <button
                onClick={handleFinish}
                className="px-6 py-3 rounded-bl-[16px] rounded-tl-[16px] rounded-tr-[16px] font-Inter font-medium text-[16px] leading-[20px] tracking-[-0.176px] bg-[var(--interview-accent)] hover:bg-[var(--interview-accent-hover)] text-white shadow-md transition-all duration-200 hover:shadow-lg"
              >
                У меня нет вопросов
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export { COMPANY_QUESTIONS };
export type { Question };
