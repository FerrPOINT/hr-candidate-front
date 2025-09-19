import { renderHook } from '@testing-library/react';
import { useAudioRecording } from '../useAudioRecording';

describe('useAudioRecording (simple)', () => {
  it('экспортирует хук useAudioRecording', () => {
    expect(useAudioRecording).toBeDefined();
    expect(typeof useAudioRecording).toBe('function');
  });

  it('инициализируется без ошибок', () => {
    expect(() => {
      const { result } = renderHook(() => useAudioRecording());
      expect(result.current).toBeDefined();
    }).not.toThrow();
  });
});
