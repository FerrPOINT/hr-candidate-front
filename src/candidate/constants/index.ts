// Константы для кандидатов
export const INTERVIEW_STAGES = {
  WELCOME: 'welcome',
  MICROPHONE_CHECK: 'microphone_check',
  QUESTIONS: 'questions',
  COMPLETE: 'complete',
} as const;

export const QUESTION_TYPES = {
  TEXT: 'text',
  AUDIO: 'audio',
  VIDEO: 'video',
} as const;

export const AUDIO_SETTINGS = {
  DEFAULT_VOLUME: 0.8,
  DEFAULT_PLAYBACK_RATE: 1.0,
  MAX_RECORDING_TIME: 300, // 5 минут в секундах
} as const;
