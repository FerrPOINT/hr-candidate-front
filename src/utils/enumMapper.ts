// Безопасный маппер для enum'ов
// Обрабатывает случаи когда в базе данных есть значения, которых нет в enum'ах

// Определяем enum для статуса кандидата
export enum CandidateStatusEnum {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  REJECTED = 'REJECTED',
  HIRED = 'HIRED',
}

// Удалить все, что связано с SourceEnum и маппингом поля source.

// Безопасный маппер для CandidateStatusEnum
export function mapCandidateStatusEnum(value: string | null | undefined): CandidateStatusEnum {
  if (!value) return CandidateStatusEnum.NEW;

  const normalized = value.trim().toUpperCase();

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