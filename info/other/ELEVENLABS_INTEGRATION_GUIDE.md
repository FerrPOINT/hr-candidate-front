# 🎤 ElevenLabs Conversational AI Integration Guide

## 📋 Обзор

Полная интеграция ElevenLabs Conversational AI для голосовых интервью с учетом всех нюансов.

## 🏗️ Архитектура

### Flow данных:
1. **Кандидат авторизуется** → получает JWT токен
2. **Вызывается `startInterview`** → создается агент + возвращается signed URL + все данные
3. **Данные сохраняются в localStorage** → передаются в компонент интервью
4. **Компонент подключается к ElevenLabs** → использует signed URL
5. **Отправляется `contextual_update`** → с interviewId и sessionId
6. **Начинается голосовое интервью** → AI проводит собеседование

## 🔧 Компоненты

### 1. `useElevenLabs` Hook
```typescript
const {
  startSession,
  stopSession,
  sendMessage,
  isConnected,
  hasError,
  isEnded,
  isAgentSpeaking,
  isUserListening,
  isLoading,
  sessionData
} = useElevenLabs({
  onMessage: (text) => console.log('Сообщение:', text),
  onError: (error) => console.error('Ошибка:', error),
  onSessionEnd: () => console.log('Сессия завершена'),
  onAgentStart: () => console.log('Агент говорит'),
  onAgentEnd: () => console.log('Агент замолчал'),
  onUserStart: () => console.log('Пользователь говорит'),
  onUserEnd: () => console.log('Пользователь замолчал')
});
```

**Особенности:**
- ✅ Автоматически получает signed URL из localStorage
- ✅ Отправляет `contextual_update` после подключения
- ✅ Обрабатывает все типы сообщений ElevenLabs
- ✅ Управляет состоянием подключения
- ✅ Проверяет разрешения микрофона

### 2. `ProfessionalVoiceInterview` Component
```typescript
<ProfessionalVoiceInterview
  interviewId={123}
  onSessionEnd={() => navigate('/thank-you')}
  onError={(error) => console.error(error)}
/>
```

**Особенности:**
- ✅ Профессиональный UI с индикаторами состояния
- ✅ Отображение информации о позиции и прогрессе
- ✅ Анимированная кнопка микрофона
- ✅ Чат с сообщениями агента и пользователя
- ✅ Автоскролл к последним сообщениям

### 3. `VoiceInterviewService`
```typescript
const response = await VoiceInterviewService.startInterview(interviewId, {
  voiceMode: true,
  autoCreateAgent: true,
  includeCandidateData: true
});
```

**Особенности:**
- ✅ Только один метод `startInterview`
- ✅ Возвращает все необходимые данные
- ✅ Обработка ошибок
- ✅ Логирование

## 🎯 Ключевые нюансы

### 1. Contextual Update
```typescript
// Отправляется автоматически после подключения
{
  type: 'contextual_update',
  text: `interviewId: ${interviewId}, sessionId: ${sessionId}`
}
```

### 2. Обработка сообщений
```typescript
// Разные типы сообщений ElevenLabs
if (message.type === 'user_transcript') {
  // Пользователь закончил говорить
} else if (message.type === 'assistant_message') {
  // Агент отправил сообщение
} else if (message.type === 'conversation_started') {
  // Разговор начался
} else if (message.type === 'conversation_ended') {
  // Разговор завершился
}
```

### 3. Управление состоянием
```typescript
// Статусы подключения
'idle' | 'connecting' | 'connected' | 'error' | 'ended'

// Индикаторы активности
isAgentSpeaking: boolean
isUserListening: boolean
isConnected: boolean
```

### 4. Данные сессии
```typescript
// Сохраняются в localStorage
{
  signedUrl: string,
  sessionId: string,
  agentId: string,
  webhookUrl: string,
  candidateData: {
    position: { title, level },
    progress: { currentQuestion, totalQuestions },
    settings: { answerTime, language }
  },
  interviewId: number
}
```

## 🚀 Использование

### 1. Инициализация
```typescript
// В InterviewEntryForm.tsx
const startResponse = await VoiceInterviewService.startInterview(interviewId, {
  voiceMode: true,
  autoCreateAgent: true,
  includeCandidateData: true
});

localStorage.setItem('voiceSessionData', JSON.stringify({
  ...startResponse,
  interviewId
}));

navigate(`/interview/${interviewId}/session`);
```

### 2. Проведение интервью
```typescript
// В InterviewSession.tsx
<ProfessionalVoiceInterview
  interviewId={interviewId}
  onSessionEnd={handleSessionEnd}
  onError={handleError}
/>
```

### 3. Завершение
```typescript
const handleSessionEnd = async () => {
  await VoiceInterviewService.finishInterview(interviewId);
  localStorage.removeItem('voiceSessionData');
  navigate('/thank-you');
};
```

## ✅ Преимущества

1. **Простота**: Один вызов `startInterview` возвращает все данные
2. **Безопасность**: API ключ на сервере, signed URL для клиента
3. **Надежность**: Автоматическая обработка ошибок и переподключений
4. **UX**: Профессиональный интерфейс с индикаторами состояния
5. **Производительность**: Нет избыточных API вызовов

## 🔍 Отладка

### Логи в консоли:
- `🚀 Starting ElevenLabs session...`
- `✅ Connected to ElevenLabs`
- `📤 Sent contextual_update`
- `📨 Message from ElevenLabs`
- `🤖 Agent started speaking`
- `👤 User started speaking`

### Проверка данных:
```typescript
// В консоли браузера
console.log(JSON.parse(localStorage.getItem('voiceSessionData')));
```

## 🎯 Результат

Полнофункциональная система голосовых интервью с ElevenLabs, которая:
- Создает впечатление настоящего разговора
- Автоматически управляет всем процессом
- Предоставляет профессиональный UX
- Обрабатывает все edge cases
- Готова к продакшену 