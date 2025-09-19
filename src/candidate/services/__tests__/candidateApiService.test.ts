import { candidateApiService } from '../candidateApiService';
import { apiService } from '../../../services/apiService';

// Моки для зависимостей
jest.mock('../../../services/apiService');
jest.mock('generated-src/client/configuration', () => ({
  Configuration: jest.fn().mockImplementation(() => ({})),
}));
jest.mock('generated-src/client/apis/candidates-api', () => ({
  CandidatesApi: jest.fn().mockImplementation(() => ({
    loginCandidate: jest.fn(),
    verifyCandidateEmail: jest.fn(),
    startInterview: jest.fn(),
    getCurrentQuestion: jest.fn(),
    submitAnswer: jest.fn(),
    endInterview: jest.fn(),
    getCandidatePositionSummary: jest.fn(),
  })),
}));

const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('candidateApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Мокаем публичный API клиент
    mockApiService.getPublicApiClient.mockReturnValue({
      candidates: {
        loginCandidate: jest.fn(),
        verifyCandidateEmail: jest.fn(),
        startInterview: jest.fn(),
        getCurrentQuestion: jest.fn(),
        submitAnswer: jest.fn(),
        endInterview: jest.fn(),
        getCandidatePositionSummary: jest.fn(),
      },
    } as any);
  });

  describe('loginCandidate', () => {
    it('успешно авторизует кандидата', async () => {
      const mockRequest = {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        positionId: 123,
      };

      const mockResponse = {
        data: {
          candidate: {
            id: 456,
            firstName: 'Иван',
            lastName: 'Иванов',
            email: 'ivan@example.com',
            status: 'ACTIVE',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
          token: 'jwt-token-123',
          verificationRequired: false,
        },
      };

      const mockPublicClient = mockApiService.getPublicApiClient();
      (mockPublicClient.candidates.loginCandidate as jest.Mock).mockResolvedValue(mockResponse);

      const result = await candidateApiService.loginCandidate(mockRequest);

      expect(mockPublicClient.candidates.loginCandidate).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse.data);
    });

    it('обрабатывает ошибку авторизации с сообщением сервера', async () => {
      const mockRequest = {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        positionId: 123,
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            message: 'Кандидат не найден',
          },
        },
      };

      const mockPublicClient = mockApiService.getPublicApiClient();
      (mockPublicClient.candidates.loginCandidate as jest.Mock).mockRejectedValue(mockError);

      await expect(candidateApiService.loginCandidate(mockRequest)).rejects.toThrow('Кандидат не найден');
    });

    it('обрабатывает ошибку авторизации без сообщения сервера', async () => {
      const mockRequest = {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        positionId: 123,
      };

      const mockError = new Error('Network error');

      const mockPublicClient = mockApiService.getPublicApiClient();
      (mockPublicClient.candidates.loginCandidate as jest.Mock).mockRejectedValue(mockError);

      await expect(candidateApiService.loginCandidate(mockRequest)).rejects.toThrow('Network error');
    });

    it('логирует детали запроса и ответа', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const mockRequest = {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        positionId: 123,
      };

      const mockResponse = {
        data: {
          candidate: { id: 456, firstName: 'Иван', lastName: 'Иванов', email: 'ivan@example.com', status: 'ACTIVE', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
          token: 'jwt-token-123',
          verificationRequired: false,
        },
      };

      const mockPublicClient = mockApiService.getPublicApiClient();
      (mockPublicClient.candidates.loginCandidate as jest.Mock).mockResolvedValue(mockResponse);

      await candidateApiService.loginCandidate(mockRequest);

      expect(consoleSpy).toHaveBeenCalledWith('🚀 candidateApiService.loginCandidate вызван');
      expect(consoleSpy).toHaveBeenCalledWith('📝 Входные данные:', { email: mockRequest.email, firstName: mockRequest.firstName, positionId: mockRequest.positionId });

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('verifyCandidateEmail', () => {
    it('успешно верифицирует email кандидата', async () => {
      const mockRequest = {
        email: 'ivan@example.com',
        verificationCode: '123456',
      };

      const mockResponse = {
        data: {
          success: true,
          token: 'jwt-token-123',
          interview: { id: 456 },
        },
      };

      const mockPublicClient = mockApiService.getPublicApiClient();
      (mockPublicClient.candidates.verifyCandidateEmail as jest.Mock).mockResolvedValue(mockResponse);

      const result = await candidateApiService.verifyCandidateEmail(mockRequest);

      expect(mockPublicClient.candidates.verifyCandidateEmail).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse.data);
    });

    it('обрабатывает ошибку верификации с сообщением сервера', async () => {
      const mockRequest = {
        email: 'ivan@example.com',
        verificationCode: '123456',
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            message: 'Неверный код верификации',
          },
        },
      };

      const mockPublicClient = mockApiService.getPublicApiClient();
      (mockPublicClient.candidates.verifyCandidateEmail as jest.Mock).mockRejectedValue(mockError);

      await expect(candidateApiService.verifyCandidateEmail(mockRequest)).rejects.toThrow('Неверный код верификации');
    });

    it('обрабатывает ошибку верификации без сообщения сервера', async () => {
      const mockRequest = {
        email: 'ivan@example.com',
        verificationCode: '123456',
      };

      const mockError = new Error('Network error');

      const mockPublicClient = mockApiService.getPublicApiClient();
      (mockPublicClient.candidates.verifyCandidateEmail as jest.Mock).mockRejectedValue(mockError);

      await expect(candidateApiService.verifyCandidateEmail(mockRequest)).rejects.toThrow('Network error');
    });
  });

  describe('checkInterviewExists', () => {
    it('проверяет существование собеседования', async () => {
      const email = 'ivan@example.com';
      const mockResponse = {
        data: {
          candidate: { id: 456, firstName: 'Иван', lastName: 'Иванов', email: 'ivan@example.com', status: 'ACTIVE', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
          verificationRequired: false,
          interview: { id: 789 },
        },
      };

      const mockPublicClient = mockApiService.getPublicApiClient();
      (mockPublicClient.candidates.loginCandidate as jest.Mock).mockResolvedValue(mockResponse);

      const result = await candidateApiService.checkInterviewExists(email);

      expect(mockPublicClient.candidates.loginCandidate).toHaveBeenCalledWith({
        firstName: '',
        lastName: '',
        email,
        positionId: 1,
      });
      expect(result).toEqual({ exists: true, interviewId: 789 });
    });

    it('возвращает false при ошибке проверки', async () => {
      const email = 'ivan@example.com';
      const mockError = new Error('Network error');

      const mockPublicClient = mockApiService.getPublicApiClient();
      (mockPublicClient.candidates.loginCandidate as jest.Mock).mockRejectedValue(mockError);

      const result = await candidateApiService.checkInterviewExists(email);

      expect(result).toEqual({ exists: false });
    });
  });

  describe('startInterview', () => {
    it('успешно запускает интервью', async () => {
      const interviewId = 456;
      const token = 'jwt-token-123';
      const mockResponse = {
        data: {
          interviewId: 456,
          status: 'IN_PROGRESS',
        },
      };

      // Мокаем создание API клиента с токеном
      const mockApiClient = {
        candidates: {
          startInterview: jest.fn().mockResolvedValue(mockResponse),
        },
      };

      // Мокаем приватный метод createApiClient
      const createApiClientSpy = jest.spyOn(candidateApiService as any, 'createApiClient').mockReturnValue(mockApiClient);

      const result = await candidateApiService.startInterview(interviewId, token);

      expect(createApiClientSpy).toHaveBeenCalledWith(token);
      expect(mockApiClient.candidates.startInterview).toHaveBeenCalledWith(interviewId);
      expect(result.success).toBe(true);
      expect(result.interview).toBeDefined();
      expect(result.interview?.id).toBe(interviewId);
      expect(result.interview?.status).toBe('IN_PROGRESS');

      createApiClientSpy.mockRestore();
    });

    it('обрабатывает ошибку запуска интервью', async () => {
      const interviewId = 456;
      const token = 'jwt-token-123';
      const mockError = new Error('Interview not found');

      const mockApiClient = {
        candidates: {
          startInterview: jest.fn().mockRejectedValue(mockError),
        },
      };

      const createApiClientSpy = jest.spyOn(candidateApiService as any, 'createApiClient').mockReturnValue(mockApiClient);

      await expect(candidateApiService.startInterview(interviewId, token)).rejects.toThrow('Ошибка запуска собеседования');

      createApiClientSpy.mockRestore();
    });
  });

  describe('getPositionSummary', () => {
    it('успешно получает информацию о вакансии', async () => {
      const positionId = 123;
      const mockResponse = {
        data: {
          id: 123,
          title: 'Software Engineer',
          questionsCount: 5,
        },
      };

      const mockPublicClient = mockApiService.getPublicApiClient();
      (mockPublicClient.candidates.getCandidatePositionSummary as jest.Mock).mockResolvedValue(mockResponse);

      const result = await candidateApiService.getPositionSummary(positionId);

      expect(mockPublicClient.candidates.getCandidatePositionSummary).toHaveBeenCalledWith(positionId);
      expect(result).toEqual({
        id: 123,
        title: 'Software Engineer',
        department: 'Engineering',
        company: 'WMT group',
        type: 'Full-time',
        questionsCount: 5,
      });
    });

    it('обрабатывает ошибку получения информации о вакансии', async () => {
      const positionId = 123;
      const mockError = new Error('Position not found');

      const mockPublicClient = mockApiService.getPublicApiClient();
      (mockPublicClient.candidates.getCandidatePositionSummary as jest.Mock).mockRejectedValue(mockError);

      await expect(candidateApiService.getPositionSummary(positionId)).rejects.toThrow('Position not found');
    });

    it('обрабатывает некорректное поле количества вопросов', async () => {
      const positionId = 123;
      const mockResponse = {
        data: {
          id: 123,
          title: 'Software Engineer',
          questionsCount: 'invalid',
        },
      };

      const mockPublicClient = mockApiService.getPublicApiClient();
      (mockPublicClient.candidates.getCandidatePositionSummary as jest.Mock).mockResolvedValue(mockResponse);

      await expect(candidateApiService.getPositionSummary(positionId)).rejects.toThrow('Некорректное поле количества вопросов в ответе API');
    });
  });

  describe('startVoiceInterview', () => {
    it('успешно запускает голосовое интервью', async () => {
      const interviewId = '456';
      const token = 'jwt-token-123';
      const mockResponse = {
        data: {
          interviewId: 456,
          status: 'IN_PROGRESS',
        },
      };

      const mockApiClient = {
        candidates: {
          startInterview: jest.fn().mockResolvedValue(mockResponse),
        },
      };

      const createApiClientSpy = jest.spyOn(candidateApiService as any, 'createApiClient').mockReturnValue(mockApiClient);

      const result = await candidateApiService.startVoiceInterview(interviewId, token);

      expect(createApiClientSpy).toHaveBeenCalledWith(token);
      expect(mockApiClient.candidates.startInterview).toHaveBeenCalledWith(456);
      expect(result).toEqual(mockResponse.data);

      createApiClientSpy.mockRestore();
    });
  });

  describe('getNextVoiceQuestion', () => {
    it('успешно получает следующий голосовой вопрос', async () => {
      const interviewId = '456';
      const token = 'jwt-token-123';
      const mockResponse = {
        data: {
          questionId: 789,
          text: 'Расскажите о себе',
          audioUrl: 'https://example.com/audio.mp3',
          maxDuration: 120,
        },
      };

      const mockApiClient = {
        candidates: {
          getCurrentQuestion: jest.fn().mockResolvedValue(mockResponse),
        },
      };

      const createApiClientSpy = jest.spyOn(candidateApiService as any, 'createApiClient').mockReturnValue(mockApiClient);

      const result = await candidateApiService.getNextVoiceQuestion(interviewId, token);

      expect(createApiClientSpy).toHaveBeenCalledWith(token);
      expect(mockApiClient.candidates.getCurrentQuestion).toHaveBeenCalledWith(456);
      expect(result).toEqual({
        id: '789',
        text: 'Расскажите о себе',
        audioUrl: 'https://example.com/audio.mp3',
        duration: 120,
      });

      createApiClientSpy.mockRestore();
    });
  });

  describe('submitVoiceAnswer', () => {
    it('успешно отправляет голосовой ответ', async () => {
      const interviewId = '456';
      const questionId = '789';
      const audioFile = new File(['audio data'], 'audio.wav', { type: 'audio/wav' });
      const token = 'jwt-token-123';
      const mockResponse = {
        data: {
          success: true,
          message: 'Answer submitted',
        },
      };

      const mockApiClient = {
        candidates: {
          submitAnswer: jest.fn().mockResolvedValue(mockResponse),
        },
      };

      const createApiClientSpy = jest.spyOn(candidateApiService as any, 'createApiClient').mockReturnValue(mockApiClient);

      const result = await candidateApiService.submitVoiceAnswer(interviewId, questionId, audioFile, token);

      expect(createApiClientSpy).toHaveBeenCalledWith(token);
      expect(mockApiClient.candidates.submitAnswer).toHaveBeenCalledWith(456, 789, false, audioFile);
      expect(result).toEqual(mockResponse.data);

      createApiClientSpy.mockRestore();
    });
  });

  describe('finishVoiceInterview', () => {
    it('успешно завершает голосовое интервью', async () => {
      const interviewId = '456';
      const token = 'jwt-token-123';
      const mockResponse = {
        data: {
          success: true,
          message: 'Interview finished',
        },
      };

      const mockApiClient = {
        candidates: {
          endInterview: jest.fn().mockResolvedValue(mockResponse),
        },
      };

      const createApiClientSpy = jest.spyOn(candidateApiService as any, 'createApiClient').mockReturnValue(mockApiClient);

      const result = await candidateApiService.finishVoiceInterview(interviewId, token);

      expect(createApiClientSpy).toHaveBeenCalledWith(token);
      expect(mockApiClient.candidates.endInterview).toHaveBeenCalledWith(456);
      expect(result).toEqual(mockResponse.data);

      createApiClientSpy.mockRestore();
    });
  });

  describe('submitInterviewAnswer', () => {
    it('успешно отправляет текстовый ответ', async () => {
      const candidateId = '456';
      const questionId = '789';
      const answer = 'Мой ответ на вопрос';
      const token = 'jwt-token-123';

      const result = await candidateApiService.submitInterviewAnswer(candidateId, questionId, answer, token);

      expect(result).toEqual({
        success: true,
        message: 'Ответ успешно отправлен',
      });
    });
  });

  describe('mapInterviewStatus', () => {
    it('правильно маппит статусы интервью', () => {
      const mapStatus = (candidateApiService as any).mapInterviewStatus;

      expect(mapStatus('NOT_STARTED')).toBe('NOT_STARTED');
      expect(mapStatus('IN_PROGRESS')).toBe('IN_PROGRESS');
      expect(mapStatus('FINISHED')).toBe('FINISHED');
      expect(mapStatus('UNKNOWN')).toBe('NOT_STARTED');
      expect(mapStatus(undefined)).toBe('NOT_STARTED');
    });
  });

  describe('getCandidateInfo', () => {
    it('выбрасывает ошибку о недоступности', async () => {
      const candidateId = '456';
      const token = 'jwt-token-123';

      await expect(candidateApiService.getCandidateInfo(candidateId, token)).rejects.toThrow('Недоступно в Candidates API');
    });
  });

  describe('getInterviewInfo', () => {
    it('выбрасывает ошибку о недоступности', async () => {
      const interviewId = '456';
      const token = 'jwt-token-123';

      await expect(candidateApiService.getInterviewInfo(interviewId, token)).rejects.toThrow('Ошибка получения информации об интервью');
    });
  });

  describe('getAnswerAudio', () => {
    it('выбрасывает ошибку о недоступности', async () => {
      await expect(candidateApiService.getAnswerAudio()).rejects.toThrow('Недоступно');
    });
  });
});
