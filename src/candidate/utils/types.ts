export const InterviewStage = {
  WELCOME: 'welcome',
  MICROPHONE_CHECK: 'microphone_check',
  INSTRUCTIONS: 'instructions',
  INTERVIEW: 'interview',
  COMPLETE: 'complete',
} as const;

export const QuestionType = {
  TEXT: 'text',
  AUDIO: 'audio',
} as const;

export const AudioSettings = {
  DEFAULT_VOLUME: 0.8,
  DEFAULT_PLAYBACK_RATE: 1.0,
  MAX_RECORDING_TIME: 120,
} as const;

export type InterviewStageType = typeof InterviewStage[keyof typeof InterviewStage];
export type QuestionTypeType = typeof QuestionType[keyof typeof QuestionType];
export type AudioSettingsType = typeof AudioSettings;