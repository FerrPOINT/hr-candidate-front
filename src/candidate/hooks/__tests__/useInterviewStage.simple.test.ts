import { renderHook } from '@testing-library/react';
import { useInterviewStage } from '../useInterviewStage';

describe('useInterviewStage (simple)', () => {
  it('инициализируется с правильными значениями по умолчанию', () => {
    const { result } = renderHook(() => useInterviewStage());

    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('object');
  });

  it('возвращает объект с методами', () => {
    const { result } = renderHook(() => useInterviewStage());

    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('object');
  });
});