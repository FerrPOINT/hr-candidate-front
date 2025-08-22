import { candidateApiService } from './candidateApiService';
import type { CandidateLoginRequest, CandidateLoginResponse, CandidateEmailVerificationRequest, CandidateEmailVerificationResponse } from '../../api/models';

export interface CandidateAuthData {
  firstName: string;
  lastName: string;
  email: string;
  positionId: number; // Добавляем обязательное поле согласно API спецификации
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
    console.log('🚀 candidateAuthService.authenticate вызван');
    console.log('📝 Входные данные:', { email: authData.email, firstName: authData.firstName, positionId: authData.positionId });
    
    try {
      console.log('🔐 Вызываем candidateApiService.loginCandidate...');
      const response = await candidateApiService.loginCandidate({
        firstName: authData.firstName,
        lastName: authData.lastName,
        email: authData.email,
        positionId: authData.positionId
      });

      console.log('📥 Получен ответ от candidateApiService:', response);

      // Сохраняем данные кандидата в localStorage
      if (response.candidate?.id) {
        console.log('💾 Сохраняем candidateId в localStorage:', response.candidate.id);
        localStorage.setItem(CandidateAuthService.CANDIDATE_ID_KEY, String(response.candidate.id));
      }

      // В CandidateLoginResponse нет токена - он будет получен только после верификации
      // Токен сохраняем только если верификация не требуется (но это не должно происходить)
      if (response.verificationRequired) {
        console.log('✅ Верификация требуется, возвращаем успех');
        return {
          success: true,
          candidateId: response.candidate?.id ? String(response.candidate.id) : undefined,
          message: 'Требуется верификация email'
        };
      } else {
        // Если верификация не требуется, значит что-то пошло не так
        console.warn('⚠️ Неожиданный ответ: верификация не требуется, но токен не предоставлен');
        return {
          success: false,
          error: 'Ошибка аутентификации: неожиданный ответ от сервера'
        };
      }
    } catch (error: any) {
      console.error('💥 Ошибка в candidateAuthService.authenticate:', error);
      
      // Специальная обработка для случая когда кандидат не найден
      const errorMessage = error.message || 'Ошибка аутентификации';
      if (errorMessage.includes('не назначено собеседование') ||
          errorMessage.toLowerCase().includes('found user false') ||
          errorMessage.toLowerCase().includes('candidate not found')) {
        console.log('🚫 Кандидат не найден, возвращаем специальную ошибку');
        return {
          success: false,
          error: 'Извините, для вас не назначено собеседование. Пожалуйста, обратитесь к рекрутеру.'
        };
      }
      
      console.log('🚨 Возвращаем общую ошибку:', errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Верификация email
   */
  async verifyEmail(email: string, verificationCode: string): Promise<AuthResponse> {
    try {
      console.log('Starting email verification:', { email, code: verificationCode });
      
      // Получаем данные кандидата из localStorage для верификации
      const candidateId = this.getCandidateId();
      if (!candidateId) {
        throw new Error('Кандидат не найден. Сначала пройдите авторизацию.');
      }

      // Используем новый endpoint verifyCandidateEmail
      const response = await candidateApiService.verifyCandidateEmail({
        email,
        verificationCode
      });

      console.log('Email verification response:', response);

      // После успешной верификации сохраняем токен
      if (response.token && response.success) {
        localStorage.setItem(CandidateAuthService.AUTH_TOKEN_KEY, response.token);
      }

      return {
        success: response.success,
        candidateId: response.candidate?.id ? String(response.candidate.id) : undefined,
        message: response.success ? 'Email успешно верифицирован' : 'Ошибка верификации email'
      };
    } catch (error: any) {
      console.error('Email verification failed:', error);
      
      return {
        success: false,
        error: error.message || 'Ошибка верификации email'
      };
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

      const token = this.getToken();
      if (!token) {
        throw new Error('Токен авторизации не найден');
      }

      return await candidateApiService.getCandidateInfo(candidateId, token);
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

      const token = this.getToken();
      if (!token) {
        throw new Error('Токен авторизации не найден');
      }

      return await candidateApiService.submitInterviewAnswer(candidateId, questionId, answer, token);
    } catch (error: any) {
      console.error('Failed to submit answer:', error);
      throw error;
    }
  }

  /**
   * Проверка наличия собеседования по email
   */
  async checkInterviewExists(email: string): Promise<{ exists: boolean, interviewId?: number, message?: string }> {
    try {
      console.log('Checking interview exists for email:', email);
      
      const response = await candidateApiService.checkInterviewExists(email);
      console.log('Interview check response:', response);
      
      return {
        exists: response.exists,
        interviewId: response.interviewId,
        message: response.exists ? 'Собеседование найдено' : 'Собеседование не найдено'
      };
    } catch (error: any) {
      console.error('Check interview exists failed:', error);
      
      return {
        exists: false,
        message: error.message || 'Ошибка проверки собеседования'
      };
    }
  }

  /**
   * Старт собеседования
   */
  async startInterview(interviewId: number, token: string): Promise<{ success: boolean, message?: string }> {
    try {
      console.log('Starting interview:', { interviewId, token: token.substring(0, 10) + '...' });
      
      const response = await candidateApiService.startInterview(interviewId, token);
      console.log('Start interview response:', response);
      
      if (response.success) {
        return {
          success: true,
          message: 'Собеседование успешно запущено'
        };
      } else {
        return {
          success: false,
          message: 'Ошибка запуска собеседования'
        };
      }
    } catch (error: any) {
      console.error('Start interview failed:', error);
      
      return {
        success: false,
        message: error.message || 'Ошибка запуска собеседования'
      };
    }
  }

  // Новый метод для получения информации о вакансии
  async getPositionSummary(positionId: number): Promise<{ 
    id: number; 
    title: string; 
    department: string;
    company: string;
    type: string;
    questionsCount: number 
  }> {
    try {
      const response = await candidateApiService.getPositionSummary(positionId);
      return response;
    } catch (error: any) {
      console.error('Error getting position summary:', error);
      throw new Error('Не удалось получить информацию о вакансии');
    }
  }
}

export const candidateAuthService = new CandidateAuthService();

