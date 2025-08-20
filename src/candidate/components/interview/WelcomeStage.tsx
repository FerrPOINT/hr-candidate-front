import React from 'react';

interface WelcomeStageProps {
  candidateName: string;
  onNext: () => void;
  onBack: () => void;
}

export const WelcomeStage: React.FC<WelcomeStageProps> = React.memo(({ 
  candidateName, 
  onNext, 
  onBack 
}) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-[#e16349] rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-white text-2xl">👋</span>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[#001a2c]">
          Добро пожаловать
        </h2>
        <p className="text-[#525866] text-lg">
          Здравствуйте, {candidateName}! Добро пожаловать на голосовое интервью с AI-ассистентом.
        </p>
        <p className="text-[#868c98] text-sm">
          Готовы начать интервью? Мы проверим ваш микрофон и зададим несколько вопросов.
        </p>
      </div>

      <div className="flex justify-center space-x-4 pt-4">
        <button
          onClick={onBack}
          className="px-6 py-2 text-[#868c98] hover:text-[#001a2c] transition-colors"
        >
          Назад
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-[#e16349] text-white rounded-lg hover:bg-[#d14a31] transition-colors"
        >
          Начать
        </button>
      </div>
    </div>
  );
});

WelcomeStage.displayName = 'WelcomeStage';
