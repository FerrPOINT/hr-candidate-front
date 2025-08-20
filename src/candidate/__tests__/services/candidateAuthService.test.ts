import { candidateAuthService } from '../../services/candidateAuthService';
import { candidateApiService } from '../../services/candidateApiService';

// Mock the candidateApiService
jest.mock('../../services/candidateApiService', () => ({
  candidateApiService: {
    authCandidate: jest.fn(),
    verifyEmail: jest.fn(),
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
    it('успешно аутентифицирует кандидата', async () => {
      const authData = {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        token: 'invite-token'
      };

      const mockResponse = {
        candidate: { id: 123 },
        token: 'auth-token-123',
        message: 'Код подтверждения отправлен на email'
      };

      mockCandidateApiService.authCandidate.mockResolvedValue(mockResponse);

      const result = await candidateAuthService.authenticate(authData);

      expect(mockCandidateApiService.authCandidate).toHaveBeenCalledWith({
        firstName: authData.firstName,
        lastName: authData.lastName,
        email: authData.email
      });
      expect(result).toEqual({
        success: true,
        candidateId: '123',
        message: 'Аутентификация успешна'
      });
      expect(localStorage.getItem('candidate_id')).toBe('123');
      expect(localStorage.getItem('auth_token')).toBe('auth-token-123');
    });

    it('обрабатывает ошибку аутентификации', async () => {
      const authData = {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com'
      };

      const mockError = new Error('Неверные данные для авторизации');

      mockCandidateApiService.authCandidate.mockRejectedValue(mockError);

      const result = await candidateAuthService.authenticate(authData);

      expect(mockCandidateApiService.authCandidate).toHaveBeenCalledWith({
        firstName: authData.firstName,
        lastName: authData.lastName,
        email: authData.email
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
        email: 'ivan@example.com'
      };

      const mockError = new Error('found user false');

      mockCandidateApiService.authCandidate.mockRejectedValue(mockError);

      const result = await candidateAuthService.authenticate(authData);

      expect(mockCandidateApiService.authCandidate).toHaveBeenCalledWith({
        firstName: authData.firstName,
        lastName: authData.lastName,
        email: authData.email
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
        email: 'ivan@example.com'
      };

      const mockError = new Error('candidate not found');

      mockCandidateApiService.authCandidate.mockRejectedValue(mockError);

      const result = await candidateAuthService.authenticate(authData);

      expect(mockCandidateApiService.authCandidate).toHaveBeenCalledWith({
        firstName: authData.firstName,
        lastName: authData.lastName,
        email: authData.email
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
        token: 'jwt-token-123',
        candidate: { id: 123 }
      };

      mockCandidateApiService.verifyEmail.mockResolvedValue(mockResponse);

      const result = await candidateAuthService.verifyEmail(email, verificationCode);

      expect(mockCandidateApiService.verifyEmail).toHaveBeenCalledWith({
        email,
        verificationCode,
        firstName: '',
        lastName: ''
      });
      expect(result).toEqual({
        success: true,
        candidateId: '123',
        message: 'Email успешно верифицирован'
      });
      expect(localStorage.getItem('auth_token')).toBe('jwt-token-123');
    });

    it('обрабатывает ошибку верификации', async () => {
      const email = 'ivan@example.com';
      const verificationCode = '123456';

      const mockError = new Error('Неверный код верификации');

      mockCandidateApiService.verifyEmail.mockRejectedValue(mockError);

      const result = await candidateAuthService.verifyEmail(email, verificationCode);

      expect(mockCandidateApiService.verifyEmail).toHaveBeenCalledWith({
        email,
        verificationCode,
        firstName: '',
        lastName: ''
      });
      expect(result).toEqual({
        success: false,
        error: 'Неверный код верификации'
      });
    });
  });

  describe('token management', () => {
    it('получает токен из localStorage', () => {
      localStorage.setItem('auth_token', 'test-token-123');
      expect(candidateAuthService.getAuthToken()).toBe('test-token-123');
    });

    it('получает candidate_id из localStorage', () => {
      localStorage.setItem('candidate_id', 'test-id-123');
      expect(candidateAuthService.getCandidateId()).toBe('test-id-123');
    });

    it('проверяет авторизацию', () => {
      expect(candidateAuthService.isAuthenticated()).toBe(false);
      
      localStorage.setItem('candidate_id', 'test-id');
      localStorage.setItem('auth_token', 'test-token');
      expect(candidateAuthService.isAuthenticated()).toBe(true);
    });

    it('очищает авторизацию', () => {
      localStorage.setItem('candidate_id', 'test-id');
      localStorage.setItem('auth_token', 'test-token');
      
      candidateAuthService.clearAuth();
      
      expect(localStorage.getItem('candidate_id')).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });
});
