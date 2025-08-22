/* tslint:disable */
/* eslint-disable */
/**
 * Combined models export
 * Manual file that exports all OpenAPI generated models
 * This file is manually maintained and NOT auto-generated
 */

// Explicit enums (runtime values)
export { RoleEnum } from '../../generated-src/client/models/role-enum';
export { PositionStatusEnum } from '../../generated-src/client/models/position-status-enum';
export { PositionLevelEnum } from '../../generated-src/client/models/position-level-enum';
export { QuestionTypeEnum } from '../../generated-src/client/models/question-type-enum';
export { InterviewStatusEnum } from '../../generated-src/client/models/interview-status-enum';
export { InterviewResultEnum } from '../../generated-src/client/models/interview-result-enum';
export { CandidateStatusEnum } from '../../generated-src/client/models/candidate-status-enum';

// Frequently used model interfaces
export type { User } from '../../generated-src/client/models/user';
export type { Branding } from '../../generated-src/client/models/branding';
export type { BrandingUpdateRequest } from '../../generated-src/client/models/branding-update-request';
export type { LoginRequest } from '../../generated-src/client/models/login-request';

export type { Position } from '../../generated-src/client/models/position';
export type { PositionCreateRequest } from '../../generated-src/client/models/position-create-request';
export type { PositionUpdateRequest } from '../../generated-src/client/models/position-update-request';
export type { PositionStats } from '../../generated-src/client/models/position-stats';
export type { PositionStatsByLevel } from '../../generated-src/client/models/position-stats-by-level';
export type { PositionQuestionsResponse } from '../../generated-src/client/models/position-questions-response';
export type { PositionQuestionsResponseInterviewSettings } from '../../generated-src/client/models/position-questions-response-interview-settings';

export type { Candidate } from '../../generated-src/client/models/candidate';
export type { CandidateCreateRequest } from '../../generated-src/client/models/candidate-create-request';
export type { CandidateUpdateRequest } from '../../generated-src/client/models/candidate-update-request';
export type { CandidatesPaginatedResponse } from '../../generated-src/client/models/candidates-paginated-response';
export type { CandidateLoginRequest } from '../../generated-src/client/models/candidate-login-request';
export type { CandidateLoginResponse } from '../../generated-src/client/models/candidate-login-response';
export type { CandidateEmailVerificationRequest } from '../../generated-src/client/models/candidate-email-verification-request';
export type { CandidateEmailVerificationResponse } from '../../generated-src/client/models/candidate-email-verification-response';

// Widened Interview type to include optional legacy fields used in UI
export type Interview = import('../../generated-src/client/models/interview').Interview & {
	result?: string;
	startedAt?: string;
};
export type { InterviewsPaginatedResponse } from '../../generated-src/client/models/interviews-paginated-response';
export type { InterviewStartRequest } from '../../generated-src/client/models/interview-start-request';
export type { InterviewStartResponse } from '../../generated-src/client/models/interview-start-response';
export type { InterviewAnswer } from '../../generated-src/client/models/interview-answer';

export type { Question } from '../../generated-src/client/models/question';
export type { QuestionCreateRequest } from '../../generated-src/client/models/question-create-request';
export type { QuestionUpdateRequest } from '../../generated-src/client/models/question-update-request';
export type { QuestionsPaginatedResponse } from '../../generated-src/client/models/questions-paginated-response';

export type { PaginatedResponse } from '../../generated-src/client/models/paginated-response';
export type { MonthlyReport } from '../../generated-src/client/models/monthly-report';
export type { GetPositionPublicLink200Response } from '../../generated-src/client/models/get-position-public-link200-response';

export type { PositionDataGenerationRequest } from '../../generated-src/client/models/position-data-generation-request';
export type { PositionDataGenerationResponse } from '../../generated-src/client/models/position-data-generation-response';

export type { TranscribeAudio200Response } from '../../generated-src/client/models/transcribe-audio200-response';
export type { TranscribeAnswerWithAI200Response } from '../../generated-src/client/models/transcribe-answer-with-ai200-response';
export type { BaseQuestionFields } from '../../generated-src/client/models/base-question-fields';
export type { AuthResponse } from '../../generated-src/client/models/auth-response';
export type { AgentConfig } from '../../generated-src/client/models/agent-config'; 