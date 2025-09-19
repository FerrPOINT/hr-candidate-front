export const INTERVIEW_STAGES = {
  WELCOME: 'welcome',
  MICROPHONE_CHECK: 'microphone_check',
  INSTRUCTIONS: 'instructions',
  INTERVIEW: 'interview',
  COMPLETE: 'complete',
} as const;

export const QUESTION_TYPES = {
  TEXT: 'text',
  AUDIO: 'audio',
} as const;

export const AUDIO_SETTINGS = {
  DEFAULT_VOLUME: 0.8,
  DEFAULT_PLAYBACK_RATE: 1.0,
  MAX_RECORDING_TIME_SECONDS: 120,
} as const;

export type InterviewStage = typeof INTERVIEW_STAGES[keyof typeof INTERVIEW_STAGES];
export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES];
export type AudioSettingsType = typeof AUDIO_SETTINGS;