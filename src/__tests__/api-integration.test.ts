/**
 * Простой тест для проверки интеграции API
 */

describe('API Integration', () => {
  it('should have generated API models', () => {
    // Проверяем, что модели API доступны
    expect(() => {
      require('../../api/models.auto');
    }).not.toThrow();
  });

  it('should have generated API client', () => {
    // Проверяем, что API клиент доступен
    expect(() => {
      require('../../api/apiClient');
    }).not.toThrow();
  });

  it('should have candidates API', () => {
    // Проверяем, что CandidatesApi доступен
    expect(() => {
      require('../../generated-src/client/apis/candidates-api');
    }).not.toThrow();
  });
}); 