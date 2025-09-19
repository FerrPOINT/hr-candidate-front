// Константы приложения
export const API_ENDPOINTS = {
  CANDIDATES: '/api/candidates',
  INTERVIEWS: '/api/interviews',
  AUTH: '/api/auth',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети',
  VALIDATION_ERROR: 'Ошибка валидации',
  AUTH_ERROR: 'Ошибка авторизации',
  UNKNOWN_ERROR: 'Неизвестная ошибка',
} as const;
