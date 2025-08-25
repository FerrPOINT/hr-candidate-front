/**
 * Профессиональный структурированный логгер
 * Заменяет console.log для продакшена
 */

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5
}

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  interviewId?: string;
  correlationId?: string;
  [key: string]: unknown;
}

class Logger {
  private level: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.level = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}${contextStr} | ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  trace(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.TRACE)) {
      console.trace(this.formatMessage('TRACE', message, context));
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, context));
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorContext = error ? { ...context, stack: error.stack } : context;
      console.error(this.formatMessage('ERROR', message, errorContext));
    }
  }

  fatal(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog(LogLevel.FATAL)) {
      const errorContext = error ? { ...context, stack: error.stack } : context;
      console.error(this.formatMessage('FATAL', message, errorContext));
    }
  }

  // Специальные методы для бизнес-логики
  interviewEvent(action: string, interviewId: string, context?: Omit<LogContext, 'action' | 'interviewId'>): void {
    this.info(`Interview: ${action}`, { action, interviewId, ...context });
  }

  apiCall(endpoint: string, method: string, context?: Omit<LogContext, 'action'>): void {
    this.debug(`API: ${method} ${endpoint}`, { action: 'api_call', endpoint, method, ...context });
  }

  userAction(action: string, userId: string, context?: Omit<LogContext, 'action' | 'userId'>): void {
    this.info(`User: ${action}`, { action, userId, ...context });
  }
}

export const logger = new Logger();
export default logger; 