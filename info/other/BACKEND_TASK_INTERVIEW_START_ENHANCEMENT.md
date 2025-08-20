# 🚀 ТЗ для бэкенда: Расширение метода старта интервью для кандидатов

## 📋 Задача

Расширить метод `POST /interviews/{id}/start` для возврата всех необходимых данных кандидату при старте интервью, исключив избыточные запросы и чувствительные данные.

---

## 🎯 Цель

Заменить множественные API вызовы (`getInterview`, `getQuestions`, etc.) одним вызовом `startInterview`, который вернет все необходимые данные для проведения интервью кандидатом.

---

## 📊 Проблема

### Текущие проблемы:
1. **Избыточные запросы**: `getInterview()` возвращает чувствительные данные
2. **Дублирование**: данные кандидата уже есть в store
3. **Небезопасность**: кандидат видит данные компании, команды, других кандидатов
4. **Производительность**: множественные API вызовы

### Текущий flow:
```
1. authCandidate() → token + candidate data
2. getInterview() → interview + candidate + position + questions (ИЗБЫТОЧНО)
3. startInterview() → только статус
```

---

## 🔧 Требования к реализации

### 1. Обновить OpenAPI схему

#### Расширить `InterviewStartRequest`:
```yaml
InterviewStartRequest:
  type: object
  properties:
    voiceMode:
      type: boolean
      description: "Включить голосовой режим"
      default: false
    includeCandidateData:
      type: boolean
      description: "Включить данные для кандидата"
      default: true
    agentConfig:
      $ref: '#/components/schemas/AgentConfig'
    voiceSettings:
      $ref: '#/components/schemas/VoiceSettings'
    autoCreateAgent:
      type: boolean
      description: "Автоматически создать агента"
      default: true
```

#### Расширить `InterviewStartResponse`:
```yaml
InterviewStartResponse:
  type: object
  properties:
    # Базовые данные интервью
    interviewId:
      type: integer
      format: int64
    status:
      $ref: '#/components/schemas/InterviewStartStatusEnum'
    message:
      type: string
    
    # Данные для голосового режима (если voiceMode=true)
    agentId:
      type: string
      description: "ID созданного агента"
    sessionId:
      type: string
      description: "ID голосовой сессии"
    webhookUrl:
      type: string
      description: "URL для webhook событий"
    
    # Данные для кандидата (если includeCandidateData=true)
    candidateData:
      $ref: '#/components/schemas/InterviewCandidateData'
```

#### Добавить новую схему `InterviewCandidateData`:
```yaml
InterviewCandidateData:
  type: object
  description: "Минимальные данные для кандидата"
  properties:
    # Базовые данные интервью
    interview:
      type: object
      properties:
        id:
          type: integer
          format: int64
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
      required: [id, status, createdAt]
    
    # Настройки интервью
    settings:
      type: object
      properties:
        answerTime:
          type: integer
          description: "Время на ответ в секундах"
          example: 120
        language:
          type: string
          description: "Язык интервью"
          example: "Русский"
        saveAudio:
          type: boolean
          description: "Сохранять аудио"
          example: true
        saveVideo:
          type: boolean
          description: "Сохранять видео"
          example: false
        randomOrder:
          type: boolean
          description: "Случайный порядок вопросов"
          example: false
        minScore:
          type: number
          format: float
          description: "Минимальный проходной балл"
          example: 70.0
      required: [answerTime, language, saveAudio, saveVideo, randomOrder, minScore]
    
    # Вопросы для интервью
    questions:
      type: array
      items:
        type: object
        properties:
          id:
            type: integer
            format: int64
          text:
            type: string
            description: "Текст вопроса"
          type:
            $ref: '#/components/schemas/QuestionTypeEnum'
          order:
            type: integer
            description: "Порядок вопроса"
          isRequired:
            type: boolean
            description: "Обязательный вопрос"
        required: [id, text, type, order]
      description: "Список вопросов для интервью"
    
    # Информация о вакансии (минимальная)
    position:
      type: object
      properties:
        title:
          type: string
          description: "Название вакансии"
          example: "Java Developer"
        level:
          $ref: '#/components/schemas/PositionLevelEnum'
          description: "Уровень позиции"
      required: [title, level]
    
    # Прогресс интервью
    progress:
      type: object
      properties:
        currentQuestion:
          type: integer
          description: "Номер текущего вопроса (начиная с 0)"
          example: 0
        totalQuestions:
          type: integer
          description: "Общее количество вопросов"
          example: 5
        answeredQuestions:
          type: integer
          description: "Количество отвеченных вопросов"
          example: 0
        remainingTime:
          type: integer
          description: "Оставшееся время в секундах"
          example: 600
      required: [currentQuestion, totalQuestions, answeredQuestions, remainingTime]
    
    # Чек-лист для подготовки
    checklist:
      type: array
      items:
        type: object
        properties:
          text:
            type: string
            description: "Текст пункта чек-листа"
          completed:
            type: boolean
            description: "Выполнен ли пункт"
        required: [text, completed]
      description: "Чек-лист для подготовки к интервью"
    
    # Информация для приглашения
    inviteInfo:
      type: object
      properties:
        language:
          type: string
          description: "Язык интервью"
          example: "Русский"
        questionsCount:
          type: integer
          description: "Количество вопросов"
          example: 5
        estimatedDuration:
          type: integer
          description: "Примерная длительность в минутах"
          example: 15
      required: [language, questionsCount, estimatedDuration]
  
  required: [interview, settings, questions, position, progress, checklist, inviteInfo]
```

---

## 🔄 Обновленный flow

### Новый flow:
```
1. authCandidate() → token + candidate data (в store)
2. startInterview(includeCandidateData=true) → все данные для интервью
3. Дальнейшие вызовы только для действий (answer, finish, etc.)
```

### Пример запроса:
```json
POST /interviews/123/start
{
  "voiceMode": false,
  "includeCandidateData": true,
  "autoCreateAgent": false
}
```

### Пример ответа:
```json
{
  "interviewId": 123,
  "status": "STARTED",
  "message": "Интервью успешно начато",
  "candidateData": {
    "interview": {
      "id": 123,
      "status": "in_progress",
      "createdAt": "2024-01-15T10:30:00Z",
      "startedAt": "2024-01-15T10:30:00Z"
    },
    "settings": {
      "answerTime": 120,
      "language": "Русский",
      "saveAudio": true,
      "saveVideo": false,
      "randomOrder": false,
      "minScore": 70.0
    },
    "questions": [
      {
        "id": 1,
        "text": "Расскажите о своем опыте работы с Java",
        "type": "text",
        "order": 1,
        "isRequired": true
      }
    ],
    "position": {
      "title": "Java Developer",
      "level": "middle"
    },
    "progress": {
      "currentQuestion": 0,
      "totalQuestions": 5,
      "answeredQuestions": 0,
      "remainingTime": 600
    },
    "checklist": [
      {
        "text": "Проверьте работу микрофона",
        "completed": false
      }
    ],
    "inviteInfo": {
      "language": "Русский",
      "questionsCount": 5,
      "estimatedDuration": 15
    }
  }
}
```

---

## 🛡️ Безопасность

### Что НЕ возвращается кандидату:
- ❌ Данные компании (`company`, `branding`)
- ❌ Информация о команде (`team`)
- ❌ Статистика (`stats`, `avgScore`)
- ❌ Список других кандидатов (`candidates`)
- ❌ Публичные ссылки (`publicLink`)
- ❌ AI оценки (`aiScore`)
- ❌ Ответы других кандидатов (`answers`)

### Что возвращается кандидату:
- ✅ Только его данные (уже есть в store)
- ✅ Настройки интервью
- ✅ Вопросы для интервью
- ✅ Прогресс и статус
- ✅ Минимальная информация о вакансии

---

## 🔧 Техническая реализация

### 1. Java модели

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewStartRequest {
    private Boolean voiceMode = false;
    private Boolean includeCandidateData = true;
    private AgentConfig agentConfig;
    private VoiceSettings voiceSettings;
    private Boolean autoCreateAgent = true;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewStartResponse {
    private Long interviewId;
    private InterviewStartStatusEnum status;
    private String message;
    private String agentId;
    private String sessionId;
    private String webhookUrl;
    private InterviewCandidateData candidateData;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewCandidateData {
    private InterviewData interview;
    private InterviewSettings settings;
    private List<QuestionData> questions;
    private PositionData position;
    private InterviewProgress progress;
    private List<ChecklistItem> checklist;
    private InviteInfo inviteInfo;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewData {
    private Long id;
    private InterviewStatusEnum status;
    private LocalDateTime createdAt;
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewSettings {
    private Integer answerTime;
    private String language;
    private Boolean saveAudio;
    private Boolean saveVideo;
    private Boolean randomOrder;
    private Double minScore;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionData {
    private Long id;
    private String text;
    private QuestionTypeEnum type;
    private Integer order;
    private Boolean isRequired;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PositionData {
    private String title;
    private PositionLevelEnum level;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewProgress {
    private Integer currentQuestion;
    private Integer totalQuestions;
    private Integer answeredQuestions;
    private Integer remainingTime;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistItem {
    private String text;
    private Boolean completed;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InviteInfo {
    private String language;
    private Integer questionsCount;
    private Integer estimatedDuration;
}
```

### 2. Контроллер

```java
@PostMapping("/{id}/start")
public ResponseEntity<InterviewStartResponse> startInterview(
    @PathVariable Long id,
    @RequestBody(required = false) InterviewStartRequest request) {
    
    Interview interview = interviewService.findById(id);
    
    // Запускаем интервью
    interviewService.startInterview(interview);
    
    InterviewStartResponse response = InterviewStartResponse.builder()
        .interviewId(id)
        .status(InterviewStartStatusEnum.STARTED)
        .message("Интервью успешно начато")
        .build();
    
    // Если запрошены данные для кандидата
    if (request != null && Boolean.TRUE.equals(request.getIncludeCandidateData())) {
        InterviewCandidateData candidateData = buildCandidateData(interview);
        response.setCandidateData(candidateData);
    }
    
    // Если запрошен голосовой режим
    if (request != null && Boolean.TRUE.equals(request.getVoiceMode())) {
        Agent agent = agentService.createAgentForInterview(interview);
        response.setAgentId(agent.getElevenLabsAgentId());
        response.setSessionId(agent.getSessionId());
        response.setWebhookUrl(buildWebhookUrl(interview.getId()));
    }
    
    return ResponseEntity.ok(response);
}

private InterviewCandidateData buildCandidateData(Interview interview) {
    Position position = positionService.findById(interview.getPositionId());
    List<Question> questions = questionService.findByPositionId(position.getId());
    
    return InterviewCandidateData.builder()
        .interview(buildInterviewData(interview))
        .settings(buildSettings(position))
        .questions(buildQuestionsData(questions))
        .position(buildPositionData(position))
        .progress(buildProgress(interview, questions.size()))
        .checklist(buildChecklist())
        .inviteInfo(buildInviteInfo(position, questions.size()))
        .build();
}

private InterviewData buildInterviewData(Interview interview) {
    return InterviewData.builder()
        .id(interview.getId())
        .status(interview.getStatus())
        .createdAt(interview.getCreatedAt())
        .startedAt(interview.getStartedAt())
        .finishedAt(interview.getFinishedAt())
        .build();
}

private InterviewSettings buildSettings(Position position) {
    return InterviewSettings.builder()
        .answerTime(position.getAnswerTime())
        .language(position.getLanguage())
        .saveAudio(position.getSaveAudio())
        .saveVideo(position.getSaveVideo())
        .randomOrder(position.getRandomOrder())
        .minScore(position.getMinScore())
        .build();
}

private List<QuestionData> buildQuestionsData(List<Question> questions) {
    return questions.stream()
        .map(q -> QuestionData.builder()
            .id(q.getId())
            .text(q.getText())
            .type(q.getType())
            .order(q.getOrder())
            .isRequired(q.getIsRequired())
            .build())
        .collect(Collectors.toList());
}

private PositionData buildPositionData(Position position) {
    return PositionData.builder()
        .title(position.getTitle())
        .level(position.getLevel())
        .build();
}

private InterviewProgress buildProgress(Interview interview, int totalQuestions) {
    return InterviewProgress.builder()
        .currentQuestion(0)
        .totalQuestions(totalQuestions)
        .answeredQuestions(0)
        .remainingTime(calculateRemainingTime(interview))
        .build();
}

private List<ChecklistItem> buildChecklist() {
    return Arrays.asList(
        ChecklistItem.builder().text("Проверьте работу микрофона").completed(false).build(),
        ChecklistItem.builder().text("Убедитесь, что вы в тихом помещении").completed(false).build(),
        ChecklistItem.builder().text("Закройте лишние вкладки браузера").completed(false).build(),
        ChecklistItem.builder().text("Подготовьтесь к ответам на вопросы").completed(false).build()
    );
}

private InviteInfo buildInviteInfo(Position position, int questionsCount) {
    return InviteInfo.builder()
        .language(position.getLanguage())
        .questionsCount(questionsCount)
        .estimatedDuration(calculateEstimatedDuration(questionsCount, position.getAnswerTime()))
        .build();
}
```

---

## 📋 План реализации

### Этап 1: Модели данных (1 день)
1. ✅ Создать все Java модели
2. ✅ Добавить валидацию
3. ✅ Написать unit тесты для моделей

### Этап 2: Сервисы (1 день)
1. ✅ Реализовать метод `buildCandidateData()`
2. ✅ Добавить вспомогательные методы
3. ✅ Написать unit тесты для сервисов

### Этап 3: Контроллер (1 день)
1. ✅ Обновить метод `startInterview()`
2. ✅ Добавить обработку ошибок
3. ✅ Написать интеграционные тесты

### Этап 4: OpenAPI схема (0.5 дня)
1. ✅ Обновить OpenAPI схему
2. ✅ Добавить новые схемы
3. ✅ Обновить документацию

### Этап 5: Тестирование (0.5 дня)
1. ✅ Протестировать новый flow
2. ✅ Проверить безопасность данных
3. ✅ Убедиться в совместимости с админским API

---

## 🎯 Результат

После реализации:
- 🔒 **Безопасность**: Кандидаты не видят чувствительные данные
- ⚡ **Производительность**: Один запрос вместо множественных
- 🧹 **Чистота кода**: Четкое разделение данных
- 🛡️ **Принцип минимальных прав**: Только необходимые данные
- 📊 **Удобство**: Все данные для UI в одном ответе

---

**Статус**: 🚀 **ГОТОВО К РЕАЛИЗАЦИИ**

**Приоритет**: 🔥 **ВЫСОКИЙ** - критически важно для безопасности

**Время реализации**: 4 дня 