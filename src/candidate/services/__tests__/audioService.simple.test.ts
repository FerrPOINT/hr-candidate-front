import { audioService } from '../audioService';

// Моки для Web Audio API
const mockGetUserMedia = jest.fn();
const mockMediaRecorder = {
  start: jest.fn(),
  stop: jest.fn(),
  requestData: jest.fn(),
  ondataavailable: null,
  onstop: null,
  mimeType: 'audio/webm',
};

const mockAudio = {
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  currentTime: 0,
  duration: 10,
  volume: 1,
  paused: true,
  onended: null,
  onpause: null,
  onplay: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

const mockURL = {
  createObjectURL: jest.fn(),
  revokeObjectURL: jest.fn(),
};

describe.skip('audioService (simple)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Мокаем MediaDevices
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: mockGetUserMedia,
      },
      writable: true,
    });
    
    // Мокаем MediaRecorder
    (window as any).MediaRecorder = jest.fn().mockImplementation(() => mockMediaRecorder);
    (window as any).MediaRecorder.isTypeSupported = jest.fn().mockReturnValue(true);
    
    // Мокаем Audio
    (window as any).Audio = jest.fn().mockImplementation(() => mockAudio);
    
    // Мокаем URL
    (window as any).URL = mockURL;
  });

  describe('isSupported', () => {
    it('возвращает true если MediaDevices поддерживается', () => {
      expect(audioService.isSupported()).toBe(true);
    });

    it('возвращает false если MediaDevices не поддерживается', () => {
      Object.defineProperty(navigator, 'mediaDevices', {
        value: undefined,
        writable: true,
      });
      
      expect(audioService.isSupported()).toBe(false);
    });
  });

  describe('requestMicrophonePermission', () => {
    it('успешно запрашивает разрешение на микрофон', async () => {
      const mockStream = {
        getTracks: () => [{
          kind: 'audio',
          enabled: true,
          stop: jest.fn(),
        }],
      };
      
      mockGetUserMedia.mockResolvedValue(mockStream);
      
      const result = await audioService.requestMicrophonePermission();
      
      expect(mockGetUserMedia).toHaveBeenCalledWith({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      expect(result).toBe(mockStream);
    });

    it('обрабатывает ошибку доступа к микрофону', async () => {
      const mockError = new Error('Permission denied');
      mockGetUserMedia.mockRejectedValue(mockError);
      
      await expect(audioService.requestMicrophonePermission()).rejects.toThrow('Не удалось получить доступ к микрофону');
    });
  });

  describe('startRecording', () => {
    it('успешно начинает запись', async () => {
      const mockStream = {
        getTracks: () => [{
          kind: 'audio',
          enabled: true,
          stop: jest.fn(),
        }],
      };
      
      mockGetUserMedia.mockResolvedValue(mockStream);
      
      await audioService.startRecording();
      
      expect(mockGetUserMedia).toHaveBeenCalled();
      expect(mockMediaRecorder.start).toHaveBeenCalled();
    });

    it('обрабатывает ошибку начала записи', async () => {
      const mockError = new Error('Recording failed');
      mockGetUserMedia.mockRejectedValue(mockError);
      
      await expect(audioService.startRecording()).rejects.toThrow('Ошибка начала записи');
    });
  });

  describe('stopRecording', () => {
    it('возвращает существующий Blob если запись не активна', async () => {
      const blob = await audioService.stopRecording();
      expect(blob).toBe(null);
    });
  });

  describe('getRecordingDuration', () => {
    it('возвращает 0 если запись не начата', () => {
      expect(audioService.getRecordingDuration()).toBe(0);
    });
  });

  describe('playAudio', () => {
    it('обрабатывает ошибку воспроизведения', async () => {
      const mockBlob = new Blob(['audio data'], { type: 'audio/webm' });
      const mockError = new Error('Playback failed');
      
      mockCreateObjectURL.mockReturnValue('blob:mock-url');
      mockAudio.play.mockRejectedValue(mockError);
      
      await expect(audioService.playAudio(mockBlob)).rejects.toThrow('Ошибка воспроизведения аудио');
    });
  });

  describe('playAudioFromUrl', () => {
    it('обрабатывает ошибку воспроизведения из URL', async () => {
      const audioUrl = 'https://example.com/audio.mp3';
      const mockError = new Error('Playback failed');
      
      mockAudio.play.mockRejectedValue(mockError);
      
      await expect(audioService.playAudioFromUrl(audioUrl)).rejects.toThrow('Ошибка воспроизведения аудио');
    });
  });

  describe('stopAudio', () => {
    it('останавливает воспроизведение аудио', () => {
      // Устанавливаем аудио элемент
      (audioService as any).audioElement = mockAudio;
      
      audioService.stopAudio();
      
      expect(mockAudio.pause).toHaveBeenCalled();
      expect(mockAudio.currentTime).toBe(0);
    });
  });

  describe('pauseAudio', () => {
    it('ставит воспроизведение на паузу', () => {
      // Устанавливаем аудио элемент
      (audioService as any).audioElement = mockAudio;
      
      audioService.pauseAudio();
      
      expect(mockAudio.pause).toHaveBeenCalled();
    });
  });

  describe('resumeAudio', () => {
    it('возобновляет воспроизведение', () => {
      // Устанавливаем аудио элемент
      (audioService as any).audioElement = mockAudio;
      
      audioService.resumeAudio();
      
      expect(mockAudio.play).toHaveBeenCalled();
    });
  });

  describe('getCurrentTime', () => {
    it('возвращает текущее время воспроизведения', () => {
      // Устанавливаем аудио элемент
      (audioService as any).audioElement = mockAudio;
      mockAudio.currentTime = 5.5;
      
      const currentTime = audioService.getCurrentTime();
      
      expect(currentTime).toBe(5.5);
    });

    it('возвращает 0 если аудио не загружено', () => {
      const currentTime = audioService.getCurrentTime();
      expect(currentTime).toBe(0);
    });
  });

  describe('getDuration', () => {
    it('возвращает длительность аудио', () => {
      // Устанавливаем аудио элемент
      (audioService as any).audioElement = mockAudio;
      mockAudio.duration = 120.5;
      
      const duration = audioService.getDuration();
      
      expect(duration).toBe(120.5);
    });

    it('возвращает 0 если аудио не загружено', () => {
      const duration = audioService.getDuration();
      expect(duration).toBe(0);
    });
  });

  describe('setVolume', () => {
    it('устанавливает громкость', () => {
      // Устанавливаем аудио элемент
      (audioService as any).audioElement = mockAudio;
      
      audioService.setVolume(0.7);
      
      expect(mockAudio.volume).toBe(0.7);
    });

    it('ограничивает громкость в диапазоне 0-1', () => {
      // Устанавливаем аудио элемент
      (audioService as any).audioElement = mockAudio;
      
      audioService.setVolume(1.5);
      expect(mockAudio.volume).toBe(1);
      
      audioService.setVolume(-0.5);
      expect(mockAudio.volume).toBe(0);
    });
  });

  describe('setPlaybackRate', () => {
    it('устанавливает скорость воспроизведения', () => {
      // Устанавливаем аудио элемент
      (audioService as any).audioElement = mockAudio;
      
      audioService.setPlaybackRate(1.5);
      
      expect(mockAudio.playbackRate).toBe(1.5);
    });
  });

  describe('setMasterVolume', () => {
    it('устанавливает мастер-громкость', () => {
      // Устанавливаем аудио элемент
      (audioService as any).audioElement = mockAudio;
      
      audioService.setMasterVolume(0.8);
      
      expect(mockAudio.volume).toBe(0.8);
    });
  });

  describe('getVolume', () => {
    it('возвращает текущую громкость', () => {
      // Устанавливаем аудио элемент
      (audioService as any).audioElement = mockAudio;
      mockAudio.volume = 0.6;
      
      const volume = audioService.getVolume();
      
      expect(volume).toBe(0.6);
    });

    it('возвращает 0 если аудио не загружено', () => {
      const volume = audioService.getVolume();
      expect(volume).toBe(0);
    });
  });

  describe('isPlaying', () => {
    it('возвращает true если аудио воспроизводится', () => {
      // Устанавливаем аудио элемент
      (audioService as any).audioElement = mockAudio;
      mockAudio.paused = false;
      
      const isPlaying = audioService.isPlaying();
      
      expect(isPlaying).toBe(true);
    });

    it('возвращает false если аудио на паузе', () => {
      // Устанавливаем аудио элемент
      (audioService as any).audioElement = mockAudio;
      mockAudio.paused = true;
      
      const isPlaying = audioService.isPlaying();
      
      expect(isPlaying).toBe(false);
    });

    it('возвращает false если аудио не загружено', () => {
      const isPlaying = audioService.isPlaying();
      expect(isPlaying).toBe(false);
    });
  });

  describe('onEnded', () => {
    it('добавляет обработчик события окончания', () => {
      // Устанавливаем аудио элемент
      (audioService as any).audioElement = mockAudio;
      const callback = jest.fn();
      
      audioService.onEnded(callback);
      
      expect(mockAudio.addEventListener).toHaveBeenCalledWith('ended', callback, { once: true });
    });
  });

  describe('onTimeUpdate', () => {
    it('добавляет обработчик события изменения времени', () => {
      // Устанавливаем аудио элемент
      (audioService as any).audioElement = mockAudio;
      const callback = jest.fn();
      
      audioService.onTimeUpdate(callback);
      
      expect(mockAudio.addEventListener).toHaveBeenCalledWith('timeupdate', expect.any(Function));
    });
  });

  describe('cleanup', () => {
    it('очищает все ресурсы', () => {
      // Устанавливаем состояние сервиса
      (audioService as any).audioElement = mockAudio;
      (audioService as any).mediaRecorder = mockMediaRecorder;
      (audioService as any).audioChunks = ['chunk1', 'chunk2'];
      (audioService as any).isRecording = true;
      (audioService as any).recordingStartTime = Date.now();
      
      audioService.cleanup();
      
      expect(mockAudio.pause).toHaveBeenCalled();
      expect(mockAudio.src).toBe('');
    });
  });

  describe('blobToBase64', () => {
    it('конвертирует Blob в Base64', async () => {
      const mockBlob = new Blob(['test data'], { type: 'audio/webm' });
      
      // Мокаем FileReader
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        result: 'data:audio/webm;base64,dGVzdCBkYXRh',
        onload: null,
        onerror: null,
      };
      
      (window as any).FileReader = jest.fn().mockImplementation(() => mockFileReader);
      
      const result = await audioService.blobToBase64(mockBlob);
      
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockBlob);
      expect(result).toBe('dGVzdCBkYXRh');
    });
  });

  describe('base64ToBlob', () => {
    it('конвертирует Base64 в Blob', () => {
      const base64 = 'dGVzdCBkYXRh';
      const mimeType = 'audio/webm';
      
      const result = audioService.base64ToBlob(base64, mimeType);
      
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe(mimeType);
    });

    it('использует дефолтный MIME тип', () => {
      const base64 = 'dGVzdCBkYXRh';
      
      const result = audioService.base64ToBlob(base64);
      
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('audio/webm');
    });
  });
});
