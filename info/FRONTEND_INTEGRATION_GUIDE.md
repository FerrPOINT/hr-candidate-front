# 🎤 Руководство по интеграции голосовых интервью (Frontend)

## Обзор

Система голосовых интервью теперь работает через **ElevenLabs Conversational AI** с использованием **signed URL** для безопасного подключения к WebSocket.

## Архитектура

```
Frontend (React) ←→ Backend (Spring Boot) ←→ ElevenLabs API
       ↓                    ↓                      ↓
   WebSocket           Signed URL           Agent Management
   Conversation        Generation           & Function Calling
```

## Основные изменения

### ❌ Старый подход (не используется):
- Создание сессий через `/v1/convai/agents/{agentId}/sessions`
- Прямое управление сессиями на backend

### ✅ Новый подход:
- Получение signed URL от backend
- Прямое WebSocket подключение к ElevenLabs
- Function calling через webhook'и

## Интеграция на Frontend

### 1. Установка ElevenLabs React SDK

```bash
npm install @elevenlabs/react
```

### 2. Компонент голосового интервью

```jsx
import React, { useState, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';

const VoiceInterview = ({ interviewId }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [signedUrl, setSignedUrl] = useState(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setIsConnected(true);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setIsConnected(false);
    },
    onMessage: (message) => {
      console.log('Received message:', message);
      // Обработка сообщений от агента
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
      setError(error.message);
    },
  });

  // Получение signed URL от backend
  const getSignedUrl = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/interviews/${interviewId}/voice/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourAuthToken}` // Ваш токен авторизации
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSignedUrl(data.signedUrl);
      
      console.log('Received signed URL:', data.signedUrl);
      
    } catch (err) {
      console.error('Failed to get signed URL:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Запуск голосового интервью
  const startInterview = async () => {
    try {
      // 1. Проверяем разрешения микрофона
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Освобождаем ресурсы

      // 2. Получаем signed URL
      await getSignedUrl();

      // 3. Запускаем сессию с ElevenLabs
      if (signedUrl) {
        await conversation.startSession({
          signedUrl: signedUrl
        });
      }

    } catch (err) {
      console.error('Failed to start interview:', err);
      setError(err.message);
    }
  };

  // Завершение интервью
  const endInterview = async () => {
    try {
      await conversation.endSession();
      
      // Уведомляем backend о завершении
      await fetch(`/api/v1/interviews/${interviewId}/voice/session/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${yourAuthToken}`
        }
      });

    } catch (err) {
      console.error('Failed to end interview:', err);
      setError(err.message);
    }
  };

  return (
    <div className="voice-interview">
      <h2>Голосовое интервью</h2>
      
      {error && (
        <div className="error">
          Ошибка: {error}
        </div>
      )}

      <div className="controls">
        {!isConnected ? (
          <button 
            onClick={startInterview} 
            disabled={isLoading}
            className="start-btn"
          >
            {isLoading ? 'Подключение...' : 'Начать интервью'}
          </button>
        ) : (
          <button 
            onClick={endInterview}
            className="end-btn"
          >
            Завершить интервью
          </button>
        )}
      </div>

      <div className="status">
        Статус: {isConnected ? 'Подключено' : 'Отключено'}
      </div>
    </div>
  );
};

export default VoiceInterview;
```

### 3. Обработка сообщений от агента

```jsx
const conversation = useConversation({
  onMessage: (message) => {
    console.log('Message from agent:', message);
    
    // Типы сообщений от агента
    switch (message.type) {
      case 'agent_question':
        // Агент задает вопрос
        console.log('Agent question:', message.text);
        break;
        
      case 'agent_thinking':
        // Агент думает (может показать индикатор загрузки)
        console.log('Agent is thinking...');
        break;
        
      case 'agent_speaking':
        // Агент говорит
        console.log('Agent is speaking:', message.text);
        break;
        
      case 'agent_silent':
        // Агент молчит (ожидает ответа кандидата)
        console.log('Agent is waiting for response...');
        break;
        
      case 'interview_ended':
        // Интервью завершено
        console.log('Interview ended');
        handleInterviewEnd();
        break;
        
      default:
        console.log('Unknown message type:', message.type);
    }
  },
});
```

## API Endpoints

### 1. Создание голосовой сессии
```http
POST /api/v1/interviews/{interviewId}/voice/session
Authorization: Bearer {token}

Response:
{
  "sessionId": "signed-url-session",
  "agentId": "agent_xxx",
  "status": "CREATED",
  "webhookUrl": "/api/v1/webhooks/elevenlabs/events",
  "signedUrl": "wss://api.elevenlabs.io/v1/convai/conversation?...",
  "createdAt": "2024-01-01T12:00:00Z"
}
```

### 2. Завершение сессии
```http
POST /api/v1/interviews/{interviewId}/voice/session/end
Authorization: Bearer {token}
```

### 3. Статус сессии
```http
GET /api/v1/interviews/{interviewId}/voice/session/status
Authorization: Bearer {token}

Response:
{
  "status": "ACTIVE" // CREATED, ACTIVE, ENDED, ERROR
}
```

## Безопасность

### ✅ Что безопасно:
- **API ключ ElevenLabs** остается на backend
- **Signed URL** содержит все необходимые токены
- **Webhook'и** защищены авторизацией

### ⚠️ Важные моменты:
- **Signed URL** имеет ограниченное время жизни
- **Микрофон** требует разрешения пользователя
- **CORS** должен быть настроен для вашего домена

## Обработка ошибок

### Типичные ошибки:

1. **Микрофон недоступен**
```jsx
try {
  await navigator.mediaDevices.getUserMedia({ audio: true });
} catch (err) {
  alert('Для голосового интервью необходим доступ к микрофону');
}
```

2. **Signed URL истек**
```jsx
if (error.message.includes('expired') || error.message.includes('invalid')) {
  // Получаем новый signed URL
  await getSignedUrl();
  await conversation.startSession({ signedUrl: newSignedUrl });
}
```

3. **Сетевая ошибка**
```jsx
if (error.message.includes('network') || error.message.includes('connection')) {
  // Показываем сообщение о проблемах с сетью
  setError('Проблемы с подключением. Проверьте интернет-соединение.');
}
```

## Тестирование

### Локальная разработка:
1. Запустите backend с профилем `local`
2. Убедитесь, что ElevenLabs API ключ настроен
3. Проверьте, что агент создается при запуске
4. Тестируйте с реальным микрофоном

### Отладка:
```jsx
// Включите подробное логирование
const conversation = useConversation({
  onConnect: (wsUrl) => {
    console.log('WebSocket URL:', wsUrl);
    // URL содержит параметры: interview_id, session_id
  },
  onMessage: (message) => {
    console.log('Raw message:', JSON.stringify(message, null, 2));
  },
});
```

## Миграция с старой системы

### Что изменилось:
- ❌ Больше не нужно управлять сессиями напрямую
- ❌ Нет прямых вызовов ElevenLabs API
- ✅ Используйте только signed URL
- ✅ Все через WebSocket соединение

### Обновление кода:
```jsx
// Старый код (не работает)
const session = await fetch('/api/v1/interviews/123/voice/session', {
  method: 'POST'
});

// Новый код
const { signedUrl } = await fetch('/api/v1/interviews/123/voice/session', {
  method: 'POST'
}).then(r => r.json());

await conversation.startSession({ signedUrl });
```

## Поддержка

При возникновении проблем:
1. Проверьте логи в консоли браузера
2. Убедитесь, что backend запущен и доступен
3. Проверьте настройки CORS
4. Убедитесь, что ElevenLabs API ключ валиден

---

**Готово к использованию!** 🚀 