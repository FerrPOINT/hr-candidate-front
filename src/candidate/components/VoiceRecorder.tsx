import { useState, useRef, useEffect } from 'react';
import { Button } from './';
import { Mic, MicOff, Play, Pause, RotateCcw, AlertCircle, Shield, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onSkipQuestion?: () => void;
  onSwitchToText?: () => void;
  maxDuration?: number;
  className?: string;
}

type PermissionState = 'unknown' | 'granted' | 'denied' | 'requesting';
type RecordingState = 'idle' | 'recording' | 'recorded' | 'playing';

export function VoiceRecorder({
  onRecordingComplete,
  onStartRecording,
  onStopRecording,
  onSkipQuestion,
  onSwitchToText,
  maxDuration = 120,
  className = ""
}: VoiceRecorderProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [permissionState, setPermissionState] = useState<PermissionState>('unknown');
  const [duration, setDuration] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  const [error, setError] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationFrame = useRef<number | null>(null);
  const recordedBlobRef = useRef<Blob | null>(null);

  // Check initial microphone permission
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      // Check if getUserMedia is available first
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia not supported');
        setPermissionState('unknown');
        return;
      }
      
      // Check if permissions API is available
      if (navigator.permissions && 'query' in navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setPermissionState(permission.state as PermissionState);
        } catch (permError) {
          // Some browsers might not support microphone permission query
          console.log('Microphone permission query not supported:', permError);
          setPermissionState('unknown');
        }
      } else {
        // Fallback for browsers without permissions API
        setPermissionState('unknown');
      }
    } catch (error) {
      console.log('Error checking microphone permission:', error);
      setPermissionState('unknown');
    }
  };

  const requestMicrophonePermission = async () => {
    setPermissionState('requesting');
    setError('');
    
    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Браузер не поддерживает доступ к микрофону');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Permission granted, stop the stream immediately
      stream.getTracks().forEach(track => track.stop());
      setPermissionState('granted');
      return true;
    } catch (error: any) {
      // Suppress console error for expected permission denial
      if (error.name !== 'NotAllowedError') {
        console.error('Error requesting microphone permission:', error);
      }
      
      setPermissionState('denied');
      
      let errorMessage = '';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Для записи голосового ответа необходимо разрешить доступ к микрофону.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Микрофон не найден. Убедитесь, что микрофон подключен к устройству.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Микрофон уже используется другим приложением. Закройте другие вкладки или приложения.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Настройки микрофона не поддерживаются. Попробуйте использовать другой микрофон.';
      } else if (error.message.includes('поддерживает')) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Произошла ошибка при получении доступа к микрофону. Попробуйте обновить страницу.';
      }
      
      setError(errorMessage);
      return false;
    }
  };

  const startRecording = async () => {
    // Request permission if needed
    if (permissionState !== 'granted') {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }

    try {
      // Check again if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Браузер не поддерживает доступ к микрофону');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      streamRef.current = stream;
      
      // Set up audio analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      // Start recording
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: mediaRecorder.mimeType });
        recordedBlobRef.current = audioBlob;
        onRecordingComplete?.(audioBlob, duration);
        setRecordingState('recorded');
        stopAudioAnalysis();
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      setRecordingState('recording');
      setDuration(0);
      setError('');
      onStartRecording?.();
      
      // Start timer
      recordingTimer.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);
      
      // Start audio level visualization
      startAudioAnalysis();
      
    } catch (error: any) {
      // Suppress console error for expected permission denial
      if (error.name !== 'NotAllowedError') {
        console.error('Error starting recording:', error);
      }
      
      setRecordingState('idle');
      
      let errorMessage = '';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Для записи голосового ответа необходимо разрешить доступ к микрофону.';
        setPermissionState('denied');
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Микрофон не найден. Убедитесь, что микрофон подключен к устройству.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Микрофон уже используется другим приложением. Закройте другие вкладки или приложения.';
      } else if (error.message.includes('поддерживает')) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Произошла ошибка при начале записи. Попробуйте обновить страницу.';
      }
      
      setError(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('idle'); // Will be set to 'recorded' in onstop handler
      onStopRecording?.();
      
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  const startAudioAnalysis = () => {
    if (!analyserRef.current) return;
    
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const analyze = () => {
      if (recordingState !== 'recording') return;
      
      analyser.getByteFrequencyData(dataArray);
      
      // Create audio levels for visualization
      const levels = [];
      for (let i = 0; i < 20; i++) {
        const slice = dataArray.slice(i * 5, (i + 1) * 5);
        const average = slice.reduce((sum, value) => sum + value, 0) / slice.length;
        levels.push(Math.min(100, (average / 255) * 100 + 5)); // Add minimum height
      }
      
      setAudioLevels(levels);
      animationFrame.current = requestAnimationFrame(analyze);
    };
    
    analyze();
  };

  const stopAudioAnalysis = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    setAudioLevels([]);
  };

  const resetRecording = () => {
    setRecordingState('idle');
    setDuration(0);
    setAudioLevels([]);
    recordedBlobRef.current = null;
    setError('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const getProgressWidth = () => {
    if (recordingState === 'recording') {
      return `${Math.max(5, (duration / maxDuration) * 100)}%`;
    }
    return '100%';
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-[20px] p-4 w-full text-center">
          <div className="flex items-center gap-2 justify-center text-red-600 mb-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Проблема с микрофоном</span>
          </div>
          <p className="text-red-600 text-sm leading-relaxed mb-4">{error}</p>
          
          {permissionState === 'denied' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={requestMicrophonePermission}
                  variant="outline"
                  className="w-full border-[#e16349]/30 text-[#e16349] hover:bg-[#e16349]/10 rounded-2xl"
                >
                  Разрешить доступ к микрофону
                </Button>
                
                <div className="flex gap-2">
                  {onSwitchToText && (
                    <Button
                      onClick={onSwitchToText}
                      variant="outline"
                      className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 rounded-2xl flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Ответить текстом
                    </Button>
                  )}
                  
                  {false && onSkipQuestion && (
                    <Button
                      onClick={onSkipQuestion}
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-2xl"
                    >
                      Пропустить
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-gray-600 bg-gray-50 rounded-2xl p-3">
                <strong>Как разрешить доступ:</strong><br />
                • Нажмите на иконку замка в адресной строке браузера<br />
                • Выберите "Разрешить" для доступа к микрофону<br />
                • Обновите страницу и попробуйте снова
              </div>
            </div>
          )}
        </div>
      )}

      {/* Audio visualization - simplified */}
      {recordingState === 'recording' && (
        <div className="flex items-end justify-center gap-1 h-16 w-full max-w-xs">
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className="rounded-full w-2 bg-red-500 transition-all duration-100"
              style={{
                height: `${Math.max(10, audioLevels[i] || 15)}%`
              }}
            />
          ))}
        </div>
      )}

      {/* Recording controls - simplified */}
      <div className="flex items-center gap-4">
        <Button
          onClick={recordingState === 'recording' ? stopRecording : startRecording}
          disabled={recordingState === 'recorded' || permissionState === 'denied'}
          className={`w-16 h-16 rounded-full transition-all ${
            permissionState === 'denied'
              ? 'bg-gray-400 cursor-not-allowed'
              : recordingState === 'recording'
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : recordingState === 'recorded'
                  ? 'bg-green-500 cursor-default'
                  : 'bg-[#e16349] hover:bg-[#d55a42]'
          } text-white shadow-lg`}
        >
          {permissionState === 'denied' ? (
            <MicOff className="w-6 h-6" />
          ) : recordingState === 'recording' ? (
            <div className="w-5 h-5 bg-white rounded-sm" />
          ) : recordingState === 'recorded' ? (
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>

        {/* Reset button - simplified */}
        {recordingState === 'recorded' && (
          <Button
            onClick={resetRecording}
            variant="ghost"
            className="w-12 h-12 rounded-full text-gray-600 hover:text-[#e16349] hover:bg-gray-100"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Timer - simplified */}
      {(recordingState === 'recording' || recordingState === 'recorded') && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            {recordingState === 'recording' && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
            <span className={`font-mono ${
              recordingState === 'recording' ? 'text-red-500' : 'text-gray-600'
            }`}>
              {formatTime(duration)}
            </span>
          </div>
          
          {/* Simple progress bar */}
          <div className="w-40 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                recordingState === 'recording' ? 'bg-red-500' : 'bg-[#e16349]'
              }`}
              style={{ width: getProgressWidth() }}
            />
          </div>
        </div>
      )}

      {/* Instructions - simplified */}
      <p className="text-gray-600 text-center max-w-md text-sm">
        {permissionState === 'denied' 
          ? 'Микрофон недоступен. Разрешите доступ или пропустите вопрос.'
          : recordingState === 'recording' 
            ? 'Говорите четко и развернуто'
            : recordingState === 'recorded'
              ? 'Запись готова! Нажмите кнопку сброса для повторной записи'
              : 'Нажмите на микрофон для записи ответа'
        }
      </p>
    </div>
  );
}
