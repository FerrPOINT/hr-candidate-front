/* tslint:disable */
/* eslint-disable */
/**
 * Combined models export (Candidates-only)
 * Рефактор под доступный домен: кандидаты. Экспортируем то, что есть в генерируемых моделях,
 * а недостающие enum'ы определяем локально для совместимости типизации.
 */

// Не экспортируем локальные enum'ы — используем только то, что есть в сгенерированных моделях

// Доступные из кандидатов модели/типы
export { CandidateStatusEnum } from '../../generated-src/client/models/candidate-status-enum';

// Основные типы интервью
export type { Interview } from '../../generated-src/client/models/interview';

export type { 
  CandidateLoginRequest 
} from '../../generated-src/client/models/candidate-login-request';
export type { 
  CandidateLoginResponse 
} from '../../generated-src/client/models/candidate-login-response';
export type { 
  CandidateEmailVerificationRequest 
} from '../../generated-src/client/models/candidate-email-verification-request';
export type { 
  CandidateEmailVerificationResponse 
} from '../../generated-src/client/models/candidate-email-verification-response';

// Публичные данные вакансии для кандидата
export type { PositionSummaryResponse as PositionSummary } from '../../generated-src/client/models/position-summary-response';

// Интервью (кандидатский флоу)
export type { InterviewStartResponse } from '../../generated-src/client/models/interview-start-response';
export type { InterviewEndResponse } from '../../generated-src/client/models/interview-end-response';
export type { InterviewQuestionResponse } from '../../generated-src/client/models/interview-question-response';

// Доп. вопросы/сообщения, аудио-тест, отправка ответа
export type { AdditionalQuestionsResponseInner as AdditionalQuestion } from '../../generated-src/client/models/additional-questions-response-inner';
export type { CompletionResponse } from '../../generated-src/client/models/completion-response';
export type { WelcomeMessagesResponse } from '../../generated-src/client/models/welcome-messages-response';
export type { MicrophoneTestResponse } from '../../generated-src/client/models/microphone-test-response';
export type { SubmitAnswerResponse } from '../../generated-src/client/models/submit-answer-response';
export type { PaginatedResponse } from '../../generated-src/client/models/paginated-response';