import { useAuthStore, authStore } from '../authStore';
import { apiService } from '../../services/apiService';

// Моки для зависимостей
jest.mock('../../services/apiService');
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('экспортирует authStore', () => {
    expect(authStore).toBeDefined();
  });

  it('имеет правильную структуру', () => {
    expect(typeof authStore).toBe('object');
    expect(authStore).toHaveProperty('isAuth');
    expect(authStore).toHaveProperty('user');
    expect(authStore).toHaveProperty('token');
    expect(authStore).toHaveProperty('role');
    expect(authStore).toHaveProperty('isLoading');
    expect(authStore).toHaveProperty('error');
    expect(authStore).toHaveProperty('showSessionExpiredModal');
  });

  it('isAuth возвращает boolean', () => {
    expect(typeof authStore.isAuth).toBe('boolean');
  });

  it('user может быть null или объектом', () => {
    expect(authStore.user === null || typeof authStore.user === 'object').toBe(true);
  });

  it('token может быть null или строкой', () => {
    expect(authStore.token === null || typeof authStore.token === 'string').toBe(true);
  });

  it('инициализируется с правильными значениями по умолчанию', () => {
    expect(authStore.isAuth).toBe(false);
    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull();
    expect(authStore.role).toBeNull();
    expect(authStore.isLoading).toBe(true);
    expect(authStore.error).toBeNull();
    expect(authStore.showSessionExpiredModal).toBe(false);
  });

  describe('logout', () => {
    it('очищает все данные и сбрасывает состояние', () => {
      const store = useAuthStore.getState();
      
      // Вызываем logout
      store.logout();
      
      expect(store.token).toBeNull();
      expect(store.role).toBeNull();
      expect(store.user).toBeNull();
      expect(store.isAuth).toBe(false);
    });
  });

  describe('showSessionExpired', () => {
    it('вызывает метод без ошибок', () => {
      const store = useAuthStore.getState();
      
      expect(() => {
        store.showSessionExpired();
      }).not.toThrow();
    });
  });

  describe('hideSessionExpired', () => {
    it('вызывает метод без ошибок', () => {
      const store = useAuthStore.getState();
      
      expect(() => {
        store.hideSessionExpired();
      }).not.toThrow();
    });
  });

  describe('setAuthError', () => {
    it('вызывает метод без ошибок', () => {
      const store = useAuthStore.getState();
      const errorMessage = 'Test error message';
      
      expect(() => {
        store.setAuthError(errorMessage);
      }).not.toThrow();
    });
  });
});