import { voiceInterviewService } from '../voiceInterviewService';

describe('voiceInterviewService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInterviewInfo', () => {
    it('выбрасывает ошибку о неподдержке в текущей сборке', async () => {
      await expect(voiceInterviewService.getInterviewInfo('1')).rejects.toThrow('Not supported in this build');
    });
  });

  describe('startVoiceInterview', () => {
    it('выбрасывает ошибку о неподдержке в текущей сборке', async () => {
      await expect(voiceInterviewService.startVoiceInterview('1')).rejects.toThrow('Not supported in this build');
    });
  });

  describe('getNextQuestion', () => {
    it('выбрасывает ошибку о неподдержке в текущей сборке', async () => {
      await expect(voiceInterviewService.getNextQuestion('1')).rejects.toThrow('Not supported in this build');
    });
  });

  describe('getQuestionAudio', () => {
    it('выбрасывает ошибку о неподдержке в текущей сборке', async () => {
      await expect(voiceInterviewService.getQuestionAudio('1', 'q1')).rejects.toThrow('Not supported in this build');
    });
  });

  describe('submitAnswer', () => {
    it('выбрасывает ошибку о неподдержке в текущей сборке', async () => {
      const mockAnswer = {
        questionId: 'q1',
        audioBlob: new Blob(['audio data'], { type: 'audio/webm' }),
        duration: 30
      };

      await expect(voiceInterviewService.submitAnswer('1', mockAnswer)).rejects.toThrow('Not supported in this build');
    });
  });

  describe('endVoiceInterview', () => {
    it('выбрасывает ошибку о неподдержке в текущей сборке', async () => {
      await expect(voiceInterviewService.endVoiceInterview('1')).rejects.toThrow('Not supported in this build');
    });
  });

  describe('getInterviewAnswers', () => {
    it('выбрасывает ошибку о неподдержке в текущей сборке', async () => {
      await expect(voiceInterviewService.getInterviewAnswers('1')).rejects.toThrow('Not supported in this build');
    });
  });

  describe('getAnswerAudio', () => {
    it('выбрасывает ошибку о неподдержке в текущей сборке', async () => {
      await expect(voiceInterviewService.getAnswerAudio('1', 'q1')).rejects.toThrow('Not supported in this build');
    });
  });

  describe('checkVoiceQuestionsStatus', () => {
    it('выбрасывает ошибку о неподдержке в текущей сборке', async () => {
      await expect(voiceInterviewService.checkVoiceQuestionsStatus('1')).rejects.toThrow('Not supported in this build');
    });
  });
});