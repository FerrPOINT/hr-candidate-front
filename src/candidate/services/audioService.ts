export interface AudioRecorderOptions {
  sampleRate?: number;
  channelCount?: number;
  bitDepth?: number;
}

export interface AudioPlayerOptions {
  volume?: number;
  playbackRate?: number;
}

class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private recordingStartTime: number = 0;
  private isRecording: boolean = false;

  /**
   * Проверить поддержку аудио API
   */
  isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /**
   * Запросить разрешение на доступ к микрофону
   */
  async requestMicrophonePermission(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      return stream;
    } catch (error: any) {
      console.error('Microphone permission error:', error);
      throw new Error('Не удалось получить доступ к микрофону');
    }
  }

  /**
   * Начать запись аудио
   */
  async startRecording(options: AudioRecorderOptions = {}): Promise<void> {
    try {
      const stream = await this.requestMicrophonePermission();
      
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      this.recordingStartTime = Date.now();
      this.isRecording = true;
    } catch (error: any) {
      console.error('Start recording error:', error);
      throw new Error('Ошибка начала записи');
    }
  }

  /**
   * Остановить запись аудио
   */
  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Запись не была начата'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        resolve(audioBlob);
      };

      this.mediaRecorder.onerror = (error) => {
        reject(new Error('Ошибка остановки записи'));
      };

      this.mediaRecorder.stop();
      
      // Остановить все треки потока
      if (this.mediaRecorder.stream) {
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
      this.isRecording = false;
    });
  }

  /**
   * Получить длительность записи в секундах
   */
  getRecordingDuration(): number {
    if (!this.isRecording) return 0;
    return (Date.now() - this.recordingStartTime) / 1000;
  }

  /**
   * Воспроизвести аудио из Blob
   */
  async playAudio(audioBlob: Blob, options: AudioPlayerOptions = {}): Promise<void> {
    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      this.audioElement = new Audio(audioUrl);
      
      if (options.volume !== undefined) {
        this.audioElement.volume = Math.max(0, Math.min(1, options.volume));
      }
      
      if (options.playbackRate !== undefined) {
        this.audioElement.playbackRate = options.playbackRate;
      }

      await this.audioElement.play();
    } catch (error: any) {
      console.error('Play audio error:', error);
      throw new Error('Ошибка воспроизведения аудио');
    }
  }

  /**
   * Воспроизвести аудио из URL
   */
  async playAudioFromUrl(audioUrl: string, options: AudioPlayerOptions = {}): Promise<void> {
    try {
      this.audioElement = new Audio(audioUrl);
      
      if (options.volume !== undefined) {
        this.audioElement.volume = Math.max(0, Math.min(1, options.volume));
      }
      
      if (options.playbackRate !== undefined) {
        this.audioElement.playbackRate = options.playbackRate;
      }

      await this.audioElement.play();
    } catch (error: any) {
      console.error('Play audio from URL error:', error);
      throw new Error('Ошибка воспроизведения аудио');
    }
  }

  /**
   * Остановить воспроизведение
   */
  stopAudio(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
  }

  /**
   * Пауза воспроизведения
   */
  pauseAudio(): void {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  /**
   * Возобновить воспроизведение
   */
  resumeAudio(): void {
    if (this.audioElement) {
      this.audioElement.play();
    }
  }

  /**
   * Получить текущее время воспроизведения
   */
  getCurrentTime(): number {
    return this.audioElement ? this.audioElement.currentTime : 0;
  }

  /**
   * Получить общую длительность аудио
   */
  getDuration(): number {
    return this.audioElement ? this.audioElement.duration : 0;
  }

  /**
   * Установить громкость (0-1)
   */
  setVolume(volume: number): void {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Получить громкость
   */
  getVolume(): number {
    return this.audioElement ? this.audioElement.volume : 0;
  }

  /**
   * Проверить, воспроизводится ли аудио
   */
  isPlaying(): boolean {
    return this.audioElement ? !this.audioElement.paused : false;
  }

  /**
   * Добавить обработчик события окончания воспроизведения
   */
  onEnded(callback: () => void): void {
    if (this.audioElement) {
      this.audioElement.addEventListener('ended', callback);
    }
  }

  /**
   * Добавить обработчик события изменения времени
   */
  onTimeUpdate(callback: (currentTime: number) => void): void {
    if (this.audioElement) {
      this.audioElement.addEventListener('timeupdate', () => {
        callback(this.audioElement!.currentTime);
      });
    }
  }

  /**
   * Очистить ресурсы
   */
  cleanup(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }
    
    if (this.mediaRecorder && this.mediaRecorder.stream) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.recordingStartTime = 0;
  }

  /**
   * Конвертировать Blob в Base64
   */
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Убираем префикс data:audio/...
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Конвертировать Base64 в Blob
   */
  base64ToBlob(base64: string, mimeType: string = 'audio/webm'): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
}

export const audioService = new AudioService();

