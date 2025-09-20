export class Configuration {
  constructor(config: any = {}) {
    this.basePath = config.basePath || '/api/v1';
    this.accessToken = config.accessToken || (() => '');
  }
  basePath: string;
  accessToken: () => string;
}

export class CandidatesApi {
  constructor(config: any = {}) {}
  
  loginCandidate = jest.fn(async (request: any) => ({ 
    data: {
      candidate: {
        id: 1,
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      token: 'mock-token',
      verificationRequired: false,
      interview: {
        id: 1,
        status: 'NOT_STARTED'
      }
    }
  }));
  
  verifyCandidateEmail = jest.fn(async (request: any) => ({ 
    data: {
      success: true,
      message: 'Email verified'
    }
  }));
  
  startInterview = jest.fn(async (interviewId: number) => ({ 
    data: {
      success: true,
      interviewId,
      status: 'IN_PROGRESS'
    }
  }));
  
  getCurrentQuestion = jest.fn(async (interviewId: number) => ({ 
    data: {
      questionId: 1,
      text: 'Mock question text',
      audioUrl: 'mock-audio-url',
      maxDuration: 30
    }
  }));
  
  submitAnswer = jest.fn(async (interviewId: number, questionId: number, isVoice: boolean, audioFile?: File) => ({ 
    data: {
      success: true,
      message: 'Answer submitted'
    }
  }));
  
  endInterview = jest.fn(async (interviewId: number) => ({ 
    data: {
      success: true,
      message: 'Interview completed'
    }
  }));
  
  getCandidatePositionSummary = jest.fn(async (positionId: number) => ({ 
    data: {
      id: positionId,
      title: 'Mock Position',
      questionsCount: 5
    }
  }));
}

// Экспорт типов
export interface CandidateLoginRequest {
  firstName: string;
  lastName: string;
  email: string;
  positionId: number;
}

export interface CandidateLoginResponse {
  candidate: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  token?: string;
  verificationRequired: boolean;
  interview?: {
    id: number;
    status: string;
  };
}

export interface CandidateEmailVerificationRequest {
  email: string;
  verificationCode: string;
}

export interface CandidateEmailVerificationResponse {
  success: boolean;
  message: string;
}

