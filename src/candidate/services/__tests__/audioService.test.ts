import { audioService } from '../audioService';

describe('AudioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isSupported', () => {
    it('возвращает true если MediaDevices поддерживается', () => {
      expect(audioService.isSupported()).toBe(true);
    });
  });

  describe('stopRecording', () => {
    it('выбрасывает ошибку если запись не была начата', async () => {
      await expect(audioService.stopRecording()).rejects.toThrow('Запись не была начата');
    });
  });

  describe('cleanup', () => {
    it('очищает ресурсы', () => {
      expect(() => {
        audioService.cleanup();
      }).not.toThrow();
    });
  });
});