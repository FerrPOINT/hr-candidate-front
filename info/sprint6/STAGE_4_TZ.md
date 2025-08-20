# ТЗ: ЭТАП 4 - РЕФАКТОРИНГ

## ОБЩАЯ ИНФОРМАЦИЯ
- **Этап**: 4 из 5
- **Название**: Рефакторинг
- **Срок**: 1-2 дня
- **Приоритет**: Высокий
- **Статус**: ⏳ Ожидает начала

## ЦЕЛЬ ЭТАПА
Оптимизировать код, разбить большие компоненты, вынести логику в хуки и улучшить читаемость и поддерживаемость кода.

## ДЕТАЛЬНЫЕ ЗАДАЧИ

### ЗАДАЧА 4.1: Разбиение InterviewProcess.tsx
**Время**: 4 часа
**Сложность**: Высокая

**Действия**:
1. Проанализировать структуру `InterviewProcess.tsx` (676 строк)
2. Выделить логические блоки по стадиям интервью
3. Создать отдельные компоненты для каждой стадии
4. Вынести общую логику в хуки

**Компоненты для создания**:
```typescript
// components/interview/stages/
├── WelcomeStage.tsx           // Стадия приветствия
├── MicrophoneCheckStage.tsx   // Проверка микрофона
├── ReadingTestStage.tsx       // Тест чтения
├── RecordingTestStage.tsx     // Тест записи
├── QuestionStage.tsx          // Стадия вопроса
├── RecordingAnswerStage.tsx   // Запись ответа
├── QuestionCompletedStage.tsx // Вопрос завершен
├── CandidateQuestionsStage.tsx // Вопросы кандидата
└── AllCompletedStage.tsx      // Все завершено
```

**Критерии готовности**:
- [ ] Компонент разбит на логические части
- [ ] Каждый компонент < 200 строк
- [ ] Логика вынесена в хуки
- [ ] Функциональность сохранена

### ЗАДАЧА 4.2: Создание хуков для логики
**Время**: 3 часа
**Сложность**: Средняя

**Действия**:
1. Создать `useInterviewStage.ts` для управления стадиями
2. Создать `useAudioRecording.ts` для записи аудио
3. Создать `useAudioPlayback.ts` для воспроизведения
4. Создать `useInterviewProgress.ts` для прогресса

**Хуки**:
```typescript
// hooks/useInterviewStage.ts
export function useInterviewStage() {
  const [currentStage, setCurrentStage] = useState<ProcessStage>('welcome');
  const [stageData, setStageData] = useState<StageData>({});
  
  const nextStage = useCallback(() => {});
  const previousStage = useCallback(() => {});
  const resetStage = useCallback(() => {});
  
  return { currentStage, stageData, nextStage, previousStage, resetStage };
}

// hooks/useAudioRecording.ts
export function useAudioRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const startRecording = useCallback(() => {});
  const stopRecording = useCallback(() => {});
  const clearRecording = useCallback(() => {});
  
  return { isRecording, audioBlob, startRecording, stopRecording, clearRecording };
}
```

**Критерии готовности**:
- [ ] Все хуки созданы
- [ ] Логика вынесена из компонентов
- [ ] Хуки переиспользуемы
- [ ] Тесты написаны

### ЗАДАЧА 4.3: Оптимизация производительности
**Время**: 2 часа
**Сложность**: Средняя

**Действия**:
1. Добавить `React.memo` для компонентов
2. Оптимизировать `useCallback` и `useMemo`
3. Настроить виртуализацию для списков
4. Оптимизировать рендеринг анимаций

**Оптимизации**:
```typescript
// Оптимизация компонентов
export const MessageBubble = React.memo(({ content, isUser, isNew }: MessageBubbleProps) => {
  // компонент
});

// Оптимизация хуков
export function useOptimizedInterview() {
  const interviewData = useMemo(() => {
    // тяжелые вычисления
  }, [dependencies]);
  
  const handleNextQuestion = useCallback(() => {
    // обработчик
  }, [dependencies]);
}
```

**Критерии готовности**:
- [ ] Производительность улучшена
- [ ] Нет лишних ререндеров
- [ ] Анимации плавные
- [ ] Память не утекает

### ЗАДАЧА 4.4: Улучшение читаемости кода
**Время**: 2 часа
**Сложность**: Низкая

**Действия**:
1. Добавить JSDoc комментарии
2. Улучшить именование переменных
3. Разбить сложные функции
4. Добавить типизацию

**Примеры улучшений**:
```typescript
/**
 * Хук для управления состоянием интервью кандидата
 * @param initialStage - Начальная стадия интервью
 * @returns Объект с состоянием и методами управления
 */
export function useInterviewState(initialStage: ProcessStage = 'welcome') {
  // реализация
}

// Улучшенное именование
const [isMicrophonePermissionGranted, setIsMicrophonePermissionGranted] = useState(false);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [timeRemainingInSeconds, setTimeRemainingInSeconds] = useState(150);
```

**Критерии готовности**:
- [ ] Код документирован
- [ ] Имена переменных понятны
- [ ] Функции разбиты
- [ ] Типизация полная

### ЗАДАЧА 4.5: Рефакторинг утилит
**Время**: 1 час
**Сложность**: Низкая

**Действия**:
1. Реорганизовать `utils/` папку
2. Создать специализированные утилиты
3. Добавить тесты для утилит
4. Улучшить типизацию

**Структура утилит**:
```typescript
// utils/
├── audio/
│   ├── audioHelpers.ts
│   ├── audioValidation.ts
│   └── audioFormats.ts
├── time/
│   ├── timeFormatters.ts
│   └── timeCalculators.ts
├── validation/
│   ├── formValidation.ts
│   └── emailValidation.ts
└── constants/
    ├── interviewConstants.ts
    └── uiConstants.ts
```

**Критерии готовности**:
- [ ] Утилиты организованы
- [ ] Тесты написаны
- [ ] Типизация улучшена
- [ ] Документация добавлена

### ЗАДАЧА 4.6: Оптимизация стилей
**Время**: 1 час
**Сложность**: Низкая

**Действия**:
1. Оптимизировать CSS классы
2. Убрать дублирующиеся стили
3. Создать CSS переменные
4. Улучшить responsive дизайн

**Оптимизации**:
```css
/* Создание CSS переменных */
:root {
  --interview-primary: #e16349;
  --interview-secondary: #df1c41;
  --interview-background: #e9eae2;
  --interview-text: #323232;
}

/* Оптимизация классов */
.interview-card {
  background: var(--interview-background);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

**Критерии готовности**:
- [ ] Стили оптимизированы
- [ ] CSS переменные созданы
- [ ] Responsive дизайн улучшен
- [ ] Размер CSS уменьшен

## ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ

### ПРИНЦИПЫ РЕФАКТОРИНГА
- **Единственная ответственность**: Каждый компонент/функция делает одну вещь
- **DRY**: Не повторять код
- **KISS**: Простота и понятность
- **SOLID**: Следование принципам SOLID

### СТРУКТУРА КОМПОНЕНТОВ
```typescript
// Структура компонента
interface ComponentProps {
  // типы пропсов
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // хуки
  const [state, setState] = useState();
  
  // обработчики
  const handleAction = useCallback(() => {}, []);
  
  // эффекты
  useEffect(() => {}, []);
  
  // рендер
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### ТРЕБОВАНИЯ К КАЧЕСТВУ
- **Читаемость**: Код должен быть понятным
- **Поддерживаемость**: Легко изменять и расширять
- **Производительность**: Оптимизированный рендеринг
- **Тестируемость**: Легко тестировать

## ЧЕКАП ЭТАПА

### ЧТО ПРОВЕРЯЕМ
1. **Структура кода**:
   - [ ] Компоненты разбиты на логические части
   - [ ] Размер файлов < 200 строк
   - [ ] Логика вынесена в хуки
   - [ ] Утилиты организованы

2. **Производительность**:
   - [ ] Нет лишних ререндеров
   - [ ] Анимации плавные
   - [ ] Память не утекает
   - [ ] Время загрузки не увеличилось

3. **Читаемость**:
   - [ ] Код документирован
   - [ ] Имена переменных понятны
   - [ ] Функции разбиты
   - [ ] Типизация полная

4. **Функциональность**:
   - [ ] Все функции работают
   - [ ] Нет регрессий
   - [ ] Тесты проходят
   - [ ] UI не изменился

### КОМАНДЫ ДЛЯ ПРОВЕРКИ
```bash
# Проверка линтера
npm run lint

# Проверка типов
npm run type-check

# Запуск тестов
npm run test

# Проверка производительности
npm run build
npm run analyze

# Проверка покрытия
npm run test:coverage
```

### ОЖИДАЕМЫЙ РЕЗУЛЬТАТ
- Код оптимизирован и структурирован
- Производительность улучшена
- Читаемость повышена
- Функциональность сохранена

## РИСКИ И МИТИГАЦИЯ

### РИСКИ
1. **Потеря функциональности при рефакторинге**
   - **Митигация**: Пошаговое тестирование

2. **Ухудшение производительности**
   - **Митигация**: Профилирование до и после

3. **Сложность понимания новой структуры**
   - **Митигация**: Подробная документация

### ПЛАН ДЕЙСТВИЙ ПРИ ОШИБКАХ
1. Откатиться к предыдущей версии
2. Проанализировать проблему
3. Исправить ошибку
4. Протестировать исправление
5. Продолжить рефакторинг

## ДОКУМЕНТАЦИЯ

### ОБНОВЛЯЕМЫЕ ФАЙЛЫ
- `CANDIDATE_INTEGRATION_STATE.md` - обновить статус этапа
- `EXECUTION_PLAN.md` - отметить выполнение
- `README.md` - обновить документацию

### ЛОГИ
- Записать время начала и окончания
- Зафиксировать выполненные рефакторинги
- Отметить улучшения производительности
- Записать найденные проблемы

## СЛЕДУЮЩИЙ ЭТАП
После успешного завершения этапа 4 перейти к **ЭТАПУ 5: ТЕСТИРОВАНИЕ**

---

**Статус**: ⏳ Ожидает начала
**Следующее действие**: Начать выполнение задачи 4.1
