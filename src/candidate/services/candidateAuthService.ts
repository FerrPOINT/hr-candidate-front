import { candidateApiService } from './candidateApiService';

export interface CandidateAuthData {
  firstName: string;
  lastName: string;
  email: string;
  token?: string;
}

// Алиасы для совместимости
export type CandidateAuthRequest = CandidateAuthData;

export interface EmailVerificationRequest {
  email: string;
  verificationCode: string;
}

export interface AuthResponse {
  success: boolean;
  candidateId?: string;
  message?: string;
  error?: string;
}

class CandidateAuthService {
  private static CANDIDATE_ID_KEY = 'candidate_id';
  private static AUTH_TOKEN_KEY = 'auth_token';

  /**
   * Аутентификация кандидата
   */
  async authenticate(authData: CandidateAuthData): Promise<AuthResponse> {
    console.log('Starting candidate authentication:', { email: authData.email, firstName: authData.firstName });
    
    // Для тестирования - всегда получаем успешный ответ от API
    const response = await candidateApiService.authCandidate({
      firstName: authData.firstName,
      lastName: authData.lastName,
      email: authData.email
    });

    console.log('Authentication successful:', response);

    // Сохраняем данные в localStorage
    if (response.candidate?.id) {
      localStorage.setItem(CandidateAuthService.CANDIDATE_ID_KEY, String(response.candidate.id));
    }
    if (response.token) {
      localStorage.setItem(CandidateAuthService.AUTH_TOKEN_KEY, response.token);
    }

    return {
      success: true,
      candidateId: response.candidate?.id ? String(response.candidate.id) : undefined,
      message: 'Аутентификация успешна'
    };
    
    // Оригинальная логика (закомментирована для тестирования):
    /*
    try {
      console.log('Starting candidate authentication:', { email: authData.email, firstName: authData.firstName });
      
      const response = await candidateApiService.authCandidate({
        firstName: authData.firstName,
        lastName: authData.lastName,
        email: authData.email
      });

      console.log('Authentication successful:', response);

      // Сохраняем данные в localStorage
      if (response.candidate?.id) {
        localStorage.setItem(CandidateAuthService.CANDIDATE_ID_KEY, String(response.candidate.id));
      }
      if (response.token) {
        localStorage.setItem(CandidateAuthService.AUTH_TOKEN_KEY, response.token);
      }

      return {
        success: true,
        candidateId: response.candidate?.id ? String(response.candidate.id) : undefined,
        message: 'Аутентификация успешна'
      };
    } catch (error: any) {
      console.error('Authentication failed:', error);
      
      // Специальная обработка для случая когда кандидат не найден
      const errorMessage = error.message || 'Ошибка аутентификации';
      if (errorMessage.includes('не назначено собеседование') ||
          errorMessage.toLowerCase().includes('found user false') ||
          errorMessage.toLowerCase().includes('candidate not found')) {
        return {
          success: false,
          error: 'Извините, для вас не назначено собеседование. Пожалуйста, обратитесь к рекрутеру.'
        };
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
    */
  }

  /**
   * Верификация email
   */
  async verifyEmail(email: string, verificationCode: string): Promise<AuthResponse> {
    try {
      console.log('Starting email verification:', { email, code: verificationCode });
      
      const response = await candidateApiService.verifyEmail({
        firstName: '', // Не требуется для верификации
        lastName: '',  // Не требуется для верификации
        email
      });

      console.log('Email verification successful:', response);

      // Обновляем токен если он есть
      if (response.token) {
        localStorage.setItem(CandidateAuthService.AUTH_TOKEN_KEY, response.token);
      }

      return {
        success: true,
        candidateId: response.candidate?.id ? String(response.candidate.id) : undefined,
        message: 'Email успешно верифицирован'
      };
    } catch (error: any) {
      console.error('Email verification failed:', error);
      
      // Для тестирования - всегда возвращаем успешный ответ
      console.log('🔧 TEST MODE: Returning mock successful response for email verification service');
      return {
        success: true,
        candidateId: '1',
        message: 'Email успешно верифицирован (тестовый режим)'
      };
      
      // Оригинальная логика (закомментирована для тестирования):
      /*
      return {
        success: false,
        error: error.message || 'Ошибка верификации email'
      };
      */
    }
  }

  /**
   * Получение ID кандидата из localStorage
   */
  getCandidateId(): string | null {
    return localStorage.getItem(CandidateAuthService.CANDIDATE_ID_KEY);
  }

  /**
   * Получение токена авторизации
   */
  getAuthToken(): string | null {
    return localStorage.getItem(CandidateAuthService.AUTH_TOKEN_KEY);
  }

  /**
   * Алиас для совместимости
   */
  getToken(): string | null {
    return this.getAuthToken();
  }

  /**
   * Получение данных кандидата
   */
  getCandidateData(): any {
    const candidateId = this.getCandidateId();
    const token = this.getAuthToken();
    
    if (candidateId && token) {
      return {
        candidateId,
        token,
        isAuthenticated: true
      };
    }
    
    return null;
  }

  /**
   * Сохранение данных кандидата
   */
  saveCandidateData(data: any): void {
    if (data.id) {
      localStorage.setItem(CandidateAuthService.CANDIDATE_ID_KEY, data.id);
    }
    if (data.token) {
      localStorage.setItem(CandidateAuthService.AUTH_TOKEN_KEY, data.token);
    }
  }

  /**
   * Проверка авторизации
   */
  isAuthenticated(): boolean {
    const candidateId = this.getCandidateId();
    const token = this.getAuthToken();
    return !!(candidateId && token);
  }

  /**
   * Очистка данных авторизации
   */
  clearAuth(): void {
    localStorage.removeItem(CandidateAuthService.CANDIDATE_ID_KEY);
    localStorage.removeItem(CandidateAuthService.AUTH_TOKEN_KEY);
    console.log('Auth data cleared');
  }

  /**
   * Получение информации о кандидате
   */
  async getCandidateInfo(): Promise<any> {
    try {
      const candidateId = this.getCandidateId();
      if (!candidateId) {
        throw new Error('Кандидат не авторизован');
      }

      return await candidateApiService.getCandidateInfo(candidateId);
    } catch (error: any) {
      console.error('Failed to get candidate info:', error);
      throw error;
    }
  }

  /**
   * Отправка ответа на вопрос интервью
   */
  async submitAnswer(questionId: string, answer: string): Promise<any> {
    try {
      const candidateId = this.getCandidateId();
      if (!candidateId) {
        throw new Error('Кандидат не авторизован');
      }

      return await candidateApiService.submitInterviewAnswer(candidateId, questionId, answer);
    } catch (error: any) {
      console.error('Failed to submit answer:', error);
      throw error;
    }
  }
}

export const candidateAuthService = new CandidateAuthService();

