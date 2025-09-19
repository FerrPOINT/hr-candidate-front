import { apiClient } from '../apiClient';

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

describe('apiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('экспортирует apiClient', () => {
    expect(apiClient).toBeDefined();
  });

  it('имеет правильную структуру', () => {
    expect(typeof apiClient).toBe('object');
    expect(apiClient).toHaveProperty('candidates');
  });

  it('candidates API существует', () => {
    expect(apiClient.candidates).toBeDefined();
    expect(typeof apiClient.candidates).toBe('object');
  });
});
