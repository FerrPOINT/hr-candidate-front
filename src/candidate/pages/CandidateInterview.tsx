import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WMTLogo } from '../components/';
import { HelpButton, HelpModal } from '../components/';
import { candidateAuthService } from '../services/candidateAuthService';
import { candidateApiService } from '../services/candidateApiService';
// Локальный тип для голосового вопроса
interface VoiceQuestionResponse {
  id: string;
  text: string;
  audioUrl?: string;
  duration?: number;
}
import { Play, Pause, Mic, MicOff, Volume2 } from 'lucide-react';

interface InterviewData {
  interviewId: string;
  candidateName: string;
  questionsCount: number;
  currentQuestion?: VoiceQuestionResponse;
}

const CandidateInterview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [totalQuestions, setTotalQuestions] = useState<number>(6);
  
  // Аудио состояния
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>('');

  // Инициализация интервью
  useEffect(() => {
    const initializeInterview = async () => {
      if (!id) {
        setError('ID интервью не найден');
        return;
      }

      // Проверяем авторизацию
      if (!candidateAuthService.isAuthenticated()) {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Получаем токен для авторизованных запросов
        const token = candidateAuthService.getToken();
        if (!token) {
          throw new Error('Токен авторизации не найден');
        }

        // Получаем информацию об интервью
        const interviewInfo = await candidateApiService.getInterviewInfo(id, token);
        
        const data: InterviewData = {
          interviewId: id,
          candidateName: 'Кандидат', // Временно используем статичное значение
          questionsCount: 6 // Временно используем статичное значение
        };

        setInterviewData(data);
        setTotalQuestions(data.questionsCount);

        console.log('Интервью инициализировано:', data);
      } catch (error: any) {
        console.error('Ошибка инициализации интервью:', error);
        setError(error.message || 'Ошибка запуска интервью');
      } finally {
        setIsLoading(false);
      }
    };

    initializeInterview();
  }, [id, navigate]);

  // Обработчики аудио
  const handlePlayAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const handlePauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
    setAudioProgress(0);
    // Автоматически переходим к следующему вопросу
    if (currentQuestion < totalQuestions) {
      handleNextQuestion();
    }
  }, [currentQuestion, totalQuestions]);

  const handleAudioTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
    }
  }, []);

  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
    // TODO: Добавить логику записи аудио
    console.log('Начата запись ответа');
  }, []);

  const handleStopRecording = useCallback(() => {
    setIsRecording(false);
    // TODO: Добавить логику остановки записи и отправки на сервер
    console.log('Запись остановлена');
  }, []);

  const handleNextQuestion = useCallback(async () => {
    if (currentQuestion < totalQuestions && interviewData) {
      try {
        // Получаем токен для авторизованных запросов
        const token = candidateAuthService.getToken();
        if (!token) {
          throw new Error('Токен авторизации не найден');
        }

        // Получаем следующий вопрос через API
        const nextQuestion = await candidateApiService.getNextVoiceQuestion(interviewData.interviewId, token);
        
        setInterviewData(prev => ({
          ...prev!,
          currentQuestion: nextQuestion
        }));
        
        setCurrentAudioUrl(nextQuestion.audioUrl || '');
        setCurrentQuestion(prev => prev + 1);
        setIsPlaying(false);
        setAudioProgress(0);
      } catch (error: any) {
        console.error('Ошибка получения следующего вопроса:', error);
        setError(error.message || 'Ошибка получения вопроса');
      }
    }
  }, [currentQuestion, totalQuestions, interviewData]);

  const handleFinishInterview = useCallback(async () => {
    if (interviewData) {
      try {
        // Получаем токен для авторизованных запросов
        const token = candidateAuthService.getToken();
        if (!token) {
          throw new Error('Токен авторизации не найден');
        }

        // Завершаем voice интервью через API
        await candidateApiService.finishVoiceInterview(interviewData.interviewId, token);
        console.log('Интервью завершено');
        navigate('/complete');
      } catch (error: any) {
        console.error('Ошибка завершения интервью:', error);
        setError(error.message || 'Ошибка завершения интервью');
      }
    }
  }, [interviewData, navigate]);

  const handleStartInterview = useCallback(async () => {
    if (interviewData) {
      try {
        // Получаем токен для авторизованных запросов
        const token = candidateAuthService.getToken();
        if (!token) {
          throw new Error('Токен авторизации не найден');
        }

        // Начинаем voice интервью через API
        await candidateApiService.startVoiceInterview(interviewData.interviewId, token);
        
        // Получаем первый вопрос
        const firstQuestion = await candidateApiService.getNextVoiceQuestion(interviewData.interviewId, token);
        
        setInterviewData(prev => ({
          ...prev!,
          currentQuestion: firstQuestion
        }));
        
        setCurrentAudioUrl(firstQuestion.audioUrl || '');
        setIsInterviewStarted(true);
      } catch (error: any) {
        console.error('Ошибка запуска интервью:', error);
        setError(error.message || 'Ошибка запуска интервью');
      }
    }
  }, [interviewData]);

  if (isLoading) {
    return (
      <div className="bg-[#e9eae2] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e16349] mx-auto mb-4"></div>
          <p className="text-[#525866]">Подготовка интервью...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#e9eae2] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
            <h3 className="text-red-800 font-medium mb-2">Ошибка</h3>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-[#e16349] text-white rounded-lg hover:bg-[#d14a31] transition-colors"
            >
              Вернуться к входу
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#e9eae2] min-h-screen w-full">
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-col gap-4 p-6 w-full h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <WMTLogo size="medium" />
            <HelpButton onClick={() => setIsHelpModalOpen(true)} />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="bg-[#f5f6f1] rounded-[44px] w-full max-w-4xl">
              <div className="w-full h-full">
                <div className="flex flex-col gap-6 p-6 w-full">
                  
                  {/* Progress Bar */}
                  <div className="bg-white rounded-[32px] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#525866]">
                        Вопрос {currentQuestion} из {totalQuestions}
                      </span>
                      <span className="text-sm text-[#525866]">
                        {Math.round((currentQuestion / totalQuestions) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#e16349] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Interview Content */}
                  <div className="bg-white rounded-[32px] p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-[#0a0d14] mb-2">
                        {isInterviewStarted ? 'Аудио интервью' : 'Подготовка к интервью'}
                      </h2>
                      <p className="text-[#525866] text-lg">
                        {isInterviewStarted 
                          ? `Здравствуйте, ${interviewData?.candidateName}! Слушайте вопросы и отвечайте на них.`
                          : 'Нажмите "Начать интервью" чтобы приступить к вопросам'
                        }
                      </p>
                    </div>

                    {/* Audio Interface */}
                    {isInterviewStarted && interviewData && (
                      <div className="bg-[#f8f9fa] rounded-[20px] p-6 mb-6">
                        <div className="text-center space-y-6">
                          
                          {/* Audio Player */}
                          <div className="flex items-center justify-center space-x-4">
                            <button
                              onClick={isPlaying ? handlePauseAudio : handlePlayAudio}
                              className="w-16 h-16 bg-[#e16349] rounded-full flex items-center justify-center text-white hover:bg-[#d14a31] transition-colors"
                            >
                              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                            </button>
                            
                            <div className="flex-1 max-w-md">
                              <div className="bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-[#e16349] h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${audioProgress}%` }}
                                ></div>
                              </div>
                              <p className="text-sm text-[#525866] mt-2">
                                Вопрос {currentQuestion} из {totalQuestions}
                              </p>
                            </div>
                          </div>

                          {/* Recording Controls */}
                          <div className="flex items-center justify-center space-x-4">
                            <button
                              onClick={isRecording ? handleStopRecording : handleStartRecording}
                              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                                isRecording 
                                  ? 'bg-red-500 text-white hover:bg-red-600' 
                                  : 'bg-[#e16349] text-white hover:bg-[#d14a31]'
                              }`}
                            >
                              {isRecording ? (
                                <>
                                  <MicOff className="w-4 h-4 inline mr-2" />
                                  Остановить запись
                                </>
                              ) : (
                                <>
                                  <Mic className="w-4 h-4 inline mr-2" />
                                  Начать запись
                                </>
                              )}
                            </button>
                          </div>

                          {/* Status Indicators */}
                          <div className="flex justify-center space-x-4">
                            <div className={`w-4 h-4 rounded-full ${isPlaying ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                            <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
                          </div>

                          {/* Status Text */}
                          <p className="text-sm text-[#525866]">
                            {isPlaying ? 'Воспроизведение вопроса...' : isRecording ? 'Запись ответа...' : 'Ожидание...'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Controls */}
                    <div className="text-center space-y-4">
                      {!isInterviewStarted && (
                        <button
                          onClick={handleStartInterview}
                          className="px-8 py-3 bg-[#e16349] text-white rounded-xl hover:bg-[#d14a31] transition-colors"
                        >
                          Начать интервью
                        </button>
                      )}
                      
                      {isInterviewStarted && (
                        <div className="space-y-2">
                          {currentQuestion < totalQuestions && (
                            <button
                              onClick={handleNextQuestion}
                              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Следующий вопрос
                            </button>
                          )}
                          
                          {currentQuestion === totalQuestions && (
                            <button
                              onClick={handleFinishInterview}
                              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Завершить интервью
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Panel */}
                  <div className="bg-white rounded-[32px] p-4">
                    <p className="text-xs text-[#525866] text-center">
                      <strong>Аудио интервью:</strong> Слушайте вопросы внимательно и отвечайте четко в микрофон. 
                      Ваши ответы будут записаны и проанализированы.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentAudioUrl}
        onEnded={handleAudioEnded}
        onTimeUpdate={handleAudioTimeUpdate}
        preload="metadata"
      />

      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
      />
    </div>
  );
};

export default CandidateInterview;
