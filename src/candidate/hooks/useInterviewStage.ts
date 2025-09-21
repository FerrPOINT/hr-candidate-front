import { useState, useCallback } from 'react';

export interface InterviewStage {
  name: string;
  title: string;
  description: string;
  component: string;
}

const stages: InterviewStage[] = [
  { 
    name: 'welcome',
    title: 'Добро пожаловать', 
    description: 'Приветственный экран',
    component: 'WelcomeStage'
  },
  { 
    name: 'microphone',
    title: 'Проверка микрофона', 
    description: 'Проверим ваш микрофон',
    component: 'MicrophoneCheckStage'
  },
  { 
    name: 'question',
    title: 'Вопрос 1', 
    description: 'Расскажите о своем опыте работы с React',
    component: 'QuestionStage'
  },
  { 
    name: 'complete',
    title: 'Завершение', 
    description: 'Интервью завершено',
    component: 'CompletionStage'
  }
];

export const useInterviewStage = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const nextStage = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (currentStage < stages.length - 1) {
        setCurrentStage(currentStage + 1);
      }
      setIsLoading(false);
    }, 1000);
  }, [currentStage, stages.length]);

  const previousStage = useCallback(() => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  }, [currentStage]);

  const goToStage = useCallback((stageIndex: number) => {
    if (stageIndex >= 0 && stageIndex < stages.length) {
      setCurrentStage(stageIndex);
    }
  }, [stages.length]);

  const isLastStage = currentStage === stages.length - 1;
  const isFirstStage = currentStage === 0;
  const currentStageInfo = stages[currentStage];
  const progress = ((currentStage + 1) / stages.length) * 100;

  return {
    // Основные методы (соответствуют тестам)
    currentStage,
    stages,
    nextStage,
    previousStage,
    goToStage,
    
    // Информация о текущем этапе
    currentStageInfo,
    progress,
    
    // Состояние
    isLoading,
    isLastStage,
    isFirstStage,
    totalStages: stages.length,
    
    // Дополнительные методы
    setLoading: setIsLoading
  };
};
