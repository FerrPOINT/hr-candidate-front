# Настройка переменных окружения

Используйте только REACT_APP_API_BASE_URL для настройки API.

- Локально:
  ```
  REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
  ```
- На проде: переменную не указывайте, будет относительный путь `/api/v1`.

## Проблема с REACT_APP_LOCAL_API

Переменная `REACT_APP_LOCAL_API=true` не работала, потому что в package.json был неправильный скрипт.

## Исправление

### 1. Обновленные скрипты в package.json

```json
{
  "scripts": {
    "start": "react-scripts start",
    "start:dev": "cross-env REACT_APP_LOCAL_API=true react-scripts start",
    "start:local": "cross-env REACT_APP_LOCAL_API=true react-scripts start",
    "start:prod": "cross-env REACT_APP_API_HOST=api.example.com:8080 react-scripts start"
  }
}
```

### 2. Создайте файл .env в корне проекта

```bash
# API Configuration
REACT_APP_LOCAL_API=true
REACT_APP_API_HOST=localhost:8080

# Для продакшена используйте:
# REACT_APP_LOCAL_API=false
# REACT_APP_API_HOST=your-production-api-host:8080
```

### 3. Как использовать

#### Для локальной разработки:
```bash
npm run start:dev
# или
npm run start:local
```

#### Для продакшена:
```bash
npm run start:prod
```

## Проверка работы

После запуска с `REACT_APP_LOCAL_API=true`, все API запросы должны идти на `http://localhost:8080/api/v1` вместо относительного пути `/api/v1`.

## Отладка

Если переменная все еще не работает:

1. Проверьте, что файл `.env` находится в корне проекта
2. Перезапустите сервер разработки
3. Проверьте в браузере (DevTools → Console):
   ```javascript
   console.log(process.env.REACT_APP_LOCAL_API);
   ```

## OpenRouter Configuration

Для настройки OpenRouter с моделью `anthropic/claude-3.5-sonnet` добавьте в `.env`:

```bash
# OpenRouter Configuration (для бэкенда)
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
``` 