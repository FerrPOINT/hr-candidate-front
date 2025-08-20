# 🎤 Speech-to-Speech с ElevenLabs Conversation AI

## 📋 Описание

Реализация голосового интервью с использованием ElevenLabs Conversation AI. Фронтенд обеспечивает только speech-to-speech взаимодействие, вся бизнес-логика (агенты, вопросы, ответы) находится на бэкенде.

## 🏗️ Архитектура

```
Frontend (React) ←→ ElevenLabs SDK ←→ ElevenLabs API
       ↓
Backend API (Java) ←→ Database
```

### **Frontend (React) - Только speech-to-speech:**
- ✅ ElevenLabs Conversation AI для голосового взаимодействия
- ✅ Получение вопросов от бэкенда через API
- ✅ Отправка ответов на бэкенд через API
- ✅ Управление голосовой сессией

### **Backend (Java) - Вся бизнес-логика:**
- ✅ Управление агентами
- ✅ Webhook обработчики
- ✅ Логика вопросов/ответов
- ✅ Валидация и безопасность

## 🚀 Быстрый старт

### 1. Настройка переменных окружения

Создайте файл `.env.local`:

```env
REACT_APP_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
REACT_APP_BACKEND_URL=http://localhost:8080
```

### 2. Установка зависимостей

```bash
npm install @elevenlabs/react
```

### 3. Создание агента в ElevenLabs

1. Перейдите на [ElevenLabs Console](https://console.elevenlabs.io)
2. Создайте нового агента
3. Скопируйте ID агента

### 4. Запуск приложения

```bash
npm start
```

## 📱 Использование

### Компонент ElabsSession

```tsx
import ElabsSession from './pages/ElabsSession';

// Использование
<ElabsSession 
  useProxy={true}
  backendUrl="http://localhost:8080"
  apiKey="your_api_key"
/>
```

### Хук useElevenLabs

```tsx
import { useElevenLabs } from './hooks/useElevenLabs';

const {
  sessionId,
  status,
  isListening,
  isSpeaking,
  startSession,
  stopSession,
  sendMessage,
  sendQuestionToAgent,
  isConnected,
  hasError,
  isEnded
} = useElevenLabs({
  agentId: 'your-agent-id',
  voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam
  onMessage: (message) => console.log('Сообщение от агента:', message),
  onError: (error) => console.error('Ошибка:', error),
  onSessionEnd: () => console.log('Сессия завершена'),
  onQuestionReceived: (question) => console.log('Получен вопрос:', question),
  onAnswerSent: (answer) => console.log('Отправлен ответ:', answer)
});
```

### Сервис VoiceInterviewService

```tsx
import VoiceInterviewService from './services/voiceInterviewService';

// Запуск интервью
const session = await VoiceInterviewService.startInterview(interviewId, {
  voiceMode: true,
  autoCreateAgent: true
});

// Получение вопроса
const question = await VoiceInterviewService.getNextQuestion(interviewId);

// Сохранение ответа
await VoiceInterviewService.saveVoiceAnswer(interviewId, questionId, {
  text: 'Ответ пользователя',
  durationMs: 5000,
  confidence: 0.95,
  timestamp: new Date().toISOString()
});

// Завершение сессии
await VoiceInterviewService.endVoiceSession(interviewId);
```

## 🔧 API Endpoints

### Backend API (Java)

- `POST /interviews/{id}/start` - Запуск интервью с голосовым режимом
- `POST /interviews/{id}/voice/session` - Создание голосовой сессии
- `GET /interviews/{id}/voice/next-question` - Получение следующего вопроса
- `POST /interviews/{id}/voice/answer` - Сохранение голосового ответа
- `POST /interviews/{id}/voice/end` - Завершение голосовой сессии
- `GET /interviews/{id}/voice/status` - Статус голосовой сессии

### ElevenLabs API

- `POST /v1/conversations/sessions` - Создание сессии
- `POST /v1/conversations/sessions/{sessionId}/messages` - Отправка сообщения
- `DELETE /v1/conversations/sessions/{sessionId}` - Завершение сессии

## 🎯 Поток взаимодействия

1. **Инициализация**
   - Пользователь открывает страницу интервью
   - Frontend получает данные интервью с бэкенда
   - Бэкенд создает агента в ElevenLabs
   - Frontend запускает голосовую сессию

2. **Получение вопроса**
   - Frontend запрашивает следующий вопрос с бэкенда
   - Бэкенд возвращает вопрос
   - Frontend отправляет вопрос агенту для озвучивания
   - Агент озвучивает вопрос пользователю

3. **Ответ пользователя**
   - Пользователь отвечает голосом
   - ElevenLabs транскрибирует речь
   - Frontend получает транскрипт
   - Frontend отправляет ответ на бэкенд

4. **Завершение**
   - Повтор шагов 2-3 до окончания вопросов
   - Frontend завершает голосовую сессию
   - Бэкенд завершает интервью

## 🔒 Безопасность

- Все API вызовы используют JWT токены
- ElevenLabs API ключи хранятся в переменных окружения
- Webhook подписи валидируются на бэкенде
- HTTPS обязателен для production

## 🐛 Отладка

### Проверка подключения

```javascript
// Проверка статуса сессии
console.log('Voice session status:', voiceStatus);
console.log('Is connected:', isConnected);
console.log('Has error:', hasError);
```

### Логи ElevenLabs

```javascript
// Включение подробных логов
console.log('ElevenLabs session ID:', sessionId);
console.log('Agent speaking:', isSpeaking);
console.log('User listening:', isListening);
```

### Проверка API

```javascript
// Проверка бэкенд API
const status = await VoiceInterviewService.getVoiceSessionStatus(interviewId);
console.log('Backend session status:', status);
```

## 📊 Мониторинг

### Метрики для отслеживания

- Время подключения к ElevenLabs
- Качество транскрипции
- Время ответа пользователя
- Количество ошибок
- Статус сессий

### Логирование

```javascript
// Структурированные логи
console.log('Voice session event', {
  type: 'session_started',
  interviewId,
  sessionId,
  timestamp: new Date().toISOString()
});
```

## 🚀 Production

### Требования

- HTTPS сертификат
- Валидный ElevenLabs API ключ
- Настроенный бэкенд с webhook обработчиками
- Мониторинг и логирование

### Развертывание

1. Настройте production переменные окружения
2. Убедитесь в доступности бэкенда
3. Проверьте webhook URL в ElevenLabs
4. Протестируйте полный цикл интервью

## 📞 Поддержка

При возникновении проблем:

1. Проверьте консоль браузера
2. Убедитесь в поддержке Web Audio API
3. Проверьте подключение к интернету
4. Обратитесь к технической поддержке

---

**Версия**: 1.0.0  
**Дата**: 2024  
**Автор**: HR Recruiter Team 