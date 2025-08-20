import React from 'react';

export const CompletionStage: React.FC = React.memo(() => {
  return (
    <div className="text-center">
      <div className="w-24 h-24 bg-[#28a745] rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-white text-2xl">✅</span>
      </div>
      <p className="text-[#525866]">
        Поздравляем! Интервью завершено. Ваши ответы будут обработаны и отправлены рекрутеру.
      </p>
    </div>
  );
});

CompletionStage.displayName = 'CompletionStage';
