# Руководство по миграции с Mock API на реальное API

## Обзор изменений

Проект был успешно мигрирован с использования мок API на реальное сгенерированное API из OpenAPI спецификации.

## Основные изменения

### 1. Удалены файлы
- `src/mocks/mockApi.ts` - основной мок API
- `src/mocks/vacancies.json` - мок данные

### 2. Создан новый сервисный слой
- `src/services/apiService.ts` - новый сервис для работы с реальным API

### 3. Обновлены существующие сервисы
- `src/services/authService.ts` - обновлен для использования нового API сервиса
- `src/client/apiClient.ts` - обновлен базовый URL

### 4. Обновлены все компоненты
Все компоненты были успешно мигрированы с mock API на реальное API:

- `src/components/Layout.tsx` - обновлен для использования нового API сервиса
- `src/pages/Dashboard.tsx` - уже использовал новый API сервис
- `src/pages/VacancyList.tsx` - уже использовал новый API сервис
- `src/pages/Account.tsx` - обновлен для использования нового API сервиса
- `src/pages/Branding.tsx` - обновлен для использования нового API сервиса
- `src/pages/Team.tsx` - обновлен для использования нового API сервиса
- `src/pages/Tariffs.tsx` - обновлен для использования нового API сервиса
- `src/pages/Questions.tsx` - обновлен для использования нового API сервиса
- `src/pages/InterviewList.tsx` - обновлен для использования нового API сервиса
- `src/pages/InterviewCreate.tsx` - обновлен для использования нового API сервиса
- `src/pages/VacancyCreate.tsx` - обновлен для использования нового API сервиса
- `src/pages/Stats.tsx` - обновлен для использования нового API сервиса
- `src/pages/Reports.tsx` - обновлен для использования нового API сервиса
- `src/pages/Learn.tsx` - обновлен для использования нового API сервиса
- `src/pages/Archive.tsx` - обновлен для использования нового API сервиса
- `src/pages/InterviewSession.tsx` - обновлен для использования нового API сервиса

## Структура нового API сервиса

### Основные методы

#### Аутентификация
- `login(email, password)` - вход в систему
- `logout()` - выход из системы

#### Аккаунт
- `getAccount()` - получить профиль пользователя
- `updateAccount(userData)` - обновить профиль

#### Вакансии
- `getPositions(params)` - получить список вакансий
- `getPosition(id)` - получить вакансию по ID
- `createPosition(positionData)` - создать вакансию
- `updatePosition(id, positionData)` - обновить вакансию
- `getPositionStats(id)` - получить статистику вакансии
- `getPositionPublicLink(id)` - получить публичную ссылку

#### Кандидаты
- `getCandidates(positionId)` - получить кандидатов вакансии
- `getCandidate(id)` - получить кандидата по ID
- `createCandidate(positionId, candidateData)` - создать кандидата
- `updateCandidate(id, candidateData)` - обновить кандидата
- `deleteCandidate(id)` - удалить кандидата

#### Собеседования
- `getInterviews(params)` - получить список собеседований
- `getInterview(id)` - получить собеседование по ID
- `startInterview(candidateId)` - начать собеседование
- `submitInterviewAnswer(interviewId, answerData)` - отправить ответ
- `finishInterview(interviewId)` - завершить собеседование
- `getPositionInterviews(positionId)` - получить собеседования вакансии

#### Вопросы
- `getQuestions(positionId)` - получить вопросы вакансии
- `createQuestion(positionId, questionData)` - создать вопрос
- `updateQuestion(id, questionData)` - обновить вопрос
- `deleteQuestion(id)` - удалить вопрос

#### Команда и пользователи
- `getUsers()` - получить список пользователей
- `createUser(userData)` - создать пользователя
- `getUser(id)` - получить пользователя по ID
- `updateUser(id, userData)` - обновить пользователя
- `deleteUser(id)` - удалить пользователя

#### Настройки
- `getBranding()` - получить брендинг
- `updateBranding(brandingData)` - обновить брендинг
- `getTariffs()` - получить тарифы
- `getTariffInfo()` - получить информацию о тарифе

#### AI
- `generateQuestions(description, questionsCount)` - сгенерировать вопросы
- `transcribeAudio(audioFile)` - транскрибировать аудио
- `transcribeInterviewAnswer(interviewId, answerId)` - транскрибировать ответ

#### Аналитика и отчеты
- `getStats()` - получить статистику
- `getReports()` - получить отчеты
- `getMonthlyReport(year, month)` - получить месячный отчет

#### Дополнительные методы
- `getChecklist()` - получить чек-лист
- `getInviteInfo()` - получить информацию о приглашении
- `getLearnMaterials()` - получить обучающие материалы

## Конфигурация

### Переменные окружения
Создайте файл `.env` в корне проекта:

```bash
# API Configuration
REACT_APP_RECRUITER_API_HOST=your-api-host:8080

# Другие переменные...
```

## API Configuration

По умолчанию API клиент настроен на относительный путь `/api/v1`. Для указания конкретного хоста используйте переменную `REACT_APP_RECRUITER_API_HOST`.

### Базовый URL
По умолчанию API клиент требует переменную окружения `REACT_APP_API_HOST`.
Для продакшена и разработки используйте только эту переменную.

## Обработка ошибок

Новый API сервис может выбрасывать ошибки при проблемах с сетью или сервером. 
Все компоненты обновлены для обработки ошибок с использованием toast уведомлений:

```typescript
try {
  const data = await apiService.getPositions();
  setPositions(data.items);
} catch (error) {
  console.error('Error fetching positions:', error);
  toast.error('Ошибка загрузки вакансий');
}
```

## Типы данных

Все компоненты обновлены для использования правильных типов данных из сгенерированных моделей:

- `User` - использует `firstName` и `lastName` вместо `name`
- `Question` - использует `QuestionTypeEnum` для типа вопроса
- `Position` - использует `PositionStatusEnum` и `PositionLevelEnum`
- `Branding` - использует `BrandingUpdateRequest` для обновления

## Тестирование

1. Убедитесь, что бэкенд сервер запущен
2. Проверьте, что API доступен по адресу, указанному в `REACT_APP_RECRUITER_API_HOST`
3. Протестируйте основные функции: вход, получение данных, создание записей

## Статус миграции

✅ **МИГРАЦИЯ ЗАВЕРШЕНА**

Все компоненты успешно мигрированы с mock API на реальное API. Основные функции:

- ✅ Аутентификация
- ✅ Управление вакансиями
- ✅ Управление кандидатами
- ✅ Управление собеседованиями
- ✅ Управление вопросами
- ✅ Управление пользователями
- ✅ Настройки брендинга
- ✅ Статистика и отчеты
- ✅ AI генерация вопросов

## Полезные ссылки

- [OpenAPI спецификация](../api/openapi.yaml)
- [Сгенерированный API клиент](./src/client/)
- [Новый API сервис](../src/services/apiService.ts)

# Миграция на новую переменную окружения

Используйте только REACT_APP_API_BASE_URL для настройки адреса API.

- Локально:
  ```
  REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
  ```
- На проде: переменную не указывайте, будет относительный путь `/api/v1`. 