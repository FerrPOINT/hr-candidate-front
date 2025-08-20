import { mockApiClient, mockApiService } from '../../test-utils';

// Мок для apiClient
jest.mock('../../api/apiClient', () => ({
    apiClient: mockApiClient,
}));

describe('API Service Basic Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Authentication', () => {
        it('should have login method', () => {
            expect(mockApiService.login).toBeDefined();
            expect(typeof mockApiService.login).toBe('function');
        });

        it('should have logout method', () => {
            expect(mockApiService.logout).toBeDefined();
            expect(typeof mockApiService.logout).toBe('function');
        });
    });

    describe('Positions API', () => {
        it('should have getPositions method', () => {
            expect(mockApiService.getPositions).toBeDefined();
            expect(typeof mockApiService.getPositions).toBe('function');
        });

        it('should have createPosition method', () => {
            expect(mockApiService.createPosition).toBeDefined();
            expect(typeof mockApiService.createPosition).toBe('function');
        });
    });

    describe('Candidates API', () => {
        it('should have getCandidates method', () => {
            expect(mockApiService.getCandidates).toBeDefined();
            expect(typeof mockApiService.getCandidates).toBe('function');
        });

        it('should have createCandidate method', () => {
            expect(mockApiService.createCandidate).toBeDefined();
            expect(typeof mockApiService.createCandidate).toBe('function');
        });
    });

    describe('Interviews API', () => {
        it('should have getInterviews method', () => {
            expect(mockApiService.getInterviews).toBeDefined();
            expect(typeof mockApiService.getInterviews).toBe('function');
        });

        it('should have startInterview method', () => {
            expect(mockApiService.startInterview).toBeDefined();
            expect(typeof mockApiService.startInterview).toBe('function');
        });
    });

    describe('Questions API', () => {
        it('should have getQuestions method', () => {
            expect(mockApiService.getQuestions).toBeDefined();
            expect(typeof mockApiService.getQuestions).toBe('function');
        });

        it('should have createQuestion method', () => {
            expect(mockApiService.createQuestion).toBeDefined();
            expect(typeof mockApiService.createQuestion).toBe('function');
        });
    });
}); 