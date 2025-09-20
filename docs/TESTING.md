## Руководство по тестированию (Frontend)

### Обзор
Тестовый стек проекта:
- Jest + ts-jest (TypeScript, jsdom)
- @testing-library/react (RTL) и @testing-library/user-event
- Покрытие кода: Istanbul (через Jest)

Цели тестов:
- Проверять бизнес-логику сервисов и хуков (unit/integration)
- Валидировать критические пользовательские сценарии (интеграционные UI-тесты на RTL)
- Документировать ожидаемое поведение компонентов и страниц

### Запуск тестов
- Все тесты:
```
npm test -- --watchAll=false
```
- С покрытием:
```
npm test -- --coverage --watchAll=false
```
- По маске имён файлов:
```
npm test -- --testPathPattern="candidate|hooks|utils" --watchAll=false
```

Отчёт покрытия генерируется в каталоге `coverage/` (HTML-отчёт: `coverage/lcov-report/index.html`).

### Структура тестов
- Расположение: рядом с кодом или в каталоге `__tests__` внутри `src/`
- Наименования файлов: `*.test.ts(x)` или `*.spec.ts(x)`
- Категории:
  - Сервисы: `src/candidate/services/__tests__/*`
  - Хуки: `src/candidate/hooks/__tests__/*`
  - Компоненты/страницы: `src/candidate/**/__tests__/*`
  - Утилиты: `src/utils/__tests__/*`

### Конфигурация Jest (кратко)
- Файл: `jest.config.js`
- Ключевые опции:
  - `preset: 'ts-jest'`, `testEnvironment: 'jsdom'`
  - `setupFilesAfterEnv: ['<rootDir>/jest.setup.js']`
  - `collectCoverage: true`, репортёры: `text`, `lcov`, `html`
  - `transformIgnorePatterns`: пропускает ESM-пакеты UI, при необходимости расширяйте

### Моки и окружение
- Глобальные моки добавляются в `jest.setup.js` (localStorage, matchMedia, ResizeObserver, базовые аудио API)
- Для Web Audio / MediaRecorder в специфичных тестах используйте ручные моки:
  - `window.AudioContext`, `navigator.mediaDevices.getUserMedia`
  - `window.MediaRecorder`, `window.URL.createObjectURL`
  - `requestAnimationFrame` через `jest.useFakeTimers()`/`advanceTimersByTime`

Рекомендации:
- Держите моки узкими (на уровне теста), чтобы не влияли на другие наборы
- Отключайте сложные побочки: ретраи, случайные таймеры

### Паттерны написания тестов
- Arrange-Act-Assert
- Для хуков: `renderHook` и `act` из RTL
- Для компонент: тестируйте поведение через DOM (роль, текст, aria-*), а не детали реализации
- Для сервисов: мокайте внешние зависимости (API-клиенты, axios, сгенерированный SDK)

Примеры проверок:
- Успешные и ошибочные сценарии
- Граничные условия (пустые данные, некорректные значения)
- Переходы состояния (loading -> success/error), навигация

### Покрытие и цели качества
- Целевые метрики (минимум):
  - Компоненты: 80%+
  - Сервисы: 90%+
  - Хуки: 85%+
  - Утилиты: 80%+
  - Общее покрытие: 75%+
- Полезная метрика — покрытие веток (branches) на критических участках

### Типичные проблемы и решения (Troubleshooting)
1) Ошибка ESM для axios в Jest:
   - Симптом: `SyntaxError: Cannot use import statement outside a module (axios)`
   - Решение: в `jest.config.js` добавить сопоставление CJS-билда, например:
```
moduleNameMapper: {
  '^axios$': 'axios/dist/node/axios.cjs',
  // ...прочие маппинги
}
```

2) Ошибка RTL/ReactDOM вида `Cannot read properties of undefined (indexOf)`:
   - Причина: конфликт версий `react`, `react-dom`, `@testing-library/react`, либо некорректный импорт в тестовой среде
   - Действия:
     - Сверить версии `react` и `react-dom` (должны совпадать)
     - Обновить `@testing-library/react` до совместимой версии
     - Проверить, что тесты не импортируют файлы, выполняющие побочные эффекты при загрузке

3) Таймауты в аудио-тестах (MediaRecorder/FileReader/RAF):
   - Используйте `jest.useFakeTimers()` и управляйте временем через `advanceTimersByTime`
   - Мокайте `FileReader` и резолвите `onload` вручную

### Практики для стабильности
- Изолируйте побочные эффекты: каждый тест должен сам подготавливать и очищать окружение (`beforeEach`/`afterEach`)
- Для нестабильных API — вводите тонкие адаптеры и покрывайте их контрактными тестами
- Избегайте снапшотов на большие деревья — валидируйте по ролям и текстам

### CI и отчёты
- Рекомендуется добавить шаги в CI:
  - `npm ci`
  - `npm run build:with-tests` (опционально) или `npm test -- --coverage --watchAll=false`
  - Публикация `coverage/lcov-report` как артефакт

### Дорожная карта расширения покрытия
- Сервисы (критично): `candidateApiService`, `audioService`, `voiceInterviewService`
- Хуки: `useCandidateAuth`, `useInterviewStages`, `useAudioRecording`, `useVoiceInterview`
- Компоненты интервью: `InterviewProcess`, `QuestionStage`, `MicrophoneCheckStage`, `ProgressBar`
- Страницы и формы: `CandidateInterview`, `AuthForm`, `EmailVerification`
- Утилиты: `logger`, `audioUtils`

Отдельный детальный перечень сценариев и критериев приёмки — см. `info/TEST_COVERAGE_TASK_SPECIFICATION.md`.

### Быстрый чек-лист перед PR
- [ ] Локально: все тесты зелёные (`npm test -- --watchAll=false`)
- [ ] Покрытие не ниже порогов (см. `jest.config.js`)
- [ ] Новые публичные методы покрыты тестами (успех/ошибка)
- [ ] Нет «флаки» тестов (перезапуск даёт стабильный результат)

### Контакты/ответственность
За поддержание тестов отвечает команда фронтенда; текущий владелец задачи — AI Assistant (см. `info/TEST_COVERAGE_TASK_SPECIFICATION.md`).


