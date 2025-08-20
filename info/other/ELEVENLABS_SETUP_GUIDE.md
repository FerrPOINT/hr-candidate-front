# 🎤 ElevenLabs Integration Setup Guide

## 📋 Обзор

Данное руководство описывает полный поток работы с ElevenLabs Conversational AI в HR Recruiter:

1. **Приветственная страница** - ввод данных кандидата
2. **Получение токена** - авторизация через backend
3. **Страница голосового интервью** - центральный компонент ElevenLabs

## 🚀 Быстрый старт

### 1. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
# ElevenLabs Configuration
REACT_APP_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
REACT_APP_ELEVENLABS_DEFAULT_VOICE_ID=pNInz6obpgDQGcFmaJgB

# Backend Configuration
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
REACT_APP_USE_PROXY=true
REACT_APP_BACKEND_URL=http://localhost:8080
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

## 🔄 Полный поток работы

### Шаг 1: Приветственная страница

**URL:** `/interview-entry?positionId=123`

Кандидат вводит:
- Имя
- Фамилию  
- Email
- Телефон

**Компонент:** `InterviewEntryForm.tsx`

### Шаг 2: Авторизация

После отправки формы:
1. Backend создает/находит кандидата
2. Возвращает JWT токен
3. Токен сохраняется в `authStore`
4. Перенаправление на `/elabs/{interviewId}`

### Шаг 3: Голосовое интервью

**URL:** `/elabs/{interviewId}`

**Компоненты:**
- `ElabsSession.tsx` - основная страница
- `ElevenLabsConversation.tsx` - центральный компонент ElevenLabs
- `useElevenLabs.ts` - хук для управления сессией

## 🎯 Центральный компонент ElevenLabs

### ElevenLabsConversation.tsx

Этот компонент является **сердцем** голосового интервью:

```tsx
<ElevenLabsConversation
  agentId={agentId}
  voiceId="pNInz6obpgDQGcFmaJgB"
  isConnected={isConnected}
  onMessage={(message) => {
    // Обработка сообщений от агента
  }}
  onError={(error) => {
    // Обработка ошибок
  }}
  // ... другие обработчики
/>
```

### Возможности компонента:

- ✅ **Реальное голосовое взаимодействие** через ElevenLabs SDK
- ✅ **Автоматическая транскрипция** речи пользователя
- ✅ **TTS для агента** - озвучивание вопросов
- ✅ **Индикаторы состояния** - микрофон, динамики, AI
- ✅ **Обработка событий** - начало/конец речи, ошибки
- ✅ **Интеграция с backend** - сохранение ответов

## 🔧 Архитектура

```
Frontend (React)
├── InterviewEntryForm.tsx (приветственная страница)
├── ElabsSession.tsx (основная страница интервью)
├── ElevenLabsConversation.tsx (центральный компонент)
├── useElevenLabs.ts (хук управления)
└── voiceInterviewService.ts (сервис API)

Backend (Java)
├── /candidates/auth (авторизация кандидата)
├── /interviews/{id}/start (создание агента)
├── /interviews/{id}/voice/session (голосовая сессия)
├── /interviews/{id}/voice/next-question (следующий вопрос)
├── /interviews/{id}/voice/answer (сохранение ответа)
└── /interviews/{id}/voice/end (завершение сессии)

ElevenLabs API
├── @elevenlabs/react (React SDK)
├── useConversation (хук для разговора)
└── WebSocket (реальное время)
```

## 🎮 Управление сессией

### Состояния:

1. **Подключение** - инициализация ElevenLabs
2. **Активна** - голосовое взаимодействие
3. **Агент говорит** - TTS воспроизведение
4. **Пользователь говорит** - STT запись
5. **Завершена** - интервью окончено

### Кнопки управления:

- **Подключиться** - запуск голосовой сессии
- **Начать разговор** - старт интервью
- **Остановить** - пауза сессии
- **Завершить интервью** - окончание

## 📊 История и статистика

### История разговора:
- Сообщения агента (синие)
- Ответы пользователя (серые)
- Автоматическая прокрутка

### Статистика:
- Количество вопросов
- Количество ответов
- Текущий вопрос
- Статус сессии

## 🔒 Безопасность

- JWT токены для авторизации
- HTTPS для всех соединений
- Валидация данных на frontend и backend
- Безопасное хранение API ключей

## 🐛 Отладка

### Логи в консоли:

```javascript
// Инициализация
🎤 Инициализация сессии для интервью 123...
✅ Данные интервью получены
✅ Агент создан на бэкенде: agent_123

// ElevenLabs события
🚀 Автоматический запуск ElevenLabs conversation...
🎤 ElevenLabs conversation started
🤖 Agent started speaking
👤 User started speaking
📨 ElevenLabs message: Здравствуйте! Начнем интервью...

// Ошибки
❌ ElevenLabs error: Connection failed
❌ Ошибка в голосовой сессии: Network error
```

### Проверка состояния:

```javascript
// В консоли браузера
console.log('Voice session status:', voiceStatus);
console.log('Is connected:', isConnected);
console.log('Agent ID:', agentId);
console.log('Messages:', messages);
```

## 🚀 Готово к использованию!

После настройки:

1. **Откройте** `/interview-entry?positionId=123`
2. **Введите** данные кандидата
3. **Получите** токен авторизации
4. **Перейдите** на `/elabs/{interviewId}`
5. **Нажмите** "Подключиться"
6. **Начните** голосовое интервью!

---

**Версия:** 1.0.0  
**Дата:** 2024  
**Автор:** HR Recruiter Team 