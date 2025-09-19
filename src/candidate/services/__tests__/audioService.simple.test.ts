import { audioService } from '../audioService';

describe('audioService (simple)', () => {
  it('экспортирует audioService', () => {
    expect(audioService).toBeDefined();
    expect(typeof audioService).toBe('object');
  });

  it('имеет базовые методы', () => {
    expect(typeof audioService.startRecording).toBe('function');
    expect(typeof audioService.stopRecording).toBe('function');
    expect(typeof audioService.playAudio).toBe('function');
    expect(typeof audioService.stopAudio).toBe('function');
  });
});