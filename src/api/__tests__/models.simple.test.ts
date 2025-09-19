import { Candidate, Interview, Question, Answer } from '../models';

describe('API Models (simple)', () => {
  it('экспортирует Candidate', () => {
    expect(Candidate).toBeDefined();
    expect(typeof Candidate).toBe('function');
  });

  it('экспортирует Interview', () => {
    expect(Interview).toBeDefined();
    expect(typeof Interview).toBe('function');
  });

  it('экспортирует Question', () => {
    expect(Question).toBeDefined();
    expect(typeof Question).toBe('function');
  });

  it('экспортирует Answer', () => {
    expect(Answer).toBeDefined();
    expect(typeof Answer).toBe('function');
  });

  it('создает экземпляр Candidate', () => {
    const candidate = new Candidate();
    expect(candidate).toBeInstanceOf(Candidate);
  });

  it('создает экземпляр Interview', () => {
    const interview = new Interview();
    expect(interview).toBeInstanceOf(Interview);
  });

  it('создает экземпляр Question', () => {
    const question = new Question();
    expect(question).toBeInstanceOf(Question);
  });

  it('создает экземпляр Answer', () => {
    const answer = new Answer();
    expect(answer).toBeInstanceOf(Answer);
  });
});
