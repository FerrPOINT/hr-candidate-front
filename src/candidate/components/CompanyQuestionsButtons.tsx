import { motion } from 'framer-motion';
import { CompanyQuestion } from './interview/types';

interface CompanyQuestionsButtonsProps {
  questions: CompanyQuestion[];
  onQuestionSelect: (question: CompanyQuestion) => void;
  onNoQuestions: () => void;
}

export function CompanyQuestionsButtons({ 
  questions, 
  onQuestionSelect, 
  onNoQuestions 
}: CompanyQuestionsButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-3"
    >
      <div className="text-center mb-4">
        <p className="text-gray-600">Выберите вопрос о компании:</p>
      </div>
      
      {/* Company Questions */}
      <div className="space-y-2">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => onQuestionSelect(question)}
              className="w-full text-left py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-interview-accent hover:bg-interview-accent/5 transition-all duration-200 bg-white"
            >
              <span className="text-gray-700 hover:text-interview-accent">
                {question.text}
              </span>
            </button>
          </motion.div>
        ))}
      </div>

      {/* No Questions Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: questions.length * 0.1 + 0.2 }}
        className="pt-2"
      >
        <button
          onClick={onNoQuestions}
          className="w-full bg-[var(--interview-accent)] hover:bg-[var(--interview-accent-hover)] text-white font-medium rounded-[32px] py-3 px-6 shadow-md transition-all duration-200 hover:shadow-lg"
        >
          У меня нет вопросов
        </button>
      </motion.div>
    </motion.div>
  );
}
