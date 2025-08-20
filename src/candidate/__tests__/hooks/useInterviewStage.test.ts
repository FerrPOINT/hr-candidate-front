import { renderHook, act } from '@testing-library/react';
import { useInterviewStage } from '../../hooks/useInterviewStage';

describe('useInterviewStage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('инициализируется с первым этапом', () => {
    const { result } = renderHook(() => useInterviewStage());

    expect(result.current.currentStage).toBe(0);
    expect(result.current.stages).toHaveLength(4);
    expect(result.current.stages[0].name).toBe('welcome');
  });

  it('переходит к следующему этапу', async () => {
    const { result } = renderHook(() => useInterviewStage());

    act(() => {
      result.current.nextStage();
    });

    // Ждем завершения асинхронной операции
    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(result.current.currentStage).toBe(1);
    expect(result.current.stages[result.current.currentStage].name).toBe('microphone');
  });

  it('возвращается к предыдущему этапу', async () => {
    const { result } = renderHook(() => useInterviewStage());

    // Переходим к следующему этапу
    act(() => {
      result.current.nextStage();
    });

    // Ждем завершения асинхронной операции
    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(result.current.currentStage).toBe(1);

    // Возвращаемся назад
    act(() => {
      result.current.previousStage();
    });

    expect(result.current.currentStage).toBe(0);
  });

  it('не может перейти назад с первого этапа', () => {
    const { result } = renderHook(() => useInterviewStage());

    expect(result.current.currentStage).toBe(0);

    act(() => {
      result.current.previousStage();
    });

    expect(result.current.currentStage).toBe(0);
  });

  it('не может перейти вперед с последнего этапа', async () => {
    const { result } = renderHook(() => useInterviewStage());

    // Переходим к последнему этап
    act(() => {
      result.current.nextStage(); // 1
    });
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    act(() => {
      result.current.nextStage(); // 2
    });
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    act(() => {
      result.current.nextStage(); // 3
    });
    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(result.current.currentStage).toBe(3);

    act(() => {
      result.current.nextStage();
    });
    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(result.current.currentStage).toBe(3);
  });

  it('возвращает правильную информацию о текущем этапе', () => {
    const { result } = renderHook(() => useInterviewStage());

    expect(result.current.currentStageInfo).toEqual({
      name: 'welcome',
      title: 'Добро пожаловать',
      description: 'Приветственный экран',
      component: 'WelcomeStage'
    });
  });

  it('возвращает правильную информацию о прогрессе', async () => {
    const { result } = renderHook(() => useInterviewStage());

    expect(result.current.progress).toBe(25); // 1 из 4 этапов

    act(() => {
      result.current.nextStage();
    });

    // Ждем завершения асинхронной операции
    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(result.current.progress).toBe(50); // 2 из 4 этапов
  });

  it('проверяет, является ли этап первым', async () => {
    const { result } = renderHook(() => useInterviewStage());

    expect(result.current.isFirstStage).toBe(true);

    act(() => {
      result.current.nextStage();
    });

    // Ждем завершения асинхронной операции
    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(result.current.isFirstStage).toBe(false);
  });

  it('проверяет, является ли этап последним', async () => {
    const { result } = renderHook(() => useInterviewStage());

    expect(result.current.isLastStage).toBe(false);

    // Переходим к последнему этапу
    act(() => {
      result.current.nextStage(); // 1
    });
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    act(() => {
      result.current.nextStage(); // 2
    });
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    act(() => {
      result.current.nextStage(); // 3
    });
    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(result.current.isLastStage).toBe(true);
  });
});
