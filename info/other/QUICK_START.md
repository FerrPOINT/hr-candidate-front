# 🚀 Быстрый старт - ElevenLabs AI Conversation ГОТОВО

## ✅ СТАТУС: ПОЛНОСТЬЮ ГОТОВО К ИСПОЛЬЗОВАНИЮ

Все компоненты настроены, протестированы и готовы для проведения AI conversational собеседований.

---

## 🎯 Что готово

### ✅ Основные компоненты:
- **ElevenLabsConversation** - центральный компонент голосового интервью
- **useElevenLabs** - хук для управления голосовыми сессиями  
- **VoiceInterviewService** - сервис для работы с backend API
- **ElevenLabs Proxy** - безопасная интеграция через backend
- **ElabsSession** - страница голосового интервью

### ✅ Архитектура:
- **Frontend**: React + ElevenLabs SDK (версия 0.2.2)
- **Backend**: Java API для управления агентами
- **Безопасность**: Прокси через backend (API ключ скрыт)
- **UX**: Индикаторы состояния, история разговора

---

## 🚀 Запуск за 3 шага

### 1. Настройка переменных окружения

Создайте файл `.env.local`:

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

---

## 🎯 Тестирование

### Быстрый тест:
1. Откройте `/interview-entry?positionId=123`
2. Введите данные кандидата
3. Перейдите на `/elabs/{interviewId}`
4. Начните голосовое интервью!

### Тестовые страницы:
- `/elevenlabs-test` - тест ElevenLabs SDK
- `/speech-test` - тест speech-to-speech
- `/test` - общие тесты

---

## 🔧 Технические детали

### Центральный компонент:
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
/>
```

### Хук управления:
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
  onSessionEnd: () => console.log('Сессия завершена')
});
```

### API сервис:
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