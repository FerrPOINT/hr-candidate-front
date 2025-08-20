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

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        stream.getTracks().forEach(track => track.stop());
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

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
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
