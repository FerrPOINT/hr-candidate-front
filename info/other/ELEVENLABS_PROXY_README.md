# 🎤 ElevenLabs SDK Proxy - Руководство по использованию

Этот проект предоставляет два способа перенаправления трафика ElevenLabs SDK через ваш backend-сервер для обеспечения безопасности API-ключей.

## 📋 Содержание

1. [Вариант C: Monkey-patch (Быстрый старт)](#вариант-c-monkey-patch-быстрый-старт)
2. [Вариант A: Патч SDK (Production)](#вариант-a-патч-sdk-production)
3. [Backend-прокси](#backend-прокси)
4. [Использование в компонентах](#использование-в-компонентах)
5. [Устранение неполадок](#устранение-неполадок)

---

## 🔧 Вариант C: Monkey-patch (Быстрый старт)

### Что это такое?
Monkey-patch перехватывает все HTTP и WebSocket запросы к ElevenLabs в рантайме и перенаправляет их через ваш backend.

### Преимущества:
- ✅ Быстрая настройка
- ✅ Не требует модификации node_modules
- ✅ Работает с любой версией SDK
- ✅ Легко отключается

### Недостатки:
- ⚠️ Может сломаться при обновлении SDK
- ⚠️ Менее надёжен для production

### Установка и настройка:

1. **Импортируйте прокси в вашем приложении:**

```typescript
// В src/index.tsx или App.tsx
import { initElevenLabsProxy } from './utils/elevenLabsProxy';

// Инициализируйте прокси перед рендером приложения
initElevenLabsProxy({
  backendUrl: 'http://localhost:8080',
  originalElevenLabsUrl: 'https://api.elevenlabs.io',
  apiKey: 'your-backend-api-key' // опционально
});
```

2. **Используйте в компоненте:**

```typescript
import React from 'react';
import { useConversation } from '@elevenlabs/react';

const VoiceInterview: React.FC = () => {
  const conversation = useConversation({
    apiKey: 'dummy-key', // Не будет использоваться при прокси
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    agentId: 'your-agent-id',
    onMessage: (message) => {
      console.log('Получено сообщение:', message);
    }
  });

  return (
    <div>
      <button onClick={() => conversation.start()}>
        Начать разговор
      </button>
    </div>
  );
};
```

---

## 🔧 Вариант A: Патч SDK (Production)

### Что это такое?
Скрипт модифицирует исходный код пакета `@elevenlabs/react` для перенаправления всех запросов на ваш backend.

### Преимущества:
- ✅ Надёжен для production
- ✅ Не зависит от рантайм-патчей
- ✅ Создаёт резервные копии
- ✅ Генерирует патч-файлы

### Недостатки:
- ⚠️ Требует переустановки при обновлении SDK
- ⚠️ Модифицирует node_modules

### Установка и настройка:

1. **Установите ElevenLabs SDK:**

```bash
npm install @elevenlabs/react
```

2. **Запустите скрипт патчинга:**

```bash
# Базовый патч
node scripts/patch-elevenlabs-sdk.js

# С указанием backend URL
node scripts/patch-elevenlabs-sdk.js --backend-url=https://your-backend.com

# Восстановление оригинального SDK
node scripts/patch-elevenlabs-sdk.js --restore
```

3. **Что делает скрипт:**
   - Создаёт резервную копию в `node_modules/@elevenlabs/react-backup`
   - Модифицирует `dist/index.js` и `dist/index.d.ts`
   - Заменяет все URL ElevenLabs на ваш backend
   - Создаёт патч-файл в `patches/elevenlabs-sdk.patch`

4. **Используйте как обычно:**

```typescript
import { useConversation } from '@elevenlabs/react';

const VoiceInterview: React.FC = () => {
  const conversation = useConversation({
    apiKey: 'dummy-key', // Теперь все запросы идут через ваш backend
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    agentId: 'your-agent-id'
  });

  return <div>...</div>;
};
```

---

## 🖥️ Backend-прокси

### Требования к backend:

Ваш backend должен обрабатывать следующие эндпоинты:

```
POST /elevenlabs-proxy/* -> https://api.elevenlabs.io/*
GET  /elevenlabs-proxy/* -> https://api.elevenlabs.io/*
WSS  /elevenlabs-proxy/ws/* -> wss://api.elevenlabs.io/*
```

### Пример реализации на Java (Spring Boot):

```java
@RestController
@RequestMapping("/elevenlabs-proxy")
public class ElevenLabsProxyController {

    private static final String ELEVENLABS_API_URL = "https://api.elevenlabs.io";
    private static final String ELEVENLABS_API_KEY = "your-elevenlabs-api-key";

    @PostMapping("/**")
    public ResponseEntity<String> proxyPost(
            HttpServletRequest request,
            @RequestBody(required = false) String body,
            HttpHeaders headers
    ) {
        String path = request.getRequestURI().replace("/elevenlabs-proxy", "");
        String targetUrl = ELEVENLABS_API_URL + path;
        
        // Создаём запрос к ElevenLabs
        HttpHeaders proxyHeaders = new HttpHeaders();
        proxyHeaders.set("xi-api-key", ELEVENLABS_API_KEY);
        proxyHeaders.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<String> entity = new HttpEntity<>(body, proxyHeaders);
        
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.postForEntity(targetUrl, entity, String.class);
    }

    @GetMapping("/**")
    public ResponseEntity<String> proxyGet(
            HttpServletRequest request,
            HttpHeaders headers
    ) {
        String path = request.getRequestURI().replace("/elevenlabs-proxy", "");
        String targetUrl = ELEVENLABS_API_URL + path;
        
        HttpHeaders proxyHeaders = new HttpHeaders();
        proxyHeaders.set("xi-api-key", ELEVENLABS_API_KEY);
        
        HttpEntity<String> entity = new HttpEntity<>(proxyHeaders);
        
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.exchange(targetUrl, HttpMethod.GET, entity, String.class);
    }
}
```

### WebSocket прокси (если нужен):

```java
@Component
public class ElevenLabsWebSocketProxy {

    @EventListener
    public void handleWebSocketConnect(SessionConnectedEvent event) {
        // Логика для WebSocket соединений
    }
}
```

---

## 🎯 Использование в компонентах

### Компонент ElabsSession:

```typescript
import React from 'react';
import ElabsSession from './pages/ElabsSession';

// С monkey-patch (по умолчанию)
<ElabsSession 
  useProxy={true}
  backendUrl="http://localhost:8080"
  apiKey="your-backend-key"
/>

// С патченным SDK
<ElabsSession 
  useProxy={false}
  backendUrl="http://localhost:8080"
/>
```

### Настройка маршрутов:

```typescript
// В App.tsx или router
<Route 
  path="/elabs-session/:interviewId" 
  element={<ElabsSession />} 
/>
```

---

## 🔍 Устранение неполадок

### Проблема: "Пакет @elevenlabs/react не найден"

**Решение:**
```bash
npm install @elevenlabs/react
```

### Проблема: "Ошибка инициализации прокси"

**Проверьте:**
1. Правильность backend URL
2. Доступность backend сервера
3. CORS настройки

**Решение:**
```typescript
// Добавьте обработку ошибок
try {
  initElevenLabsProxy({
    backendUrl: 'http://localhost:8080',
    originalElevenLabsUrl: 'https://api.elevenlabs.io'
  });
} catch (error) {
  console.error('Ошибка инициализации прокси:', error);
}
```

### Проблема: "SDK не работает после патчинга"

**Решение:**
```bash
# Восстановите оригинальный SDK
node scripts/patch-elevenlabs-sdk.js --restore

# Переустановите пакет
npm uninstall @elevenlabs/react
npm install @elevenlabs/react

# Примените патч заново
node scripts/patch-elevenlabs-sdk.js
```

### Проблема: "WebSocket соединения не работают"

**Проверьте:**
1. WebSocket прокси на backend
2. Правильность URL для WebSocket
3. SSL сертификаты (для HTTPS)

### Отладка:

Включите подробное логирование:

```typescript
// В браузере
localStorage.setItem('debug', 'elevenlabs-proxy:*');

// В консоли
console.log('Прокси статус:', isElevenLabsProxyInitialized());
console.log('Конфигурация:', getElevenLabsProxy()?.getConfig());
```

---

## 📝 Примеры использования

### Полный пример компонента:

```typescript
import React, { useState, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import { initElevenLabsProxy } from '../utils/elevenLabsProxy';

const VoiceInterview: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Инициализируем прокси
    try {
      initElevenLabsProxy({
        backendUrl: 'http://localhost:8080',
        originalElevenLabsUrl: 'https://api.elevenlabs.io'
      });
      setIsInitialized(true);
    } catch (err) {
      setError('Ошибка инициализации прокси');
    }
  }, []);

  const conversation = useConversation({
    apiKey: 'dummy-key',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    agentId: 'your-agent-id',
    onMessage: (message) => {
      console.log('Сообщение:', message);
    },
    onError: (error) => {
      console.error('Ошибка:', error);
    }
  });

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!isInitialized) {
    return <div>Инициализация...</div>;
  }

  return (
    <div>
      <button onClick={() => conversation.start()}>
        Начать разговор
      </button>
      <button onClick={() => conversation.stop()}>
        Остановить разговор
      </button>
    </div>
  );
};

export default VoiceInterview;
```

---

## 🚀 Production рекомендации

1. **Используйте вариант A (патч SDK)** для production
2. **Настройте HTTPS** для backend
3. **Добавьте rate limiting** на backend
4. **Логируйте все запросы** к ElevenLabs
5. **Мониторьте использование** API ключей
6. **Создайте fallback** на случай недоступности ElevenLabs

---

## 📞 Поддержка

При возникновении проблем:

1. Проверьте консоль браузера на ошибки
2. Убедитесь, что backend доступен
3. Проверьте CORS настройки
4. Убедитесь, что API ключ ElevenLabs валиден

Для получения помощи создайте issue в репозитории проекта. 