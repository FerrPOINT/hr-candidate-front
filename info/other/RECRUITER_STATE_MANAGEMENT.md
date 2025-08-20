# Система управления состоянием рекрутерской части

## Обзор

Система автоматически сохраняет все выборы пользователя в рекрутерской части в `localStorage` и восстанавливает их при повторном посещении страниц.

## Что сохраняется

### VacancyList (`/recruiter/vacancies`)
- Поисковый запрос
- Фильтр по статусу
- Вкладка (Все/Мои)
- Выбранная вакансия
- Номер страницы
- Размер страницы
- Активная вкладка в деталях вакансии

### InterviewList (`/recruiter/interviews`)
- Номер текущей страницы
- Размер страницы
- Выбранная позиция (фильтр)
- Выбранный статус (фильтр)
- Поисковый запрос

### VacancyCreate (`/recruiter/vacancies/create`)
- Все поля формы создания вакансии:
  - Название
  - Статус
  - Топики
  - Язык
  - Показывать другие языки
  - Теги
  - Минимальный балл
  - Приглашать дальше
  - Время ответа
  - Уровень
  - Сохранять аудио
  - Сохранять видео
  - Случайный порядок
  - Описание
  - Тип вопросов
  - Количество вопросов
  - Тип проверки

### InterviewCreate (`/recruiter/interviews/create`)
- Все поля формы создания интервью:
  - Имя
  - Фамилия
  - Email
  - ID вакансии
  - Запланированная дата

## Техническая реализация

### Основные файлы

1. **`src/utils/recruiterStateManager.ts`** - Основная логика управления состоянием
2. **`src/components/RecruiterStateManager.tsx`** - UI для управления состоянием (только в dev режиме)
3. **Интеграция в страницы** - каждая страница использует хук `useRecruiterState`

### Ключевые особенности

- **Автоматическое сохранение**: Состояние сохраняется при каждом изменении
- **Восстановление при загрузке**: Страницы инициализируются с сохранёнными значениями
- **Изоляция**: Каждая секция имеет своё состояние
- **Совместимость**: Автоматическое объединение с дефолтными значениями
- **Логирование**: Все операции логируются в консоль

## Использование

### В компонентах

```tsx
import { useRecruiterState } from '../utils/recruiterStateManager';

const MyComponent = () => {
  const { state, updateVacancyList } = useRecruiterState();
  
  // Инициализация с сохранённым состоянием
  const [searchTerm, setSearchTerm] = useState(state.vacancyList.searchTerm);
  
  // Сохранение при изменениях
  useEffect(() => {
    updateVacancyList({ searchTerm });
  }, [searchTerm, updateVacancyList]);
  
  return <div>...</div>;
};
```

### Прямое использование

```tsx
import recruiterStateManager from '../utils/recruiterStateManager';

// Получить состояние
const state = recruiterStateManager.getState();

// Обновить состояние
recruiterStateManager.updateVacancyList({ searchTerm: 'новый поиск' });

// Сбросить всё
recruiterStateManager.resetState();

// Сбросить секцию
recruiterStateManager.resetSection('vacancyList');
```

## Управление состоянием

### В режиме разработки

В правом нижнем углу доступен компонент управления состоянием с кнопками:
- 👁️ **Показать состояние** - отображает текущее состояние в JSON
- 🗑️ **Сбросить всё** - удаляет все сохранённые данные
- **Сбросить секцию** - удаляет данные конкретной секции

### Программное управление

```tsx
// Подписка на изменения
const unsubscribe = recruiterStateManager.subscribe((state) => {
  console.log('Состояние изменилось:', state);
});

// Отписка
unsubscribe();
```

## Структура данных

```typescript
interface RecruiterState {
  vacancyList: {
    searchTerm: string;
    statusFilter: string;
    tab: 'all' | 'my';
    selectedId: string | null;
    page: number;
    pageSize: number;
    vacancyTab: string;
  };
  
  interviewList: {
    currentPage: number;
    pageSize: number;
    selectedPosition: number | undefined;
    selectedStatus: string;
    searchQuery: string;
  };
  
  vacancyCreate: {
    form: {
      title: string;
      status: string;
      topics: string[];
      language: string;
      showOtherLang: boolean;
      tags: string[];
      minScore: number;
      inviteNext: boolean;
      answerTime: number;
      level: string;
      saveAudio: boolean;
      saveVideo: boolean;
      randomOrder: boolean;
      description: string;
      questionType: string;
      questionsCount: number;
      checkType: string;
    };
    activeTab: 'basic' | 'questions' | 'advanced';
  };
  
  interviewCreate: {
    formData: {
      firstName: string;
      lastName: string;
      email: string;
      vacancyId: string;
      scheduledDate: string;
    };
  };
  
  general: {
    lastVisitedPage: string;
    theme: 'light' | 'dark';
    sidebarCollapsed: boolean;
  };
}
```

## Хранение

- **Ключ**: `recruiter_state_v1`
- **Формат**: JSON в localStorage
- **Версионирование**: Автоматическое при изменении структуры
- **Очистка**: При выходе из системы состояние сохраняется

## Логирование

Все операции логируются с эмодзи для удобства:

- 💾 **Сохранение**: `Сохранено в localStorage: recruiter_state_v1`
- 📖 **Загрузка**: `Загружено из localStorage: recruiter_state_v1`
- 🔄 **Сброс**: `Состояние рекрутера сброшено к дефолтным значениям`
- ❌ **Ошибки**: `Ошибка сохранения/загрузки из localStorage`

## Добавление новых секций

1. Добавить интерфейс в `RecruiterState`
2. Добавить дефолтные значения в `defaultState`
3. Добавить методы в `RecruiterStateManager`
4. Интегрировать в компоненты

## Производительность

- **Debounce**: Сохранение происходит с задержкой для оптимизации
- **Мемоизация**: React компоненты используют `useMemo` и `useCallback`
- **Изоляция**: Изменения в одной секции не влияют на другие

## Безопасность

- **Валидация**: Все данные валидируются при загрузке
- **Fallback**: При ошибках используются дефолтные значения
- **Очистка**: Возможность полной очистки данных

## Отладка

```tsx
// В консоли браузера
console.log('Текущее состояние:', recruiterStateManager.getState());

// Очистить состояние
recruiterStateManager.clearStorage();

// Сбросить конкретную секцию
recruiterStateManager.resetSection('vacancyList');
``` 