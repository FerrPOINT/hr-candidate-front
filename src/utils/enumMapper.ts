// Безопасный маппер для enum'ов
// Обрабатывает случаи когда в базе данных есть значения, которых нет в enum'ах

import {
  CandidateStatusEnum,
  PositionStatusEnum,
  InterviewStatusEnum,
  InterviewResultEnum,
  QuestionTypeEnum,
  RoleEnum
} from '../api/models';

// Удалить все, что связано с SourceEnum и маппингом поля source.

// Безопасный маппер для CandidateStatusEnum
export function mapCandidateStatusEnum(value: string | null | undefined): CandidateStatusEnum {
  if (!value) return CandidateStatusEnum.NEW;

  const normalized = value.toUpperCase();

  switch (normalized) {
    case 'NEW':
      return CandidateStatusEnum.NEW;
    case 'IN_PROGRESS':
      return CandidateStatusEnum.IN_PROGRESS;
    case 'FINISHED':
      return CandidateStatusEnum.FINISHED;
    case 'REJECTED':
      return CandidateStatusEnum.REJECTED;
    case 'HIRED':
      return CandidateStatusEnum.HIRED;
    default:
      console.warn(`Unknown candidate status: "${value}", mapping to NEW`);
      return CandidateStatusEnum.NEW;
  }
}

// Безопасный маппер для PositionStatusEnum
export function mapPositionStatusEnum(value: string | null | undefined): PositionStatusEnum {
  if (!value) return PositionStatusEnum.ACTIVE;

  const normalized = value.toUpperCase();

  switch (normalized) {
    case 'ACTIVE':
      return PositionStatusEnum.ACTIVE;
    case 'PAUSED':
      return PositionStatusEnum.PAUSED;
    case 'ARCHIVED':
      return PositionStatusEnum.ARCHIVED;
    default:
      console.warn(`Unknown position status: "${value}", mapping to ACTIVE`);
      return PositionStatusEnum.ACTIVE;
  }
}

// Безопасный маппер для InterviewStatusEnum
export function mapInterviewStatusEnum(value: string | null | undefined): InterviewStatusEnum {
  if (!value) return InterviewStatusEnum.NOT_STARTED;

  const normalized = value.toUpperCase();

  switch (normalized) {
    case 'NOT_STARTED':
      return InterviewStatusEnum.NOT_STARTED;
    case 'IN_PROGRESS':
      return InterviewStatusEnum.IN_PROGRESS;
    case 'FINISHED':
      return InterviewStatusEnum.FINISHED;
    default:
      console.warn(`Unknown interview status: "${value}", mapping to NOT_STARTED`);
      return InterviewStatusEnum.NOT_STARTED;
  }
}

// Безопасный маппер для InterviewResultEnum
export function mapInterviewResultEnum(value: string | null | undefined): InterviewResultEnum | undefined {
  if (!value) return undefined;

  const normalized = value.toUpperCase();

  switch (normalized) {
    case 'SUCCESSFUL':
      return InterviewResultEnum.SUCCESSFUL;
    case 'UNSUCCESSFUL':
      return InterviewResultEnum.UNSUCCESSFUL;
    case 'ERROR':
      return InterviewResultEnum.ERROR;
    default:
      console.warn(`Unknown interview result: "${value}", returning undefined`);
      return undefined;
  }
}

// Безопасный маппер для RoleEnum
export function mapRoleEnum(value: string | null | undefined): RoleEnum {
  if (!value) return RoleEnum.VIEWER;

  const normalized = value.toUpperCase();

  switch (normalized) {
    case 'ADMIN':
      return RoleEnum.ADMIN;
    case 'RECRUITER':
      return RoleEnum.RECRUITER;
    case 'VIEWER':
      return RoleEnum.VIEWER;
    default:
      console.warn(`Unknown role: "${value}", mapping to VIEWER`);
      return RoleEnum.VIEWER;
  }
}

// Безопасный маппер для QuestionTypeEnum
export function mapQuestionTypeEnum(value: string | null | undefined): QuestionTypeEnum {
  if (!value) return QuestionTypeEnum.TEXT;

  const normalized = value.toUpperCase();

  switch (normalized) {
    case 'TEXT':
      return QuestionTypeEnum.TEXT;
    case 'AUDIO':
      return QuestionTypeEnum.AUDIO;
    case 'VIDEO':
      return QuestionTypeEnum.VIDEO;
    case 'CHOICE':
      return QuestionTypeEnum.CHOICE;
    default:
      console.warn(`Unknown question type: "${value}", mapping to TEXT`);
      return QuestionTypeEnum.TEXT;
  }
}

// Универсальный маппер для всех enum'ов
export function safeMapEnum<T extends string>(
  value: string | null | undefined,
  enumType: Record<string, T>,
  defaultValue: T,
  enumName: string
): T {
  if (!value) return defaultValue;

  // Проверяем, есть ли значение в enum
  const enumValues = Object.values(enumType);
  if (enumValues.includes(value as T)) {
    return value as T;
  }

  // Если нет, логируем и возвращаем дефолт
  console.warn(`Unknown ${enumName} value: "${value}", using default: "${defaultValue}"`);
  return defaultValue;
} 