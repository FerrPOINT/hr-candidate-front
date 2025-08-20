# 🧪 Финальный план тестирования ElevenLabs

## ✅ Статус: Код исправлен согласно рекомендациям поддержки

### 🔧 Что исправлено:
1. **Убран `sendMessage`** - метод не существует в React SDK
2. **Добавлен `connectionType: "websocket"`** - обязательный параметр
3. **Исправлено получение `conversationId`** - из результата `startSession`
4. **Убрана циклическая зависимость** в `conversationConfig`
5. **Компиляция проходит успешно** ✅

---

## 🎯 Основной компонент для тестирования

### **ElevenLabsConversation** - центральный компонент
- **Файл:** `src/components/ElevenLabsConversation.tsx`
- **Использование:** `src/pages/ElabsSession.tsx`
- **URL для тестирования:** `/elabs/{interviewId}`

---

## 🚀 План тестирования

### 1. **Подготовка**
```bash
# Проверить переменные окружения
REACT_APP_ELEVENLABS_API_KEY=your_key_here
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1

# Запустить приложение
npm start
```

### 2. **Тестирование полного флоу**

#### Шаг 1: Приветственная страница
- **URL:** `/interview-entry?positionId=1`
- **Действия:**
  - Ввести данные кандидата
  - Нажать "Начать интервью"
  - Проверить перенаправление на `/elabs/{interviewId}`

#### Шаг 2: Страница голосового интервью
- **URL:** `/elabs/{interviewId}`
- **Ожидаемое поведение:**
  - ✅ Загрузка данных интервью
  - ✅ Создание агента на backend
  - ✅ Получение signed URL
  - ✅ Автоматический запуск ElevenLabs сессии

#### Шаг 3: Голосовое взаимодействие
- **Компонент:** `ElevenLabsConversation`
- **Ожидаемое поведение:**
  - ✅ Подключение к ElevenLabs через WebSocket
  - ✅ Получение `conversationId` из `startSession`
  - ✅ Отправка маппинга на backend
  - ✅ Индикаторы состояния (микрофон, динамики, AI)
  - ✅ Голосовое взаимодействие с агентом

### 3. **Проверка логов**

#### Успешный запуск:
```
🚀 Starting ElevenLabs session...
✅ Microphone permission granted
🔍 Got signed URL: wss://hr.acm-ai.ru/ws-elevenlabs/v1/convai/conversation?...
🔍 Starting ElevenLabs session with signed URL...
✅ Got conversation_id from startSession: conv_xxx
✅ Conversation ID saved: conv_xxx
📤 Sending conversation mapping: {interviewId: 58, conversationId: conv_xxx}
✅ Conversation mapping sent successfully
✅ ElevenLabs session started successfully
✅ Connected to ElevenLabs
```

#### Обработка событий:
```
👤 User started speaking
🤖 Agent started speaking
📨 Message from ElevenLabs: {type: "assistant_message", text: "..."}
🤖 Agent finished speaking
👤 User finished speaking
```

### 4. **Проверка UI индикаторов**

#### Статус подключения:
- 🟡 **Желтый** - Подключение...
- 🟢 **Зеленый** - Подключено к ElevenLabs
- 🔴 **Красный** - Ошибка подключения

#### Индикаторы активности:
- 🎤 **Микрофон** - зеленый pulse когда слушает
- 🔊 **Динамики** - синий pulse когда агент говорит
- 🤖 **AI** - фиолетовый индикатор активности

---

## 🐛 Возможные проблемы и решения

### 1. **Ошибка: "No agent ID available"**
**Причина:** Не создался агент на backend
**Решение:** Проверить логи backend, убедиться что инструменты агента настроены

### 2. **Ошибка: "WebSocket connection failed"**
**Причина:** Проблемы с signed URL или прокси
**Решение:** Проверить доступность прокси сервера

### 3. **Ошибка: "Microphone permission denied"**
**Причина:** Браузер не разрешил доступ к микрофону
**Решение:** Разрешить доступ к микрофону в браузере

### 4. **Сессия сразу закрывается**
**Причина:** Множественные инициализации (исправлено)
**Решение:** Проверить логи на множественные вызовы `startSession`

---

## 📊 Критерии успеха

### ✅ **Тест пройден если:**
1. **Подключение:** Сессия успешно подключается к ElevenLabs
2. **Голосовое взаимодействие:** Можно говорить и слышать ответы агента
3. **Индикаторы:** UI показывает правильные состояния
4. **Логи:** Нет ошибок в консоли браузера
5. **Backend:** Получает маппинг conversation_id

### ❌ **Тест провален если:**
1. **Ошибки подключения:** WebSocket не подключается
2. **Нет голоса:** Агент не отвечает или не слышит
3. **UI не работает:** Индикаторы не обновляются
4. **Ошибки в логах:** Критические ошибки в консоли

---

## 🎯 Готово к тестированию!

Все исправления внесены согласно рекомендациям поддержки ElevenLabs. Система готова к тестированию голосового интервью! 