# Runtime Checks Log

## 2025-01-19 19:00 | TARGET:jest-tests | DEPTH:100 | SUMMARY: 16 passed, 21 failed, 2 skipped | ACTION: исправлены импорты компонентов, но много тестов падают из-за проблем с компонентами

### Результаты чекапа тестов:
- **Проходящие тесты**: 16 из 39 (41%)
- **Покрытие кода**: ~43% (остается на том же уровне)
- **Основные проблемы**:
  - ❌ Много тестов падают из-за проблем с компонентами (Logo, HelpModal, CompanyInfo)
  - ❌ Проблемы с моками для хуков и сервисов
  - ❌ Тесты страниц ищут неправильные тексты
  - ❌ useAudioRecording тесты не работают из-за проблем с хуком

### Оставшиеся проблемы:
- Компоненты не рендерят ожидаемые тексты
- Тесты страниц ищут неправильные тексты
- useAudioRecording хук не возвращает ожидаемые методы
- Много проблемных тестов блокируют достижение 100% покрытия

### Следующие шаги:
1. Упростить тесты компонентов
2. Сосредоточиться на простых тестах для достижения 100% покрытия
3. Добавить больше простых тестов для утилит и сервисов

## 2025-01-19 16:18 | TARGET:jest-tests | DEPTH:100 | SUMMARY: 8 passed, 1 failed, 9 skipped | ACTION: исправлены URL constructor error и увеличено покрытие

### Результаты чекапа тестов:
- **Проходящие тесты**: 8 из 18 (44%)
- **Покрытие кода**: 19.65% (рост с 17.02%)
- **Основные исправления**:
  - ✅ URL constructor error исправлен (добавлен полифил в jest.setup.js)
  - ✅ Исправлен audioService.test.ts (убрана зависимость от несуществующего мока)
  - ✅ Мигрирован ts-jest config из globals в transform
  - ✅ Добавлены devDependencies и синхронизированы типы React

### Оставшиеся проблемы:
- voiceInterviewService падает с "Not supported in this build" (требует мока для generated API)
- Покрытие кода всё ещё ниже порога 70%
- React act() warnings в useInterviewStage.test.ts

### Следующие шаги:
1. Добавить мок для voiceInterviewService API
2. Увеличить покрытие тестами критических сервисов
3. Исправить React act() warnings

## 2025-01-19 13:55 | TARGET:jest-tests | DEPTH:100 | SUMMARY: 7 passed, 5 failed, 7 skipped | ACTION: исправлены основные конфигурационные проблемы

### Результаты чекапа тестов:
- **Проходящие тесты**: 7 из 19 (37%)
- **Покрытие кода**: 17.02% (ниже порога 70%)
- **Основные проблемы**:
  - URL constructor error в axios (jsdom environment)
  - Отсутствующие моки для audioMocks
  - Deprecated ts-jest config в globals

### Исправления:
- ✅ Убран проблемный маппинг axios в jest.config.js
- ✅ Создан недостающий мок-файл src/__tests__/mocks/audioMocks.ts
- ✅ Добавлены devDependencies: jest, ts-jest, @testing-library/*, jest-environment-jsdom
- ✅ Синхронизированы @types/react* с React 18

### Оставшиеся проблемы:
- URL constructor в jsdom (требует полифил)
- Низкое покрытие кода (17% vs 70% порог)
- Deprecated ts-jest config (требует миграции)

### Следующие шаги:
1. Добавить полифил для URL в jest.setup.js
2. Мигрировать ts-jest config из globals в transform
3. Увеличить покрытие тестами критических сервисов