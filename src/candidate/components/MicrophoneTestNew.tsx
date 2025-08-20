import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Mic, MicOff, Play, Volume2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { SymmetricAudioWaves } from './SymmetricAudioWaves';
import { WMTLogo } from './';
import { HelpButton, HelpModal } from './';

interface MicrophoneTestProps {
  onComplete: () => void;
  onSkip: () => void;
}

type TestState = 'initial' | 'recording' | 'recorded' | 'playing' | 'completed';

export function MicrophoneTestNew({ onComplete, onSkip }: MicrophoneTestProps) {
  const [testState, setTestState] = useState<TestState>('initial');
  const [duration, setDuration] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationFrame = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      // Мокаем запись без реального разрешения микрофона (тестовый режим)
      const stream = new MediaStream();
      streamRef.current = stream;
      
      // Создаем фейковый MediaRecorder для тестового режима
      const chunks: BlobPart[] = [];
      const testDuration = 3; // 3 секунды тестовой записи
      
      setTestState('recording');
      setDuration(0);
      
      // Таймер записи
      recordingTimer.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= testDuration) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Test recording error:', error);
    }
  };

  const stopRecording = () => {
    setTestState('recorded');
    
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
    }
    
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    
    // Создаем тестовый blob
    const testBlob = new Blob(['test audio data'], { type: 'audio/wav' });
    setRecordedAudio(testBlob);
  };

  const playRecording = () => {
    setTestState('playing');
    // Симуляция воспроизведения
    setTimeout(() => {
      setTestState('recorded');
    }, duration * 1000);
  };

  const confirmTest = () => {
    setTestState('completed');
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#e9eae2] min-h-screen w-full">
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-col gap-4 p-6 w-full h-full">
          
          {/* Header - унифицированный с другими экранами */}
          <div className="flex items-center justify-between w-full">
            <WMTLogo size="medium" />
            <HelpButton onClick={() => setIsHelpModalOpen(true)} />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-4 mt-8">
            <div className="bg-[#f5f6f1] rounded-[44px] w-full max-w-3xl">
              <div className="w-full h-full">
                <div className="flex flex-col gap-6 p-6 w-full">
                  
                  <div className="bg-white rounded-[32px] w-full">
                    <div className="w-full h-full">
                      <div className="flex flex-col gap-5 p-8 w-full text-center">
                        
                        {/* Header */}
                        <div className="space-y-3">
                          <h4 className="text-[#0a0d14]">Проверка микрофона</h4>
                          <p className="text-gray-600">
                            Давайте убедимся, что ваш микрофон работает корректно
                          </p>
                        </div>

                        {testState === 'completed' ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                          >
                            <div className="w-24 h-24 bg-[#e16349]/10 border-2 border-[#e16349]/20 rounded-full flex items-center justify-center mx-auto">
                              <CheckCircle2 className="w-12 h-12 text-[#e16349]" />
                            </div>
                            <p className="text-[#e16349]">
                              Отлично! Микрофон работает корректно
                            </p>
                          </motion.div>
                        ) : (
                          <>
                            {/* Recording Controls */}
                            <div className="space-y-8">
                              
                              {/* Audio Visualization */}
                              {testState === 'recording' && (
                                <motion.div 
                                  className="py-4"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <SymmetricAudioWaves 
                                    isSpeaking={true}
                                    size="large"
                                  />
                                </motion.div>
                              )}

                              {testState === 'playing' && (
                                <motion.div 
                                  className="py-4"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                >
                                  <SymmetricAudioWaves 
                                    isSpeaking={true}
                                    size="large"
                                  />
                                </motion.div>
                              )}

                              {/* Main Action Button */}
                              {testState === 'initial' && (
                                <div className="flex flex-col items-center gap-6 py-4">
                                  <SymmetricAudioWaves 
                                    isSpeaking={false}
                                    size="medium"
                                  />
                                  <Button
                                    onClick={startRecording}
                                    className="w-20 h-20 rounded-full bg-[#e16349] hover:bg-[#d55a42] text-white shadow-lg transform hover:scale-105 transition-all"
                                  >
                                    <Mic className="w-8 h-8" />
                                  </Button>
                                </div>
                              )}

                              {testState === 'recording' && (
                                <div className="space-y-6">
                                  <Button
                                    onClick={stopRecording}
                                    className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg mx-auto animate-pulse"
                                  >
                                    <div className="w-6 h-6 bg-white rounded-sm" />
                                  </Button>
                                  
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    <span className="font-mono text-red-500">{formatTime(duration)}</span>
                                  </div>
                                </div>
                              )}

                              {testState === 'recorded' && (
                                <div className="space-y-6">
                                  <div className="flex items-center justify-center gap-4">
                                    <Button
                                      onClick={playRecording}
                                      className="w-16 h-16 rounded-full bg-[#e16349] hover:bg-[#d55a42] text-white shadow-lg"
                                    >
                                      <Play className="w-6 h-6" />
                                    </Button>
                                    <span className="text-gray-600">Прослушать запись</span>
                                  </div>
                                  
                                  <Button
                                    onClick={confirmTest}
                                    className="bg-[#e16349] hover:bg-[#d55a42] text-white px-12 py-4 rounded-3xl shadow-lg w-full max-w-xs mx-auto"
                                  >
                                    Все хорошо, продолжить
                                  </Button>
                                </div>
                              )}

                            </div>

                            {/* Instructions */}
                            <div className="text-gray-600 space-y-2">
                              {testState === 'initial' && (
                                <p>Нажмите на микрофон и произнесите несколько слов для проверки</p>
                              )}
                              {testState === 'recording' && (
                                <p>Говорите четко: "Меня зовут [ваше имя], сегодня хороший день"</p>
                              )}
                              {testState === 'recorded' && (
                                <p>Прослушайте запись и подтвердите, если качество устраивает</p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
      />
    </div>
  );
}
