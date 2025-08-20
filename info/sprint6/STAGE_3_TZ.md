# ТЗ: ЭТАП 3 - ИНТЕГРАЦИЯ API (ИСПРАВЛЕННЫЙ И АКТУАЛИЗИРОВАННЫЙ)

## ОБЩАЯ ИНФОРМАЦИЯ
- **Этап**: 3 из 5
- **Название**: Интеграция API
- **Срок**: 2-3 дня
- **Приоритет**: Критический
- **Статус**: ⏳ Ожидает начала
- **Источник**: OpenAPI файлы + описание пользователя

## ЦЕЛЬ ЭТАПА
Заменить мок-данные на реальные API вызовы для **трехэтапной аутентификации** и **голосового интервью с имитацией рекрутера**.

## РЕАЛЬНЫЙ ФЛОУ КАНДИДАТА (АКТУАЛИЗИРОВАННЫЙ)
```
1. Кандидат открывает ссылку с ID собеседования
2. AuthForm → ввод firstName, lastName, email
3. EmailVerification → подтверждение email кодом
4. InterviewProcess → голосовое интервью с имитацией рекрутера:
   - Старт интервью
   - Получение вопросов по одному
   - Воспроизведение аудио с анимацией
   - Запись ответа кандидата
   - Отправка ответа на бекенд
   - Повтор для каждого вопроса
   - Финиш интервью
```

## ДЕТАЛЬНЫЕ ЗАДАЧИ

### ЗАДАЧА 3.1: Создание API сервисов
**Время**: 3 часа
**Сложность**: Средняя

**Действия**:
1. Создать `src/candidate/services/candidateAuthService.ts`
2. Создать `src/candidate/services/voiceInterviewService.ts`
3. Создать `src/candidate/services/audioService.ts`
4. Настроить базовые конфигурации API

**Сервисы**:
```typescript
// candidateAuthService.ts
export class CandidateAuthService {
  // ЭТАП 1: Регистрация/поиск кандидата
  async authCandidate(request: CandidateAuthRequest): Promise<CandidateAuthResponse>
  // ЭТАП 2: Подтверждение email
  async verifyEmail(email: string, code: string): Promise<EmailVerificationResponse>
}

// voiceInterviewService.ts
export class VoiceInterviewService {
  // ЭТАП 3: Голосовое интервью с имитацией рекрутера
  async startInterview(interviewId: number): Promise<VoiceInterviewStartResponse>
  async getNextQuestion(interviewId: number): Promise<VoiceQuestionResponse>
  async submitAnswer(interviewId: number, questionId: number, audioFile: File): Promise<VoiceAnswerResponse>
  async endInterview(interviewId: number): Promise<VoiceInterviewEndResponse>
}
```

**Критерии готовности**:
- [ ] Все сервисы созданы
- [ ] API конфигурация настроена
- [ ] Типы данных определены
- [ ] Базовые методы работают

### ЗАДАЧА 3.2: ЭТАП 1 - Интеграция AuthForm (АКТУАЛИЗИРОВАННЫЙ И ИСПРАВЛЕННЫЙ)
**Время**: 2 часа
**Сложность**: Средняя

**Действия**:
1. Заменить моковые данные в `AuthForm.tsx` (213 строк)
2. Интегрировать `POST /api/v1/candidates/auth` (find-or-create)
3. Обработать `verificationRequired` флаг
4. Настроить переход к EmailVerification
5. **ID собеседования передается через URL** (например, `/candidate/interview/123`)

**API Endpoint**:
```typescript
// POST /api/v1/candidates/auth
interface CandidateAuthRequest {
  firstName: string;
  lastName: string;
  email: string;
  // interviewId НЕ передается в API - он берется из URL
}

interface CandidateAuthResponse {
  token?: string;              // JWT токен (если уже верифицирован)
  verificationRequired: boolean; // true если нужна верификация email
  candidate: Candidate;        // Данные кандидата
}

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: 'NEW' | 'IN_PROGRESS' | 'FINISHED' | 'REJECTED' | 'HIRED';
}
```

**Логика работы**:
1. Кандидат открывает ссылку `/candidate/interview/{interviewId}`
2. ID собеседования извлекается из URL
3. Пользователь вводит данные в `AuthForm`
4. Отправляется `POST /api/v1/candidates/auth`
5. Если `verificationRequired: true` → переход к `EmailVerification`
6. Если `verificationRequired: false` → переход к `InterviewProcess`

**Критерии готовности**:
- [ ] Регистрация кандидата работает
- [ ] Обрабатывается `verificationRequired`
- [ ] ID собеседования извлекается из URL
- [ ] Переход к email verification с правильными данными

### ЗАДАЧА 3.3: ЭТАП 2 - Интеграция EmailVerification (АКТУАЛИЗИРОВАННЫЙ И ИСПРАВЛЕННЫЙ)
**Время**: 2 часа
**Сложность**: Средняя

**Действия**:
1. Заменить моковые данные в `EmailVerification.tsx` (243 строки)
2. Интегрировать подтверждение email кода
3. Настроить повторную отправку кода
4. Обработать JWT токен после подтверждения
5. Передать данные к интервью

**API Endpoint**:
```typescript
// POST /api/v1/candidates/auth (с verificationCode)
interface CandidateAuthRequest {
  firstName: string;
  lastName: string;
  email: string;
  verificationCode: string;  // Код подтверждения
}

interface CandidateAuthResponse {
  token: string;             // JWT токен после подтверждения
  verificationRequired: false; // Всегда false после подтверждения
  candidate: Candidate;
}
```

**Логика работы**:
1. Пользователь вводит код в `EmailVerification`
2. Отправляется `POST /api/v1/candidates/auth` с `verificationCode`
3. При успехе получаем `token` → переход к `InterviewProcess`
4. При ошибке показываем сообщение об ошибке

**Критерии готовности**:
- [ ] Код подтверждения отправляется на API
- [ ] JWT токен сохраняется после подтверждения
- [ ] Переход к интервью после успешной верификации
- [ ] Обработка ошибок верификации

### ЗАДАЧА 3.4: ЭТАП 3 - Интеграция InterviewProcess (АКТУАЛИЗИРОВАННЫЙ)
**Время**: 6 часов
**Сложность**: Высокая

**Действия**:
1. Заменить моковые вопросы в `InterviewProcess.tsx` (676 строк!)
2. Интегрировать **полный флоу голосового интервью с имитацией рекрутера**:

**ПРАВИЛЬНАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ API ВЫЗОВОВ**:
```typescript
// 1. СТАРТ ИНТЕРВЬЮ
POST /api/v1/interviews/{interviewId}/voice/start
→ VoiceInterviewStartResponse

// 2. ЦИКЛ ДЛЯ КАЖДОГО ВОПРОСА:
// 2.1. Получить следующий вопрос
GET /api/v1/interviews/{interviewId}/voice/next-question
→ VoiceQuestionResponse (с audioUrl)

// 2.2. Воспроизвести аудио с анимацией
// Анимация работает ТОЛЬКО при воспроизведении аудио
GET /api/v1/questions/{questionId}/voice/audio
→ Audio file

// 2.3. Записать ответ кандидата
// VoiceRecorder.tsx записывает аудио

// 2.4. Отправить ответ на бекенд
POST /api/v1/interviews/{interviewId}/voice/answer?questionId={questionId}
Content-Type: multipart/form-data
Body: { audio: File }
→ VoiceAnswerResponse

// 3. ФИНИШ ИНТЕРВЬЮ
POST /api/v1/interviews/{interviewId}/voice/end
→ Interview
```

**Ключевые особенности**:
- **Имитация рекрутера**: Воспроизведение аудио вопросов
- **Анимация**: Работает только при воспроизведении аудио
- **Последовательность**: Старт → Вопрос → Ответ → Вопрос → Ответ → ... → Финиш
- **Аудио ответы**: Отправляются как multipart/form-data

**API Endpoints**:
```typescript
// Старт интервью
interface VoiceInterviewStartResponse {
  interviewId: number;
  totalQuestions: number;
  estimatedDuration: number;
  status: 'STARTED';
}

// Получение вопроса
interface VoiceQuestionResponse {
  questionId: number;
  text: string;
  audioUrl: string;
  order: number;
  maxAnswerDuration: number;
}

// Отправка ответа
interface VoiceAnswerRequest {
  audio: File; // multipart/form-data
  // questionId передается как query параметр, а не в body
}

interface VoiceAnswerResponse {
  questionId: number;
  transcript: string;        // Транскрибированный текст ответа
  durationSec: number;       // Длительность ответа в секундах
  confidence: number;        // Уверенность в распознавании (0.0-1.0)
  audioFilePath: string;     // Путь к сохраненному аудиофайлу
  savedAt: string;          // Время сохранения ответа
}
```

**Критерии готовности**:
- [ ] Интервью запускается через API
- [ ] Вопросы загружаются по одному с сервера
- [ ] Аудио воспроизводится с анимацией
- [ ] Аудио ответы отправляются как multipart/form-data
- [ ] Все 9 стадий работают корректно
- [ ] Прогресс отслеживается
- [ ] Имитация рекрутера работает

### ЗАДАЧА 3.5: Интеграция аудио системы (АКТУАЛИЗИРОВАННЫЙ)
**Время**: 4 часа
**Сложность**: Высокая

**Действия**:
1. Обновить `VoiceRecorder.tsx` (472 строки) для работы с API
2. Настроить воспроизведение аудио вопросов
3. **Интегрировать анимацию, которая работает только при воспроизведении аудио**
4. Добавить обработку аудио ошибок

**Аудио API Endpoints**:
```typescript
// Воспроизведение аудио вопросов
GET /api/v1/questions/{questionId}/voice/audio
→ Audio file (MP3/WAV)

// Получение аудио ответов (для анализа)
GET /api/v1/interviews/{interviewId}/answers/{questionId}/audio
→ Audio file (MP3/WAV)
```

**Анимация аудио**:
```typescript
// AIAvatarWithWaves.tsx (111 строк) - анимация только при воспроизведении
const [isPlaying, setIsPlaying] = useState(false);

// Анимация работает только когда isPlaying = true
const waveVariants = {
  animate: isPlaying ? {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: { duration: 2, repeat: Infinity }
  } : {
    scale: 1,
    opacity: 0.3
  }
};
```

**Критерии готовности**:
- [ ] Аудио вопросы воспроизводятся корректно
- [ ] Анимация работает только при воспроизведении
- [ ] Запись аудио работает
- [ ] Аудио отправляется как multipart/form-data
- [ ] Обработка аудио ошибок

### ЗАДАЧА 3.6: Обработка ошибок и состояний
**Время**: 2 часа
**Сложность**: Средняя

**Действия**:
1. Создать систему обработки ошибок API
2. Настроить состояния загрузки для каждого этапа
3. Добавить retry логику
4. Создать fallback механизмы

**Типы ошибок**:
```typescript
interface APIError {
  code: string;
  message: string;
  details?: any;
}

enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}
```

**Критерии готовности**:
- [ ] Ошибки обрабатываются корректно
- [ ] Состояния загрузки отображаются
- [ ] Retry логика работает
- [ ] Fallback механизмы функционируют

### ЗАДАЧА 3.7: Создание хуков для API
**Время**: 3 часа
**Сложность**: Средняя

**Действия**:
1. Создать `useCandidateAuth.ts`
2. Создать `useEmailVerification.ts`
3. Создать `useVoiceInterview.ts`
4. Создать `useAudio.ts`
5. Настроить кэширование и оптимизацию

**Хуки**:
```typescript
// useCandidateAuth.ts
export function useCandidateAuth() {
  const [authState, setAuthState] = useState<AuthState>({});
  const authCandidate = useCallback(async (data: CandidateAuthRequest) => {});
  return { authState, authCandidate };
}

// useEmailVerification.ts
export function useEmailVerification() {
  const [verificationState, setVerificationState] = useState<VerificationState>({});
  const verifyEmail = useCallback(async (email: string, code: string) => {});
  return { verificationState, verifyEmail };
}

// useVoiceInterview.ts
export function useVoiceInterview(interviewId: number) {
  const [interviewState, setInterviewState] = useState<InterviewState>({});
  const startInterview = useCallback(async () => {});
  const getNextQuestion = useCallback(async () => {});
  const submitAnswer = useCallback(async (questionId: number, audioFile: File) => {});
  const endInterview = useCallback(async () => {});
  return { interviewState, startInterview, getNextQuestion, submitAnswer, endInterview };
}

// useAudio.ts
export function useAudio() {
  const [audioState, setAudioState] = useState<AudioState>({});
  const playAudio = useCallback(async (audioUrl: string) => {});
  const recordAudio = useCallback(async (maxDuration: number) => {});
  return { audioState, playAudio, recordAudio };
}
```

**Критерии готовности**:
- [ ] Все хуки созданы
- [ ] Кэширование настроено
- [ ] Оптимизация производительности
- [ ] Типизация полная

## ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ

### API ENDPOINTS (ПРАВИЛЬНЫЕ)
```typescript
// Аутентификация
POST /api/v1/candidates/auth                    // ЭТАП 1: Регистрация/поиск
POST /api/v1/candidates/auth                    // ЭТАП 2: Подтверждение email

// Голосовое интервью с имитацией рекрутера
POST /api/v1/interviews/{id}/voice/start        // Старт интервью
GET /api/v1/interviews/{id}/voice/next-question // Получить следующий вопрос
POST /api/v1/interviews/{id}/voice/answer       // Отправить ответ (multipart/form-data)
POST /api/v1/interviews/{id}/voice/end          // Завершить интервью

// Аудио
GET /api/v1/questions/{questionId}/voice/audio  // Получить аудио вопроса
GET /api/v1/interviews/{interviewId}/answers/{questionId}/audio // Получить аудио ответа
```

### СТРУКТУРА ДАННЫХ
```typescript
// ЭТАП 1: Аутентификация
interface CandidateAuthRequest {
  firstName: string;
  lastName: string;
  email: string;
  interviewId?: number; // ID из ссылки
}

interface CandidateAuthResponse {
  candidateId: number;
  interviewId: number;
  verificationRequired: boolean;
  token?: string;
}

// ЭТАП 2: Подтверждение email
interface EmailVerificationRequest {
  email: string;
  verificationCode: string;
}

interface EmailVerificationResponse {
  candidateId: number;
  interviewId: number;
  token: string;
  expiresAt: string;
}

// ЭТАП 3: Голосовое интервью
interface VoiceInterviewStartResponse {
  interviewId: number;
  totalQuestions: number;
  estimatedDuration: number;
  status: 'STARTED';
}

interface VoiceQuestionResponse {
  questionId: number;
  text: string;
  audioUrl: string;
  order: number;
  maxAnswerDuration: number;
}

interface VoiceAnswerRequest {
  audio: File; // multipart/form-data
  questionId: number;
}

interface VoiceAnswerResponse {
  questionId: number;
  transcript: string;
  durationSec: number;
  confidence: number;
  audioFilePath: string;
  savedAt: string;
}
```

## ЧЕКАП ЭТАПА

### ЧТО ПРОВЕРЯЕМ
1. **ЭТАП 1 - Аутентификация**:
   - [ ] Кандидат открывает ссылку с ID собеседования
   - [ ] Регистрация/поиск работает с `verificationRequired`
   - [ ] Переход к email verification

2. **ЭТАП 2 - Email верификация**:
   - [ ] Код подтверждения отправляется
   - [ ] JWT токен сохраняется после подтверждения
   - [ ] Переход к интервью

3. **ЭТАП 3 - Голосовое интервью с имитацией рекрутера**:
   - [ ] Интервью запускается через `POST /voice/start`
   - [ ] Вопросы загружаются по одному через `GET /voice/next-question`
   - [ ] Аудио воспроизводится с анимацией (только при воспроизведении)
   - [ ] Ответы отправляются через `POST /voice/answer` (multipart/form-data)
   - [ ] Интервью завершается через `POST /voice/end`
   - [ ] Все 9 стадий работают корректно

4. **Общие проверки**:
   - [ ] Ошибки обрабатываются gracefully
   - [ ] Анимация звука работает только при воспроизведении
   - [ ] Аудио отправляется как multipart/form-data

### КОМАНДЫ ДЛЯ ПРОВЕРКИ
```bash
# Проверка API интеграции
npm run test:api

# Проверка аудио
npm run test:audio

# Проверка полного флоу
npm run test:e2e
```

### ОЖИДАЕМЫЙ РЕЗУЛЬТАТ
- **Полный трехэтапный флоу работает** с реальным API
- **Имитация рекрутера** через воспроизведение аудио
- **Анимация работает только при воспроизведении** аудио
- **Аудио ответы отправляются** как multipart/form-data
- **Последовательность API вызовов** корректна

## РИСКИ И МИТИГАЦИЯ

### РИСКИ
1. **Аудио API может быть недоступен**
   - **Митигация**: Fallback на текстовые вопросы

2. **Multipart/form-data может не работать**
   - **Митигация**: Тестировать на разных браузерах

3. **Анимация может не синхронизироваться с аудио**
   - **Митигация**: Использовать Web Audio API события

4. **JWT токен может истечь**
   - **Митигация**: Автоматическое обновление токена

### ПЛАН ДЕЙСТВИЙ ПРИ ОШИБКАХ
1. Остановить процесс
2. Зафиксировать ошибку в `CANDIDATE_INTEGRATION_STATE.md`
3. Определить причину
4. Исправить проблему
5. Повторить проверку

## ДОКУМЕНТАЦИЯ

### ОБНОВЛЯЕМЫЕ ФАЙЛЫ
- `CANDIDATE_INTEGRATION_STATE.md` - обновить статус этапа
- `EXECUTION_PLAN.md` - отметить выполнение
- `API_INTEGRATION_PLAN.md` - актуализировать с правильными эндпоинтами

### ЛОГИ
- Записать время начала и окончания
- Зафиксировать выполненные задачи
- Отметить найденные проблемы
- Записать решения

## СЛЕДУЮЩИЙ ЭТАП
После успешного завершения этапа 3 перейти к **ЭТАПУ 4: РЕФАКТОРИНГ**

---

**Статус**: ⏳ Ожидает начала
**Следующее действие**: Начать выполнение задачи 3.1
**Источник**: OpenAPI файлы + описание пользователя
