import { candidateAuthService } from '../../services/candidateAuthService';
import { candidateApiService } from '../../services/candidateApiService';

// Mock the candidateApiService
jest.mock('../../services/candidateApiService', () => ({
  candidateApiService: {
    loginCandidate: jest.fn(),
    verifyCandidateEmail: jest.fn(),
  },
}));

const mockCandidateApiService = candidateApiService as jest.Mocked<typeof candidateApiService>;

describe('candidateAuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('authenticate', () => {
    it('успешно аутентифицирует кандидата с верификацией', async () => {
      const authData = {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        positionId: 123
      };

      const mockResponse = {
        interview: { id: 456 },
        verificationRequired: true,
        message: 'Код подтверждения отправлен на email'
      };

      mockCandidateApiService.loginCandidate.mockResolvedValue(mockResponse);

      const result = await candidateAuthService.authenticate(authData);

      expect(mockCandidateApiService.loginCandidate).toHaveBeenCalledWith({
        firstName: authData.firstName,
        lastName: authData.lastName,
        email: authData.email,
        positionId: authData.positionId
      });
      expect(result).toEqual({
        success: true,
        interviewId: 456,
        message: 'Верификация отключена локально'
      });
    });

    it('успешно аутентифицирует кандидата без верификации', async () => {
      const authData = {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        positionId: 123
      };

      const mockResponse = {
        interview: { id: 456 },
        verificationRequired: false,
        token: 'auth-token-123',
        message: 'Вход выполнен успешно'
      };

      mockCandidateApiService.loginCandidate.mockResolvedValue(mockResponse);

      const result = await candidateAuthService.authenticate(authData);

      expect(mockCandidateApiService.loginCandidate).toHaveBeenCalledWith({
        firstName: authData.firstName,
        lastName: authData.lastName,
        email: authData.email,
        positionId: authData.positionId
      });
      expect(result).toEqual({
        success: true,
        interviewId: 456,
        token: 'auth-token-123',
        message: 'Вход выполнен успешно'
      });
    });

    it('обрабатывает ошибку аутентификации', async () => {
      const authData = {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        positionId: 123
      };

      const mockError = new Error('Неверные данные для авторизации');

      mockCandidateApiService.loginCandidate.mockRejectedValue(mockError);

      const result = await candidateAuthService.authenticate(authData);

      expect(mockCandidateApiService.loginCandidate).toHaveBeenCalledWith({
        firstName: authData.firstName,
        lastName: authData.lastName,
        email: authData.email,
        positionId: authData.positionId
      });
      expect(result).toEqual({
        success: false,
        error: 'Неверные данные для авторизации'
      });
    });

    it('обрабатывает ошибку когда кандидат не найден (found user false)', async () => {
      const authData = {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        positionId: 123
      };

      const mockError = new Error('found user false');

      mockCandidateApiService.loginCandidate.mockRejectedValue(mockError);

      const result = await candidateAuthService.authenticate(authData);

      expect(mockCandidateApiService.loginCandidate).toHaveBeenCalledWith({
        firstName: authData.firstName,
        lastName: authData.lastName,
        email: authData.email,
        positionId: authData.positionId
      });
      expect(result).toEqual({
        success: false,
        error: 'Извините, для вас не назначено собеседование. Пожалуйста, обратитесь к рекрутеру.'
      });
    });

    it('обрабатывает ошибку когда кандидат не назначен на собеседование (candidate not found)', async () => {
      const authData = {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        positionId: 123
      };

      const mockError = new Error('candidate not found');

      mockCandidateApiService.loginCandidate.mockRejectedValue(mockError);

      const result = await candidateAuthService.authenticate(authData);

      expect(mockCandidateApiService.loginCandidate).toHaveBeenCalledWith({
        firstName: authData.firstName,
        lastName: authData.lastName,
        email: authData.email,
        positionId: authData.positionId
      });
      expect(result).toEqual({
        success: false,
        error: 'Извините, для вас не назначено собеседование. Пожалуйста, обратитесь к рекрутеру.'
      });
    });
  });

  describe('verifyEmail', () => {
    it('успешно верифицирует email', async () => {
      const email = 'ivan@example.com';
      const verificationCode = '123456';

      const mockResponse = {
        success: true,
        token: 'jwt-token-123',
        interview: { id: 456 }
      };

      mockCandidateApiService.verifyCandidateEmail.mockResolvedValue(mockResponse);

      const result = await candidateAuthService.verifyEmail(email, verificationCode);

      expect(mockCandidateApiService.verifyCandidateEmail).toHaveBeenCalledWith({
        email,
        verificationCode
      });
      expect(result).toEqual({
        success: true,
        interviewId: 456,
        token: 'jwt-token-123',
        message: 'Email успешно верифицирован'
      });
      expect(localStorage.getItem('candidate_token')).toBe('jwt-token-123');
      expect(localStorage.getItem('candidate_interview_id')).toBe('456');
    });

    it('обрабатывает ошибку верификации', async () => {
      const email = 'ivan@example.com';
      const verificationCode = '123456';

      const mockError = new Error('Неверный код верификации');

      mockCandidateApiService.verifyCandidateEmail.mockRejectedValue(mockError);

      const result = await candidateAuthService.verifyEmail(email, verificationCode);

      expect(mockCandidateApiService.verifyCandidateEmail).toHaveBeenCalledWith({
        email,
        verificationCode
      });
      expect(result).toEqual({
        success: false,
        error: 'Неверный код верификации'
      });
    });
  });

  describe('token management', () => {
    it('получает токен из localStorage', () => {
      localStorage.setItem('candidate_token', 'test-token-123');
      expect(candidateAuthService.getAuthToken()).toBe('test-token-123');
    });

    it('получает candidate_interview_id из localStorage', () => {
      localStorage.setItem('candidate_interview_id', 'test-id-123');
      expect(candidateAuthService.getCandidateId()).toBe('test-id-123');
    });

    it('проверяет авторизацию', () => {
      expect(candidateAuthService.isAuthenticated()).toBe(false);
      
      localStorage.setItem('candidate_interview_id', 'test-id');
      localStorage.setItem('candidate_token', 'test-token');
      expect(candidateAuthService.isAuthenticated()).toBe(true);
    });

    it('очищает авторизацию', () => {
      localStorage.setItem('candidate_interview_id', 'test-id');
      localStorage.setItem('candidate_token', 'test-token');
      
      candidateAuthService.clearAuth();
      
      expect(localStorage.getItem('candidate_interview_id')).toBeNull();
      expect(localStorage.getItem('candidate_token')).toBeNull();
    });
  });
});
