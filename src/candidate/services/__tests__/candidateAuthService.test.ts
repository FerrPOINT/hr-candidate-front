import { candidateAuthService } from '../candidateAuthService';

// Мокаем axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  })),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
}));

describe('candidateAuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('экспортирует candidateAuthService', () => {
    expect(candidateAuthService).toBeDefined();
  });

  it('имеет правильную структуру', () => {
    expect(typeof candidateAuthService).toBe('object');
    expect(candidateAuthService).toHaveProperty('authenticate');
    expect(candidateAuthService).toHaveProperty('verifyEmail');
    expect(candidateAuthService).toHaveProperty('getPositionSummary');
  });

  it('authenticate метод существует', () => {
    expect(typeof candidateAuthService.authenticate).toBe('function');
  });

  it('verifyEmail метод существует', () => {
    expect(typeof candidateAuthService.verifyEmail).toBe('function');
  });

  it('getPositionSummary метод существует', () => {
    expect(typeof candidateAuthService.getPositionSummary).toBe('function');
  });

  it('setAuthData метод существует', () => {
    expect(typeof candidateAuthService.setAuthData).toBe('function');
  });

  it('getAuthData метод существует', () => {
    expect(typeof candidateAuthService.getAuthData).toBe('function');
  });

  it('clearAuthData метод существует', () => {
    expect(typeof candidateAuthService.clearAuthData).toBe('function');
  });

  it('isAuthenticated метод существует', () => {
    expect(typeof candidateAuthService.isAuthenticated).toBe('function');
  });
});

