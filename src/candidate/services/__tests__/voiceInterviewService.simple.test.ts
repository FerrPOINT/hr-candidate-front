import { voiceInterviewService } from '../voiceInterviewService';

// Простые тесты для voiceInterviewService
describe('voiceInterviewService (simple)', () => {
  it('экспортирует voiceInterviewService', () => {
    expect(voiceInterviewService).toBeDefined();
  });

  it('имеет правильную структуру', () => {
    expect(typeof voiceInterviewService).toBe('object');
    expect(voiceInterviewService).toHaveProperty('startVoiceInterview');
    expect(voiceInterviewService).toHaveProperty('getNextQuestion');
    expect(voiceInterviewService).toHaveProperty('submitAnswer');
  });

  it('startVoiceInterview является функцией', () => {
    expect(typeof voiceInterviewService.startVoiceInterview).toBe('function');
  });

  it('getNextQuestion является функцией', () => {
    expect(typeof voiceInterviewService.getNextQuestion).toBe('function');
  });

  it('submitAnswer является функцией', () => {
    expect(typeof voiceInterviewService.submitAnswer).toBe('function');
  });
});

