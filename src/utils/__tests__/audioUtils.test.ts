import { getFullAudioUrl, isRelativeUrl, logAudioUrl } from '../audioUtils';

describe('audioUtils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getFullAudioUrl', () => {
    it('возвращает пустую строку для пустого URL', () => {
      expect(getFullAudioUrl('')).toBe('');
      expect(getFullAudioUrl(null as any)).toBe('');
      expect(getFullAudioUrl(undefined as any)).toBe('');
    });

    it('возвращает полный URL без изменений', () => {
      const httpUrl = 'http://example.com/audio.mp3';
      const httpsUrl = 'https://example.com/audio.mp3';
      
      expect(getFullAudioUrl(httpUrl)).toBe(httpUrl);
      expect(getFullAudioUrl(httpsUrl)).toBe(httpsUrl);
    });

    it('формирует полный URL из относительного пути', () => {
      process.env.REACT_APP_API_BASE_URL = 'https://api.example.com';
      
      expect(getFullAudioUrl('/media/audio.mp3')).toBe('https://api.example.com/media/audio.mp3');
      expect(getFullAudioUrl('media/audio.mp3')).toBe('https://api.example.com/media/audio.mp3');
    });

    it('обрабатывает базовый URL с trailing slash', () => {
      process.env.REACT_APP_API_BASE_URL = 'https://api.example.com/';
      
      expect(getFullAudioUrl('/media/audio.mp3')).toBe('https://api.example.com/media/audio.mp3');
      expect(getFullAudioUrl('media/audio.mp3')).toBe('https://api.example.com/media/audio.mp3');
    });

    it('обрабатывает множественные слеши', () => {
      process.env.REACT_APP_API_BASE_URL = 'https://api.example.com//';
      
      expect(getFullAudioUrl('//media//audio.mp3')).toBe('https://api.example.com/media//audio.mp3');
    });

    it('использует пустой базовый URL если переменная окружения не задана', () => {
      delete process.env.REACT_APP_API_BASE_URL;
      
      expect(getFullAudioUrl('/media/audio.mp3')).toBe('/media/audio.mp3');
      expect(getFullAudioUrl('media/audio.mp3')).toBe('/media/audio.mp3');
    });
  });

  describe('isRelativeUrl', () => {
    it('определяет относительные URL', () => {
      expect(isRelativeUrl('/media/audio.mp3')).toBe(true);
      expect(isRelativeUrl('media/audio.mp3')).toBe(true);
      expect(isRelativeUrl('./media/audio.mp3')).toBe(true);
      expect(isRelativeUrl('../media/audio.mp3')).toBe(true);
    });

    it('определяет абсолютные URL', () => {
      expect(isRelativeUrl('http://example.com/audio.mp3')).toBe(false);
      expect(isRelativeUrl('https://example.com/audio.mp3')).toBe(false);
    });

    it('обрабатывает пустые строки', () => {
      expect(isRelativeUrl('')).toBe(true);
    });
  });

  describe('logAudioUrl', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('логирует информацию об аудио URL', () => {
      process.env.REACT_APP_API_BASE_URL = 'https://api.example.com';
      
      logAudioUrl('/media/audio.mp3', 'https://api.example.com/media/audio.mp3', 'test');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '🎵 Audio URL Debug [test]:',
        {
          original: '/media/audio.mp3',
          full: 'https://api.example.com/media/audio.mp3',
          baseUrl: 'https://api.example.com',
          isRelative: true
        }
      );
    });

    it('логирует информацию для абсолютного URL', () => {
      const absoluteUrl = 'https://external.com/audio.mp3';
      
      logAudioUrl(absoluteUrl, absoluteUrl, 'external');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '🎵 Audio URL Debug [external]:',
        {
          original: absoluteUrl,
          full: absoluteUrl,
          baseUrl: undefined,
          isRelative: false
        }
      );
    });

    it('логирует с пустым контекстом', () => {
      logAudioUrl('test.mp3', 'test.mp3', '');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '🎵 Audio URL Debug []:',
        expect.any(Object)
      );
    });
  });
});