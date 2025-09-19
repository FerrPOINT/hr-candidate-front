import { INTERVIEW_STAGES, QUESTION_TYPES, AUDIO_SETTINGS } from '../constants';

describe('candidate constants (simple)', () => {
  it('экспортирует INTERVIEW_STAGES', () => {
    expect(INTERVIEW_STAGES).toBeDefined();
    expect(typeof INTERVIEW_STAGES).toBe('object');
  });

  it('экспортирует QUESTION_TYPES', () => {
    expect(QUESTION_TYPES).toBeDefined();
    expect(typeof QUESTION_TYPES).toBe('object');
  });

  it('экспортирует AUDIO_SETTINGS', () => {
    expect(AUDIO_SETTINGS).toBeDefined();
    expect(typeof AUDIO_SETTINGS).toBe('object');
  });
});
