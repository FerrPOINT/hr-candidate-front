export class Candidate {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  position?: string;
  
  constructor(data?: Partial<Candidate>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class Interview {
  id?: string;
  candidateId?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  questions?: Question[];
  
  constructor(data?: Partial<Interview>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class Question {
  id?: string;
  text?: string;
  type?: string;
  order?: number;
  audioUrl?: string;
  
  constructor(data?: Partial<Question>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class Answer {
  id?: string;
  questionId?: string;
  candidateId?: string;
  text?: string;
  audioUrl?: string;
  duration?: number;
  
  constructor(data?: Partial<Answer>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

// Экспортируем также типы
export type CandidateType = Candidate;
export type InterviewType = Interview;
export type QuestionType = Question;
export type AnswerType = Answer;