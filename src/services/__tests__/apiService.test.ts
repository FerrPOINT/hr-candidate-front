import { apiService } from '../apiService';

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

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('экспортирует apiService', () => {
    expect(apiService).toBeDefined();
  });

  it('имеет правильную структуру', () => {
    expect(typeof apiService).toBe('object');
    expect(apiService).toHaveProperty('get');
    expect(apiService).toHaveProperty('post');
    expect(apiService).toHaveProperty('put');
    expect(apiService).toHaveProperty('delete');
  });

  it('get метод существует', () => {
    expect(typeof apiService.get).toBe('function');
  });

  it('post метод существует', () => {
    expect(typeof apiService.post).toBe('function');
  });

  it('put метод существует', () => {
    expect(typeof apiService.put).toBe('function');
  });

  it('delete метод существует', () => {
    expect(typeof apiService.delete).toBe('function');
  });
});
