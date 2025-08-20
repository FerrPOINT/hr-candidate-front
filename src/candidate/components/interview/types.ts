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

export interface Question {
  id: string;
  text: string;
  category: string;
  maxDuration: number;
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