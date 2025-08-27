

interface QuestionProgressIndicatorProps {
  questionIndex: number;
}

export function QuestionProgressIndicator({ questionIndex }: QuestionProgressIndicatorProps) {
  return (
    <div className="max-w-[842px] mx-auto mb-4">
      <div className="flex items-start justify-start px-0 py-6 w-full">
        <div className="text-[#162137] text-[12px] leading-[16px]">
          Вопрос {questionIndex + 1}
        </div>
        <div className="flex-1 ml-6 flex items-center justify-center h-4">
          <div className="bg-[#e2e4e9] h-px w-full"></div>
        </div>
      </div>
    </div>
  );
}
