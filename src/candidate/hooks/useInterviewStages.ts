import { useState, useCallback } from 'react';

export type InterviewStage = 
  | 'welcome-messages'      // Вступительные сообщения
  | 'microphone-check'      // Проверка микрофона
  | 'interview-start'       // Старт интервью (после проверки микрофона)
  | 'questions'             // Основные вопросы
  | 'completion'            // Завершение с дополнительными вопросами
  | 'finished';             // Интервью завершено

export interface InterviewStageConfig {
  stage: InterviewStage;
  title: string;
  description: string;
  canGoBack: boolean;
  canSkip: boolean;
}

export const useInterviewStages = (interviewId: number) => {
  const [currentStage, setCurrentStage] = useState<InterviewStage>('welcome-messages');
  const [stageHistory, setStageHistory] = useState<InterviewStage[]>(['welcome-messages']);

  const stageConfigs: Record<InterviewStage, InterviewStageConfig> = {
    'welcome-messages': {
      stage: 'welcome-messages',
      title: 'Вступительные сообщения',
      description: 'Ознакомьтесь с процессом интервью',
      canGoBack: false,
      canSkip: false
    },
    'microphone-check': {
      stage: 'microphone-check',
      title: 'Проверка микрофона',
      description: 'Убедитесь, что ваш микрофон работает корректно',
      canGoBack: true,
      canSkip: false
    },
    'interview-start': {
      stage: 'interview-start',
      title: 'Запуск интервью',
      description: 'Запускаем собеседование и получаем первый вопрос',
      canGoBack: false,
      canSkip: false
    },
    'questions': {
      stage: 'questions',
      title: 'Основные вопросы',
      description: 'Ответьте на вопросы интервью',
      canGoBack: false,
      canSkip: false
    },
    'completion': {
      stage: 'completion',
      title: 'Завершение интервью',
      description: 'Дополнительные вопросы и завершение',
      canGoBack: true,
      canSkip: false
    },
    'finished': {
      stage: 'finished',
      title: 'Интервью завершено',
      description: 'Спасибо за участие',
      canGoBack: false,
      canSkip: false
    }
  };

  const goToStage = useCallback((stage: InterviewStage) => {
    setCurrentStage(stage);
    setStageHistory(prev => [...prev, stage]);
  }, []);

  const goToNextStage = useCallback(() => {
    const stageOrder: InterviewStage[] = [
      'welcome-messages',
      'microphone-check',
      'interview-start',
      'questions',
      'completion',
      'finished'
    ];
    
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1];
      goToStage(nextStage);
    }
  }, [currentStage, goToStage]);

  const goToPreviousStage = useCallback(() => {
    const stageOrder: InterviewStage[] = [
      'welcome-messages',
      'microphone-check',
      'interview-start',
      'questions',
      'completion',
      'finished'
    ];
    
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex > 0) {
      const prevStage = stageOrder[currentIndex - 1];
      setCurrentStage(prevStage);
      setStageHistory(prev => [...prev, prevStage]);
    }
  }, [currentStage]);

  const goToStageDirectly = useCallback((stage: InterviewStage) => {
    setCurrentStage(stage);
    setStageHistory(prev => [...prev, stage]);
  }, []);

  const getCurrentStageConfig = useCallback(() => {
    return stageConfigs[currentStage];
  }, [currentStage, stageConfigs]);

  const getProgress = useCallback(() => {
    const stageOrder: InterviewStage[] = [
      'welcome-messages',
      'microphone-check',
      'interview-start',
      'questions',
      'completion',
      'finished'
    ];
    
    const currentIndex = stageOrder.indexOf(currentStage);
    return {
      current: currentIndex + 1,
      total: stageOrder.length,
      percentage: Math.round(((currentIndex + 1) / stageOrder.length) * 100)
    };
  }, [currentStage]);

  const resetToStage = useCallback((stage: InterviewStage) => {
    setCurrentStage(stage);
    setStageHistory([stage]);
  }, []);

  return {
    currentStage,
    stageHistory,
    stageConfigs,
    goToStage,
    goToNextStage,
    goToPreviousStage,
    goToStageDirectly,
    getCurrentStageConfig,
    getProgress,
    resetToStage
  };
}; 