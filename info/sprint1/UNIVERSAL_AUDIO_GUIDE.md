# Универсальное руководство по работе с аудио

## Новая архитектура: Универсальный AudioService

### Проблема
- `MediaRecorder` - это Web API, который работает только в браузере
- На сервере (Linux/Node.js) нет доступа к микрофону и MediaRecorder
- Нужно единое решение для браузера и сервера

### Решение
**Универсальный AudioService, который автоматически определяет среду выполнения:**

```typescript
// Проверяет, где выполняется код
private isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined';
}
```

## Архитектура

### 1. **В браузере** (клиент)
```typescript
// ✅ Работает
const audioService = new AudioService();
await audioService.startRecording(); // getUserMedia + MediaRecorder
const blob = await audioService.stopRecording();
const result = await audioService.transcribeAudio(blob); // API call
```

### 2. **На сервере** (Node.js/Linux)
```typescript
// ✅ Работает только транскрибация
const audioService = new AudioService();
const result = await audioService.transcribeAudio(audioBlob); // API call
// ❌ startRecording() - ошибка "Запись аудио доступна только в браузере"
```

## API Reference

### `checkSupport()`
```typescript
const support = await audioService.checkSupport();
// {
//   isBrowser: true/false,
//   getUserMedia: true/false,
//   mediaRecorder: true/false,
//   audioContext: true/false,
//   supportedFormats: ['audio/webm', 'audio/mp4', ...]
// }
```

### `startRecording(options)` - только в браузере
```typescript
await audioService.startRecording({
  duration: 30,        // секунды
  quality: 'high',     // 'low' | 'medium' | 'high'
  format: 'webm',      // 'wav' | 'webm' | 'mp3'
  sampleRate: 48000,   // частота дискретизации
  channels: 1          // количество каналов
});
```

### `stopRecording()` - только в браузере
```typescript
const audioBlob = await audioService.stopRecording();
// Возвращает Blob с записанным аудио
```

### `transcribeAudio(blob)` - работает везде
```typescript
const result = await audioService.transcribeAudio(audioBlob);
// {
//   success: true/false,
//   transcript: "распознанный текст",
//   error?: "описание ошибки"
// }
```

### `transcribeInterviewAnswer(blob, interviewId, questionId)` - работает везде
```typescript
const result = await audioService.transcribeInterviewAnswer(
  audioBlob, 
  interviewId, 
  questionId
);
// Сохраняет в БД и возвращает отформатированный текст
```

## Примеры использования

### React компонент
```typescript
import { audioService } from '../services/audioService';

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const startRecording = async () => {
    try {
      // Проверяем поддержку автоматически
      audioService.setLevelChangeHandler(setAudioLevel);
      await audioService.startRecording({ duration: 60 });
      setIsRecording(true);
    } catch (error) {
      console.error('Ошибка записи:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const blob = await audioService.stopRecording();
      const result = await audioService.transcribeAudio(blob);
      console.log('Транскрипт:', result.transcript);
    } catch (error) {
      console.error('Ошибка остановки:', error);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Начать запись
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Остановить запись
      </button>
      {audioLevel > 0 && (
        <div className="audio-level" style={{width: `${audioLevel}%`}} />
      )}
    </div>
  );
};
```

### Node.js сервер
```typescript
import { audioService } from './services/audioService';

// Обработка загруженного аудио файла
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const audioBlob = req.file.buffer;
    const result = await audioService.transcribeAudio(audioBlob);
    
    res.json({
      success: result.success,
      transcript: result.transcript
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка транскрибации' });
  }
});
```

## Обработка ошибок

### Браузер не поддерживает аудио
```typescript
try {
  await audioService.startRecording();
} catch (error) {
  if (error.message.includes('браузер не поддерживает')) {
    // Показать сообщение пользователю
    showBrowserNotSupportedMessage();
  }
}
```

### Нет доступа к микрофону
```typescript
try {
  await audioService.requestPermission();
} catch (error) {
  if (error.message.includes('доступ к микрофону')) {
    // Показать инструкции по разрешению доступа
    showMicrophonePermissionInstructions();
  }
}
```

### Серверная ошибка транскрибации
```typescript
const result = await audioService.transcribeAudio(blob);
if (!result.success) {
  console.error('Ошибка транскрибации:', result.error);
  // Показать пользователю сообщение об ошибке
}
```

## Поддерживаемые форматы

### Запись (браузер)
- **WebM** (Opus) - лучший для речи
- **MP4** (AAC) - универсальный
- **WAV** - без сжатия

### Транскрибация (везде)
- **WebM** ✅
- **MP3** ✅
- **WAV** ✅
- **OGG** ✅
- **M4A** ✅

## Производительность

### Браузер
- **Запись**: getUserMedia + MediaRecorder
- **Анализ уровня**: Web Audio API
- **Транскрибация**: HTTP API

### Сервер
- **Запись**: ❌ Недоступно
- **Анализ уровня**: ❌ Недоступно
- **Транскрибация**: ✅ HTTP API + AI сервисы

## Безопасность

### Браузер
- Запрос разрешения на микрофон
- HTTPS обязателен для getUserMedia
- Аудио не покидает браузер без разрешения

### Сервер
- Валидация загружаемых файлов
- Ограничение размера файлов
- Аутентификация API запросов

## Миграция с MediaRecorder

### Было (только браузер)
```typescript
const mediaRecorder = new MediaRecorder(stream);
mediaRecorder.start();
// ... сложная логика
```

### Стало (универсально)
```typescript
const audioService = new AudioService();
await audioService.startRecording();
// ... простая логика
```

## Заключение

Новая архитектура обеспечивает:
- ✅ **Универсальность** - работает в браузере и на сервере
- ✅ **Простота** - единый API для всех платформ
- ✅ **Надежность** - автоматическая обработка ошибок
- ✅ **Производительность** - оптимизировано для каждой среды
- ✅ **Безопасность** - правильная обработка разрешений

**Запись аудио всегда происходит в браузере, транскрибация работает везде!** 