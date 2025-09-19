import { renderHook, act } from '@testing-library/react';
import { useInterviewStages, InterviewStage } from '../useInterviewStages';

describe('useInterviewStages', () => {
  const mockInterviewId = 123;

  describe('Инициализация', () => {
    it('инициализируется с правильными значениями по умолчанию', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      expect(result.current.currentStage).toBe('welcome-messages');
      expect(result.current.stageHistory).toEqual(['welcome-messages']);
      expect(result.current.stageConfigs).toBeDefined();
    });

    it('возвращает правильный интерфейс', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      expect(result.current).toHaveProperty('currentStage');
      expect(result.current).toHaveProperty('stageHistory');
      expect(result.current).toHaveProperty('stageConfigs');
      expect(result.current).toHaveProperty('goToStage');
      expect(result.current).toHaveProperty('goToNextStage');
      expect(result.current).toHaveProperty('goToPreviousStage');
      expect(result.current).toHaveProperty('goToStageDirectly');
      expect(result.current).toHaveProperty('getCurrentStageConfig');
      expect(result.current).toHaveProperty('getProgress');
      expect(result.current).toHaveProperty('resetToStage');
    });
  });

  describe('goToStage', () => {
    it('переходит к указанному этапу', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      act(() => {
        result.current.goToStage('microphone-check');
      });

      expect(result.current.currentStage).toBe('microphone-check');
      expect(result.current.stageHistory).toEqual(['welcome-messages', 'microphone-check']);
    });

    it('добавляет этап в историю', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      act(() => {
        result.current.goToStage('microphone-check');
      });

      act(() => {
        result.current.goToStage('interview-start');
      });

      expect(result.current.stageHistory).toEqual([
        'welcome-messages',
        'microphone-check',
        'interview-start'
      ]);
    });

    it('работает со всеми этапами', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      const stages: InterviewStage[] = [
        'welcome-messages',
        'microphone-check',
        'interview-start',
        'questions',
        'completion',
        'finished'
      ];

      stages.forEach(stage => {
        act(() => {
          result.current.goToStage(stage);
        });

        expect(result.current.currentStage).toBe(stage);
      });
    });
  });

  describe('goToNextStage', () => {
    it('переходит к следующему этапу в правильном порядке', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      // Начинаем с welcome-messages
      expect(result.current.currentStage).toBe('welcome-messages');

      // Переходим к следующему этапу
      act(() => {
        result.current.goToNextStage();
      });

      expect(result.current.currentStage).toBe('microphone-check');

      // Переходим к следующему этапу
      act(() => {
        result.current.goToNextStage();
      });

      expect(result.current.currentStage).toBe('interview-start');
    });

    it('не переходит дальше последнего этапа', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      // Переходим к последнему этапу
      act(() => {
        result.current.goToStage('finished');
      });

      const initialHistory = [...result.current.stageHistory];

      // Пытаемся перейти к следующему этапу
      act(() => {
        result.current.goToNextStage();
      });

      expect(result.current.currentStage).toBe('finished');
      expect(result.current.stageHistory).toEqual(initialHistory);
    });

    it('проходит все этапы в правильном порядке', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      const expectedOrder: InterviewStage[] = [
        'welcome-messages',
        'microphone-check',
        'interview-start',
        'questions',
        'completion',
        'finished'
      ];

      expectedOrder.forEach((expectedStage, index) => {
        if (index > 0) {
          act(() => {
            result.current.goToNextStage();
          });
        }

        expect(result.current.currentStage).toBe(expectedStage);
      });
    });
  });

  describe('goToPreviousStage', () => {
    it('переходит к предыдущему этапу', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      // Переходим к microphone-check
      act(() => {
        result.current.goToStage('microphone-check');
      });

      // Переходим к предыдущему этапу
      act(() => {
        result.current.goToPreviousStage();
      });

      expect(result.current.currentStage).toBe('welcome-messages');
    });

    it('не переходит назад с первого этапа', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      // Начинаем с welcome-messages
      expect(result.current.currentStage).toBe('welcome-messages');

      const initialHistory = [...result.current.stageHistory];

      // Пытаемся перейти к предыдущему этапу
      act(() => {
        result.current.goToPreviousStage();
      });

      expect(result.current.currentStage).toBe('welcome-messages');
      expect(result.current.stageHistory).toEqual(initialHistory);
    });

    it('работает с несколькими этапами', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      // Переходим к questions
      act(() => {
        result.current.goToStage('questions');
      });

      // Переходим к предыдущему этапу
      act(() => {
        result.current.goToPreviousStage();
      });

      expect(result.current.currentStage).toBe('interview-start');
    });
  });

  describe('goToStageDirectly', () => {
    it('переходит к этапу напрямую', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      act(() => {
        result.current.goToStageDirectly('questions');
      });

      expect(result.current.currentStage).toBe('questions');
      expect(result.current.stageHistory).toEqual(['welcome-messages', 'questions']);
    });

    it('добавляет этап в историю', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      act(() => {
        result.current.goToStageDirectly('completion');
      });

      expect(result.current.stageHistory).toEqual(['welcome-messages', 'completion']);
    });
  });

  describe('getCurrentStageConfig', () => {
    it('возвращает конфигурацию текущего этапа', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      const config = result.current.getCurrentStageConfig();

      expect(config.stage).toBe('welcome-messages');
      expect(config.title).toBe('Вступительные сообщения');
      expect(config.description).toBe('Ознакомьтесь с процессом интервью');
      expect(config.canGoBack).toBe(false);
      expect(config.canSkip).toBe(false);
    });

    it('возвращает правильную конфигурацию для каждого этапа', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      const stageConfigs = {
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

      Object.entries(stageConfigs).forEach(([stage, expectedConfig]) => {
        act(() => {
          result.current.goToStage(stage as InterviewStage);
        });

        const config = result.current.getCurrentStageConfig();
        expect(config).toEqual(expectedConfig);
      });
    });
  });

  describe('getProgress', () => {
    it('возвращает правильный прогресс для первого этапа', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      const progress = result.current.getProgress();

      expect(progress.current).toBe(1);
      expect(progress.total).toBe(6);
      expect(progress.percentage).toBe(17); // Math.round((1/6) * 100)
    });

    it('возвращает правильный прогресс для последнего этапа', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      act(() => {
        result.current.goToStage('finished');
      });

      const progress = result.current.getProgress();

      expect(progress.current).toBe(6);
      expect(progress.total).toBe(6);
      expect(progress.percentage).toBe(100);
    });

    it('возвращает правильный прогресс для промежуточного этапа', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      act(() => {
        result.current.goToStage('questions');
      });

      const progress = result.current.getProgress();

      expect(progress.current).toBe(4);
      expect(progress.total).toBe(6);
      expect(progress.percentage).toBe(67); // Math.round((4/6) * 100)
    });

    it('всегда возвращает валидные значения', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      const stages: InterviewStage[] = [
        'welcome-messages',
        'microphone-check',
        'interview-start',
        'questions',
        'completion',
        'finished'
      ];

      stages.forEach((stage, index) => {
        act(() => {
          result.current.goToStage(stage);
        });

        const progress = result.current.getProgress();

        expect(progress.current).toBe(index + 1);
        expect(progress.total).toBe(6);
        expect(progress.percentage).toBe(Math.round(((index + 1) / 6) * 100));
        expect(progress.current).toBeGreaterThan(0);
        expect(progress.total).toBeGreaterThan(0);
        expect(progress.percentage).toBeGreaterThanOrEqual(0);
        expect(progress.percentage).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('resetToStage', () => {
    it('сбрасывает к указанному этапу', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      // Переходим к нескольким этапам
      act(() => {
        result.current.goToStage('microphone-check');
      });

      act(() => {
        result.current.goToStage('interview-start');
      });

      // Сбрасываем к questions
      act(() => {
        result.current.resetToStage('questions');
      });

      expect(result.current.currentStage).toBe('questions');
      expect(result.current.stageHistory).toEqual(['questions']);
    });

    it('очищает историю при сбросе', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      // Переходим к нескольким этапам
      act(() => {
        result.current.goToStage('microphone-check');
      });

      act(() => {
        result.current.goToStage('interview-start');
      });

      expect(result.current.stageHistory).toHaveLength(3);

      // Сбрасываем к welcome-messages
      act(() => {
        result.current.resetToStage('welcome-messages');
      });

      expect(result.current.stageHistory).toEqual(['welcome-messages']);
    });
  });

  describe('stageConfigs', () => {
    it('содержит конфигурацию для всех этапов', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      const stageConfigs = result.current.stageConfigs;

      expect(stageConfigs).toHaveProperty('welcome-messages');
      expect(stageConfigs).toHaveProperty('microphone-check');
      expect(stageConfigs).toHaveProperty('interview-start');
      expect(stageConfigs).toHaveProperty('questions');
      expect(stageConfigs).toHaveProperty('completion');
      expect(stageConfigs).toHaveProperty('finished');
    });

    it('каждая конфигурация содержит все необходимые поля', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      const stageConfigs = result.current.stageConfigs;

      Object.values(stageConfigs).forEach(config => {
        expect(config).toHaveProperty('stage');
        expect(config).toHaveProperty('title');
        expect(config).toHaveProperty('description');
        expect(config).toHaveProperty('canGoBack');
        expect(config).toHaveProperty('canSkip');
      });
    });

    it('конфигурации имеют правильные значения canGoBack', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      const stageConfigs = result.current.stageConfigs;

      expect(stageConfigs['welcome-messages'].canGoBack).toBe(false);
      expect(stageConfigs['microphone-check'].canGoBack).toBe(true);
      expect(stageConfigs['interview-start'].canGoBack).toBe(false);
      expect(stageConfigs['questions'].canGoBack).toBe(false);
      expect(stageConfigs['completion'].canGoBack).toBe(true);
      expect(stageConfigs['finished'].canGoBack).toBe(false);
    });

    it('конфигурации имеют правильные значения canSkip', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      const stageConfigs = result.current.stageConfigs;

      Object.values(stageConfigs).forEach(config => {
        expect(config.canSkip).toBe(false);
      });
    });
  });

  describe('Интеграция методов', () => {
    it('правильно работает комбинация методов', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      // Начинаем с welcome-messages
      expect(result.current.currentStage).toBe('welcome-messages');

      // Переходим к следующему этапу
      act(() => {
        result.current.goToNextStage();
      });

      expect(result.current.currentStage).toBe('microphone-check');

      // Переходим к предыдущему этапу
      act(() => {
        result.current.goToPreviousStage();
      });

      expect(result.current.currentStage).toBe('welcome-messages');

      // Переходим напрямую к questions
      act(() => {
        result.current.goToStageDirectly('questions');
      });

      expect(result.current.currentStage).toBe('questions');

      // Сбрасываем к welcome-messages
      act(() => {
        result.current.resetToStage('welcome-messages');
      });

      expect(result.current.currentStage).toBe('welcome-messages');
      expect(result.current.stageHistory).toEqual(['welcome-messages']);
    });

    it('правильно обновляет историю при различных операциях', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      // Переходим к microphone-check
      act(() => {
        result.current.goToStage('microphone-check');
      });

      expect(result.current.stageHistory).toEqual(['welcome-messages', 'microphone-check']);

      // Переходим к interview-start
      act(() => {
        result.current.goToStage('interview-start');
      });

      expect(result.current.stageHistory).toEqual(['welcome-messages', 'microphone-check', 'interview-start']);

      // Переходим к предыдущему этапу
      act(() => {
        result.current.goToPreviousStage();
      });

      expect(result.current.currentStage).toBe('microphone-check');
      expect(result.current.stageHistory).toEqual(['welcome-messages', 'microphone-check', 'interview-start', 'microphone-check']);
    });
  });

  describe('Обработка граничных случаев', () => {
    it('правильно обрабатывает переход к несуществующему этапу', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      // Переходим к несуществующему этапу (TypeScript не позволит, но тестируем)
      act(() => {
        result.current.goToStage('microphone-check' as any);
      });

      expect(result.current.currentStage).toBe('microphone-check');
    });

    it('правильно обрабатывает сброс к несуществующему этапу', () => {
      const { result } = renderHook(() => useInterviewStages(mockInterviewId));

      // Сбрасываем к несуществующему этапу
      act(() => {
        result.current.resetToStage('microphone-check' as any);
      });

      expect(result.current.currentStage).toBe('microphone-check');
      expect(result.current.stageHistory).toEqual(['microphone-check']);
    });
  });
});
