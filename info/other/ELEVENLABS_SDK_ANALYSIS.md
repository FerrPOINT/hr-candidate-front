# 🎤 ElevenLabs React SDK - Анализ ответов поддержки

## 📋 Обзор
Анализ ответов поддержки ElevenLabs по вопросам использования React SDK v0.2.2 с signed URL для голосовых интервью.

## ✅ Ключевые выводы

### 1. **Правильная конфигурация useConversation**
```typescript
// ✅ ПРАВИЛЬНО - НЕ включаем agentId при использовании signedUrl
const conversation = useConversation({
  onConnect: () => console.log('Connected'),
  onDisconnect: () => console.log('Disconnected'),
  onMessage: (message) => console.log(message),
  onError: (error) => console.error('Error:', error),
  // НЕ включаем agentId - он встроен в signed URL
});
```

**Вывод:** Мы правильно убрали `agentId` из конфигурации!

### 2. **Метод sendMessage НЕ существует**
```typescript
// ❌ НЕПРАВИЛЬНО - такого метода нет в React SDK
await conversation.sendMessage(text);

// ✅ ПРАВИЛЬНО - общение происходит автоматически через WebSocket
// Просто говорите в микрофон, SDK сам обрабатывает ввод/вывод
```

**Вывод:** Нужно убрать все попытки использовать `sendMessage`!

### 3. **Получение conversationId**
```typescript
// ✅ ПРАВИЛЬНО - из результата startSession
const conversationId = await conversation.startSession({
  signedUrl,
  connectionType: "websocket"
});

// ❌ НЕПРАВИЛЬНО - метода getId() нет в React SDK
const id = conversation.getId(); // Не существует!
```

**Вывод:** Используем только возвращаемое значение `startSession`!

### 4. **Защита от множественных вызовов**
```typescript
// ✅ РЕКОМЕНДУЕТСЯ - реализовать собственную защиту
const [isConnecting, setIsConnecting] = useState(false);

const startConversation = useCallback(async () => {
  if (isConnecting) return; // Защита от множественных вызовов
  
  try {
    setIsConnecting(true);
    const conversationId = await conversation.startSession({
      signedUrl,
      connectionType: "websocket"
    });
  } finally {
    setIsConnecting(false);
  }
}, [conversation, isConnecting]);
```

**Вывод:** SDK НЕ обрабатывает множественные вызовы автоматически!

### 5. **Отслеживание статуса подключения**
```typescript
// ✅ РЕКОМЕНДУЕТСЯ - использовать onStatusChange
await conversation.startSession({
  signedUrl,
  connectionType: "websocket",
  onStatusChange: (status) => {
    // status: 'connected', 'connecting', 'disconnected'
    console.log('Connection status:', status);
  }
});
```

## 🚨 Критические исправления для нашего кода

### 1. **Убрать sendMessage**
```typescript
// УДАЛИТЬ весь код с sendMessage
const sendMessage = useCallback(async (text: string) => {
  // ❌ ЭТО НЕ РАБОТАЕТ!
}, [stableConversation]);
```

### 2. **Исправить получение conversationId**
```typescript
// ✅ ПРАВИЛЬНО
const result = await stableConversation.startSession({ signedUrl: url });
const conversationId = result; // startSession возвращает conversationId напрямую
```

### 3. **Добавить connectionType**
```typescript
// ✅ ПРАВИЛЬНО
const result = await stableConversation.startSession({ 
  signedUrl: url,
  connectionType: "websocket" // Добавить это!
});
```

### 4. **Добавить onStatusChange**
```typescript
// ✅ РЕКОМЕНДУЕТСЯ
const result = await stableConversation.startSession({ 
  signedUrl: url,
  connectionType: "websocket",
  onStatusChange: (status) => {
    console.log('ElevenLabs status:', status);
    if (status === 'connected') {
      setState(prev => ({ ...prev, status: 'connected' }));
    }
  }
});
```

## 📝 Правильная архитектура

### Server-side (Backend)
```javascript
// Получение signed URL
app.get("/signed-url", async (req, res) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${process.env.AGENT_ID}`,
    {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
    }
  );
  const body = await response.json();
  res.send(body.signed_url);
});
```

### Client-side (React)
```typescript
const conversation = useConversation({
  onConnect: () => console.log('Connected'),
  onDisconnect: () => console.log('Disconnected'),
  onMessage: (message) => console.log(message),
  onError: (error) => console.error('Error:', error),
});

const startConversation = useCallback(async () => {
  try {
    // 1. Получаем signed URL
    const response = await fetch("/signed-url");
    const signedUrl = await response.text();
    
    // 2. Запускаем сессию
    const conversationId = await conversation.startSession({
      signedUrl,
      connectionType: "websocket"
    });
    
    console.log('Conversation ID:', conversationId);
  } catch (error) {
    console.error('Failed to start conversation:', error);
  }
}, [conversation]);
```

## 🎯 Что нужно исправить в нашем коде

1. **Удалить все упоминания `sendMessage`**
2. **Исправить получение `conversationId` из результата `startSession`**
3. **Добавить `connectionType: "websocket"`**
4. **Добавить `onStatusChange` для отслеживания статуса**
5. **Улучшить защиту от множественных вызовов**

## 📚 Источники
- [React SDK Documentation](https://elevenlabs.io/docs/conversational-ai/libraries/react)
- [JavaScript SDK Documentation](https://elevenlabs.io/docs/conversational-ai/libraries/java-script)
- Ответы поддержки ElevenLabs от [дата] 