import { formatInterviewTime, getInterviewStatus, calculateProgress } from '../interview';

describe('interview utils (simple)', () => {
  it('экспортирует formatInterviewTime', () => {
    expect(formatInterviewTime).toBeDefined();
    expect(typeof formatInterviewTime).toBe('function');
  });

  it('экспортирует getInterviewStatus', () => {
    expect(getInterviewStatus).toBeDefined();
    expect(typeof getInterviewStatus).toBe('function');
  });

  it('экспортирует calculateProgress', () => {
    expect(calculateProgress).toBeDefined();
    expect(typeof calculateProgress).toBe('function');
  });

  it('formatInterviewTime форматирует время', () => {
    expect(formatInterviewTime(0)).toBe('00:00');
    expect(formatInterviewTime(60)).toBe('01:00');
  });

  it('calculateProgress вычисляет прогресс', () => {
    expect(calculateProgress(5, 10)).toBe(50);
    expect(calculateProgress(0, 10)).toBe(0);
    expect(calculateProgress(10, 10)).toBe(100);
  });
});
