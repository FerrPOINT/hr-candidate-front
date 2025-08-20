# 🔒 Отчет о безопасности API для кандидатов

## 🚨 Критические проблемы

### 1. **GET /interviews/{interviewId}** - Избыточные данные

**Проблема**: Эндпоинт возвращает полную информацию об интервью, включая чувствительные данные:

```typescript
interface GetInterview200Response {
  interview?: Interview;      // ✅ Нужно кандидату
  candidate?: Candidate;      // ✅ Нужно кандидату  
  position?: Position;        // ❌ СЛИШКОМ МНОГО ДАННЫХ
  questions?: Array<Question>; // ✅ Нужно кандидату
}
```

**Что возвращается в Position**:
- `title` - ✅ Нужно
- `description` - ✅ Нужно  
- `answerTime` - ✅ Нужно
- `language` - ✅ Нужно
- `saveAudio` - ✅ Нужно
- `saveVideo` - ✅ Нужно
- `randomOrder` - ✅ Нужно
- `minScore` - ✅ Нужно
- `company` - ❌ **НЕ НУЖНО КАНДИДАТУ**
- `publicLink` - ❌ **НЕ НУЖНО КАНДИДАТУ**
- `stats` - ❌ **НЕ НУЖНО КАНДИДАТУ**
- `team` - ❌ **НЕ НУЖНО КАНДИДАТУ**
- `branding` - ❌ **НЕ НУЖНО КАНДИДАТУ**
- `candidates` - ❌ **НЕ НУЖНО КАНДИДАТУ**
- `avgScore` - ❌ **НЕ НУЖНО КАНДИДАТУ**

**Что возвращается в Interview**:
- `id`, `status`, `createdAt` - ✅ Нужно
- `aiScore` - ❌ **НЕ НУЖНО КАНДИДАТУ**
- `answers` - ❌ **НЕ НУЖНО КАНДИДАТУ** (ответы других кандидатов!)

### 2. **GET /positions/{positionId}/questions-with-settings** - Не вызывается

**Статус**: ✅ **ИСПРАВЛЕНО** - больше не вызывается для кандидатов

### 3. **GET /tariff/info** - Не вызывается

**Статус**: ✅ **ИСПРАВЛЕНО** - больше не вызывается для кандидатов

---

## 📊 Анализ использования данных

### В InterviewSession.tsx используются:
```typescript
// Из interview:
- interview.id ✅
- interview.status ✅
- interview.createdAt ✅

// Из candidate:
- candidate.firstName ✅
- candidate.lastName ✅
- candidate.name ✅

// Из position:
- position.title ✅
- position.answerTime ✅
- position.language ✅
- position.saveAudio ✅
- position.saveVideo ✅
- position.randomOrder ✅
- position.minScore ✅

// Из questions:
- questions[].text ✅
- questions[].type ✅
- questions[].order ✅
```

### В ElabsSession.tsx используются:
```typescript
// Из interview:
- interview.id ✅
- interview.status ✅

// Из candidate:
- candidate.name ✅

// Из position:
- position.title ✅
```

---

## 🎯 Рекомендации по исправлению

### 1. Создать отдельный эндпоинт для кандидатов

```yaml
/interviews/{id}/candidate-data:
  get:
    operationId: getInterviewCandidateData
    tags: [Interviews]
    summary: Получить данные интервью для кандидата
    security:
      - CandidateAuth: []
    parameters:
      - in: path
        name: id
        required: true
        schema:
          type: integer
          format: int64
    responses:
      '200':
        description: OK
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/InterviewCandidateData'
```

### 2. Новая схема данных для кандидатов

```yaml
InterviewCandidateData:
  type: object
  properties:
    interview:
      type: object
      properties:
        id:
          type: integer
        status:
          $ref: '#/components/schemas/InterviewStatusEnum'
        createdAt:
          type: string
          format: date-time
        startedAt:
          type: string
          format: date-time
        finishedAt:
          type: string
          format: date-time
    candidate:
      type: object
      properties:
        firstName:
          type: string
        lastName:
          type: string
        name:
          type: string
    position:
      type: object
      properties:
        title:
          type: string
        answerTime:
          type: integer
        language:
          type: string
        saveAudio:
          type: boolean
        saveVideo:
          type: boolean
        randomOrder:
          type: boolean
        minScore:
          type: number
    questions:
      type: array
      items:
        type: object
        properties:
          id:
            type: integer
          text:
            type: string
          type:
            $ref: '#/components/schemas/QuestionTypeEnum'
          order:
            type: integer
```

### 3. Обновить candidateApiService

```typescript
// src/services/candidateApiService.ts
async getInterviewCandidateData(interviewId: number): Promise<any> {
  const response = await this.getApiClient().interviews.getInterviewCandidateData(interviewId);
  return response.data;
}
```

---

## 🔍 Дополнительные проверки

### Проверены эндпоинты, которые НЕ вызываются для кандидатов:
- ✅ `GET /account` - только для админов
- ✅ `GET /user/info` - только для админов  
- ✅ `GET /team` - только для админов
- ✅ `GET /branding` - только для админов
- ✅ `GET /tariff/info` - только для админов
- ✅ `GET /positions/{positionId}/questions-with-settings` - только для админов

### Проверены эндпоинты, которые правильно вызываются для кандидатов:
- ✅ `POST /candidates/auth` - авторизация кандидата
- ✅ `POST /interviews/{id}/start` - запуск интервью
- ✅ `POST /interviews/{id}/answer` - отправка ответа
- ✅ `POST /interviews/{id}/finish` - завершение интервью
- ✅ `POST /interviews/{id}/voice/session` - голосовая сессия
- ✅ `GET /interviews/{id}/voice/next-question` - следующий вопрос
- ✅ `POST /interviews/{id}/voice/answer` - голосовой ответ
- ✅ `POST /interviews/{id}/voice/end` - завершение голосовой сессии

---

## 🚀 План исправления

### Этап 1: Создание нового эндпоинта (1 день)
1. Добавить `getInterviewCandidateData` в OpenAPI схему
2. Создать новую схему `InterviewCandidateData`
3. Реализовать на бэкенде

### Этап 2: Обновление фронтенда (1 день)
1. Добавить метод в `candidateApiService`
2. Заменить `getInterview` на `getInterviewCandidateData` в компонентах
3. Обновить типы данных

### Этап 3: Тестирование (1 день)
1. Проверить работу для кандидатов
2. Убедиться, что админы по-прежнему получают полные данные
3. Проверить безопасность

---

## 📈 Результат

После исправления:
- **Безопасность**: Кандидаты не увидят чувствительные данные
- **Производительность**: Меньше данных передается по сети
- **Чистота кода**: Четкое разделение между админским и кандидатским API
- **Соответствие принципам**: Минимальные необходимые права доступа

---

**Статус**: 🔴 **ТРЕБУЕТ ИСПРАВЛЕНИЯ**

**Приоритет**: 🔥 **ВЫСОКИЙ** - проблема безопасности 