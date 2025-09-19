import { authStore } from '../authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом
    localStorage.clear();
  });

  it('экспортирует authStore', () => {
    expect(authStore).toBeDefined();
  });

  it('имеет правильную структуру', () => {
    expect(typeof authStore).toBe('object');
    expect(authStore).toHaveProperty('isAuthenticated');
    expect(authStore).toHaveProperty('user');
    expect(authStore).toHaveProperty('token');
  });

  it('isAuthenticated возвращает boolean', () => {
    expect(typeof authStore.isAuthenticated).toBe('boolean');
  });

  it('user может быть null или объектом', () => {
    expect(authStore.user === null || typeof authStore.user === 'object').toBe(true);
  });

  it('token может быть null или строкой', () => {
    expect(authStore.token === null || typeof authStore.token === 'string').toBe(true);
  });

  it('инициализируется с правильными значениями по умолчанию', () => {
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull();
  });
});