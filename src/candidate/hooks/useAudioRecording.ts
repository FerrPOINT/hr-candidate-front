import { useState, useCallback, useRef } from 'react';

export const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopPromiseRef = useRef<{ resolve: (b: Blob | null) => void; reject: (e: any) => void } | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Prefer a widely supported mimeType when available
      const preferredMime = 'audio/webm';
      const canUsePreferred = typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(preferredMime);
      const mediaRecorder = canUsePreferred ? new MediaRecorder(stream, { mimeType: preferredMime }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setAudioBlob(null);
      setAudioUrl(null);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        try {
          const chunkType = audioChunksRef.current[0]?.type || mediaRecorder.mimeType || 'audio/webm';
          const blob = new Blob(audioChunksRef.current, { type: chunkType });
          const url = URL.createObjectURL(blob);
          setAudioBlob(blob);
          setAudioUrl(url);
          stream.getTracks().forEach(track => track.stop());
          // Разрешаем промис остановки, если ждут
          if (stopPromiseRef.current) {
            stopPromiseRef.current.resolve(blob);
            stopPromiseRef.current = null;
          }
        } catch (e) {
          if (stopPromiseRef.current) {
            stopPromiseRef.current.resolve(null);
            stopPromiseRef.current = null;
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Не удалось получить доступ к микрофону');
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    if (mediaRecorderRef.current && isRecording) {
      const p = new Promise<Blob | null>((resolve, reject) => {
        stopPromiseRef.current = { resolve, reject };
      });
      try {
        // Запрос последнего чанка до остановки
        mediaRecorderRef.current.requestData?.();
      } catch {}
      // Небольшая задержка, чтобы дать fired ondataavailable
      setTimeout(() => {
        try { mediaRecorderRef.current?.stop(); } catch {}
      }, 30);
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return p;
    }
    return Promise.resolve(audioBlob);
  }, [isRecording, audioBlob]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      void stopRecording();
    } else {
      void startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const playAudio = useCallback(() => {
    if (audioUrl) {
      if (!audioElementRef.current) {
        audioElementRef.current = new Audio(audioUrl);
        audioElementRef.current.onended = () => setIsPlaying(false);
        audioElementRef.current.onpause = () => setIsPlaying(false);
        audioElementRef.current.onplay = () => setIsPlaying(true);
      }
      
      if (isPlaying) {
        audioElementRef.current.pause();
      } else {
        audioElementRef.current.play();
      }
    }
  }, [audioUrl, isPlaying]);

  const stopAudio = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const clearAudio = useCallback(() => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    stopAudio();
    
    if (audioElementRef.current) {
      audioElementRef.current = null;
    }
  }, [stopAudio]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    isRecording,
    isPlaying,
    audioBlob,
    audioUrl,
    recordingTime,
    startRecording,
    stopRecording,
    toggleRecording,
    playAudio,
    stopAudio,
    clearAudio,
    formatTime
  };
};
