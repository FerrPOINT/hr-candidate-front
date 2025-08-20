# 📊 Полный отчет об использовании API методов при интервью

## 🎯 Цель

Составить полный и точный список всех API методов, используемых в процессе интервью кандидата, с указанием где и когда они вызываются.

---

## 🔍 Методология

Проведен тщательный анализ всех компонентов:
- `InterviewEntryForm.tsx` - форма входа кандидата
- `InterviewSession.tsx` - обычное интервью
- `ElabsSession.tsx` - голосовое интервью
- `candidateApiService.ts` - сервис для кандидатов
- `authStore.ts` - авторизация
- `audioService.ts` - аудио транскрибация

---

## 📋 Полный список API методов

### 1. 🔐 Авторизация кандидата

#### `POST /candidates/auth`
- **Где вызывается**: `authStore.ts` → `loginCandidate()`
- **Когда**: При отправке формы на welcome странице
- **Данные**: `firstName`, `lastName`, `email`, `phone`, `positionId`
- **Возвращает**: `token` + `candidate` данные
- **Статус**: ✅ **ИСПОЛЬЗУЕТСЯ**

### 2. 📄 Получение информации о вакансии

#### `GET /positions/{positionId}`
- **Где вызывается**: `InterviewEntryForm.tsx` → `candidateApiService.getPosition()`
- **Когда**: При загрузке welcome страницы
- **Данные**: `positionId` из URL
- **Возвращает**: `title` вакансии для отображения
- **Статус**: ✅ **ИСПОЛЬЗУЕТСЯ**

### 3. 📊 Получение данных интервью

#### `GET /interviews/{interviewId}`
- **Где вызывается**: 
  - `InterviewSession.tsx` → `candidateApiService.getInterview()`
  - `ElabsSession.tsx` → `candidateApiService.getInterview()`
- **Когда**: При инициализации страницы интервью
- **Данные**: `interviewId` из URL
- **Возвращает**: `interview`, `candidate`, `position`, `questions`
- **Статус**: ❌ **ПРОБЛЕМА** - возвращает избыточные данные
- **Рекомендация**: Заменить на расширенный `startInterview()`

### 4. 🚀 Запуск интервью

#### `POST /interviews/{interviewId}/start`
- **Где вызывается**: `ElabsSession.tsx` → `candidateApiService.startInterview()`
- **Когда**: При инициализации голосового интервью
- **Данные**: `voiceMode: true`, `autoCreateAgent: true`
- **Возвращает**: `agentId`, `sessionId`, `status`
- **Статус**: ✅ **ИСПОЛЬЗУЕТСЯ** (только для голосового режима)

### 5. 🎤 Голосовые методы (только для ElabsSession)

#### `POST /interviews/{interviewId}/voice/session`
- **Где вызывается**: `candidateApiService.createVoiceSession()`
- **Когда**: При создании голосовой сессии
- **Статус**: ❌ **НЕ ИСПОЛЬЗУЕТСЯ** (заменен на `startInterview`)

#### `GET /interviews/{interviewId}/voice/next-question`
- **Где вызывается**: `ElabsSession.tsx` → `candidateApiService.getNextQuestion()`
- **Когда**: При получении следующего вопроса от агента
- **Возвращает**: `VoiceMessage` с текстом вопроса
- **Статус**: ✅ **ИСПОЛЬЗУЕТСЯ**

#### `POST /interviews/{interviewId}/voice/answer`
- **Где вызывается**: `ElabsSession.tsx` → `candidateApiService.saveVoiceAnswer()`
- **Когда**: При сохранении голосового ответа
- **Данные**: `questionId`, `text`, `durationMs`, `confidence`, `timestamp`
- **Возвращает**: `InterviewAnswer`
- **Статус**: ✅ **ИСПОЛЬЗУЕТСЯ**

#### `POST /interviews/{interviewId}/voice/end`
- **Где вызывается**: `ElabsSession.tsx` → `candidateApiService.endVoiceSession()`
- **Когда**: При завершении голосовой сессии
- **Статус**: ✅ **ИСПОЛЬЗУЕТСЯ**

#### `GET /interviews/{interviewId}/voice/status`
- **Где вызывается**: `candidateApiService.getVoiceSessionStatus()`
- **Когда**: При проверке статуса голосовой сессии
- **Статус**: ❌ **НЕ ИСПОЛЬЗУЕТСЯ**

### 6. 📝 Обычные методы интервью

#### `POST /interviews/{interviewId}/answer`
- **Где вызывается**: `candidateApiService.submitInterviewAnswer()`
- **Когда**: При отправке текстового ответа
- **Данные**: `questionId`, `answerText`, `audioUrl`, `transcript`
- **Статус**: ❌ **НЕ ИСПОЛЬЗУЕТСЯ** (в обычном интервью используется транскрибация)

#### `POST /interviews/{interviewId}/finish`
- **Где вызывается**: 
  - `InterviewSession.tsx` → `candidateApiService.finishInterview()`
  - `ElabsSession.tsx` → `candidateApiService.finishInterview()`
- **Когда**: При завершении интервью
- **Статус**: ✅ **ИСПОЛЬЗУЕТСЯ**

### 7. 🎵 Аудио транскрибация

#### `POST /ai/transcribe`
- **Где вызывается**: `audioService.ts` → `apiService.transcribeAudio()`
- **Когда**: При тестировании микрофона
- **Данные**: `audioFile` (Blob)
- **Возвращает**: `{ transcript: string }`
- **Статус**: ✅ **ИСПОЛЬЗУЕТСЯ**

#### `POST /ai/transcribe-answer`
- **Где вызывается**: `audioService.ts` → `apiService.transcribeInterviewAnswer()`
- **Когда**: При сохранении ответа на вопрос
- **Данные**: `audioFile`, `interviewId`, `questionId`
- **Возвращает**: `{ success: boolean, formattedText: string, interviewAnswerId: string }`
- **Статус**: ✅ **ИСПОЛЬЗУЕТСЯ**

---

## 🔄 Flow использования API

### Welcome страница (`InterviewEntryForm.tsx`):
```
1. GET /positions/{positionId} → получение названия вакансии
2. POST /candidates/auth → авторизация кандидата
```

### Обычное интервью (`InterviewSession.tsx`):
```
1. GET /interviews/{interviewId} → получение данных интервью
2. POST /ai/transcribe → тестирование микрофона
3. POST /ai/transcribe-answer → сохранение ответов
4. POST /interviews/{interviewId}/finish → завершение интервью
```

### Голосовое интервью (`ElabsSession.tsx`):
```
1. GET /interviews/{interviewId} → получение данных интервью
2. POST /interviews/{interviewId}/start → запуск с голосовым режимом
3. GET /interviews/{interviewId}/voice/next-question → получение вопросов
4. POST /interviews/{interviewId}/voice/answer → сохранение ответов
5. POST /interviews/{interviewId}/voice/end → завершение голосовой сессии
6. POST /interviews/{interviewId}/finish → завершение интервью
```

---

## 🚨 Проблемы и рекомендации

### ❌ **Критические проблемы**:

1. **`GET /interviews/{interviewId}`** - возвращает избыточные данные:
   - Данные кандидата (уже есть в store)
   - Данные компании, команды, статистика
   - Ответы других кандидатов

2. **Дублирование данных** - кандидат получает свои данные дважды:
   - При авторизации (`authCandidate`)
   - При получении интервью (`getInterview`)

### ✅ **Рекомендации**:

1. **Заменить `GET /interviews/{interviewId}`** на расширенный `POST /interviews/{interviewId}/start` с параметром `includeCandidateData: true`

2. **Использовать данные из store** для информации о кандидате

3. **Создать минимальный ответ** только с необходимыми данными:
   - Настройки интервью
   - Вопросы
   - Прогресс
   - Минимальная информация о вакансии

---

## 📊 Итоговая статистика

### ✅ **Активно используемые методы** (8):
- `POST /candidates/auth`
- `GET /positions/{positionId}`
- `GET /interviews/{interviewId}` (требует замены)
- `POST /interviews/{interviewId}/start`
- `GET /interviews/{interviewId}/voice/next-question`
- `POST /interviews/{interviewId}/voice/answer`
- `POST /interviews/{interviewId}/voice/end`
- `POST /interviews/{interviewId}/finish`
- `POST /ai/transcribe`
- `POST /ai/transcribe-answer`

### ❌ **Неиспользуемые методы** (3):
- `POST /interviews/{interviewId}/voice/session`
- `GET /interviews/{interviewId}/voice/status`
- `POST /interviews/{interviewId}/answer`

### 🔧 **Требуют замены** (1):
- `GET /interviews/{interviewId}` → расширенный `POST /interviews/{interviewId}/start`

---

## 🎯 Заключение

**Всего API методов**: 12
**Активно используется**: 10
**Не используется**: 2
**Требует замены**: 1

Основная проблема - избыточность данных в `GET /interviews/{interviewId}`, которую можно решить расширением метода `POST /interviews/{interviewId}/start`.

---

**Статус**: ✅ **ПОЛНЫЙ АНАЛИЗ ЗАВЕРШЕН**

**Дата**: 2024-01-15
**Версия**: 1.0 