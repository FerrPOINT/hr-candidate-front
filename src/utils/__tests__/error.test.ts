import { extractApiErrorMessage, normalizeApiError, NormalizedApiError } from '../error';

describe('error utilities', () => {
  describe('extractApiErrorMessage', () => {
    it('извлекает сообщение из axios error response', () => {
      const error = {
        response: {
          data: {
            message: 'Validation failed'
          }
        }
      };
      expect(extractApiErrorMessage(error)).toBe('Validation failed');
    });

    it('извлекает сообщение из вложенной структуры error', () => {
      const error = {
        response: {
          data: {
            error: {
              message: 'Database connection failed'
            }
          }
        }
      };
      expect(extractApiErrorMessage(error)).toBe('Database connection failed');
    });

    it('извлекает сообщение из поля detail', () => {
      const error = {
        response: {
          data: {
            detail: 'Invalid credentials'
          }
        }
      };
      expect(extractApiErrorMessage(error)).toBe('Invalid credentials');
    });

    it('извлекает сообщение из поля title', () => {
      const error = {
        response: {
          data: {
            title: 'Bad Request',
            status: 400
          }
        }
      };
      expect(extractApiErrorMessage(error)).toBe('Bad Request');
    });

    it('извлекает сообщение из массива errors', () => {
      const error = {
        response: {
          data: {
            errors: [
              { message: 'First error' },
              { message: 'Second error' }
            ]
          }
        }
      };
      expect(extractApiErrorMessage(error)).toBe('First error');
    });

    it('извлекает сообщение из массива строк errors', () => {
      const error = {
        response: {
          data: {
            errors: ['String error message']
          }
        }
      };
      expect(extractApiErrorMessage(error)).toBe('String error message');
    });

    it('извлекает сообщение из поля error как строки', () => {
      const error = {
        response: {
          data: {
            error: 'Simple error string'
          }
        }
      };
      expect(extractApiErrorMessage(error)).toBe('Simple error string');
    });

    it('использует message из ошибки если нет response', () => {
      const error = {
        message: 'Network timeout'
      };
      expect(extractApiErrorMessage(error)).toBe('Network timeout');
    });

    it('возвращает fallback сообщение для неизвестной ошибки', () => {
      const error = {};
      expect(extractApiErrorMessage(error)).toBe('Произошла ошибка при обращении к API');
    });

    it('обрабатывает строковые данные ответа', () => {
      const error = {
        response: {
          data: 'Server error occurred'
        }
      };
      expect(extractApiErrorMessage(error)).toBe('Server error occurred');
    });

    it('обрабатывает null и undefined', () => {
      expect(extractApiErrorMessage(null)).toBe('Произошла ошибка при обращении к API');
      expect(extractApiErrorMessage(undefined)).toBe('Произошла ошибка при обращении к API');
    });
  });

  describe('normalizeApiError', () => {
    it('нормализует ошибку с полной информацией', () => {
      const error = {
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR'
          }
        }
      };

      const normalized = normalizeApiError(error);
      expect(normalized).toEqual({
        message: 'Validation failed',
        status: 400,
        code: 'VALIDATION_ERROR'
      });
    });

    it('нормализует ошибку без статуса', () => {
      const error = {
        message: 'Network error'
      };

      const normalized = normalizeApiError(error);
      expect(normalized).toEqual({
        message: 'Network error',
        status: undefined,
        code: undefined
      });
    });

    it('нормализует ошибку с кодом из error объекта', () => {
      const error = {
        code: 'ECONNABORTED',
        message: 'Request timeout'
      };

      const normalized = normalizeApiError(error);
      expect(normalized).toEqual({
        message: 'Request timeout',
        status: undefined,
        code: 'ECONNABORTED'
      });
    });
  });

  describe('NormalizedApiError interface', () => {
    it('имеет правильную структуру', () => {
      const error: NormalizedApiError = {
        message: 'Test error',
        status: 500,
        code: 'SERVER_ERROR'
      };

      expect(error.message).toBe('Test error');
      expect(error.status).toBe(500);
      expect(error.code).toBe('SERVER_ERROR');
    });

    it('позволяет опциональные поля', () => {
      const error: NormalizedApiError = {
        message: 'Test error'
      };

      expect(error.message).toBe('Test error');
      expect(error.status).toBeUndefined();
      expect(error.code).toBeUndefined();
    });
  });
});