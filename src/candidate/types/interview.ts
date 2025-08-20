// Типы для голосового интервью согласно OpenAPI спецификации

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

export interface VoiceAnswerRequest {
  audio: File;                 // multipart/form-data
  // questionId передается как query параметр
}

export interface VoiceAnswerResponse {
  questionId: number;
  transcript: string;          // Транскрипция ответа
  durationSec: number;         // Длительность в секундах
  confidence: number;          // Уверенность в распознавании (0.0-1.0)
  audioFilePath: string;       // Путь к сохраненному файлу
  savedAt: string;            // Время сохранения ответа
}

export interface VoiceInterviewEndResponse {
  // Возвращает обновленный объект Interview
}

// Дополнительные типы для совместимости
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

// Типы для совместимости с существующими компонентами
export type InterviewStage = 'auth' | 'email-verification' | 'rules' | 'mic-test' | 'instructions' | 'interview' | 'mic-check' | 'questions' | 'company-questions' | 'complete';

export type ProcessStage = 
  | 'welcome' 
  | 'microphone-check' 
  | 'reading-test' 
  | 'recording-test'
  | 'question'
  | 'recording-answer'
  | 'question-completed'
  | 'candidate-questions'
  | 'all-completed';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface JobPosition {
  title: string;
  department: string;
  company: string;
  type: string;
  questionsCount: number;
}

export interface ProcessQuestion {
  id: number;
  text: string;
  timeLimit: number; // in seconds
}

export interface AIMessage {
  id: string;
  content: string;
  isVisible: boolean;
  isNew?: boolean;
}

export interface QuestionCard {
  id: string;
  questionIndex: number;
  text: string;
  status: 'active' | 'completed';
  timeRemaining?: number;
  isNew?: boolean;
}

export interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: string;
  category?: string;
  isTyping?: boolean;
  duration?: number;
  isRecorded?: boolean;
  isTranscribing?: boolean;
}

export interface CompanyQuestion {
  id: string;
  text: string;
}