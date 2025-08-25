// В этом билде доступен только CandidatesApi (startInterviewForCandidate, getCurrentQuestion, submitAnswer, endInterview)
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
  async getInterviewInfo(interviewId: string): Promise<InterviewInfo> {
    throw new Error('Not supported in this build');
  }

  async startVoiceInterview(interviewId: string): Promise<VoiceInterviewStartResponse> {
    throw new Error('Not supported in this build');
  }

  async getNextQuestion(interviewId: string): Promise<VoiceQuestionResponse> {
    throw new Error('Not supported in this build');
  }

  async getQuestionAudio(questionId: string): Promise<Blob> {
    throw new Error('Not supported in this build');
  }

  async submitAnswer(interviewId: string, questionId: string, audioFile: File): Promise<VoiceAnswerResponse> {
    throw new Error('Not supported in this build');
  }

  async endVoiceInterview(interviewId: string): Promise<any> {
    throw new Error('Not supported in this build');
  }

  async getInterviewAnswers(interviewId: string): Promise<any[]> {
    throw new Error('Not supported in this build');
  }

  async getAnswerAudio(interviewId: string, questionId: string): Promise<Blob> {
    throw new Error('Not supported in this build');
  }

  async checkVoiceQuestionsStatus(positionId: string): Promise<{ ready: boolean; message?: string }> {
    throw new Error('Not supported in this build');
  }
}

export const voiceInterviewService = new VoiceInterviewService();
