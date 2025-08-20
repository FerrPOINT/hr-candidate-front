# Использование переменных окружения

## Основная переменная

### REACT_APP_API_BASE_URL

**Пример:**
```
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
```

Если переменная не указана — используется относительный путь `/api/v1` (best practice для продакшена).

## Конфигурация

### Переменные окружения
Приложение использует только одну переменную окружения:

- `REACT_APP_API_BASE_URL` - **обязательная** переменная для указания хоста API

### Пример файла .env
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
```

## Как использовать

### 1. Импорт properties
```typescript
import { properties } from '../config/properties';
```

### 2. Получение API URL
```typescript
// Получить API URL (обязательно требует REACT_APP_API_BASE_URL)
const apiUrl = properties.getApiBaseUrl();
```

## Сборка для продакшена

```bash
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1 npm run build
```

## Доступные методы

- `properties.getApiBaseUrl()` - получить API URL (требует REACT_APP_API_BASE_URL)
- `properties.getApiTimeout()` - получить таймаут API (30000ms)
- `properties.shouldUseMock()` - проверить mock режим (false)
- `properties.isDebugEnabled()` - проверить debug режим (true)
- `properties.getCurrentEnvironment()` - получить текущее окружение

## Важно

**Без переменной `REACT_APP_API_BASE_URL` приложение не запустится!**

## Преимущества

✅ **Обязательная конфигурация** - нельзя забыть настроить API  
✅ **Простота** - только одна переменная для хоста  
✅ **Безопасность** - нет дефолтных URL в коде  
✅ **Типизация** - полная поддержка TypeScript  
✅ **Простота использования** - простой API 