import { CandidatesApi } from '../../../generated-src/client/apis/candidates-api';
import { VoiceInterviewsApi } from '../../../generated-src/client/apis/voice-interviews-api';
import { InterviewsApi } from '../../../generated-src/client/apis/interviews-api';
import { Configuration } from '../../../generated-src/client/configuration';

// Локальные типы для кандидата
interface CandidateAuthRequest {
  firstName: string;
  lastName: string;
  email: string;
}

interface CandidateAuthResponse {
  candidate: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    positionId: number;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
  verificationRequired: boolean;
}

// Локальный тип для голосового вопроса
interface VoiceQuestionResponse {
  id: string;
  text: string;
  audioUrl?: string;
  duration?: number;
}
import type { Interview } from '../../../src/api/models';

class CandidateApiService {
  private candidatesApi: CandidatesApi;
  private voiceInterviewsApi: VoiceInterviewsApi;
  private interviewsApi: InterviewsApi;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';
    
    const config = new Configuration({
      basePath: this.baseUrl,
    });
    
    this.candidatesApi = new CandidatesApi(config);
    this.voiceInterviewsApi = new VoiceInterviewsApi(config);
    this.interviewsApi = new InterviewsApi(config);
  }

  /**
   * Авторизация кандидата (find-or-create)
   */
  async authCandidate(request: CandidateAuthRequest): Promise<CandidateAuthResponse> {
    // Для тестирования - всегда возвращаем успешный ответ с токеном
    console.log('🔧 TEST MODE: Returning mock successful response for candidate auth');
    return {
              candidate: {
          id: 1,
          firstName: request.firstName,
          lastName: request.lastName,
          email: request.email,
          status: 'NOT_STARTED',
          positionId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
      token: 'test-token-' + Date.now(),
      verificationRequired: true
    };
    
    // Оригинальная логика (закомментирована для тестирования):
    /*
    try {
      console.log('Authenticating candidate:', { email: request.email, firstName: request.firstName });
      
      const response = await this.candidatesApi.authCandidate(request);
      console.log('Auth response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Candidate auth error:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Неверные данные для авторизации');
      } else if (error.response?.status === 404) {
        throw new Error('Извините, для вас не назначено собеседование. Пожалуйста, обратитесь к рекрутеру.');
      } else if (error.response?.status >= 500) {
        throw new Error('Ошибка сервера. Попробуйте позже');
      } else {
        // Проверяем сообщение об ошибке на наличие информации о том, что кандидат не найден
        const errorMessage = error.response?.data?.message || error.message || 'Ошибка авторизации кандидата';
        if (errorMessage.toLowerCase().includes('found user false') || 
            errorMessage.toLowerCase().includes('candidate not found') ||
            errorMessage.toLowerCase().includes('не найден')) {
          throw new Error('Извините, для вас не назначено собеседование. Пожалуйста, обратитесь к рекрутеру.');
        }
        throw new Error(errorMessage);
      }
    }
    */
  }

  /**
   * Проверка кода верификации email
   */
  async verifyEmail(request: CandidateAuthRequest): Promise<CandidateAuthResponse> {
    try {
      console.log('Verifying email:', { email: request.email });
      
      const response = await this.candidatesApi.authCandidate(request);
      console.log('Verification response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Email verification error:', error);
      
      // Для тестирования - всегда возвращаем успешный ответ
      console.log('🔧 TEST MODE: Returning mock successful response for email verification');
      return {
        candidate: {
          id: 1,
          firstName: 'Тест',
          lastName: 'Кандидат',
          email: request.email,
          status: 'NEW',
          positionId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: 'test-verification-token-' + Date.now(),
        verificationRequired: false
      };
      
      // Оригинальная логика (закомментирована для тестирования):
      /*
      if (error.response?.status === 400) {
        throw new Error('Неверный код верификации');
      } else if (error.response?.status === 404) {
        throw new Error('Код верификации не найден');
      } else if (error.response?.status >= 500) {
        throw new Error('Ошибка сервера. Попробуйте позже');
      } else {
        throw new Error('Ошибка верификации email');
      }
      */
    }
  }

  /**
   * Получение информации о кандидате
   */
  async getCandidateInfo(candidateId: string): Promise<any> {
    try {
      console.log('Getting candidate info:', candidateId);
      
      // Здесь будет вызов API для получения информации о кандидате
      // Пока возвращаем мок данные
      return {
        id: candidateId,
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        status: 'active'
      };
    } catch (error: any) {
      console.error('Get candidate info error:', error);
      throw new Error('Ошибка получения информации о кандидате');
    }
  }

  /**
   * Получение информации об интервью
   */
  async getInterviewInfo(interviewId: string): Promise<Interview> {
    try {
      console.log('🔧 TEST MODE: Returning mock interview info for interview:', interviewId);
      
      // Заглушка для тестирования
      const mockInterview: Interview = {
        id: parseInt(interviewId),
        candidateId: 1,
        positionId: 1,
        status: 'NOT_STARTED',
        createdAt: new Date().toISOString()
      };
      
      console.log('🔧 TEST MODE: Mock interview info:', mockInterview);
      return mockInterview;
      
      // Оригинальный код закомментирован для тестирования
      // const response = await this.interviewsApi.getInterview(parseInt(interviewId));
      // console.log('Interview info response:', response.data);
      // return response.data;
    } catch (error: any) {
      console.error('Get interview info error:', error);
      throw new Error('Ошибка получения информации об интервью');
    }
  }

  /**
   * Начать voice интервью
   */
  async startVoiceInterview(interviewId: string): Promise<any> {
    try {
      console.log('🔧 TEST MODE: Returning mock start voice interview response for interview:', interviewId);
      
      // Заглушка для тестирования
      const mockResponse = {
        interviewId: parseInt(interviewId),
        status: 'STARTED',
        sessionId: `session-${Date.now()}`,
        message: 'Voice интервью успешно запущено'
      };
      
      console.log('🔧 TEST MODE: Mock start voice interview response:', mockResponse);
      return mockResponse;
      
      // Оригинальный код закомментирован для тестирования
      // const response = await this.voiceInterviewsApi.startVoiceInterview(parseInt(interviewId));
      // console.log('Start voice interview response:', response.data);
      // return response.data;
    } catch (error: any) {
      console.error('Start voice interview error:', error);
      throw new Error('Ошибка запуска voice интервью');
    }
  }

  /**
   * Получить следующий вопрос для voice интервью
   */
  async getNextVoiceQuestion(interviewId: string): Promise<VoiceQuestionResponse> {
    try {
      console.log('🔧 TEST MODE: Returning mock next voice question for interview:', interviewId);
      
      // Заглушка для тестирования
      const mockResponse: VoiceQuestionResponse = {
        id: '1',
        text: 'Расскажите о своем опыте работы в сфере разработки',
        audioUrl: 'https://example.com/question1.mp3',
        // questionNumber: 1, // Убрано для соответствия интерфейсу
        // totalQuestions: 3, // Убрано для соответствия интерфейсу
        // maxDuration: 120, // Убрано для соответствия интерфейсу
        // position: 'Frontend Developer' // Убрано для соответствия интерфейсу
      };
      
      console.log('🔧 TEST MODE: Mock next voice question response:', mockResponse);
      return mockResponse;
      
      // Оригинальный код закомментирован для тестирования
      // const response = await this.voiceInterviewsApi.getNextVoiceQuestion(parseInt(interviewId));
      // console.log('Next voice question response:', response.data);
      // return response.data;
    } catch (error: any) {
      console.error('Get next voice question error:', error);
      throw new Error('Ошибка получения следующего вопроса');
    }
  }

  /**
   * Отправить голосовой ответ
   */
  async submitVoiceAnswer(interviewId: string, questionId: string, audioFile: File): Promise<any> {
    try {
      console.log('Submitting voice answer:', { interviewId, questionId, audioFile });
      
      const response = await this.voiceInterviewsApi.submitVoiceAnswer(
        parseInt(interviewId), 
        parseInt(questionId), 
        audioFile
      );
      console.log('Submit voice answer response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Submit voice answer error:', error);
      throw new Error('Ошибка отправки голосового ответа');
    }
  }

  /**
   * Завершить voice интервью
   */
  async finishVoiceInterview(interviewId: string): Promise<Interview> {
    try {
      console.log('Finishing voice interview:', interviewId);
      
      const response = await this.voiceInterviewsApi.endVoiceInterview(parseInt(interviewId));
      console.log('Finish voice interview response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Finish voice interview error:', error);
      throw new Error('Ошибка завершения voice интервью');
    }
  }

  /**
   * Получить аудиофайл ответа кандидата
   */
  async getAnswerAudio(interviewId: string, questionId: string): Promise<File> {
    try {
      console.log('Getting answer audio:', { interviewId, questionId });
      
      const response = await this.voiceInterviewsApi.getAnswerAudio(
        parseInt(interviewId), 
        parseInt(questionId)
      );
      console.log('Get answer audio response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Get answer audio error:', error);
      throw new Error('Ошибка получения аудиофайла ответа');
    }
  }

  /**
   * Отправка ответа на вопрос интервью (для совместимости)
   */
  async submitInterviewAnswer(candidateId: string, questionId: string, answer: string): Promise<any> {
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
