export interface Question {
  id: string;
  text: string;
  category: string;
  maxDuration: number;
}

export interface JobPosition {
  title: string;
  department: string;
  company: string;
  type: string;
  questionsCount: number;
}

export interface CompanyQuestion {
  id: string;
  text: string;
}

export interface ProcessQuestion {
  id: number;
  text: string;
  timeLimit: number;
}

export interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: string;
}

export interface QuestionCard {
  id: string;
  questionIndex: number;
  text: string;
  status: 'active' | 'completed';
  timeRemaining?: number;
  isNew?: boolean;
}
