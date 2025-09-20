import { apiService } from '../../services/apiService';
import { extractApiErrorMessage } from '../../utils/error';
import type { CandidateLoginRequest } from 'generated-src/client/models/candidate-login-request';
import type { CandidateLoginResponse } from 'generated-src/client/models/candidate-login-response';
import type { CandidateEmailVerificationRequest } from 'generated-src/client/models/candidate-email-verification-request';
import type { CandidateEmailVerificationResponse } from 'generated-src/client/models/candidate-email-verification-response';
import { Configuration } from '../../../generated-src/client/configuration';
import { CandidatesApi } from '../../../generated-src/client/apis/candidates-api';

// Локальные типы для кандидата (обновлены в соответствии с новым API)
// interface CandidateAuthRequest {
//   firstName: string;
//   lastName: string;
//   email: string;
//   positionId: number; // Добавляем обязательное поле согласно API спецификации
//   verificationCode?: string; // Добавлено поле для верификации
// }

// interface CandidateAuthResponse {
//   candidate: {
//     id: number;
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone?: string;
//     status: string;
//     createdAt: string;
//     updatedAt: string;
//   };
//   token?: string; // Токен может отсутствовать до верификации
//   verificationRequired: boolean; // Флаг необходимости верификации
// }

// Локальные типы для интервью
interface Interview {
  id: number;
  candidateId: number;
  positionId: number;
  status: InterviewStatusEnum;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
}

enum InterviewStatusEnum {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED'
}

// Локальный тип для голосового вопроса
interface VoiceQuestionResponse {
  id: string;
  text: string;
  audioUrl?: string;
  duration?: number;
}

class CandidateApiService {
  /**
   * Авторизация кандидата (find-or-create) - публичный эндпоинт
   */
  async loginCandidate(request: CandidateLoginRequest): Promise<CandidateLoginResponse> {
    try {
      console.log('🚀 candidateApiService.loginCandidate вызван');
      console.log('📝 Входные данные:', { email: request.email, firstName: request.firstName, positionId: request.positionId });
      
      // Используем публичный клиент без токена
      console.log('🔗 Получаем публичный API клиент...');
      const publicClient = apiService.getPublicApiClient();
      console.log('✅ Публичный клиент получен:', publicClient);
      
      console.log('📤 Вызываем API candidates.loginCandidate...');
      const response = await publicClient.candidates.loginCandidate(request);
      
      console.log('📥 Получен ответ от API:', response);
      console.log('📊 Данные ответа:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('💥 Ошибка в candidateApiService.loginCandidate:', error);
      console.error('🔍 Детали ошибки:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      
      throw new Error(extractApiErrorMessage(error));
    }
  }

  /**
   * Верификация email кандидата - публичный эндпоинт
   */
  async verifyCandidateEmail(request: CandidateEmailVerificationRequest): Promise<CandidateEmailVerificationResponse> {
    try {
      console.log('Verifying candidate email:', { email: request.email });
      
      // Используем публичный клиент без токена
      const response = await apiService.getPublicApiClient().candidates.verifyCandidateEmail(request);
      
      console.log('Verification response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error verifying candidate email:', error);
      throw new Error(extractApiErrorMessage(error));
    }
  }

  /**
   * Проверка существования собеседования по email - публичный эндпоинт
   */
  async checkInterviewExists(email: string): Promise<{ exists: boolean; interviewId?: number }> {
    try {
      console.log('Checking interview existence for email:', email);
      
      // Используем публичный клиент без токена
      const response = await apiService.getPublicApiClient().candidates.loginCandidate({ 
        firstName: '', 
        lastName: '', 
        email,
        positionId: 1 // Используем дефолтное значение для проверки
      });
      
      // Если есть ответ и не требуется верификация, значит собеседование существует
      const exists = response.data && !response.data.verificationRequired;
      const interviewId = response.data?.interview?.id;
      
      console.log('Interview check result:', { exists, interviewId });
      return { exists, interviewId };
    } catch (error: any) {
      console.error('Error checking interview existence:', error);
      return { exists: false };
    }
  }

  /**
   * Создание API клиента с токеном
   */
  private createApiClient(token: string) {
    const config = new Configuration({
      basePath: (process.env.REACT_APP_API_BASE_URL || '/api/v1').toString().trim().replace(/\/+$/, ''),
      accessToken: () => token
    });

    return {
      candidates: new CandidatesApi(config)
    };
  }

  /**
   * Старт собеседования - защищенный эндпоинт (требует токен)
   */
  async startInterview(interviewId: number, token: string): Promise<{ success: boolean; interview?: Interview }> {
    try {
      console.log('Starting interview:', { interviewId, token: token.substring(0, 10) + '...' });
      
      // Создаем API клиент с токеном
      const apiClient = this.createApiClient(token);
      const response = await apiClient.candidates.startInterview(interviewId);
      
      console.log('Start interview response:', response.data);
      
      // Маппим ответ API в локальный тип
      const interview: Interview = {
        id: (response.data as any).interviewId || interviewId,
        candidateId: 0, // Будет заполнено из candidateData если доступно
        positionId: 0, // Будет заполнено из candidateData если доступно
        status: this.mapInterviewStatus((response.data as any).status),
        createdAt: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        finishedAt: undefined
      };
      
      return { success: true, interview };
    } catch (error: any) {
      console.error('Error starting interview:', error);
      throw new Error('Ошибка запуска собеседования');
    }
  }

  /**
   * Маппинг статуса интервью из API в локальный enum
   */
  private mapInterviewStatus(status?: string): InterviewStatusEnum {
    switch (status) {
      case 'NOT_STARTED':
        return InterviewStatusEnum.NOT_STARTED;
      case 'IN_PROGRESS':
        return InterviewStatusEnum.IN_PROGRESS;
      case 'FINISHED':
        return InterviewStatusEnum.FINISHED;
      default:
        return InterviewStatusEnum.NOT_STARTED;
    }
  }

  /**
   * Получение краткой информации о вакансии - публичный эндпоинт
   */
  async getPositionSummary(positionId: number): Promise<{ 
    id: number; 
    title: string; 
    department: string;
    company: string;
    type: string;
    questionsCount: number 
  }> {
    try {
      console.log('🔍 Getting position summary for positionId:', positionId);
      
      // Используем публичный клиент без токена
      const response = await apiService.getPublicApiClient().candidates.getCandidatePositionSummary(positionId);
      console.log('📥 API response for position summary:', response.data);
      
      const raw: any = response.data ?? {};
      const mappedQuestionsCount = (
        raw.questionsCount ??
        raw.totalQuestions ??
        raw.questions_total ??
        raw.questions_count ??
        (Array.isArray(raw.questions) ? raw.questions.length : undefined)
      );
      
      if (typeof mappedQuestionsCount !== 'number' || Number.isNaN(mappedQuestionsCount)) {
        throw new Error('Некорректное поле количества вопросов в ответе API');
      }
        
      // API может возвращать только часть полей — остальные заполняем константами брендинга
      const result = {
        id: raw.id,
        title: raw.title,
        department: 'Engineering',
        company: 'WMT group',
        type: 'Full-time',
        questionsCount: mappedQuestionsCount
      };
      
      console.log('✅ Final position summary:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Error getting position summary:', error);
      // Больше не подставляем фиктивные значения — пробрасываем ошибку, чтобы UI показал её явно
      throw new Error(error?.message || 'Не удалось получить информацию о вакансии');
    }
  }

  /**
   * Получение информации о кандидате
   */
  async getCandidateInfo(candidateId: string, token: string): Promise<any> {
    throw new Error('Недоступно в Candidates API');
  }

  /**
   * Получение информации об интервью
   */
  async getInterviewInfo(interviewId: string, token: string): Promise<any> {
    try {
      console.log('Getting interview info for interview:', interviewId);
      
      // В Candidates API нет эндпоинта получения информации об интервью
      throw new Error('Недоступно в Candidates API');
    } catch (error: any) {
      console.error('Get interview info error:', error);
      throw new Error('Ошибка получения информации об интервью');
    }
  }

  /**
   * Старт голосового интервью
   */
  async startVoiceInterview(interviewId: string, token: string): Promise<any> {
    const apiClient = this.createApiClient(token);
    return (await apiClient.candidates.startInterview(parseInt(interviewId))).data;
  }

  /**
   * Получение следующего голосового вопроса
   */
  async getNextVoiceQuestion(interviewId: string, token: string): Promise<VoiceQuestionResponse> {
    const apiClient = this.createApiClient(token);
    const resp = await apiClient.candidates.getCurrentQuestion(parseInt(interviewId));
    const d: any = resp.data;
    return {
      id: String(d.questionId ?? d.id ?? ''),
      text: d.text || '',
      audioUrl: d.audioUrl,
      duration: d.maxDuration
    };
  }

  /**
   * Отправка голосового ответа
   */
  async submitVoiceAnswer(interviewId: string, questionId: string, audioFile: File, token: string): Promise<any> {
    const apiClient = this.createApiClient(token);
    const resp = await apiClient.candidates.submitAnswer(parseInt(interviewId), parseInt(questionId), false, audioFile);
    return resp.data;
  }

  /**
   * Завершение голосового интервью
   */
  async finishVoiceInterview(interviewId: string, token: string): Promise<any> {
    const apiClient = this.createApiClient(token);
    const resp = await apiClient.candidates.endInterview(parseInt(interviewId));
    return resp.data;
  }

  /**
   * Получение аудио ответа
   */
  async getAnswerAudio(): Promise<any> { throw new Error('Недоступно'); }

  /**
   * Отправка ответа на вопрос интервью - защищенный эндпоинт
   */
  async submitInterviewAnswer(candidateId: string, questionId: string, answer: string, token: string): Promise<any> {
    try {
      console.log('Submitting interview answer:', { candidateId, questionId, answer });
      
      // Здесь будет вызов API для отправки текстового ответа
      // Пока возвращаем мок данные
      return {
        success: true,
        message: 'Ответ успешно отправлен'
      };
    } catch (error: any) {
      console.error('Submit answer error:', error);
      throw new Error('Ошибка отправки ответа');
    }
  }
}

export const candidateApiService = new CandidateApiService();
