import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { QuestionCard } from './types';
import { formatTime } from './utils';

interface QuestionCardComponentProps {
  questionCard: QuestionCard;
}

export function QuestionCardComponent({ questionCard }: QuestionCardComponentProps) {
  const CardContent = (
    <div className="bg-white rounded-[24px] border border-[#e2e4e9] max-w-[842px] w-full">
      {/* Question content */}
      <div className="px-8 py-10">
        <div className="text-center mb-8">
          <p className="text-[#000000] text-[18px] leading-[24px] tracking-[-0.27px]">
            {questionCard.text}
          </p>
        </div>
        
        {/* Status footer */}
        <div className="flex items-center justify-center gap-1.5">
          {questionCard.status === 'active' && questionCard.timeRemaining !== null && questionCard.timeRemaining !== undefined && (
            <>
              <Clock className="w-4 h-4 text-[#e16349]" />
              <span className="text-[#e16349] text-[16px] leading-[24px] tracking-[-0.176px]">
                {formatTime(questionCard.timeRemaining)}
              </span>
            </>
          )}
          
          {questionCard.status === 'completed' && (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" fill="#2DB978" />
              </svg>
              <span className="text-[#000000] text-[16px] leading-[24px] tracking-[-0.176px]">
                Сохранено
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (questionCard.isNew) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-start w-full"
      >
        {CardContent}
      </motion.div>
    );
  }

  return (
    <div className="flex justify-start w-full">
      {CardContent}
    </div>
  );
}
