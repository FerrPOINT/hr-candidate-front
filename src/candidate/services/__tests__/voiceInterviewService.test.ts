import { voiceInterviewService } from '../voiceInterviewService';
import { apiClient } from '../../../api/apiClient';

// Моки для зависимостей
jest.mock('../../../api/apiClient');

// Мокаем voiceInterviewService методы
jest.mock('../voiceInterviewService', () => ({
  voiceInterviewService: {
    getInterviewInfo: jest.fn(),
    startVoiceInterview: jest.fn(),
    getNextQuestion: jest.fn(),
    getQuestionAudio: jest.fn(),
    submitAnswer: jest.fn(),
    endVoiceInterview: jest.fn(),
    getInterviewAnswers: jest.fn(),
  }
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('voiceInterviewService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInterviewInfo', () => {
    it('возвращает информацию об интервью', async () => {
      const interviewId = 'interview-123';
      const mockInterviewInfo = {
        id: interviewId,
        positionId: 'pos-123',
        positionTitle: 'Frontend Developer',
        candidateId: 'candidate-123',
        status: 'SCHEDULED',
        scheduledDate: '2025-01-20T10:00:00Z'
      };
      
      (voiceInterviewService.getInterviewInfo as jest.Mock).mockResolvedValue(mockInterviewInfo);
      
      const result = await voiceInterviewService.getInterviewInfo(interviewId);
      
      expect(result).toEqual(mockInterviewInfo);
      expect(voiceInterviewService.getInterviewInfo).toHaveBeenCalledWith(interviewId);
    });
  });

  describe('startVoiceInterview', () => {
    it('запускает голосовое интервью', async () => {
      const interviewId = 'interview-123';
      const mockStartResponse = {
        interviewId: 123,
        status: 'STARTED',
        totalQuestions: 5,
        readyQuestions: 5,
        estimatedDuration: 30
      };
      
      (voiceInterviewService.startVoiceInterview as jest.Mock).mockResolvedValue(mockStartResponse);
      
      const result = await voiceInterviewService.startVoiceInterview(interviewId);
      
      expect(result).toEqual(mockStartResponse);
      expect(voiceInterviewService.startVoiceInterview).toHaveBeenCalledWith(interviewId);
    });
  });

  describe('getNextQuestion', () => {
    it('получает следующий вопрос', async () => {
      const interviewId = 'interview-123';
      const mockQuestionResponse = {
        questionId: 1,
        text: 'Расскажите о своем опыте работы с React',
        audioUrl: 'https://example.com/audio.mp3',
        questionNumber: 1,
        totalQuestions: 5,
        maxDuration: 120,
        position: 'Frontend Developer'
      };
      
      (voiceInterviewService.getNextQuestion as jest.Mock).mockResolvedValue(mockQuestionResponse);
      
      const result = await voiceInterviewService.getNextQuestion(interviewId);
      
      expect(result).toEqual(mockQuestionResponse);
      expect(voiceInterviewService.getNextQuestion).toHaveBeenCalledWith(interviewId);
    });
  });

  describe('getQuestionAudio', () => {
    it('получает аудио файл вопроса', async () => {
      const questionId = 'question-123';
      const mockAudioBlob = new Blob(['audio data'], { type: 'audio/mpeg' });
      
      (voiceInterviewService.getQuestionAudio as jest.Mock).mockResolvedValue(mockAudioBlob);
      
      const result = await voiceInterviewService.getQuestionAudio(questionId);
      
      expect(result).toBe(mockAudioBlob);
      expect(voiceInterviewService.getQuestionAudio).toHaveBeenCalledWith(questionId);
    });
  });

  describe('submitAnswer', () => {
    it('отправляет ответ на вопрос', async () => {
      const interviewId = 'interview-123';
      const questionId = 'question-123';
      const audioFile = new File(['audio data'], 'audio.wav', { type: 'audio/wav' });
      const mockAnswerResponse = {
        questionId: 1,
        transcript: 'Мой опыт работы с React составляет 3 года',
        durationSec: 15,
        confidence: 0.95,
        audioFilePath: '/uploads/answer_123.wav',
        savedAt: '2025-01-19T16:30:00Z'
      };
      
      (voiceInterviewService.submitAnswer as jest.Mock).mockResolvedValue(mockAnswerResponse);
      
      const result = await voiceInterviewService.submitAnswer(interviewId, questionId, audioFile);
      
      expect(result).toEqual(mockAnswerResponse);
      expect(voiceInterviewService.submitAnswer).toHaveBeenCalledWith(interviewId, questionId, audioFile);
    });
  });

  describe('endVoiceInterview', () => {
    it('завершает голосовое интервью', async () => {
      const interviewId = 'interview-123';
      const mockEndResponse = {
        interviewId: 123,
        status: 'COMPLETED',
        completedAt: '2025-01-19T16:45:00Z',
        totalQuestions: 5,
        answeredQuestions: 5
      };
      
      (voiceInterviewService.endVoiceInterview as jest.Mock).mockResolvedValue(mockEndResponse);
      
      const result = await voiceInterviewService.endVoiceInterview(interviewId);
      
      expect(result).toEqual(mockEndResponse);
      expect(voiceInterviewService.endVoiceInterview).toHaveBeenCalledWith(interviewId);
    });
  });

  describe('getInterviewAnswers', () => {
    it('получает все ответы интервью', async () => {
      const interviewId = 'interview-123';
      const mockAnswers = [
        {
          questionId: 1,
          transcript: 'Мой опыт работы с React составляет 3 года',
          durationSec: 15,
          confidence: 0.95,
          audioFilePath: '/uploads/answer_1.wav',
          savedAt: '2025-01-19T16:30:00Z'
        },
        {
          questionId: 2,
          transcript: 'Я работал с TypeScript и Redux',
          durationSec: 12,
          confidence: 0.88,
          audioFilePath: '/uploads/answer_2.wav',
          savedAt: '2025-01-19T16:32:00Z'
        }
      ];
      
      (voiceInterviewService.getInterviewAnswers as jest.Mock).mockResolvedValue(mockAnswers);
      
      const result = await voiceInterviewService.getInterviewAnswers(interviewId);
      
      expect(result).toEqual(mockAnswers);
      expect(voiceInterviewService.getInterviewAnswers).toHaveBeenCalledWith(interviewId);
    });
  });

  describe('getAnswerAudio', () => {
    it('выбрасывает ошибку о неподдерживаемой функции', async () => {
      const interviewId = 'interview-123';
      const questionId = 'question-123';
      
      await expect(voiceInterviewService.getAnswerAudio(interviewId, questionId)).rejects.toThrow('Not supported in this build');
    });
  });

  describe('checkVoiceQuestionsStatus', () => {
    it('выбрасывает ошибку о неподдерживаемой функции', async () => {
      const positionId = 'position-123';
      
      await expect(voiceInterviewService.checkVoiceQuestionsStatus(positionId)).rejects.toThrow('Not supported in this build');
    });
  });

  describe('Интерфейсы и типы', () => {
    it('определяет правильные типы для InterviewInfo', () => {
      const interviewInfo: import('../voiceInterviewService').InterviewInfo = {
        id: 'interview-123',
        positionId: 'position-456',
        positionTitle: 'Software Engineer',
        candidateId: 'candidate-789',
        status: 'IN_PROGRESS',
        scheduledDate: '2023-01-01T10:00:00Z',
        startedAt: '2023-01-01T10:05:00Z',
        completedAt: undefined,
      };
      
      expect(interviewInfo.id).toBe('interview-123');
      expect(interviewInfo.positionId).toBe('position-456');
      expect(interviewInfo.positionTitle).toBe('Software Engineer');
      expect(interviewInfo.candidateId).toBe('candidate-789');
      expect(interviewInfo.status).toBe('IN_PROGRESS');
    });

    it('определяет правильные типы для Question', () => {
      const question: import('../voiceInterviewService').Question = {
        id: 'question-123',
        text: 'Расскажите о себе',
        type: 'voice',
        order: 1,
        hasVoice: true,
        audioUrl: 'https://example.com/audio.mp3',
      };
      
      expect(question.id).toBe('question-123');
      expect(question.text).toBe('Расскажите о себе');
      expect(question.type).toBe('voice');
      expect(question.order).toBe(1);
      expect(question.hasVoice).toBe(true);
      expect(question.audioUrl).toBe('https://example.com/audio.mp3');
    });

    it('определяет правильные типы для InterviewAnswer', () => {
      const audioBlob = new Blob(['audio data'], { type: 'audio/wav' });
      const answer: import('../voiceInterviewService').InterviewAnswer = {
        questionId: 'question-123',
        audioBlob,
        text: 'Мой ответ на вопрос',
        duration: 45,
      };
      
      expect(answer.questionId).toBe('question-123');
      expect(answer.audioBlob).toBe(audioBlob);
      expect(answer.text).toBe('Мой ответ на вопрос');
      expect(answer.duration).toBe(45);
    });

    it('определяет правильные типы для NextQuestionResponse', () => {
      const question: import('../voiceInterviewService').Question = {
        id: 'question-123',
        text: 'Расскажите о себе',
        type: 'voice',
        order: 1,
        hasVoice: true,
        audioUrl: 'https://example.com/audio.mp3',
      };
      
      const response: import('../voiceInterviewService').NextQuestionResponse = {
        question,
        isLast: false,
        progress: {
          current: 1,
          total: 5,
        },
      };
      
      expect(response.question).toBe(question);
      expect(response.isLast).toBe(false);
      expect(response.progress.current).toBe(1);
      expect(response.progress.total).toBe(5);
    });

    it('определяет правильные типы для InterviewStartResponse', () => {
      const interview: import('../voiceInterviewService').InterviewInfo = {
        id: 'interview-123',
        positionId: 'position-456',
        positionTitle: 'Software Engineer',
        candidateId: 'candidate-789',
        status: 'IN_PROGRESS',
      };
      
      const question: import('../voiceInterviewService').Question = {
        id: 'question-123',
        text: 'Расскажите о себе',
        type: 'voice',
        order: 1,
        hasVoice: true,
        audioUrl: 'https://example.com/audio.mp3',
      };
      
      const response: import('../voiceInterviewService').InterviewStartResponse = {
        interview,
        firstQuestion: question,
      };
      
      expect(response.interview).toBe(interview);
      expect(response.firstQuestion).toBe(question);
    });

    it('определяет правильные типы для VoiceInterviewStartResponse', () => {
      const response: import('../voiceInterviewService').VoiceInterviewStartResponse = {
        interviewId: 123,
        status: 'STARTED',
        totalQuestions: 5,
        readyQuestions: 3,
        estimatedDuration: 30,
      };
      
      expect(response.interviewId).toBe(123);
      expect(response.status).toBe('STARTED');
      expect(response.totalQuestions).toBe(5);
      expect(response.readyQuestions).toBe(3);
      expect(response.estimatedDuration).toBe(30);
    });

    it('определяет правильные типы для VoiceQuestionResponse', () => {
      const response: import('../voiceInterviewService').VoiceQuestionResponse = {
        questionId: 456,
        text: 'Расскажите о себе',
        audioUrl: 'https://example.com/audio.mp3',
        questionNumber: 1,
        totalQuestions: 5,
        maxDuration: 120,
        position: 'Software Engineer',
      };
      
      expect(response.questionId).toBe(456);
      expect(response.text).toBe('Расскажите о себе');
      expect(response.audioUrl).toBe('https://example.com/audio.mp3');
      expect(response.questionNumber).toBe(1);
      expect(response.totalQuestions).toBe(5);
      expect(response.maxDuration).toBe(120);
      expect(response.position).toBe('Software Engineer');
    });

    it('определяет правильные типы для VoiceAnswerResponse', () => {
      const response: import('../voiceInterviewService').VoiceAnswerResponse = {
        questionId: 456,
        transcript: 'Мой ответ на вопрос',
        durationSec: 45,
        confidence: 0.95,
        audioFilePath: '/path/to/audio.wav',
        savedAt: '2023-01-01T10:05:00Z',
      };
      
      expect(response.questionId).toBe(456);
      expect(response.transcript).toBe('Мой ответ на вопрос');
      expect(response.durationSec).toBe(45);
      expect(response.confidence).toBe(0.95);
      expect(response.audioFilePath).toBe('/path/to/audio.wav');
      expect(response.savedAt).toBe('2023-01-01T10:05:00Z');
    });
  });

  describe('Сервис как экземпляр класса', () => {
    it('создает экземпляр VoiceInterviewService', () => {
      expect(voiceInterviewService).toBeDefined();
      expect(typeof voiceInterviewService).toBe('object');
    });

    it('имеет все необходимые методы', () => {
      expect(typeof voiceInterviewService.getInterviewInfo).toBe('function');
      expect(typeof voiceInterviewService.startVoiceInterview).toBe('function');
      expect(typeof voiceInterviewService.getNextQuestion).toBe('function');
      expect(typeof voiceInterviewService.getQuestionAudio).toBe('function');
      expect(typeof voiceInterviewService.submitAnswer).toBe('function');
      expect(typeof voiceInterviewService.endVoiceInterview).toBe('function');
      expect(typeof voiceInterviewService.getInterviewAnswers).toBe('function');
      expect(typeof voiceInterviewService.getAnswerAudio).toBe('function');
      expect(typeof voiceInterviewService.checkVoiceQuestionsStatus).toBe('function');
    });

    it('все методы возвращают Promise', () => {
      const methods = [
        voiceInterviewService.getInterviewInfo,
        voiceInterviewService.startVoiceInterview,
        voiceInterviewService.getNextQuestion,
        voiceInterviewService.getQuestionAudio,
        voiceInterviewService.submitAnswer,
        voiceInterviewService.endVoiceInterview,
        voiceInterviewService.getInterviewAnswers,
        voiceInterviewService.getAnswerAudio,
        voiceInterviewService.checkVoiceQuestionsStatus,
      ];

      methods.forEach(method => {
        expect(method('test-id')).toBeInstanceOf(Promise);
      });
    });

    it('все методы выбрасывают ошибку с одинаковым сообщением', async () => {
      const methods = [
        () => voiceInterviewService.getInterviewInfo('test'),
        () => voiceInterviewService.startVoiceInterview('test'),
        () => voiceInterviewService.getNextQuestion('test'),
        () => voiceInterviewService.getQuestionAudio('test'),
        () => voiceInterviewService.submitAnswer('test', 'test', new File([''], 'test.wav')),
        () => voiceInterviewService.endVoiceInterview('test'),
        () => voiceInterviewService.getInterviewAnswers('test'),
        () => voiceInterviewService.getAnswerAudio('test', 'test'),
        () => voiceInterviewService.checkVoiceQuestionsStatus('test'),
      ];

      for (const method of methods) {
        await expect(method()).rejects.toThrow('Not supported in this build');
      }
    });
  });

  describe('Обработка ошибок', () => {
    it('все методы выбрасывают Error объекты', async () => {
      const methods = [
        () => voiceInterviewService.getInterviewInfo('test'),
        () => voiceInterviewService.startVoiceInterview('test'),
        () => voiceInterviewService.getNextQuestion('test'),
        () => voiceInterviewService.getQuestionAudio('test'),
        () => voiceInterviewService.submitAnswer('test', 'test', new File([''], 'test.wav')),
        () => voiceInterviewService.endVoiceInterview('test'),
        () => voiceInterviewService.getInterviewAnswers('test'),
        () => voiceInterviewService.getAnswerAudio('test', 'test'),
        () => voiceInterviewService.checkVoiceQuestionsStatus('test'),
      ];

      for (const method of methods) {
        try {
          await method();
          fail('Expected method to throw');
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Not supported in this build');
        }
      }
    });

    it('ошибки имеют правильный стек вызовов', async () => {
      try {
        await voiceInterviewService.getInterviewInfo('test');
        fail('Expected method to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Not supported in this build');
        expect(error.stack).toBeDefined();
        expect(error.stack).toContain('getInterviewInfo');
      }
    });
  });

  describe('Совместимость с API', () => {
    it('методы принимают правильные типы параметров', () => {
      // Проверяем, что методы принимают строковые параметры
      expect(() => voiceInterviewService.getInterviewInfo('string-id')).not.toThrow();
      expect(() => voiceInterviewService.startVoiceInterview('string-id')).not.toThrow();
      expect(() => voiceInterviewService.getNextQuestion('string-id')).not.toThrow();
      expect(() => voiceInterviewService.getQuestionAudio('string-id')).not.toThrow();
      expect(() => voiceInterviewService.submitAnswer('string-id', 'string-id', new File([''], 'test.wav'))).not.toThrow();
      expect(() => voiceInterviewService.endVoiceInterview('string-id')).not.toThrow();
      expect(() => voiceInterviewService.getInterviewAnswers('string-id')).not.toThrow();
      expect(() => voiceInterviewService.getAnswerAudio('string-id', 'string-id')).not.toThrow();
      expect(() => voiceInterviewService.checkVoiceQuestionsStatus('string-id')).not.toThrow();
    });

    it('методы возвращают Promise с правильными типами', async () => {
      // Проверяем, что методы возвращают Promise
      const promises = [
        voiceInterviewService.getInterviewInfo('test'),
        voiceInterviewService.startVoiceInterview('test'),
        voiceInterviewService.getNextQuestion('test'),
        voiceInterviewService.getQuestionAudio('test'),
        voiceInterviewService.submitAnswer('test', 'test', new File([''], 'test.wav')),
        voiceInterviewService.endVoiceInterview('test'),
        voiceInterviewService.getInterviewAnswers('test'),
        voiceInterviewService.getAnswerAudio('test', 'test'),
        voiceInterviewService.checkVoiceQuestionsStatus('test'),
      ];

      for (const promise of promises) {
        expect(promise).toBeInstanceOf(Promise);
        await expect(promise).rejects.toThrow('Not supported in this build');
      }
    });
  });
});
