# 📊 Анализ данных GET /interviews/{interviewId}

## Обзор

Эндпоинт `GET /interviews/{interviewId}` возвращает полную информацию об интервью в формате `GetInterview200Response`, которая содержит 4 основных блока данных:

```typescript
interface GetInterview200Response {
  interview?: Interview;
  candidate?: Candidate;
  position?: Position;
  questions?: Array<Question>;
}
```

---

## 1. 📋 Interview (Данные интервью)

### Основные поля:
```typescript
interface Interview {
  id: number;                    // ID интервью
  candidateId: number;           // ID кандидата
  positionId: number;            // ID позиции
  status: InterviewStatusEnum;   // Статус: not_started | in_progress | finished
  result?: InterviewResultEnum;  // Результат: successful | unsuccessful | error
  createdAt: string;             // Дата создания
  startedAt?: string;            // Дата начала
  finishedAt?: string;           // Дата окончания
  transcript?: string;           // Транскрипт всего интервью
  audioUrl?: string;             // URL аудио файла
  videoUrl?: string;             // URL видео файла
  aiScore?: number;              // AI оценка (0-100)
  answers?: Array<InterviewAnswer>; // Массив ответов
}
```

### InterviewAnswer (Ответы на вопросы):
```typescript
interface InterviewAnswer {
  id: number;                    // ID ответа
  interviewId: number;           // ID интервью
  questionId: number;            // ID вопроса
  answerText: string;            // Текст ответа
  audioUrl?: string;             // URL аудио ответа
  transcript?: string;           // Транскрипт ответа
  score?: number;                // Оценка ответа (0-100)
  scoreJustification?: string;   // Обоснование оценки
  createdAt: string;             // Дата создания ответа
}
```

---

## 2. 👤 Candidate (Данные кандидата)

### Структура:
```typescript
type Candidate = BaseCandidateFields & BaseEntity;
```

### BaseCandidateFields:
```typescript
interface BaseCandidateFields {
  firstName?: string;            // Имя
  lastName?: string;             // Фамилия
  name?: string;                 // Полное имя
  email?: string;                // Email
  phone?: string;                // Телефон
  status?: CandidateStatusEnum;  // Статус: new | in_progress | finished | rejected | hired
}
```

### BaseEntity:
```typescript
interface BaseEntity {
  id: number;                    // ID кандидата
  createdAt: string;             // Дата создания
  updatedAt: string;             // Дата обновления
}
```

---

## 3. 💼 Position (Данные позиции/вакансии)

### Структура:
```typescript
type Position = BaseEntity & BasePositionFields;
```

### BasePositionFields:
```typescript
interface BasePositionFields {
  title: string;                 // Название вакансии
  description?: string;          // Описание
  status: PositionStatusEnum;    // Статус: active | paused | archived
  ownerId: number;               // ID владельца
  topics?: string[];             // Ключевые темы/теги
  minScore?: number;             // Минимальный проходной балл
  language?: string;             // Язык собеседования
  showOtherLang?: boolean;       // Показывать на других языках
  tags?: string[];               // Теги для поиска
  answerTime?: number;           // Время на ответ в секундах
  level?: PositionLevelEnum;     // Уровень: junior | middle | senior | lead
  saveAudio?: boolean;           // Сохранять аудио
  saveVideo?: boolean;           // Сохранять видео
  randomOrder?: boolean;         // Случайный порядок вопросов
  questionType?: string;         // Тип вопросов
  questionsCount?: number;       // Количество вопросов
  checkType?: string;            // Тип проверки
}
```

### Дополнительные поля Position:
```typescript
interface Position {
  // ... BaseEntity + BasePositionFields
  company?: string;              // Название компании
  publicLink?: string;           // Публичная ссылка
  stats?: PositionStats;         // Статистика позиции
  team?: User[];                 // Команда
  branding?: Branding;           // Брендинг
  candidates?: Candidate[];      // Кандидаты
  avgScore?: number;             // Средний балл
}
```

---

## 4. ❓ Questions (Вопросы для интервью)

### Структура:
```typescript
type Question = BaseEntity & BaseQuestionFields;
```

### BaseQuestionFields:
```typescript
interface BaseQuestionFields {
  text: string;                  // Текст вопроса
  type?: QuestionTypeEnum;       // Тип: text | audio | video | choice
  order?: number;                // Порядок вопроса
  isRequired?: boolean;          // Обязательный вопрос
  evaluationCriteria?: string;   // Критерии оценки
}
```

### BaseEntity:
```typescript
interface BaseEntity {
  id: number;                    // ID вопроса
  createdAt: string;             // Дата создания
  updatedAt: string;             // Дата обновления
}
```

---

## 🔍 Анализ для кандидатов

### ✅ **Необходимые данные для кандидатов:**

1. **Interview** - только базовые поля:
   - `id`, `status`, `createdAt`
   - `startedAt`, `finishedAt` (для отслеживания прогресса)

2. **Candidate** - только данные текущего кандидата:
   - `firstName`, `lastName`, `name`
   - `email`, `phone`

3. **Position** - только публичные данные:
   - `title`, `description`
   - `language`, `answerTime`
   - `saveAudio`, `saveVideo`
   - `questionsCount`

4. **Questions** - только текст вопросов:
   - `text`, `type`, `order`

### ❌ **Данные, которые НЕ нужны кандидатам:**

1. **Interview:**
   - `aiScore` - оценка AI
   - `answers` - ответы других кандидатов
   - `transcript` - полная транскрипция

2. **Position:**
   - `ownerId` - ID владельца
   - `stats` - статистика
   - `team` - команда
   - `candidates` - другие кандидаты
   - `avgScore` - средний балл

3. **Questions:**
   - `evaluationCriteria` - критерии оценки

---

## 🛡️ Рекомендации по безопасности

### 1. Создать отдельный эндпоинт для кандидатов:
```
GET /candidates/interviews/{interviewId}
```

### 2. Возвращать только необходимые поля:
```typescript
interface CandidateInterviewResponse {
  interview: {
    id: number;
    status: InterviewStatusEnum;
    createdAt: string;
    startedAt?: string;
    finishedAt?: string;
  };
  candidate: {
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phone: string;
  };
  position: {
    title: string;
    description?: string;
    language?: string;
    answerTime?: number;
    saveAudio?: boolean;
    saveVideo?: boolean;
    questionsCount?: number;
  };
  questions: Array<{
    id: number;
    text: string;
    type?: QuestionTypeEnum;
    order?: number;
  }>;
}
```

### 3. Убрать чувствительные данные:
- ❌ Статистика и метрики
- ❌ Данные других кандидатов
- ❌ Внутренние ID и ссылки
- ❌ Критерии оценки
- ❌ AI оценки

---

## 📋 Итоговая структура для кандидатов

```typescript
// Минимальная структура для кандидатов
interface CandidateInterviewData {
  // Основная информация об интервью
  interview: {
    id: number;
    status: 'not_started' | 'in_progress' | 'finished';
    createdAt: string;
    startedAt?: string;
    finishedAt?: string;
  };
  
  // Данные кандидата
  candidate: {
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phone: string;
  };
  
  // Данные вакансии
  position: {
    title: string;
    description?: string;
    language?: string;
    answerTime?: number;
    saveAudio?: boolean;
    saveVideo?: boolean;
    questionsCount?: number;
  };
  
  // Вопросы для интервью
  questions: Array<{
    id: number;
    text: string;
    type?: 'text' | 'audio' | 'video' | 'choice';
    order?: number;
  }>;
}
```

---

**Дата**: 2024  
**Статус**: Анализ завершен  
**Рекомендация**: Создать отдельный эндпоинт для кандидатов с минимальным набором данных 