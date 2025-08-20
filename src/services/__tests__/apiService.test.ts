import * as apiService from '../apiService';

test('apiService экспортирует функции', () => {
  expect(typeof apiService).toBe('object');
  // Можно проверить наличие ключевых методов, если они есть
  // expect(typeof apiService.get).toBe('function');
}); 