/**
 * Константы для статичных данных вакансии
 */

export const DEFAULT_POSITION = {
  department: 'Engineering',
  company: 'WMT group',
  type: 'Full-time'
} as const;

export type DefaultPosition = typeof DEFAULT_POSITION; 