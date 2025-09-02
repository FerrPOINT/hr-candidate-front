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
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private mediaElementSource: MediaElementAudioSourceNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private recordingStartTime: number = 0;
  private isRecording: boolean = false;

  private readonly defaultMasterVolume: number = 0.8;
  private readonly fadeInDurationMs: number = 350;

  /**
   * Проверить поддержку аудио API
   */
  isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  private ensureAudioGraph(): void {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {
        this.audioContext = null;
      }
    }
    if (!this.audioContext) return;

    if (!this.masterGain) {
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.defaultMasterVolume;
    }

    if (!this.compressor) {
      this.compressor = this.audioContext.createDynamicsCompressor();
      // Базовые мягкие настройки для выравнивания громкости
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 20;
      this.compressor.ratio.value = 3;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.25;
    }

    // Соединяем статику: compressor -> master -> destination (однократно)
    try {
      // Проверим, не подключены ли уже
      const destination = this.audioContext.destination;
      // Попытка двойного connect не бросает, но избежим
      this.compressor.disconnect();
      this.masterGain.disconnect();
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(destination);
    } catch {}
  }

  private connectElementToGraph(audio: HTMLAudioElement): void {
    if (!this.audioContext) return;
    // Очистим предыдущий источник, если был
    try {
      this.mediaElementSource?.disconnect();
    } catch {}
    this.mediaElementSource = null;

    try {
      // Для стабильной работы WebAudio (и CORS) безопасно выставить anonymous
      try { (audio as any).crossOrigin = (audio as any).crossOrigin ?? 'anonymous'; } catch {}
      this.mediaElementSource = this.audioContext.createMediaElementSource(audio);
      if (this.compressor) {
        this.mediaElementSource.connect(this.compressor);
      } else if (this.masterGain) {
        this.mediaElementSource.connect(this.masterGain);
      } else {
        this.mediaElementSource.connect(this.audioContext.destination);
      }
    } catch {
      // В некоторых браузерах createMediaElementSource может бросить, оставим фолбэк на прямое воспроизведение
      this.mediaElementSource = null;
    }
  }

  private async fadeIn(): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;
    const now = this.audioContext.currentTime;
    const target = Math.max(0, Math.min(1, this.masterGain.gain.value || this.defaultMasterVolume));
    // Начнем с нуля и поднимем к target за fadeInDurationMs
    try {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(target, now + this.fadeInDurationMs / 1000);
    } catch {
      // Fallback линейный
      this.masterGain.gain.setValueAtTime(0, now);
      this.masterGain.gain.linearRampToValueAtTime(target, now + this.fadeInDurationMs / 1000);
    }
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
      // Обнулим громкость элемента, мастер-громкость управляет уровнем
      if (this.audioElement) this.audioElement.volume = 1;
      
      if (options.volume !== undefined) {
        // При наличии AudioContext — перенастроим master gain, иначе используем громкость элемента
        this.ensureAudioGraph();
        if (this.masterGain) {
          this.masterGain.gain.value = Math.max(0, Math.min(1, options.volume));
        } else {
          this.audioElement.volume = Math.max(0, Math.min(1, options.volume));
        }
      }
      
      if (options.playbackRate !== undefined) {
        this.audioElement.playbackRate = options.playbackRate;
      }

      // Подключим к графу и сделаем мягкий fade-in
      this.ensureAudioGraph();
      this.connectElementToGraph(this.audioElement);
      // Постараемся резюмировать контекст перед проигрыванием (autoplay policy)
      if (this.audioContext && this.audioContext.state !== 'running') {
        try { await this.audioContext.resume(); } catch {}
      }
      await this.audioElement.play();
      await this.fadeIn();
    } catch (error: any) {
      console.error('Play audio error:', error);
      // Фолбэк: отключаем WebAudio и пробуем напрямую через element.volume
      try {
        if (this.mediaElementSource) {
          try { this.mediaElementSource.disconnect(); } catch {}
          this.mediaElementSource = null;
        }
        if (this.audioElement) {
          if (options.volume !== undefined) {
            this.audioElement.volume = Math.max(0, Math.min(1, options.volume));
          }
          await this.audioElement.play();
          return;
        }
      } catch {}
      throw new Error('Ошибка воспроизведения аудио');
    }
  }

  /**
   * Воспроизвести аудио из URL
   */
  async playAudioFromUrl(audioUrl: string, options: AudioPlayerOptions = {}): Promise<void> {
    try {
      this.audioElement = new Audio(audioUrl);
      if (this.audioElement) this.audioElement.volume = 1;
      // Оценим, можно ли безопасно подключать WebAudio граф (same-origin)
      let isSameOrigin = true;
      try {
        const u = new URL(audioUrl, window.location.href);
        isSameOrigin = (u.origin === window.location.origin);
      } catch { isSameOrigin = true; }
      
      if (options.volume !== undefined) {
        if (isSameOrigin) {
          this.ensureAudioGraph();
          if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, options.volume));
          } else {
            this.audioElement.volume = Math.max(0, Math.min(1, options.volume));
          }
        } else {
          // Для cross-origin без CORS используем громкость элемента
          this.audioElement.volume = Math.max(0, Math.min(1, options.volume));
        }
      }
      
      if (options.playbackRate !== undefined) {
        this.audioElement.playbackRate = options.playbackRate;
      }

      if (isSameOrigin) {
        this.ensureAudioGraph();
        this.connectElementToGraph(this.audioElement);
        if (this.audioContext && this.audioContext.state !== 'running') {
          try { await this.audioContext.resume(); } catch {}
        }
        await this.audioElement.play();
        await this.fadeIn();
      } else {
        // Фолбэк: проигрываем напрямую без WebAudio (во избежание CORS-блокировок тишиной)
        await this.audioElement.play();
      }
    } catch (error: any) {
      console.error('Play audio from URL error:', error);
      // Фолбэк на прямое воспроизведение без WebAudio
      try {
        if (this.mediaElementSource) {
          try { this.mediaElementSource.disconnect(); } catch {}
          this.mediaElementSource = null;
        }
        if (this.audioElement) {
          if (options.volume !== undefined) {
            this.audioElement.volume = Math.max(0, Math.min(1, options.volume));
          }
          await this.audioElement.play();
          return;
        }
      } catch {}
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
    // Отсоединим источник от графа, чтобы избежать наложений
    try {
      this.mediaElementSource?.disconnect();
    } catch {}
    this.mediaElementSource = null;
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
    this.ensureAudioGraph();
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
      return;
    }
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Установить скорость воспроизведения
   */
  setPlaybackRate(rate: number): void {
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
  }

  /**
   * Задать мастер-громкость (через Web Audio API)
   */
  setMasterVolume(volume: number): void {
    this.ensureAudioGraph();
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
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
    try { this.mediaElementSource?.disconnect(); } catch {}
    this.mediaElementSource = null;
    
    if (this.mediaRecorder && this.mediaRecorder.stream) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.recordingStartTime = 0;

    // Не закрываем AudioContext жестко (может переиспользоваться), но можно уменьшить громкость
    try {
      if (this.masterGain) {
        const now = this.audioContext ? this.audioContext.currentTime : undefined;
        if (now !== undefined) {
          this.masterGain.gain.cancelScheduledValues(now);
          this.masterGain.gain.setValueAtTime(this.defaultMasterVolume, now);
        } else {
          this.masterGain.gain.value = this.defaultMasterVolume;
        }
      }
    } catch {}
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

