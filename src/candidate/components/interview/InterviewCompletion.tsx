import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { candidateAuthService } from '../../services/candidateAuthService';
import logger from '../../../utils/logger';
import { getFullAudioUrl, logAudioUrl } from '../../../utils/audioUtils';

interface AdditionalQuestion {
  question: string;
  answer: string;
}

interface CompletionMessage {
  text: string;
  audioUrl: string;
}

interface InterviewCompletionProps {
  interviewId: number;
  onComplete: () => void;
}

const InterviewCompletion: React.FC<InterviewCompletionProps> = ({ interviewId, onComplete }) => {
  const [additionalQuestions, setAdditionalQuestions] = useState<AdditionalQuestion[]>([]);
  const [completionMessages, setCompletionMessages] = useState<CompletionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    loadCompletionData();
  }, [interviewId]);

  const loadCompletionData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Получаем все данные завершения одним запросом
      const apiClient = (await import('../../../services/apiService')).apiService.getApiClient();
      const data = (await apiClient.candidates.getInterviewData(interviewId)).data as any;
      const questionsData = (data?.additionalQuestions || []) as any[];
      setAdditionalQuestions(questionsData || []);

      const completion = data?.completion || {};
      setCompletionMessages(((completion?.messages || []) as any[]).map((m: any) => ({ text: m?.text || '', audioUrl: m?.audioUrl })));

      // Инициализируем ответы
      const initialAnswers: { [key: string]: string } = {};
      (questionsData || []).forEach((q: AdditionalQuestion, index: number) => {
        initialAnswers[index] = q.answer || '';
      });
      setAnswers(initialAnswers);

    } catch (err: any) {
      logger.error('Failed to load completion data', err as Error, { component: 'InterviewCompletion', interviewId: interviewId.toString() });
      const errorMessage = err?.response?.data?.message || err?.message || 'Ошибка загрузки данных завершения';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleCompleteInterview = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Завершаем интервью
      const { apiService } = await import('../../../services/apiService');
      await apiService.getApiClient().candidates.endInterview(interviewId);
      
      setIsCompleted(true);
      
      // Показываем завершающие сообщения
      setTimeout(() => {
        onComplete();
      }, 3000);

    } catch (err: any) {
      logger.error('Failed to complete interview', err as Error, { component: 'InterviewCompletion', interviewId: interviewId.toString() });
      const errorMessage = err?.response?.data?.message || err?.message || 'Ошибка завершения интервью';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных завершения...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ошибка завершения</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="space-y-2">
                <Button onClick={loadCompletionData} variant="outline" className="w-full">
                  Попробовать снова
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full bg-[#e16349] text-white hover:bg-[#d14a31]"
                >
                  Перезагрузить страницу
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-600 mb-2">
                Интервью завершено! 🎉
              </h3>
              <p className="text-gray-600">
                Спасибо за участие в собеседовании
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center text-blue-600">
            Завершение интервью 🏁
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            У вас есть возможность ответить на дополнительные вопросы перед завершением
          </p>
        </CardContent>
      </Card>

      {/* Дополнительные вопросы */}
      {additionalQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Дополнительные вопросы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {additionalQuestions.map((question, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`question-${index}`} className="text-sm font-medium">
                  {question.question}
                </Label>
                <Textarea
                  id={`question-${index}`}
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Введите ваш ответ..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Завершающие сообщения */}
      {completionMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Информация о завершении</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completionMessages.map((message, index) => (
              <div key={index} className="bg-blue-50 p-3 rounded-lg">
                <p className="text-gray-800">{message.text}</p>
                {message.audioUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const fullAudioUrl = getFullAudioUrl(message.audioUrl);
                      logAudioUrl(message.audioUrl, fullAudioUrl, 'InterviewCompletion');
                      import('../../services/audioService').then(({ audioService }) => {
                        audioService.stopAudio();
                        audioService.playAudioFromUrl(fullAudioUrl, { volume: 0.8 })
                          .catch((error) => {
                            logger.error('Failed to play completion audio', error as Error, { 
                              component: 'InterviewCompletion', 
                              interviewId: interviewId.toString(),
                              originalAudioUrl: message.audioUrl,
                              fullAudioUrl
                            });
                          });
                      });
                    }}
                  >
                    🔊 Слушать
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Кнопка завершения */}
      <div className="text-center">
        <Button
          onClick={handleCompleteInterview}
          disabled={isSubmitting}
          size="lg"
          className="px-8 py-3 bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Завершение...
            </>
          ) : (
            'Завершить интервью'
          )}
        </Button>
      </div>

      {/* Предупреждение */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-orange-800 font-medium">Важно!</p>
              <p className="text-orange-700 text-sm">
                После завершения интервью вы не сможете продолжить отвечать на вопросы. 
                Убедитесь, что все ответы заполнены корректно.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { InterviewCompletion };
export default InterviewCompletion; 