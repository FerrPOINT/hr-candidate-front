# 🚀 Быстрый старт ElevenLabs AI Conversation

## ✅ Что готово к использованию

### 🎯 Основные компоненты:
- ✅ **ElevenLabsConversation** - центральный компонент голосового интервью
- ✅ **useElevenLabs** - хук для управления голосовыми сессиями  
- ✅ **VoiceInterviewService** - сервис для работы с backend API
- ✅ **ElevenLabs Proxy** - безопасная интеграция через backend
- ✅ **ElabsSession** - страница голосового интервью

### 🔧 Архитектура:
- ✅ **Frontend**: React + ElevenLabs SDK
- ✅ **Backend**: Java API для управления агентами
- ✅ **Безопасность**: Прокси через backend (API ключ не светится)
- ✅ **UX**: Индикаторы состояния, история разговора

---

## 🚀 Быстрый запуск

### 1. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
# ElevenLabs Configuration
REACT_APP_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
REACT_APP_ELEVENLABS_DEFAULT_VOICE_ID=pNInz6obpgDQGcFmaJgB

# Backend Configuration  
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_USE_PROXY=true
```

### 2. Получение API ключа ElevenLabs

1. Зарегистрируйтесь на [elevenlabs.io](https://elevenlabs.io)
2. Перейдите в [API Keys](https://elevenlabs.io/app/api-keys)
3. Создайте новый API ключ
4. Скопируйте ключ в `.env.local`

### 3. Запуск приложения

```bash
npm install
npm start
```

### 4. Тестирование

1. Откройте `/interview-entry?positionId=123`
2. Введите данные кандидата
3. Перейдите на `/elabs/{interviewId}`
4. Начните голосовое интервью!

---

## 🎯 Полный поток работы

### Шаг 1: Приветственная страница
```
URL: /interview-entry?positionId=123
↓
Пользователь вводит: имя, фамилия, email, телефон
↓
POST /candidates/auth → получение JWT токена
↓
Перенаправление на /elabs/{interviewId}
```

### Шаг 2: Инициализация голосового интервью
```
URL: /elabs/{interviewId}
↓
POST /interviews/{id}/start → создание агента на backend
↓
Инициализация ElevenLabs сессии
↓
Отображение ElevenLabsConversation компонента
```

### Шаг 3: Голосовое взаимодействие
```
ElevenLabsConversation компонент
↓
useConversation хук (@elevenlabs/react)
↓
Реальное голосовое взаимодействие
↓
Автоматическая транскрипция ответов
↓
Сохранение на backend через VoiceInterviewService
```

### Шаг 4: Завершение
```
Завершение голосовой сессии
↓
POST /interviews/{id}/voice/end
↓
POST /interviews/{id}/finish
↓
Перенаправление на /interviews
```

---

## 🔧 Технические детали

### Центральный компонент: ElevenLabsConversation

```tsx
<ElevenLabsConversation
  agentId={agentId}
  voiceId="pNInz6obpgDQGcFmaJgB"
  isConnected={isConnected}
  onMessage={(message) => {
    // Обработка транскрипции речи пользователя
    // Автоматическое сохранение на backend
  }}
  onError={(error) => {
    // Обработка ошибок
  }}
  onSessionEnd={() => {
    // Завершение сессии
  }}
  // ... другие обработчики событий
/>
```

### Хук управления: useElevenLabs

```tsx
const {
  sessionId,
  status,
  isListening,
  isSpeaking,
  isAgentSpeaking,
  isUserListening,
  startSession,
  stopSession,
  sendMessage,
  isConnected,
  hasError,
  isEnded
} = useElevenLabs({
  agentId: 'your-agent-id',
  voiceId: 'pNInz6obpgDQGcFmaJgB',
  onMessage: (message) => console.log('Сообщение:', message),
  onError: (error) => console.error('Ошибка:', error),
  onSessionEnd: () => console.log('Сессия завершена'),
  onAgentStart: () => console.log('Агент говорит'),
  onAgentEnd: () => console.log('Агент замолчал'),
  onUserStart: () => console.log('Пользователь говорит'),
  onUserEnd: () => console.log('Пользователь замолчал')
});
```

### Сервис API: VoiceInterviewService

```tsx
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

---

## 🎤 Доступные голоса

- **Adam** (pNInz6obpgDQGcFmaJgB) - Мужской голос
- **Bella** (EXAVITQu4vr4xnSDxMaL) - Женский голос  
- **Rachel** (21m00Tcm4TlvDq8ikWAM) - Женский голос
- **Domi** (AZnzlk1XvdvUeBnXmlld) - Женский голос

---

## 🔒 Безопасность

- ✅ **API ключ скрыт** - все запросы идут через backend
- ✅ **JWT токены** - авторизация кандидатов
- ✅ **HTTPS** - защищенная передача данных
- ✅ **CORS** - настройки для безопасности

---

## 🐛 Отладка

### Проверка конфигурации:
```javascript
// В консоли браузера
console.log('ElevenLabs Config:', elevenLabsConfig);
elevenLabsConfig.validateConfig();
```

### Проверка прокси:
```javascript
// В консоли браузера
console.log('Proxy status:', isElevenLabsProxyInitialized());
```

### Логирование событий:
```javascript
// Все события логируются в консоль
// 🎤 Голосовая сессия началась
// 🤖 Агент начал говорить
// 👤 Пользователь начал говорить
// 📨 Сообщение от агента
// ✅ Ответ сохранен на сервере
```

---

## ✅ Готово к использованию!

Все компоненты настроены и готовы для проведения голосовых интервью с ElevenLabs AI. Система полностью интегрирована с backend и обеспечивает безопасное, качественное голосовое взаимодействие.

**Следующие шаги:**
1. Настройте API ключ ElevenLabs
2. Запустите backend сервер
3. Протестируйте на `/elevenlabs-test`
4. Запустите первое голосовое интервью!

🚀 **Удачи с AI собеседованиями!** 