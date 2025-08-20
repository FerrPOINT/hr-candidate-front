import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

type CustomOptions = Omit<RenderOptions, 'wrapper'> & {
  withRouter?: boolean;
  initialEntries?: string[];
};

const Providers: React.FC<{ children: React.ReactNode; withRouter?: boolean; initialEntries?: string[] }> = ({ children, withRouter, initialEntries }) => {
  if (withRouter) {
    return <MemoryRouter initialEntries={initialEntries || ['/']}>{children}</MemoryRouter>;
  }
  return <>{children}</>;
};

const customRender = (ui: ReactElement, options?: CustomOptions) => {
  const { withRouter = true, initialEntries, ...rest } = options || {};
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <Providers withRouter={withRouter} initialEntries={initialEntries}>{children}</Providers>
    ),
    ...rest,
  });
};

// Мок для API клиента
export const mockApiClient = {
    auth: {
        login: jest.fn(),
        logout: jest.fn(),
        refresh: jest.fn(),
    },
    positions: {
        getPositions: jest.fn(),
        createPosition: jest.fn(),
        updatePosition: jest.fn(),
        getPosition: jest.fn(),
    },
    candidates: {
        getCandidates: jest.fn(),
        createCandidate: jest.fn(),
        updateCandidate: jest.fn(),
        getCandidate: jest.fn(),
    },
    interviews: {
        getInterviews: jest.fn(),
        startInterview: jest.fn(),
        getInterview: jest.fn(),
    },
    questions: {
        getQuestions: jest.fn(),
        createQuestion: jest.fn(),
        updateQuestion: jest.fn(),
        deleteQuestion: jest.fn(),
    },
    account: {
        getUserInfo: jest.fn(),
        updateUser: jest.fn(),
    },
    teamUsers: {
        getUsers: jest.fn(),
        createUser: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
    },
    analyticsReports: {
        getPositionsStats: jest.fn(),
        getInterviewsStats: jest.fn(),
        getCandidatesStats: jest.fn(),
    },
    settings: {
        getBranding: jest.fn(),
        updateBranding: jest.fn(),
    },
    ai: {
        transcribeAudio: jest.fn(),
        transcribeAnswerWithAI: jest.fn(),
    },
    agents: {
        getAgents: jest.fn(),
        createAgent: jest.fn(),
        updateAgent: jest.fn(),
        testAgent: jest.fn(),
    },
    webhooks: {
        handleElevenLabsWebhook: jest.fn(),
    }
};

// Мок для API сервиса
export const mockApiService = {
    // Auth
    login: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),

    // Positions
    getPositions: jest.fn(),
    createPosition: jest.fn(),
    updatePosition: jest.fn(),
    getPosition: jest.fn(),

    // Candidates
    getCandidates: jest.fn(),
    createCandidate: jest.fn(),
    updateCandidate: jest.fn(),
    getCandidate: jest.fn(),

    // Interviews
    getInterviews: jest.fn(),
    startInterview: jest.fn(),
    getInterview: jest.fn(),

    // Questions
    getQuestions: jest.fn(),
    createQuestion: jest.fn(),
    updateQuestion: jest.fn(),
    deleteQuestion: jest.fn(),

    // Users
    getUsers: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),

    // Analytics
    getPositionStats: jest.fn(),
    getInterviewStats: jest.fn(),
    getCandidateStats: jest.fn(),

    // Settings
    getBranding: jest.fn(),
    updateBranding: jest.fn(),
};

// Заготовки данных для тестов
export const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'RECRUITER' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export const mockPosition = {
    id: '1',
    title: 'Frontend Developer',
    description: 'React developer position',
    status: 'ACTIVE' as const,
    level: 'MIDDLE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export const mockCandidate = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    status: 'NEW' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export const mockInterview = {
    id: '1',
    candidateId: '1',
    positionId: '1',
    status: 'SCHEDULED' as const,
    result: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export * from '@testing-library/react';
export { customRender as render }; 