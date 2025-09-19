import { candidateApiService } from '../candidate/services/candidateApiService';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

describe('Candidate API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have candidateApiService object', () => {
    expect(candidateApiService).toBeDefined();
    expect(typeof candidateApiService).toBe('object');
  });

  it('should have loginCandidate method', () => {
    expect(candidateApiService.loginCandidate).toBeDefined();
    expect(typeof candidateApiService.loginCandidate).toBe('function');
  });

  it('should have verifyCandidateEmail method', () => {
    expect(candidateApiService.verifyCandidateEmail).toBeDefined();
    expect(typeof candidateApiService.verifyCandidateEmail).toBe('function');
  });
});
