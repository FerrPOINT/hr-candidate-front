import { renderHook } from '@testing-library/react';
import { useVoiceInterview } from '../useVoiceInterview';

describe('useVoiceInterview (simple)', () => {
  it('экспортирует хук useVoiceInterview', () => {
    expect(useVoiceInterview).toBeDefined();
    expect(typeof useVoiceInterview).toBe('function');
  });

  it('инициализируется без ошибок', () => {
    expect(() => {
      const { result } = renderHook(() => useVoiceInterview());
      expect(result.current).toBeDefined();
    }).not.toThrow();
  });
});

