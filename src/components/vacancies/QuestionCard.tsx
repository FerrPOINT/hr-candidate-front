import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ITEM_TYPE = "question";

interface DragItem {
  id: string;
  index: number;
}

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    evaluationCriteria: string;
    weight: number;
    isRequired: boolean;
    order: number;
  };
  index: number;
  questions: Array<{
    id: string;
    text: string;
    evaluationCriteria: string;
    weight: number;
    isRequired: boolean;
    order: number;
  }>;
  setQuestions: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    text: string;
    evaluationCriteria: string;
    weight: number;
    isRequired: boolean;
    order: number;
  }>>>;
  moveQuestion: (dragIndex: number, hoverIndex: number) => void;
}

export function QuestionCard({ 
  question, 
  index, 
  questions, 
  setQuestions, 
  moveQuestion 
}: QuestionCardProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: { id: `question-${index}`, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: DragItem) => {
      if (item.index === index) return;
      moveQuestion(item.index, index);
      item.index = index;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => {
        if (node) {
          preview(drop(node));
        }
      }}
      style={{ 
        opacity: isDragging ? 0.6 : 1,
        transform: isDragging ? 'rotate(1deg) scale(1.02)' : 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '2px solid transparent'
      }}
      className="bg-[#ffffff] rounded-[32px] p-6 w-full relative transition-all duration-300"
    >
      {/* Question header with enhanced drag handle and number */}
      <div className="flex items-center gap-3 mb-6">
        <div
          ref={(node) => {
            if (node) {
              drag(node);
            }
          }}
          className="cursor-move w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] rounded-lg hover:from-[#e16349] hover:to-[#df1c41] transition-all duration-200 group shadow-sm hover:shadow-md border border-[#e2e4e9] hover:border-[#e16349] transform hover:scale-105"
          title="Перетащите для изменения порядка"
        >
          {/* Beautiful drag handle icon - 3 horizontal lines */}
          <svg
            className="w-4 h-4 text-[#525866] group-hover:text-white transition-colors"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M2 6h12M2 10h12M2 14h12" />
          </svg>
        </div>
        <h4 className="text-[16px] font-medium text-[#0a0d14]">
          Вопрос {index + 1}/{questions.length}
        </h4>
      </div>

      {/* Question input */}
      <div className="mb-6">
        <textarea
          value={question.text}
          onChange={(e) => {
            // Update the question text in the main state
            setQuestions(prev => prev.map((q, i) => 
              i === index ? { ...q, text: e.target.value } : q
            ));
          }}
          placeholder="Введите текст вопроса"
          className="w-full h-[120px] p-6 border border-[#e2e4e9] rounded-[32px] text-[16px] text-[16px] resize-none outline-none focus:ring-0"
        />
      </div>

      {/* Navigation arrows for question regeneration */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-muted/50 border border-border rounded-lg flex flex-row gap-0.5 items-center justify-center p-[5px] m-[5px]">
          {/* Previous question button */}
          <button className="relative shrink-0 size-4 cursor-pointer transition-all rounded-sm hover:bg-[#f6f8fa] disabled:opacity-30 disabled:cursor-not-allowed" data-name="chevron-left">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d="M10 4L6 8L10 12" stroke="#525866" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </button>
          {/* Next question button */}
          <button className="relative shrink-0 size-4 cursor-pointer transition-all rounded-sm hover:bg-[#f6f8fa] disabled:opacity-30 disabled:cursor-not-allowed" data-name="chevron-right">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d="M6 4L10 8L6 12" stroke="#525866" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Evaluation criteria */}
      <div className="mb-6">
        <textarea
          value={question.evaluationCriteria}
          onChange={(e) => {
            // Update the evaluation criteria in the main state
            setQuestions(prev => prev.map((q, i) => 
              i === index ? { ...q, evaluationCriteria: e.target.value } : q
            ));
          }}
          placeholder="Укажите ключевые точки на которые ИИ должен опираться при оценке. Это не обязательно, но может улучшить точность оценки."
          className="w-full min-h-[80px] p-6 border border-[#e2e4e9] rounded-[32px] text-[16px] text-[#525866] resize-none outline-none focus:ring-0"
        />
      </div>

      {/* Action buttons at the bottom - right side */}
      <div className="flex items-center justify-end gap-3 mt-6">
        {/* Regenerate button */}
        <button className="bg-[#ffffff] text-[#525866] px-4 py-2 rounded-2xl font-medium border border-[#e2e4e9] hover:bg-[#f6f8fa] transition-colors cursor-pointer flex items-center gap-2">
          <span>⭐</span>
          Сгенерировать снова
        </button>
        
        {/* Delete button */}
        <button className="bg-[#ffffff] text-[#e16349] px-4 py-2 rounded-2xl font-medium border border-[#e16349] hover:bg-[#fef2f2] transition-colors cursor-pointer flex items-center gap-2">
          <span>🗑️</span>
          Удалить
        </button>
      </div>
    </div>
  );
} 