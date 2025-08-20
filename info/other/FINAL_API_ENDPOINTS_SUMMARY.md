# 🎯 Финальная сводка API эндпоинтов после приветственного окна

## 📋 Полный список эндпоинтов с токеном кандидата

### 🔑 1. Авторизация (без токена)
```
POST /candidates/auth
```
**Описание:** Получение JWT токена кандидата  
**Используется в:** `InterviewEntryForm.tsx`  
**Токен:** Не требуется (публичный эндпоинт)

---

### 🎤 2. Голосовое интервью (с токеном)

#### 2.1 Получение данных интервью
```
GET /interviews/{interviewId}
```
**Описание:** Получение полной информации об интервью  
**Используется в:** `ElabsSession.tsx` (строка 113)  
**Токен:** `Authorization: Bearer <candidate_token>`

#### 2.2 Запуск интервью с созданием агента
```
POST /interviews/{interviewId}/start
```
**Описание:** Запуск интервью и автоматическое создание ElevenLabs агента  
**Используется в:** `ElabsSession.tsx` (строка 119)  
**Токен:** `Authorization: Bearer <candidate_token>`  
**Body:**
```json
{
  "voiceMode": true,
  "autoCreateAgent": true
}
```

#### 2.3 Создание голосовой сессии
```
POST /interviews/{interviewId}/voice/session
```
**Описание:** Создание голосовой сессии в ElevenLabs  
**Используется в:** `voiceInterviewService.ts`  
**Токен:** `Authorization: Bearer <candidate_token>`

#### 2.4 Получение следующего вопроса
```
GET /interviews/{interviewId}/voice/next-question
```
**Описание:** Получение следующего вопроса для голосового интервью  
**Используется в:** `ElabsSession.tsx` (строка 165)  
**Токен:** `Authorization: Bearer <candidate_token>`

#### 2.5 Сохранение голосового ответа
```
POST /interviews/{interviewId}/voice/answer?questionId={questionId}
```
**Описание:** Сохранение транскрибированного голосового ответа  
**Используется в:** `ElabsSession.tsx` (строка 147)  
**Токен:** `Authorization: Bearer <candidate_token>`  
**Body:**
```json
{
  "text": "Ответ кандидата",
  "durationMs": 15000,
  "confidence": 0.95,
  "timestamp": "2024-01-15T10:30:15Z"
}
```

#### 2.6 Получение статуса голосовой сессии
```
GET /interviews/{interviewId}/voice/status
```
**Описание:** Получение текущего статуса голосовой сессии  
**Используется в:** `voiceInterviewService.ts`  
**Токен:** `Authorization: Bearer <candidate_token>`

#### 2.7 Завершение голосовой сессии
```
POST /interviews/{interviewId}/voice/end
```
**Описание:** Завершение голосовой сессии  
**Используется в:** `ElabsSession.tsx` (строка 186)  
**Токен:** `Authorization: Bearer <candidate_token>`

#### 2.8 Завершение интервью
```
POST /interviews/{interviewId}/finish
```
**Описание:** Финальное завершение интервью  
**Используется в:** `ElabsSession.tsx` (строка 197)  
**Токен:** `Authorization: Bearer <candidate_token>`

---

### 📊 3. Дополнительные эндпоинты (с токеном)

#### 3.1 Получение информации о позиции
```
GET /positions/{positionId}
```
**Описание:** Получение данных о вакансии  
**Используется в:** `InterviewEntryForm.tsx` (строка 79)  
**Токен:** `Authorization: Bearer <candidate_token>`

#### 3.2 Получение вопросов с настройками
```
GET /positions/{positionId}/questions-with-settings
```
**Описание:** Получение вопросов и настроек интервью  
**Используется в:** `apiService.ts`  
**Токен:** `Authorization: Bearer <candidate_token>`

#### 3.3 Получение информации о пользователе
```
GET /user/info
```
**Описание:** Получение дополнительной информации о кандидате  
**Используется в:** `apiService.ts`  
**Токен:** `Authorization: Bearer <candidate_token>`

#### 3.4 Получение информации о тарифе
```
GET /tariff/info
```
**Описание:** Получение информации о доступных интервью  
**Используется в:** `apiService.ts`  
**Токен:** `Authorization: Bearer <candidate_token>`

---

### 🔄 4. Webhook эндпоинты (от ElevenLabs)

#### 4.1 Обработка webhook событий
```
POST /webhooks/elevenlabs/events
```
**Описание:** Прием событий от ElevenLabs Conversational AI  
**Используется в:** Backend (Java)  
**Токен:** Не требуется (публичный webhook)  
**Заголовки:**
```
Content-Type: application/json
X-ElevenLabs-Signature: <signature>
```

---

## 🔒 Механизм авторизации

### Автоматическое добавление токена
```typescript
// В apiClient.ts
const config = new Configuration({
  basePath,
  accessToken: () => useAuthStore.getState().token || '',
});
```

### Хранение токена
```typescript
// В authStore.ts
const saveAuthData = (token: string, user: any, role: string, rememberMe: boolean = false) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('auth_token', token);
  storage.setItem('auth_user', JSON.stringify(user));
  storage.setItem('auth_role', role);
};
```

### Восстановление сессии
```typescript
// Автоматическое восстановление при загрузке приложения
useEffect(() => {
  useAuthStore.getState().restoreSession();
}, []);
```

---

## 📝 Полный поток API вызовов

### Этап 1: Приветственное окно
1. **GET /positions/{positionId}** - получение данных о вакансии
2. **POST /candidates/auth** - получение JWT токена

### Этап 2: Инициализация интервью
3. **GET /interviews/{interviewId}** - получение данных интервью
4. **POST /interviews/{interviewId}/start** - запуск с созданием агента

### Этап 3: Голосовое взаимодействие (цикл)
5. **GET /interviews/{interviewId}/voice/next-question** - получение вопроса
6. **POST /interviews/{interviewId}/voice/answer** - сохранение ответа
7. **GET /interviews/{interviewId}/voice/status** - проверка статуса

### Этап 4: Завершение
8. **POST /interviews/{interviewId}/voice/end** - завершение сессии
9. **POST /interviews/{interviewId}/finish** - завершение интервью

---

## 🎯 Итоговая таблица

| № | Метод | Эндпоинт | Описание | Токен | Используется в |
|---|-------|----------|----------|-------|----------------|
| 1 | GET | `/positions/{positionId}` | Данные вакансии | ✅ | InterviewEntryForm |
| 2 | POST | `/candidates/auth` | Получение токена | ❌ | InterviewEntryForm |
| 3 | GET | `/interviews/{interviewId}` | Данные интервью | ✅ | ElabsSession |
| 4 | POST | `/interviews/{interviewId}/start` | Запуск с агентом | ✅ | ElabsSession |
| 5 | POST | `/interviews/{interviewId}/voice/session` | Создание сессии | ✅ | voiceInterviewService |
| 6 | GET | `/interviews/{interviewId}/voice/next-question` | Следующий вопрос | ✅ | ElabsSession |
| 7 | POST | `/interviews/{interviewId}/voice/answer` | Сохранение ответа | ✅ | ElabsSession |
| 8 | GET | `/interviews/{interviewId}/voice/status` | Статус сессии | ✅ | voiceInterviewService |
| 9 | POST | `/interviews/{interviewId}/voice/end` | Завершение сессии | ✅ | ElabsSession |
| 10 | POST | `/interviews/{interviewId}/finish` | Завершение интервью | ✅ | ElabsSession |
| 11 | GET | `/positions/{positionId}/questions-with-settings` | Вопросы с настройками | ✅ | apiService |
| 12 | GET | `/user/info` | Информация о пользователе | ✅ | apiService |
| 13 | GET | `/tariff/info` | Информация о тарифе | ✅ | apiService |
| 14 | POST | `/webhooks/elevenlabs/events` | Webhook события | ❌ | Backend |

**Всего эндпоинтов: 14**  
**С токеном кандидата: 12**  
**Без токена: 2**  

---

## ✅ Готово к использованию!

Все API эндпоинты задокументированы и готовы к интеграции с backend. Токен кандидата автоматически добавляется ко всем защищенным эндпоинтам через `apiClient.ts` и `useAuthStore`. 🚀 