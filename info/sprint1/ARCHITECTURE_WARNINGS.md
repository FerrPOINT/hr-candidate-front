# ⚠️ ВНИМАНИЕ: ПЛОХАЯ АРХИТЕКТУРА

## ❌ НЕ ДЕЛАЙТЕ ТАК:

### 1. Разные скрипты для разных окружений
```json
// ПЛОХО - приводит к багам на продакшене!
"scripts": {
  "start:dev": "set REACT_APP_LOCAL_API=true && react-scripts start",
  "start:prod": "cross-env REACT_APP_API_HOST=api.example.com:8080 react-scripts start"
}
```

### 2. Хардкод настроек в скриптах
```bash
# ПЛОХО - настройки зашиты в команды
set REACT_APP_LOCAL_API=true && react-scripts start
```

### 3. Разные конфигурации для разных профилей
```typescript
// ПЛОХО - условная логика в коде
basePath: string = (process.env.REACT_APP_LOCAL_API === 'true' ? 'http://localhost:8080/api/v1' : '/api/v1')
```

## ✅ ДЕЛАЙТЕ ТАК:

### 1. Один скрипт для всех окружений
```json
"scripts": {
  "start": "react-scripts start"
}
```

### 2. Используйте .env файлы
```bash
# .env.development
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1

# .env.production  
REACT_APP_API_BASE_URL=https://api.example.com/api/v1
```

### 3. Простая конфигурация
```typescript
// ХОРОШО - одна настройка для всех окружений
basePath: string = process.env.REACT_APP_API_BASE_URL || '/api/v1'
```

## 🚨 ПОЧЕМУ ЭТО ВАЖНО:

1. **Баги на продакшене** - разные настройки = разные баги
2. **Сложность отладки** - непонятно, какая конфигурация используется
3. **Сложность деплоя** - нужно помнить про разные скрипты
4. **Нарушение принципа DRY** - дублирование логики

## 🔧 КАК ИСПРАВИТЬ:

1. Удалите все `start:dev`, `start:prod` скрипты
2. Используйте только `npm start`
3. Настройте `.env` файлы для разных окружений
4. Упростите логику в `apiClient.ts` 