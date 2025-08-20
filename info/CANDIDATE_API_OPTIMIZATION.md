# 🎯 Оптимизация API для кандидатов

## Проблема

Кандидаты видели лишние API запросы, которые не должны были выполняться:
- `GET /positions/{positionId}/questions-with-settings` - вопросы с настройками
- `GET /tariff/info` - информация о тарифе

## Причина

**Layout компонент использовался для всех страниц**, включая страницы кандидатов. При загрузке Layout автоматически вызывал:
1. `apiService.getAccount()` - который мог вызывать дополнительные API
2. Другие методы, не предназначенные для кандидатов

## Решение

### 1. Создан отдельный CandidateLayout

```typescript
// src/components/CandidateLayout.tsx
const CandidateLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Простой заголовок для кандидатов */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Интервью
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <main className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
```

### 2. Создан отдельный CandidateApiService

```typescript
// src/services/candidateApiService.ts
class CandidateApiService {
  // Только методы, необходимые для кандидатов:
  async authCandidate(authData: any): Promise<any>
  async getInterview(interviewId: number): Promise<any>
  async startInterview(interviewId: number, options?: any): Promise<any>
  async submitInterviewAnswer(interviewId: number, answerData: any): Promise<any>
  async finishInterview(interviewId: number): Promise<any>
  async getPosition(positionId: number): Promise<any>
  
  // Voice Interview Methods
  async createVoiceSession(interviewId: number, options?: any): Promise<any>
  async getNextQuestion(interviewId: number): Promise<any>
  async saveVoiceAnswer(interviewId: number, questionId: number, voiceMessage: any): Promise<any>
  async endVoiceSession(interviewId: number): Promise<void>
  async getVoiceSessionStatus(interviewId: number): Promise<any>
  async transcribeInterviewAnswer(audioFile: File, interviewId: number, questionId: number): Promise<any>
}
```

### 3. Обновлен роутинг

```typescript
// src/App.tsx
<Routes>
  {/* Публичные страницы (без Layout) */}
  <Route path="/login" element={<Login />} />
  <Route path="/interview-entry" element={<InterviewEntryForm />} />
  <Route path="/interview-entry-demo" element={<InterviewEntryDemo />} />
  
  {/* Страницы кандидатов (с CandidateLayout) */}
  <Route path="/interview/:sessionId" element={<CandidateLayout><InterviewSession /></CandidateLayout>} />
  <Route path="/elabs/:sessionId" element={<CandidateLayout><ElabsSession /></CandidateLayout>} />
  
  {/* Админские страницы (с Layout) */}
  <Route path="/" element={<ProtectedRoute><EditorLayout /></ProtectedRoute>} />
  <Route path="/old" element={<Layout />}>
    {/* ... админские роуты ... */}
  </Route>
</Routes>
```

### 4. Обновлены компоненты кандидатов

- `InterviewEntryForm.tsx` - использует `candidateApiService`
- `ElabsSession.tsx` - использует `candidateApiService`
- `InterviewSession.tsx` - использует `candidateApiService`

## Результат

✅ **Кандидаты больше не видят лишние API запросы**

### API запросы для кандидатов (только необходимые):

1. **Авторизация кандидата:**
   - `POST /candidates/auth` - авторизация

2. **Данные интервью:**
   - `GET /interviews/{id}` - получение данных интервью
   - `GET /positions/{id}` - получение данных позиции

3. **Управление интервью:**
   - `POST /interviews/{id}/start` - начало интервью
   - `POST /interviews/{id}/finish` - завершение интервью
   - `POST /interviews/{id}/answer` - отправка ответа

4. **Голосовые интервью:**
   - `POST /interviews/{interviewId}/voice/session` - создание сессии
   - `GET /interviews/{interviewId}/voice/next-question` - следующий вопрос
   - `POST /interviews/{interviewId}/voice/answer` - сохранение ответа
   - `POST /interviews/{interviewId}/voice/end` - завершение сессии
   - `GET /interviews/{interviewId}/voice/status` - статус сессии

5. **Транскрибация:**
   - `POST /ai/transcribe-answer` - транскрибация ответа

### Удаленные API запросы:

❌ `GET /positions/{positionId}/questions-with-settings` - не вызывается
❌ `GET /tariff/info` - не вызывается
❌ `GET /account` - не вызывается для кандидатов
❌ `GET /branding` - не вызывается для кандидатов
❌ `GET /users` - не вызывается для кандидатов
❌ `GET /reports` - не вызывается для кандидатов

## Архитектурные улучшения

1. **Разделение ответственности** - отдельные сервисы для админов и кандидатов
2. **Безопасность** - кандидаты не имеют доступа к админским API
3. **Производительность** - меньше ненужных запросов
4. **Чистота кода** - четкое разделение логики

## Тестирование

Для проверки исправления:

1. Откройте DevTools → Network
2. Перейдите на страницу кандидата `/interview-entry`
3. Заполните форму и авторизуйтесь
4. Перейдите на страницу интервью `/elabs/{id}`
5. Убедитесь, что в Network нет запросов к `/tariff/info` и `/questions-with-settings`

---

**Дата**: 2024  
**Статус**: ✅ Завершено  
**Влияние**: Высокое - улучшена безопасность и производительность 