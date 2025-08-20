# 🔐 API Endpoints After Welcome Screen (with Candidate Token)

## 📋 Обзор

После приветственного окна (`InterviewEntryForm`) кандидат получает JWT токен, который автоматически добавляется ко всем последующим API запросам через заголовок `Authorization: Bearer <token>`.

## 🔑 Авторизация кандидата

### 1. Получение токена
```
POST /candidates/auth
Content-Type: application/json

{
  "firstName": "Иван",
  "lastName": "Иванов", 
  "email": "ivan@example.com",
  "phone": "+79991234567",
  "positionId": 123
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "candidate": {
    "id": 456,
    "firstName": "Иван",
    "lastName": "Иванов",
    "email": "ivan@example.com",
    "phone": "+79991234567",
    "positionId": 123,
    "status": "new"
  }
}
```

## 🎤 Голосовое интервью (ElabsSession)

### 2. Получение данных интервью
```
GET /interviews/{interviewId}
Authorization: Bearer <candidate_token>

Response:
{
  "interview": {
    "id": 789,
    "candidateId": 456,
    "positionId": 123,
    "status": "not_started",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "candidate": {
    "id": 456,
    "firstName": "Иван",
    "lastName": "Иванов",
    "email": "ivan@example.com"
  },
  "position": {
    "id": 123,
    "title": "Java Developer",
    "company": "Tech Corp",
    "description": "Разработка микросервисов"
  },
  "questions": [
    {
      "id": 1,
      "text": "Расскажите о вашем опыте работы с Java",
      "type": "text",
      "order": 1
    }
  ]
}
```

### 3. Запуск интервью с созданием агента
```
POST /interviews/{interviewId}/start
Authorization: Bearer <candidate_token>
Content-Type: application/json

{
  "voiceMode": true,
  "autoCreateAgent": true
}

Response:
{
  "interviewId": 789,
  "agentId": "agent_abc123",
  "sessionId": "session_xyz789",
  "status": "AGENT_CREATED",
  "message": "Агент успешно создан",
  "webhookUrl": "https://api.hr-recruiter.com/webhooks/elevenlabs/events"
}
```

### 4. Создание голосовой сессии (опционально)
```
POST /interviews/{interviewId}/voice/session
Authorization: Bearer <candidate_token>
Content-Type: application/json

{
  "voiceMode": true,
  "agentConfig": {
    "name": "Interview Agent",
    "description": "AI interviewer",
    "prompt": "Ты проводишь собеседование...",
    "voiceId": "pNInz6obpgDQGcFmaJgB",
    "tools": ["getNextQuestion", "saveAnswer", "endInterview"]
  },
  "voiceSettings": {
    "stability": 0.75,
    "similarityBoost": 0.85,
    "style": 0.5,
    "useSpeakerBoost": true
  }
}

Response:
{
  "sessionId": "session_xyz789",
  "agentId": "agent_abc123",
  "status": "CREATED",
  "webhookUrl": "https://api.hr-recruiter.com/webhooks/elevenlabs/events",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 5. Получение следующего вопроса
```
GET /interviews/{interviewId}/voice/next-question
Authorization: Bearer <candidate_token>

Response:
{
  "text": "Расскажите о вашем опыте работы с Java",
  "audioUrl": "https://api.elevenlabs.io/v1/text-to-speech/...",
  "durationMs": 5000,
  "confidence": 1.0,
  "timestamp": "2024-01-15T10:30:00Z",
  "type": "AGENT_QUESTION"
}
```

### 6. Сохранение голосового ответа
```
POST /interviews/{interviewId}/voice/answer?questionId={questionId}
Authorization: Bearer <candidate_token>
Content-Type: application/json

{
  "text": "Я работал с Java 3 года, занимался разработкой микросервисов...",
  "audioUrl": "https://storage.example.com/audio/answer_123.mp3",
  "durationMs": 15000,
  "confidence": 0.95,
  "timestamp": "2024-01-15T10:30:15Z",
  "type": "USER_ANSWER"
}

Response:
{
  "id": 999,
  "interviewId": 789,
  "questionId": 1,
  "answerText": "Я работал с Java 3 года, занимался разработкой микросервисов...",
  "audioUrl": "https://storage.example.com/audio/answer_123.mp3",
  "transcript": "Я работал с Java 3 года, занимался разработкой микросервисов...",
  "score": 85.5,
  "scoreJustification": "Хороший ответ с конкретными примерами",
  "createdAt": "2024-01-15T10:30:15Z"
}
```

### 7. Получение статуса голосовой сессии
```
GET /interviews/{interviewId}/voice/status
Authorization: Bearer <candidate_token>

Response:
{
  "sessionId": "session_xyz789",
  "status": "ACTIVE",
  "currentQuestion": 3,
  "totalQuestions": 10,
  "duration": 1800,
  "lastActivity": "2024-01-15T10:30:15Z"
}
```

### 8. Завершение голосовой сессии
```
POST /interviews/{interviewId}/voice/end
Authorization: Bearer <candidate_token>

Response:
{
  "success": true,
  "message": "Голосовая сессия завершена"
}
```

### 9. Завершение интервью
```
POST /interviews/{interviewId}/finish
Authorization: Bearer <candidate_token>

Response:
{
  "id": 789,
  "candidateId": 456,
  "positionId": 123,
  "status": "finished",
  "result": "successful",
  "startedAt": "2024-01-15T10:30:00Z",
  "finishedAt": "2024-01-15T10:45:00Z",
  "aiScore": 87.5,
  "answers": [
    {
      "id": 999,
      "questionId": 1,
      "answerText": "Я работал с Java 3 года...",
      "score": 85.5,
      "createdAt": "2024-01-15T10:30:15Z"
    }
  ]
}
```

## 🔄 Webhook события (от ElevenLabs)

### 10. Обработка webhook событий
```
POST /webhooks/elevenlabs/events
Content-Type: application/json
X-ElevenLabs-Signature: <signature>

{
  "type": "AGENT_MESSAGE",
  "interviewId": "789",
  "sessionId": "session_xyz789",
  "agentId": "agent_abc123",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "message": "Здравствуйте! Начнем интервью.",
    "durationMs": 3000
  }
}

Response:
{
  "success": true,
  "message": "Событие обработано"
}
```

## 📊 Дополнительные эндпоинты

### 11. Получение информации о позиции
```
GET /positions/{positionId}
Authorization: Bearer <candidate_token>

Response:
{
  "id": 123,
  "title": "Java Developer",
  "company": "Tech Corp",
  "description": "Разработка микросервисов",
  "level": "middle",
  "language": "ru",
  "topics": ["Java", "Spring", "Microservices"],
  "questionsCount": 10,
  "answerTime": 120
}
```

### 12. Получение вопросов с настройками
```
GET /positions/{positionId}/questions-with-settings
Authorization: Bearer <candidate_token>

Response:
{
  "questions": [
    {
      "id": 1,
      "text": "Расскажите о вашем опыте работы с Java",
      "type": "text",
      "order": 1,
      "isRequired": true
    }
  ],
  "interviewSettings": {
    "answerTime": 120,
    "language": "ru",
    "showOtherLang": false,
    "saveAudio": true,
    "saveVideo": false,
    "randomOrder": false,
    "questionType": "mixed",
    "questionsCount": 10,
    "checkType": "ai",
    "level": "middle"
  }
}
```

### 13. Получение информации о пользователе
```
GET /user/info
Authorization: Bearer <candidate_token>

Response:
{
  "phone": "+79991234567"
}
```

### 14. Получение информации о тарифе
```
GET /tariff/info
Authorization: Bearer <candidate_token>

Response:
{
  "interviewsLeft": 5,
  "until": "2024-02-15T00:00:00Z"
}
```

## 🔒 Безопасность

### Токен авторизации
- **Тип:** JWT (JSON Web Token)
- **Заголовок:** `Authorization: Bearer <token>`
- **Хранение:** localStorage (rememberMe=true) или sessionStorage
- **Автоматическое добавление:** Через `apiClient.ts` и `useAuthStore`

### Валидация токена
```javascript
// В apiClient.ts
const config = new Configuration({
  basePath,
  accessToken: () => useAuthStore.getState().token || '',
});
```

### Обработка ошибок авторизации
- **401 Unauthorized:** Токен истек или недействителен
- **403 Forbidden:** Недостаточно прав
- **Автоматический logout:** При ошибках авторизации

## 📝 Логирование

### Успешные запросы
```javascript
console.log('✅ Данные интервью получены:', interview);
console.log('✅ Агент создан на бэкенде:', newAgentId);
console.log('✅ Ответ сохранен на бэкенде');
console.log('✅ Голосовая сессия завершена');
console.log('✅ Интервью завершено');
```

### Ошибки
```javascript
console.error('❌ Ошибка инициализации сессии:', err);
console.error('❌ Ошибка сохранения ответа:', err);
console.error('❌ Ошибка получения вопроса:', err);
console.error('❌ Ошибка завершения сессии:', err);
console.error('❌ Ошибка завершения интервью:', err);
```

## 🎯 Полный поток API вызовов

1. **POST /candidates/auth** - получение токена
2. **GET /interviews/{id}** - данные интервью
3. **POST /interviews/{id}/start** - запуск с агентом
4. **GET /interviews/{id}/voice/next-question** - получение вопросов (цикл)
5. **POST /interviews/{id}/voice/answer** - сохранение ответов (цикл)
6. **POST /interviews/{id}/voice/end** - завершение сессии
7. **POST /interviews/{id}/finish** - завершение интервью

**Все запросы (кроме /candidates/auth) требуют токен кандидата!** 🔐 