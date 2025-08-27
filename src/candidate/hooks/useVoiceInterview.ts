import { useState, useCallback, useEffect } from 'react';
import { voiceInterviewService } from '../services/voiceInterviewService';
import { 
  VoiceInterviewStartResponse, 
  VoiceQuestionResponse, 
  VoiceAnswerResponse,
  VoiceInterviewEndResponse 
} from '../types/interview';

export function useVoiceInterview(interviewId: number) {
  const [interviewSession, setInterviewSession] = useState<VoiceInterviewStartResponse | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<VoiceQuestionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);

  const startInterview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await voiceInterviewService.startVoiceInterview(interviewId.toString());
      setInterviewSession(session);
      setIsInterviewActive(true);
      return session;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Произошла ошибка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  const getNextQuestion = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const question = await voiceInterviewService.getNextQuestion(interviewId.toString());
      setCurrentQuestion(question);
      return question;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Произошла ошибка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  const submitAnswer = useCallback(async (audioFile: File) => {
    if (!currentQuestion) {
      throw new Error('Нет активного вопроса');
    }

    setLoading(true);
    setError(null);
    try {
      const answer = await voiceInterviewService.submitAnswer(
        interviewId.toString(), 
        currentQuestion.questionId.toString(), 
        audioFile
      );
      
      // Если это был последний вопрос, завершаем интервью
      if (currentQuestion.questionNumber >= currentQuestion.totalQuestions) {
        await endInterview();
      } else {
        // Получаем следующий вопрос
        await getNextQuestion();
      }
      
      return answer;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Произошла ошибка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [interviewId, currentQuestion, getNextQuestion]);

  const endInterview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await voiceInterviewService.endVoiceInterview(interviewId.toString());
      setIsInterviewActive(false);
      setCurrentQuestion(null);
      return result;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Произошла ошибка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  return {
    interviewSession,
    currentQuestion,
    loading,
    error,
    isInterviewActive,
    startInterview,
    getNextQuestion,
    submitAnswer,
    endInterview,
  };
}
