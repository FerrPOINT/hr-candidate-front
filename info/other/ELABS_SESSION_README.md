# 🎤 Голосовое интервью с ElevenLabs

## Описание

Компонент `ElabsSession` реализует голосовое собеседование с использованием ElevenLabs Conversational AI. Это отдельная страница от обычного интервью, которая позволяет кандидатам проходить собеседование через голосовое взаимодействие.

## 🚀 Возможности

- **Голосовое взаимодействие**: Кандидат отвечает голосом на вопросы AI
- **Автоматическая транскрипция**: Ответы автоматически транскрибируются
- **Управление сессией**: Создание, управление и завершение голосовых сессий
- **Переключение режимов**: Возможность переключиться между обычным и голосовым интервью
- **Статус сессии**: Отображение текущего состояния голосовой сессии

## 📋 Техническая реализация

### Speech-to-Speech Integration

Компонент использует **реальную интеграцию** с ElevenLabs Conversational AI:

- **@elevenlabs/react**: Официальный React SDK для ElevenLabs
- **useElevenLabs Hook**: Кастомный хук для управления голосовыми сессиями
- **Real-time Communication**: Двусторонняя голосовая связь в реальном времени
- **Automatic Transcription**: Автоматическая транскрипция речи пользователя

### API Endpoints

Компонент использует следующие API endpoints:

- `POST /interviews/{interviewId}/voice/session` - Создание голосовой сессии
- `GET /interviews/{interviewId}/voice/next-question` - Получение следующего вопроса
- `POST /interviews/{interviewId}/voice/answer` - Сохранение голосового ответа
- `POST /interviews/{interviewId}/voice/end` - Завершение голосовой сессии
- `GET /interviews/{interviewId}/voice/status` - Получение статуса сессии

### Архитектура

```
Frontend (React) ←→ ElevenLabs SDK ←→ ElevenLabs API
       ↓
Backend API (Java) ←→ Database
```

### Состояния интервью

1. **invite** - Приветственный экран с информацией о кандидате и вакансии
2. **intro** - Вводная информация о голосовом интервью
3. **voice-session** - Активная голосовая сессия
4. **question** - Обработка вопросов и ответов
5. **final** - Завершение интервью

### Управление голосовой сессией

```typescript
interface VoiceSessionState {
  sessionId: string | null;
  status: 'idle' | 'connecting' | 'connected' | 'error' | 'ended';
  isListening: boolean;
  isSpeaking: boolean;
  currentQuestion: number;
  questions: Question[];
  answers: Array<{
    questionId: number;
    text: string;
    durationMs: number;
    confidence: number;
    timestamp: string;
  }>;
}
```

## 🎯 Использование

### Для кандидатов

1. Перейдите по ссылке `/elabs/{interviewId}`
2. Ознакомьтесь с информацией о вакансии
3. Дайте согласие на обработку данных
4. Нажмите "Начать голосовое собеседование"
5. Отвечайте голосом на вопросы AI
6. Дождитесь завершения интервью

### Для HR-специалистов

1. В списке вакансий найдите нужное интервью
2. Нажмите на иконку микрофона для запуска голосового интервью
3. Или используйте кнопку "Переключиться на голосовое" в обычном интервью

## 🔧 Настройка

### ElevenLabs Configuration

Для работы с ElevenLabs необходимо настроить:

1. **API Key**: Получите API ключ на [elevenlabs.io](https://elevenlabs.io)
2. **Voice ID**: Выберите голос для AI-интервьюера из доступных
3. **Переменные окружения**: Создайте файл `.env.local`:
   ```
   REACT_APP_ELEVENLABS_API_KEY=your_api_key_here
   REACT_APP_ELEVENLABS_DEFAULT_VOICE_ID=pNInz6obpgDQGcFmaJgB
   ```

### Доступные голоса

- **Adam** (pNInz6obpgDQGcFmaJgB) - Мужской голос
- **Bella** (EXAVITQu4vr4xnSDxMaL) - Женский голос
- **Rachel** (21m00Tcm4TlvDq8ikWAM) - Женский голос
- **Domi** (AZnzlk1XvdvUeBnXmlld) - Женский голос

### Backend Integration

Убедитесь, что backend поддерживает все необходимые endpoints для голосовых интервью:

- `POST /interviews/{interviewId}/voice/session`
- `GET /interviews/{interviewId}/voice/next-question`
- `POST /interviews/{interviewId}/voice/answer`
- `POST /interviews/{interviewId}/voice/end`
- `GET /interviews/{interviewId}/voice/status`

## 📱 UI/UX Особенности

- **Адаптивный дизайн**: Работает на всех устройствах
- **Индикаторы состояния**: Показывает статус подключения, говорения, слушания
- **Прогресс-бар**: Отображает прогресс прохождения интервью
- **Переключение режимов**: Кнопки для перехода между обычным и голосовым интервью

## 🔒 Безопасность

- Все голосовые данные передаются по HTTPS
- Аудио файлы не сохраняются локально (опционально)
- JWT токены для авторизации
- Согласие на обработку персональных данных

## 🐛 Отладка

### Логи

Компонент выводит подробные логи в консоль:
- Создание голосовой сессии
- Получение вопросов
- Сохранение ответов
- Ошибки подключения

### Проверка состояния

```javascript
// Проверка статуса сессии
console.log('Voice session status:', voiceSession.status);
console.log('Current question:', voiceSession.currentQuestion);
console.log('Answers count:', voiceSession.answers.length);
```

## 🔮 Планы развития

- [x] Интеграция с реальным ElevenLabs SDK
- [x] Настройка голосов агентов
- [ ] Поддержка различных языков
- [ ] Анализ тона голоса
- [ ] Запись и воспроизведение аудио
- [ ] Расширенная аналитика ответов
- [ ] Интеграция с AI-агентами для умных вопросов
- [ ] Поддержка групповых интервью
- [ ] Интеграция с календарем для планирования

## 📞 Поддержка

При возникновении проблем:

1. Проверьте консоль браузера на наличие ошибок
2. Убедитесь в поддержке Web Audio API
3. Проверьте подключение к интернету
4. Обратитесь к технической поддержке

---

**Версия**: 1.0.0  
**Дата**: 2024  
**Автор**: HR Recruiter Team 