import { apiClient } from '../../api/apiClient';

export interface InterviewInfo {
  id: string;
  positionId: string;
  positionTitle: string;
  candidateId: string;
  status: string;
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface Question {
  id: string;
  text: string;
  type: string;
  order: number;
  hasVoice: boolean;
  audioUrl?: string;
}

export interface InterviewAnswer {
  questionId: string;
  audioBlob?: Blob;
  text?: string;
  duration?: number;
}

export interface NextQuestionResponse {
  question: Question;
  isLast: boolean;
  progress: {
    current: number;
    total: number;
  };
}

export interface InterviewStartResponse {
  interview: InterviewInfo;
  firstQuestion: Question;
}

// Новые типы согласно OpenAPI спецификации
export interface VoiceInterviewStartResponse {
  interviewId: number;
  status: string;              // "STARTED"
  totalQuestions: number;      // Общее количество вопросов
  readyQuestions: number;      // Количество готовых вопросов
  estimatedDuration?: number;  // Ориентировочная длительность в минутах (опционально)
}

export interface VoiceQuestionResponse {
  questionId: number;
  text: string;                // Текст вопроса
  audioUrl: string;            // URL аудио файла вопроса
  questionNumber: number;      // Номер вопроса в интервью
  totalQuestions: number;      // Общее количество вопросов
  maxDuration: number;         // Максимальная длительность ответа в секундах
  position?: string;           // Название позиции (опционально)
}

export interface VoiceAnswerResponse {
  questionId: number;
  transcript: string;          // Транскрипция ответа
  durationSec: number;         // Длительность в секундах
  confidence: number;          // Уверенность в распознавании (0.0-1.0)
  audioFilePath: string;       // Путь к сохраненному файлу
  savedAt: string;            // Время сохранения ответа
}

class VoiceInterviewService {
  /**
   * Получить информацию об интервью
   */
  async getInterviewInfo(interviewId: string): Promise<InterviewInfo> {
    try {
      const response = await apiClient.interviews.getInterview(parseInt(interviewId));
      return {
        id: response.data.id?.toString() || interviewId,
        positionId: response.data.position?.id?.toString() || '1',
        positionTitle: response.data.position?.title || 'Frontend Developer',
        candidateId: response.data.candidate?.id?.toString() || '1',
        status: response.data.status || 'NOT_STARTED',
        scheduledDate: response.data.scheduledDate,
        startedAt: response.data.startedAt,
        completedAt: response.data.completedAt
      };
    } catch (error: any) {
      console.error('Get interview info error:', error);
      throw new Error('Ошибка получения информации об интервью');
    }
  }

  /**
   * Старт голосового интервью
   */
  async startVoiceInterview(interviewId: string): Promise<VoiceInterviewStartResponse> {
    try {
      console.log('Starting voice interview:', interviewId);
      
      // Используем реальный API метод из voiceInterviews
      const response = await apiClient.voiceInterviews.startVoiceInterview(parseInt(interviewId));
      
      console.log('Voice interview started:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Start voice interview error:', error);
      
      if (error.response?.status === 409) {
        throw new Error('Не все вопросы готовы к voice-интервью');
      } else if (error.response?.status === 404) {
        throw new Error('Интервью не найдено');
      } else {
        throw new Error('Ошибка запуска интервью');
      }
    }
  }

  /**
   * Получить следующий вопрос
   */
  async getNextQuestion(interviewId: string): Promise<VoiceQuestionResponse> {
    try {
      console.log('Getting next question for interview:', interviewId);
      
      // Используем реальный API метод из voiceInterviews
      const response = await apiClient.voiceInterviews.getNextVoiceQuestion(parseInt(interviewId));
      
      console.log('Next question received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get next question error:', error);
      
      if (error.response?.status === 409) {
        throw new Error('Все вопросы уже отвечены');
      } else if (error.response?.status === 404) {
        throw new Error('Интервью не найдено');
      } else {
        throw new Error('Ошибка получения вопроса');
      }
    }
  }

  /**
   * Получить аудио вопроса
   */
  async getQuestionAudio(questionId: string): Promise<Blob> {
    try {
      console.log('Getting question audio:', questionId);
      
      // Используем реальный API метод из voice
      const response = await apiClient.voice.streamQuestionVoiceAudio(parseInt(questionId), {
        responseType: 'blob'
      });
      
      console.log('Question audio received');
      return response.data;
    } catch (error: any) {
      console.error('Get question audio error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Аудиофайл не найден');
      } else if (error.response?.status === 403) {
        throw new Error('Нет доступа к аудиофайлу');
      } else {
        throw new Error('Ошибка получения аудио вопроса');
      }
    }
  }

  /**
   * Отправить ответ на вопрос
   */
  async submitAnswer(interviewId: string, questionId: string, audioFile: File): Promise<VoiceAnswerResponse> {
    try {
      console.log('Submitting answer:', { interviewId, questionId, audioFile });
      
      // Используем реальный API метод из voiceInterviews с multipart/form-data
      const response = await apiClient.voiceInterviews.submitVoiceAnswer(
        parseInt(interviewId),
        parseInt(questionId),
        audioFile
      );
      
      console.log('Answer submitted successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Submit answer error:', error);
      
      if (error.response?.status === 422) {
        throw new Error('Некорректный аудиофайл');
      } else if (error.response?.status === 404) {
        throw new Error('Интервью или вопрос не найдены');
      } else {
        throw new Error('Ошибка отправки ответа');
      }
    }
  }

  /**
   * Завершить голосовое интервью
   */
  async endVoiceInterview(interviewId: string): Promise<any> {
    try {
      console.log('Ending voice interview:', interviewId);
      
      // Используем реальный API метод из voiceInterviews
      const response = await apiClient.voiceInterviews.endVoiceInterview(parseInt(interviewId));
      
      console.log('Voice interview ended successfully');
      return response.data;
    } catch (error: any) {
      console.error('End voice interview error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Интервью не найдено');
      } else {
        throw new Error('Ошибка завершения интервью');
      }
    }
  }

  /**
   * Получить все ответы интервью
   */
  async getInterviewAnswers(interviewId: string): Promise<any[]> {
    try {
      console.log('Getting interview answers:', interviewId);
      
      // Используем реальный API метод
      const response = await apiClient.interviews.getInterviewAnswers(parseInt(interviewId));
      
      console.log('Interview answers received');
      return response.data;
    } catch (error: any) {
      console.error('Get interview answers error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Интервью не найдено');
      } else {
        throw new Error('Ошибка получения ответов');
      }
    }
  }

  /**
   * Получить аудио ответа
   */
  async getAnswerAudio(interviewId: string, questionId: string): Promise<Blob> {
    try {
      console.log('Getting answer audio:', { interviewId, questionId });
      
      // Используем реальный API метод из voiceInterviews
      const response = await apiClient.voiceInterviews.getAnswerAudio(
        parseInt(interviewId),
        parseInt(questionId),
        {
          responseType: 'blob'
        }
      );
      
      console.log('Answer audio received');
      return response.data;
    } catch (error: any) {
      console.error('Get answer audio error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Ответ не найден');
      } else if (error.response?.status === 403) {
        throw new Error('Нет доступа к аудиофайлу');
      } else {
        throw new Error('Ошибка получения аудио ответа');
      }
    }
  }

  /**
   * Проверить статус голосовых вопросов для позиции
   */
  async checkVoiceQuestionsStatus(positionId: string): Promise<{ ready: boolean; message?: string }> {
    try {
      console.log('Checking voice questions status for position:', positionId);
      
      // Используем реальный API метод
      const response = await apiClient.positions.getPositionQuestionsVoiceStatus(parseInt(positionId));
      
      console.log('Voice questions status received:', response.data);
      
      const { total, ready, pending, error } = response.data;
      
      if (ready === total) {
        return { ready: true };
      } else {
        return { 
          ready: false, 
          message: `Готово ${ready} из ${total} вопросов. ${pending} в обработке, ${error} с ошибками.`
        };
      }
    } catch (error: any) {
      console.error('Check voice questions status error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Позиция не найдена');
      } else {
        throw new Error('Ошибка проверки статуса вопросов');
      }
    }
  }
}

export const voiceInterviewService = new VoiceInterviewService();
