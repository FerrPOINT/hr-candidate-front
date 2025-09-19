import { VoiceInterviewService } from '../voiceInterviewService';

describe('VoiceInterviewService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Подавляем console.error для чистоты тестов
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('экспортирует VoiceInterviewService класс', () => {
    expect(VoiceInterviewService).toBeDefined();
    expect(typeof VoiceInterviewService).toBe('function');
  });

  it('имеет статический метод startInterview', () => {
    expect(typeof VoiceInterviewService.startInterview).toBe('function');
  });

  it('имеет статический метод finishInterview', () => {
    expect(typeof VoiceInterviewService.finishInterview).toBe('function');
  });

  describe('startInterview', () => {
    it('возвращает заглушку когда ElevenLabs отключен', async () => {
      const result = await VoiceInterviewService.startInterview(123);
      
      expect(result).toEqual({
        signedUrl: '',
        sessionId: '',
        agentId: '',
        webhookUrl: '',
        status: undefined,
        message: 'ElevenLabs disabled',
        candidateData: {},
      });
    });

    it('принимает опции запуска', async () => {
      const options = {
        voiceMode: true,
        autoCreateAgent: true,
        includeCandidateData: false,
        agentConfig: { voice: 'test' },
        voiceSettings: { speed: 1.0 },
      };

      const result = await VoiceInterviewService.startInterview(123, options);
      
      // Должен вернуть заглушку независимо от опций
      expect(result).toEqual({
        signedUrl: '',
        sessionId: '',
        agentId: '',
        webhookUrl: '',
        status: undefined,
        message: 'ElevenLabs disabled',
        candidateData: {},
      });
    });

    it('обрабатывает отсутствие опций', async () => {
      const result = await VoiceInterviewService.startInterview(456);
      
      expect(result).toBeDefined();
      expect(result.message).toBe('ElevenLabs disabled');
    });

    it('принимает различные типы interviewId', async () => {
      const result1 = await VoiceInterviewService.startInterview(123);
      const result2 = await VoiceInterviewService.startInterview(0);
      
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    });
  });

  describe('finishInterview', () => {
    it('возвращает undefined когда ElevenLabs отключен', async () => {
      const result = await VoiceInterviewService.finishInterview(123);
      expect(result).toBeUndefined();
    });

    it('принимает различные типы interviewId', async () => {
      const result1 = await VoiceInterviewService.finishInterview(123);
      const result2 = await VoiceInterviewService.finishInterview(0);
      
      expect(result1).toBeUndefined();
      expect(result2).toBeUndefined();
    });

    it('не выбрасывает ошибку при вызове', async () => {
      await expect(VoiceInterviewService.finishInterview(123)).resolves.not.toThrow();
    });
  });
});