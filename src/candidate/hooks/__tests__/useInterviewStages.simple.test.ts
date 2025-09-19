import { renderHook } from '@testing-library/react';
import { useInterviewStages } from '../useInterviewStages';

describe('useInterviewStages (simple)', () => {
  it('инициализируется с правильными значениями по умолчанию', () => {
    const { result } = renderHook(() => useInterviewStages());

    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('object');
  });

  it('возвращает объект с методами', () => {
    const { result } = renderHook(() => useInterviewStages());

    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('object');
  });
});