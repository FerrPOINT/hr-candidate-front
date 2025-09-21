import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Play, Pause, Volume2, AlertCircle } from 'lucide-react';
import { candidateAuthService } from '../../services/candidateAuthService';
import logger from '../../../utils/logger';
import { getFullAudioUrl, logAudioUrl } from '../../../utils/audioUtils';
import { audioService } from '../../services/audioService';

interface WelcomeMessage {
  text: string;
  audioUrl: string;
}

interface WelcomeMessagesData {
  messages: WelcomeMessage[];
  testMessage?: WelcomeMessage | null;
}

interface WelcomeMessagesProps {
  interviewId: number;
  onContinue: () => void;
}

const WelcomeMessages: React.FC<WelcomeMessagesProps> = ({ interviewId, onContinue }) => {
  const [messagesData, setMessagesData] = useState<WelcomeMessagesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [hasPlayedTestMessage, setHasPlayedTestMessage] = useState(false);

  const playAudio = useCallback(async (audioUrl: string) => {
    try {
      // Формируем полный URL для аудио файла
      const fullAudioUrl = getFullAudioUrl(audioUrl);
      
      // Логируем для отладки
      logAudioUrl(audioUrl, fullAudioUrl, 'WelcomeMessages');
      
      logger.info('🎵 Начинаем воспроизведение аудио', { 
        component: 'WelcomeMessages',
        originalAudioUrl: audioUrl,
        fullAudioUrl,
        currentMessageIndex,
        hasPlayedTestMessage
      });
      
      // Останавливаем предыдущий аудио
      if (currentAudio) {
        logger.debug('⏹️ Останавливаем предыдущий аудио', { component: 'WelcomeMessages' });
      }
      audioService.stopAudio();

      // Обработчик окончания аудио
      audioService.onEnded(() => {
        logger.info('🔚 Аудио завершено, переходим к следующему', { 
          component: 'WelcomeMessages',
          totalMessages: messagesData!.messages.length
        });
        
        setIsPlaying(false);
        setCurrentAudio(null);
        
        // Автоматически переходим к следующему сообщению
        setCurrentMessageIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          
          if (nextIndex < messagesData!.messages.length) {
            // Есть еще основные сообщения
            logger.debug('➡️ Переходим к следующему основному сообщению', { 
              component: 'WelcomeMessages',
              nextIndex
            });
            return nextIndex;
          } else {
            // Основные сообщения закончились, запускаем тестовое
            logger.info('🧪 Основные сообщения закончились, запускаем тестовое', { component: 'WelcomeMessages' });
            setHasPlayedTestMessage(true);
            return prevIndex; // Оставляем текущий индекс
          }
        });
        
        // Проверяем, нужно ли переходить к следующей стадии
        setHasPlayedTestMessage(prevHasPlayed => {
          if (prevHasPlayed) {
            // Все сообщения проиграны, переходим к следующей стадии
            logger.info('🏁 Все сообщения проиграны, переходим к следующей стадии', { component: 'WelcomeMessages' });
            setTimeout(() => {
              onContinue();
            }, 1000); // Небольшая пауза перед переходом
          }
          return prevHasPlayed;
        });
      });

      // Ошибка на элементе — fallback обработка (ошибки старта ловим в catch)
      // Оставлено для совместимости, если браузер триггерит error после старта
      const onError = () => {
        logger.error('❌ Ошибка воспроизведения аудио', undefined, { 
          component: 'WelcomeMessages', 
          originalAudioUrl: audioUrl,
          fullAudioUrl,
          error: 'Audio playback failed'
        });
        setIsPlaying(false);
        setCurrentAudio(null);
        
        // При ошибке тоже переходим к следующему
        setCurrentMessageIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          
          if (nextIndex < messagesData!.messages.length) {
            logger.debug('➡️ При ошибке переходим к следующему основному сообщению', { component: 'WelcomeMessages' });
            return nextIndex;
          } else {
            logger.debug('🧪 При ошибке переходим к тестовому сообщению', { component: 'WelcomeMessages' });
            setHasPlayedTestMessage(true);
            return prevIndex; // Оставляем текущий индекс
          }
        });
        
        // Проверяем, нужно ли переходить к следующей стадии
        setHasPlayedTestMessage(prevHasPlayed => {
          if (prevHasPlayed) {
            logger.debug('🏁 При ошибке переходим к следующей стадии', { component: 'WelcomeMessages' });
            setTimeout(() => {
              onContinue();
            }, 1000);
          }
          return prevHasPlayed;
        });
      };

      setCurrentAudio(null);
      setIsPlaying(true);
      
      logger.debug('▶️ Запускаем воспроизведение аудио', { component: 'WelcomeMessages' });
      await audioService.playAudioFromUrl(fullAudioUrl, { volume: 0.8 });
      
      logger.info('✅ Аудио успешно запущено', { component: 'WelcomeMessages' });
    } catch (err: any) {
      const fullAudioUrl = getFullAudioUrl(audioUrl);
      
      logger.error('❌ Ошибка запуска аудио', err as Error, { 
        component: 'WelcomeMessages', 
        originalAudioUrl: audioUrl,
        fullAudioUrl,
        errorType: err.constructor.name,
        errorMessage: err.message
      });
      setError('Ошибка воспроизведения аудио');
      
      // При ошибке тоже переходим к следующему
      setCurrentMessageIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        
        if (nextIndex < messagesData!.messages.length) {
          logger.debug('➡️ При ошибке запуска переходим к следующему основному сообщению', { component: 'WelcomeMessages' });
          return nextIndex;
        } else {
          logger.debug('🧪 При ошибке запуска переходим к тестовому сообщению', { component: 'WelcomeMessages' });
          setHasPlayedTestMessage(true);
          return prevIndex; // Оставляем текущий индекс
        }
      });
      
      // Проверяем, нужно ли переходить к следующей стадии
      setHasPlayedTestMessage(prevHasPlayed => {
        if (prevHasPlayed) {
          logger.debug('🏁 При ошибке запуска переходим к следующей стадии', { component: 'WelcomeMessages' });
          setTimeout(() => {
            onContinue();
          }, 1000);
        }
        return prevHasPlayed;
      });
    }
  }, [currentMessageIndex, hasPlayedTestMessage, messagesData, onContinue]);

  useEffect(() => {
    loadWelcomeMessages();
  }, [interviewId]);

  // Автоматическое воспроизведение следующего сообщения
  useEffect(() => {
    if (messagesData && currentMessageIndex < messagesData.messages.length) {
      // Автоматически запускаем воспроизведение текущего сообщения
      const currentMessage = messagesData.messages[currentMessageIndex];
      if (currentMessage && currentMessage.audioUrl) {
        playAudio(currentMessage.audioUrl);
      }
    }
  }, [currentMessageIndex, messagesData, playAudio]);

  // Автоматическое воспроизведение тестового сообщения после основных
  useEffect(() => {
    if (messagesData && currentMessageIndex >= messagesData.messages.length && !hasPlayedTestMessage) {
      // Все основные сообщения проиграны, запускаем тестовое
      if (messagesData.testMessage && messagesData.testMessage.audioUrl) {
        setHasPlayedTestMessage(true);
        playAudio(messagesData.testMessage.audioUrl);
      } else {
        // Нет тестового сообщения, переходим к следующей стадии
        logger.info('🧪 Нет тестового сообщения, переходим к следующей стадии', { component: 'WelcomeMessages' });
        setHasPlayedTestMessage(true);
        setTimeout(() => {
          onContinue();
        }, 1000);
      }
    }
  }, [currentMessageIndex, messagesData, hasPlayedTestMessage, playAudio, onContinue]);

  // Обработка случая, когда нет основных сообщений
  useEffect(() => {
    if (messagesData && messagesData.messages.length === 0 && !hasPlayedTestMessage) {
      logger.info('📝 Нет основных сообщений, проверяем тестовое', { component: 'WelcomeMessages' });
      if (messagesData.testMessage && messagesData.testMessage.audioUrl) {
        setHasPlayedTestMessage(true);
        playAudio(messagesData.testMessage.audioUrl);
      } else {
        // Нет ни основных, ни тестового сообщений
        logger.info('📝 Нет сообщений вообще, переходим к следующей стадии', { component: 'WelcomeMessages' });
        setTimeout(() => {
          onContinue();
        }, 1000);
      }
    }
  }, [messagesData, hasPlayedTestMessage, playAudio, onContinue]);

  const loadWelcomeMessages = async () => {
    try {
      logger.info('🎯 Начинаем загрузку вступительных сообщений', { 
        component: 'WelcomeMessages', 
        interviewId: interviewId.toString(),
        timestamp: new Date().toISOString()
      });
      
      setIsLoading(true);
      setError(null);
      
      logger.debug('📤 Вызываем candidateAuthService.getWelcomeMessages', { 
        component: 'WelcomeMessages', 
        interviewId: interviewId.toString() 
      });
      
      const { apiService } = await import('../../../services/apiService');
      const resp = (await apiService.getApiClient().candidates.getInterviewData(interviewId)).data as any;
      const api = resp?.welcome || { messages: [], testMessage: undefined };
      const normalized: WelcomeMessagesData = {
        messages: ((api.messages || []) as Array<{ text?: string; audioUrl?: string }>).map((m) => ({ text: m.text || '', audioUrl: m.audioUrl || '' })),
        testMessage: api.testMessage ? { text: (api.testMessage as any).text || '', audioUrl: (api.testMessage as any).audioUrl || '' } : undefined
      };
      
      logger.info('📥 Вступительные сообщения успешно загружены', { 
        component: 'WelcomeMessages', 
        interviewId: interviewId.toString(), 
        messageCount: api.messages?.length || 0,
        hasTestMessage: !!api.testMessage,
        data: api
      });
      
      setMessagesData(normalized);
    } catch (err: any) {
      logger.error('❌ Ошибка загрузки вступительных сообщений', err as Error, { 
        component: 'WelcomeMessages', 
        interviewId: interviewId.toString(),
        errorType: err.constructor.name,
        errorMessage: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      setError(err.message || 'Ошибка загрузки вступительных сообщений');
    } finally {
      logger.debug('🏁 Завершение загрузки вступительных сообщений', { 
        component: 'WelcomeMessages', 
        isLoading: false 
      });
      setIsLoading(false);
    }
  };



  const stopAudio = () => {
    audioService.stopAudio();
    setIsPlaying(false);
    setCurrentAudio(null);
  };

  // Функция для принудительного перехода к следующему сообщению
  const skipToNext = () => {
    if (currentAudio) {
      stopAudio();
    }
    
    if (currentMessageIndex < messagesData!.messages.length - 1) {
      setCurrentMessageIndex(currentMessageIndex + 1);
    } else if (!hasPlayedTestMessage) {
      setHasPlayedTestMessage(true);
    } else {
      onContinue();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка вступительных сообщений...</p>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ошибка загрузки</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="space-y-2">
                <Button onClick={loadWelcomeMessages} variant="outline" className="w-full">
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

  if (!messagesData) {
    return null;
  }

  const currentMessage = messagesData.messages[currentMessageIndex];
  const isPlayingMainMessage = isPlaying && currentMessageIndex < messagesData.messages.length;
  const isPlayingTestMessage = isPlaying && hasPlayedTestMessage;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center text-blue-600">
            Добро пожаловать на собеседование! 🎯
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            Прослушайте вступительные сообщения, чтобы ознакомиться с процессом интервью
          </p>
        </CardContent>
      </Card>

      {/* Основные вступительные сообщения */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Вступительные сообщения
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Прогресс сообщений */}
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-500">
              Сообщение {currentMessageIndex + 1} из {messagesData.messages.length}
            </span>
          </div>

          {/* Текущее сообщение */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 mb-3">{currentMessage.text}</p>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => isPlayingMainMessage ? stopAudio() : playAudio(currentMessage.audioUrl)}
                variant="default"
                size="sm"
                className="flex items-center gap-2"
              >
                {isPlayingMainMessage ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Остановить
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Слушать
                  </>
                )}
              </Button>
              
              <span className="text-sm text-gray-500">
                {isPlayingMainMessage ? 'Воспроизводится...' : 'Автоматически запускается'}
              </span>
            </div>
          </div>

          {/* Кнопка пропуска */}
          <div className="text-center">
            <Button
              onClick={skipToNext}
              variant="outline"
              size="sm"
              className="text-gray-600"
            >
              Пропустить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Тестовое сообщение (опционально) */}
      {messagesData.testMessage ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Тестовое сообщение
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-3">
              Прослушайте это сообщение, чтобы проверить качество звука
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-800 mb-3">{messagesData.testMessage.text}</p>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => isPlayingTestMessage ? stopAudio() : playAudio(messagesData.testMessage!.audioUrl)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isPlayingTestMessage ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Остановить
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Слушать тест
                    </>
                  )}
                </Button>
                
                <span className="text-sm text-gray-500">
                  {isPlayingTestMessage ? 'Воспроизводится...' : 'Нажмите для прослушивания'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Тестовое сообщение
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Тестового сообщения нет. Продолжайте после прослушивания основных сообщений.</p>
          </CardContent>
        </Card>
      )}

      {/* Информация о прогрессе */}
      <div className="text-center text-sm text-gray-500">
        {hasPlayedTestMessage ? (
          <p>Все сообщения прослушаны. Переходим к проверке микрофона...</p>
        ) : (
          <p>Прослушивание вступительных сообщений...</p>
        )}
      </div>
    </div>
  );
};

export { WelcomeMessages };
export default WelcomeMessages; 