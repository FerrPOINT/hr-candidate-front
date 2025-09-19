import { adminApiService } from '../adminApiService';

describe('adminApiService', () => {
  it('экспортирует adminApiService как пустой объект', () => {
    expect(adminApiService).toBeDefined();
    expect(typeof adminApiService).toBe('object');
  });

  it('не содержит методов в этом билде', () => {
    // В этом билде admin API недоступен, поэтому объект пустой
    expect(Object.keys(adminApiService).length).toBe(0);
  });

  it('является объектом', () => {
    // Проверяем, что это объект
    expect(typeof adminApiService).toBe('object');
  });
});