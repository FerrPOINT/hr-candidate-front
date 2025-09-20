import { Logger } from '../logger';

describe('logger', () => {
  let logger: Logger;
  const consoleSpy = {
    trace: jest.spyOn(console, 'trace').mockImplementation(() => {}),
    warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
    error: jest.spyOn(console, 'error').mockImplementation(() => {}),
    info: jest.spyOn(console, 'info').mockImplementation(() => {}),
    debug: jest.spyOn(console, 'debug').mockImplementation(() => {}),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Устанавливаем NODE_ENV в development для тестов
    process.env.NODE_ENV = 'development';
    // Создаем новый экземпляр logger для каждого теста
    logger = new Logger();
    // Устанавливаем уровень TRACE для тестов
    (logger as any).level = 0; // LogLevel.TRACE
  });

  it('инициализируется без ошибок', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.trace).toBe('function');
    expect(typeof logger.fatal).toBe('function');
  });

  it('логирует info сообщения с правильным форматом', () => {
    logger.info('Test info message');
    expect(consoleSpy.info).toHaveBeenCalledTimes(1);
    const call = consoleSpy.info.mock.calls[0][0];
    expect(call).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] INFO \| Test info message$/);
  });

  it('логирует warn сообщения с правильным форматом', () => {
    logger.warn('Test warn message');
    expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
    const call = consoleSpy.warn.mock.calls[0][0];
    expect(call).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] WARN \| Test warn message$/);
  });

  it('логирует error сообщения с правильным форматом', () => {
    logger.error('Test error message');
    expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    const call = consoleSpy.error.mock.calls[0][0];
    expect(call).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] ERROR \| Test error message$/);
  });

  it('логирует debug сообщения с правильным форматом', () => {
    logger.debug('Test debug message');
    expect(consoleSpy.debug).toHaveBeenCalledTimes(1);
    const call = consoleSpy.debug.mock.calls[0][0];
    expect(call).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] DEBUG \| Test debug message$/);
  });

  it('логирует trace сообщения с правильным форматом', () => {
    logger.trace('Test trace message');
    expect(consoleSpy.trace).toHaveBeenCalledTimes(1);
    const call = consoleSpy.trace.mock.calls[0][0];
    expect(call).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] TRACE \| Test trace message$/);
  });

  it('логирует сообщения с контекстом', () => {
    const context = { userId: '123', action: 'login' };
    logger.info('User action', context);
    expect(consoleSpy.info).toHaveBeenCalledTimes(1);
    const call = consoleSpy.info.mock.calls[0][0];
    expect(call).toContain('User action');
    expect(call).toContain(JSON.stringify(context));
  });

  it('логирует ошибки с stack trace', () => {
    const error = new Error('Test error');
    logger.error('Error occurred', error);
    expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    const call = consoleSpy.error.mock.calls[0][0];
    expect(call).toContain('Error occurred');
    expect(call).toContain('stack');
  });

  it('логирует fatal ошибки', () => {
    const error = new Error('Fatal error');
    logger.fatal('Fatal error occurred', error);
    expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    const call = consoleSpy.error.mock.calls[0][0];
    expect(call).toContain('FATAL');
    expect(call).toContain('Fatal error occurred');
  });

  it('логирует интервью события', () => {
    logger.interviewEvent('started', 'interview-123');
    expect(consoleSpy.info).toHaveBeenCalledTimes(1);
    const call = consoleSpy.info.mock.calls[0][0];
    expect(call).toContain('Interview: started');
    expect(call).toContain('interview-123');
  });

  it('логирует API вызовы', () => {
    logger.apiCall('/api/candidates', 'GET');
    expect(consoleSpy.debug).toHaveBeenCalledTimes(1);
    const call = consoleSpy.debug.mock.calls[0][0];
    expect(call).toContain('API: GET /api/candidates');
  });

  it('логирует действия пользователя', () => {
    logger.userAction('login', 'user-456');
    expect(consoleSpy.info).toHaveBeenCalledTimes(1);
    const call = consoleSpy.info.mock.calls[0][0];
    expect(call).toContain('User: login');
    expect(call).toContain('user-456');
  });
});