import { candidateApiService } from './candidateApiService';
import { useAuthStore } from '../../store/authStore';
import { logger } from '../../utils/logger';
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
  interviewId?: number;
  token?: string;
}

class CandidateAuthService {
  // Локальный флаг для управления проверкой email (по умолчанию выкл)
  static EMAIL_VERIFICATION_ENABLED = false;
  private static CANDIDATE_ID_KEY = 'candidate_id';
  private static AUTH_TOKEN_KEY = 'auth_token';

  /**
   * Аутентификация кандидата
   */
  async authenticate(authData: CandidateAuthData): Promise<AuthResponse> {
    logger.debug('candidateAuthService.authenticate вызван', { 
      email: authData.email, 
      firstName: authData.firstName, 
      positionId: authData.positionId 
    });
    
    try {
      logger.debug('Вызываем candidateApiService.loginCandidate');
      const response = await candidateApiService.loginCandidate({
        firstName: authData.firstName,
        lastName: authData.lastName,
        email: authData.email,
        positionId: authData.positionId
      });

      logger.debug('Получен ответ от candidateApiService', { response });

      // Нормализуем возможные варианты структуры ответа бэкенда
      const raw: any = response as any;
      const interviewId = Number(
        raw?.interview?.id ??
        raw?.data?.interview?.id ??
        raw?.interviewId ??
        raw?.data?.interviewId
      );
      const verificationRequired: boolean = Boolean(
        raw?.verificationRequired ??
        raw?.data?.verificationRequired
      );
      const shouldVerify: boolean = CandidateAuthService.EMAIL_VERIFICATION_ENABLED && verificationRequired;
      const token: string | undefined = (
        raw?.token ??
        raw?.data?.token ??
        raw?.auth?.token ??
        raw?.data?.auth?.token ??
        raw?.session?.token ??
        raw?.accessToken ??
        raw?.jwt
      );
      
      if (!interviewId) {
        console.warn('⚠️ Неожиданный ответ при аутентификации, нет interview.id');
        return {
          success: false,
          error: 'Ошибка аутентификации: отсутствует interview.id'
        };
      }

      if (shouldVerify) {
        // Верификация требуется - переходим на страницу верификации
        logger.info('Верификация требуется', { interviewId: interviewId.toString() });
        return {
          success: true,
          interviewId,
          message: 'Требуется верификация email'
        };
      } else if (token) {
        // Верификация не требуется — сохраняем токен так же, как после верификации email
        logger.info('Верификация не требуется, есть токен', { interviewId: interviewId.toString() });

        try {
          localStorage.setItem('candidate_token', token);
          if (interviewId) {
            localStorage.setItem('candidate_interview_id', interviewId.toString());
          }
          // Делаем токен сразу доступным для API-клиента (zustand store)
          useAuthStore.setState({ token, isAuth: true, role: 'CANDIDATE' });
        } catch {}

        return {
          success: true,
          interviewId,
          token,
          message: 'Вход выполнен успешно'
        };
      } else {
        if (verificationRequired && !CandidateAuthService.EMAIL_VERIFICATION_ENABLED) {
          // Верификация запрошена сервером, но локально отключена — продолжаем без токена
          console.warn('ℹ️ Верификация на сервере требуется, но локально отключена — продолжаем без токена');
          return {
            success: true,
            interviewId,
            message: 'Верификация отключена локально'
          };
        }
        console.warn('⚠️ Неожиданный ответ: нет ни верификации, ни токена');
        return {
          success: false,
          error: 'Ошибка аутентификации: неопределенное состояние'
        };
      }
    } catch (error: any) {
      console.error('💥 Ошибка в candidateAuthService.authenticate:', error);
      
      const errorMessage = error.message || 'Ошибка аутентификации';
      if (errorMessage.includes('не назначено собеседование') ||
          errorMessage.toLowerCase().includes('found user false') ||
          errorMessage.toLowerCase().includes('candidate not found')) {
        logger.warn('Кандидат не найден, возвращаем специальную ошибку');
        return {
          success: false,
          error: 'Извините, для вас не назначено собеседование. Пожалуйста, обратитесь к рекрутеру.'
        };
      }
      
      logger.error('Возвращаем общую ошибку', error, { errorMessage });
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
      logger.debug('Starting email verification', { email, code: verificationCode });

      // Используем новый endpoint verifyCandidateEmail
      const response = await candidateApiService.verifyCandidateEmail({
        email,
        verificationCode
      });

      logger.debug('Email verification response', { response });

      const interviewId = response?.interview?.id as number | undefined;

      if (response.success && (response as any)?.token) {
        // Сохраняем токен в localStorage после успешной верификации
        localStorage.setItem('candidate_token', (response as any).token);
        localStorage.setItem('candidate_interview_id', interviewId?.toString() || '');
      }

      return {
        success: response.success,
        interviewId,
        token: (response as any)?.token,
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
    return localStorage.getItem('candidate_interview_id');
  }

  /**
   * Получение токена авторизации
   */
  getAuthToken(): string | null {
    return localStorage.getItem('candidate_token');
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
  saveCandidateData(_data: any): void {}

  /**
   * Проверка авторизации
   */
  isAuthenticated(): boolean { 
    return !!(this.getAuthToken() && this.getCandidateId()); 
  }

  /**
   * Очистка данных авторизации
   */
  clearAuth(): void { 
    localStorage.removeItem('candidate_token');
    localStorage.removeItem('candidate_interview_id');
    logger.debug('Auth data cleared'); 
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
      logger.debug('Checking interview exists for email', { email });
      
      const response = await candidateApiService.checkInterviewExists(email);
      logger.debug('Interview check response', { response });
      
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
      logger.debug('Starting interview', { interviewId: interviewId.toString(), token: token.substring(0, 10) + '...' });
      
      const response = await candidateApiService.startInterview(interviewId, token);
      logger.debug('Start interview response', { response });
      
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

