import { InterviewStage, QuestionType, AudioSettings } from '../types';

describe('candidate types (simple)', () => {
  it('экспортирует InterviewStage', () => {
    expect(InterviewStage).toBeDefined();
    expect(typeof InterviewStage).toBe('object');
  });

  it('экспортирует QuestionType', () => {
    expect(QuestionType).toBeDefined();
    expect(typeof QuestionType).toBe('object');
  });

  it('экспортирует AudioSettings', () => {
    expect(AudioSettings).toBeDefined();
    expect(typeof AudioSettings).toBe('object');
  });

  it('InterviewStage содержит правильные значения', () => {
    expect(InterviewStage.WELCOME).toBe('welcome');
    expect(InterviewStage.MICROPHONE_CHECK).toBe('microphone_check');
  });

  it('QuestionType содержит правильные значения', () => {
    expect(QuestionType.TEXT).toBe('text');
    expect(QuestionType.AUDIO).toBe('audio');
  });
});
