# 🔧 ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ ДЛЯ ИНТЕГРАЦИИ НОВОГО ДИЗАЙНА

## Спецификации и ограничения для быстрой адаптации

### ВЕРСИЯ: 1.0.0

### ДАТА: 2024-12-28

### СТАТУС: ГОТОВ К ИНТЕГРАЦИИ

---

## 🎯 ОСНОВНЫЕ ПРИНЦИПЫ

### Архитектурные ограничения

1. **НЕ ИЗМЕНЯТЬ ДИЗАЙН** - только добавлять функционал
2. **Создание адаптеров** - мосты между дизайном и логикой
3. **Сохранение производительности** - не должно ухудшиться
4. **Обратная совместимость** - существующий функционал должен работать

### Технические принципы

- **Разделение ответственности** - UI отдельно от логики
- **Инверсия зависимостей** - дизайн зависит от адаптеров
- **Композиция над наследованием** - адаптеры композируют функционал
- **Принцип единственной ответственности** - каждый адаптер отвечает за одну область

---

## 📋 ТЕХНИЧЕСКИЕ СПЕЦИФИКАЦИИ

### 1. Структура адаптеров

#### Базовый интерфейс адаптера

```typescript
// src/adapters/types.ts
interface BaseAdapter<TData, TProps> {
  // Данные для компонента
  data: TData;
  
  // Состояние загрузки
  loading: boolean;
  
  // Ошибки
  error: Error | null;
  
  // Действия
  actions: {
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onSave?: (data: TData) => void;
    onCancel?: () => void;
  };
  
  // Валидация
  validation?: {
    isValid: boolean;
    errors: string[];
  };
}

// Пример для вакансии
interface VacancyAdapter extends BaseAdapter<Vacancy, VacancyCardProps> {
  // Специфичные для вакансии поля
  status: VacancyStatus;
  candidates: Candidate[];
  analytics: VacancyAnalytics;
}
```

#### Структура папок для адаптеров

```
src/
├── adapters/
│   ├── types.ts                    # Типы адаптеров
│   ├── base/
│   │   ├── BaseAdapter.tsx         # Базовый адаптер
│   │   └── ErrorBoundary.tsx       # Обработка ошибок
│   ├── vacancy/
│   │   ├── VacancyCardAdapter.tsx  # Адаптер карточки вакансии
│   │   ├── VacancyListAdapter.tsx  # Адаптер списка вакансий
│   │   └── VacancyFormAdapter.tsx  # Адаптер формы вакансии
│   ├── candidate/
│   │   ├── CandidateCardAdapter.tsx
│   │   └── CandidateListAdapter.tsx
│   └── team/
│       ├── TeamMemberAdapter.tsx
│       └── TeamAnalyticsAdapter.tsx
```

### 2. Интеграция с состоянием

#### Подключение к Zustand store

```typescript
// src/store/integrationStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface IntegrationState {
  // Состояние нового дизайна
  newDesign: {
    currentView: 'list' | 'detail' | 'create' | 'edit';
    selectedItems: {
      vacancyId: string | null;
      candidateId: string | null;
      teamMemberId: string | null;
    };
    filters: {
      vacancy: VacancyFilters;
      candidate: CandidateFilters;
      team: TeamFilters;
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
  
  // Действия для управления состоянием
  actions: {
    setCurrentView: (view: IntegrationState['newDesign']['currentView']) => void;
    setSelectedVacancy: (id: string | null) => void;
    setSelectedCandidate: (id: string | null) => void;
    setSelectedTeamMember: (id: string | null) => void;
    updateFilters: (type: 'vacancy' | 'candidate' | 'team', filters: any) => void;
    setPagination: (pagination: IntegrationState['newDesign']['pagination']) => void;
  };
  
  // Интеграция с существующими store
  vacancyStore: typeof vacancyStore;
  candidateStore: typeof candidateStore;
  teamStore: typeof teamStore;
}

export const useIntegrationStore = create<IntegrationState>()(
  devtools(
    (set, get) => ({
      newDesign: {
        currentView: 'list',
        selectedItems: {
          vacancyId: null,
          candidateId: null,
          teamMemberId: null,
        },
        filters: {
          vacancy: {},
          candidate: {},
          team: {},
        },
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
        },
      },
      
      actions: {
        setCurrentView: (view) => set((state) => ({
          newDesign: { ...state.newDesign, currentView: view }
        })),
        
        setSelectedVacancy: (id) => set((state) => ({
          newDesign: {
            ...state.newDesign,
            selectedItems: { ...state.newDesign.selectedItems, vacancyId: id }
          }
        })),
        
        setSelectedCandidate: (id) => set((state) => ({
          newDesign: {
            ...state.newDesign,
            selectedItems: { ...state.newDesign.selectedItems, candidateId: id }
          }
        })),
        
        setSelectedTeamMember: (id) => set((state) => ({
          newDesign: {
            ...state.newDesign,
            selectedItems: { ...state.newDesign.selectedItems, teamMemberId: id }
          }
        })),
        
        updateFilters: (type, filters) => set((state) => ({
          newDesign: {
            ...state.newDesign,
            filters: {
              ...state.newDesign.filters,
              [type]: filters
            }
          }
        })),
        
        setPagination: (pagination) => set((state) => ({
          newDesign: { ...state.newDesign, pagination }
        })),
      },
      
      vacancyStore,
      candidateStore,
      teamStore,
    }),
    { name: 'integration-store' }
  )
);
```

### 3. Обработка ошибок

#### Система обработки ошибок без изменения UI

```typescript
// src/adapters/errorHandling.ts
export interface ErrorHandler {
  // Тип ошибки
  type: 'api' | 'validation' | 'network' | 'unknown';
  
  // Сообщение для пользователя
  userMessage: string;
  
  // Техническое сообщение
  technicalMessage: string;
  
  // Действия для восстановления
  recoveryActions: {
    retry?: () => void;
    fallback?: () => void;
    ignore?: () => void;
  };
}

// Адаптер для обработки ошибок
export class ErrorAdapter {
  static handle(error: any, context: string): ErrorHandler {
    if (error?.response?.status) {
      return this.handleApiError(error, context);
    }
    
    if (error?.name === 'ValidationError') {
      return this.handleValidationError(error, context);
    }
    
    if (error?.name === 'NetworkError') {
      return this.handleNetworkError(error, context);
    }
    
    return this.handleUnknownError(error, context);
  }
  
  private static handleApiError(error: any, context: string): ErrorHandler {
    const status = error.response.status;
    
    switch (status) {
      case 401:
        return {
          type: 'api',
          userMessage: 'Необходима авторизация',
          technicalMessage: `API Error 401 in ${context}`,
          recoveryActions: {
            retry: () => window.location.reload(),
          }
        };
        
      case 403:
        return {
          type: 'api',
          userMessage: 'Недостаточно прав',
          technicalMessage: `API Error 403 in ${context}`,
          recoveryActions: {
            fallback: () => window.history.back(),
          }
        };
        
      case 404:
        return {
          type: 'api',
          userMessage: 'Данные не найдены',
          technicalMessage: `API Error 404 in ${context}`,
          recoveryActions: {
            fallback: () => window.history.back(),
          }
        };
        
      case 500:
        return {
          type: 'api',
          userMessage: 'Ошибка сервера',
          technicalMessage: `API Error 500 in ${context}`,
          recoveryActions: {
            retry: () => window.location.reload(),
          }
        };
        
      default:
        return {
          type: 'api',
          userMessage: 'Произошла ошибка',
          technicalMessage: `API Error ${status} in ${context}`,
          recoveryActions: {
            retry: () => window.location.reload(),
          }
        };
    }
  }
  
  private static handleValidationError(error: any, context: string): ErrorHandler {
    return {
      type: 'validation',
      userMessage: 'Проверьте введенные данные',
      technicalMessage: `Validation Error in ${context}: ${error.message}`,
      recoveryActions: {
        ignore: () => {}, // Пользователь может исправить данные
      }
    };
  }
  
  private static handleNetworkError(error: any, context: string): ErrorHandler {
    return {
      type: 'network',
      userMessage: 'Проблемы с подключением',
      technicalMessage: `Network Error in ${context}: ${error.message}`,
      recoveryActions: {
        retry: () => window.location.reload(),
      }
    };
  }
  
  private static handleUnknownError(error: any, context: string): ErrorHandler {
    return {
      type: 'unknown',
      userMessage: 'Неизвестная ошибка',
      technicalMessage: `Unknown Error in ${context}: ${error.message}`,
      recoveryActions: {
        retry: () => window.location.reload(),
      }
    };
  }
}
```

### 4. Валидация данных

#### Система валидации для адаптеров

```typescript
// src/adapters/validation.ts
export interface ValidationRule<T> {
  field: keyof T;
  rule: (value: any) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors: Record<string, string[]>;
}

export class ValidationAdapter {
  static validate<T>(data: T, rules: ValidationRule<T>[]): ValidationResult {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};
    
    rules.forEach(rule => {
      const value = data[rule.field];
      const isValid = rule.rule(value);
      
      if (!isValid) {
        errors.push(rule.message);
        
        if (!fieldErrors[rule.field as string]) {
          fieldErrors[rule.field as string] = [];
        }
        fieldErrors[rule.field as string].push(rule.message);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors
    };
  }
  
  // Предустановленные правила для вакансий
  static vacancyRules: ValidationRule<Vacancy>[] = [
    {
      field: 'title',
      rule: (value) => value && value.length > 0 && value.length <= 100,
      message: 'Название вакансии обязательно и не должно превышать 100 символов'
    },
    {
      field: 'department',
      rule: (value) => value && value.length > 0,
      message: 'Отдел обязателен'
    },
    {
      field: 'salary',
      rule: (value) => !value || (typeof value === 'number' && value > 0),
      message: 'Зарплата должна быть положительным числом'
    }
  ];
  
  // Предустановленные правила для кандидатов
  static candidateRules: ValidationRule<Candidate>[] = [
    {
      field: 'name',
      rule: (value) => value && value.length > 0,
      message: 'Имя кандидата обязательно'
    },
    {
      field: 'email',
      rule: (value) => value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Введите корректный email'
    }
  ];
}
```

### 5. Производительность

#### Оптимизация для сохранения производительности

```typescript
// src/adapters/performance.ts
export class PerformanceAdapter {
  // Мемоизация для предотвращения лишних рендеров
  static memoize<T extends (...args: any[]) => any>(
    fn: T,
    deps: any[]
  ): T {
    let lastArgs: any[] | null = null;
    let lastResult: any = null;
    
    return ((...args: any[]) => {
      if (lastArgs && this.shallowEqual(lastArgs, args)) {
        return lastResult;
      }
      
      lastArgs = args;
      lastResult = fn(...args);
      return lastResult;
    }) as T;
  }
  
  // Ленивая загрузка данных
  static lazyLoad<T>(
    loader: () => Promise<T>,
    options: {
      cacheTime?: number;
      staleTime?: number;
    } = {}
  ) {
    let data: T | null = null;
    let loading = false;
    let error: Error | null = null;
    let lastFetch = 0;
    
    const { cacheTime = 5 * 60 * 1000, staleTime = 60 * 1000 } = options;
    
    return {
      async load() {
        const now = Date.now();
        
        // Проверяем кэш
        if (data && (now - lastFetch) < cacheTime) {
          return data;
        }
        
        // Проверяем, не устарели ли данные
        if (data && (now - lastFetch) < staleTime) {
          return data;
        }
        
        // Загружаем новые данные
        try {
          loading = true;
          error = null;
          data = await loader();
          lastFetch = now;
          return data;
        } catch (err) {
          error = err as Error;
          throw err;
        } finally {
          loading = false;
        }
      },
      
      getData() {
        return data;
      },
      
      isLoading() {
        return loading;
      },
      
      getError() {
        return error;
      }
    };
  }
  
  private static shallowEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    
    return true;
  }
}
```

---

## 📋 ТРЕБОВАНИЯ К КОДУ

### 1. TypeScript

- **Строгая типизация** - все адаптеры должны быть типизированы
- **Интерфейсы** - использовать интерфейсы для описания контрактов
- **Generic типы** - для переиспользования адаптеров
- **Строгий режим** - `strict: true` в tsconfig.json

### 2. React

- **Функциональные компоненты** - использовать hooks
- **React.memo** - для оптимизации рендеринга
- **useCallback/useMemo** - для предотвращения лишних рендеров
- **Error Boundaries** - для обработки ошибок

### 3. Тестирование

- **Unit тесты** - для каждого адаптера
- **Integration тесты** - для проверки интеграции
- **E2E тесты** - для проверки пользовательских сценариев
- **Coverage** - минимум 80% покрытия

### 4. Производительность

- **Bundle size** - не увеличивать размер бандла более чем на 10%
- **Lighthouse score** - не снижать показатели
- **Memory leaks** - избегать утечек памяти
- **Network requests** - оптимизировать количество запросов

---

## 🎯 КРИТЕРИИ ПРИЕМКИ

### Функциональные критерии

- ✅ Дизайн остался полностью неизменным
- ✅ Все интерактивные элементы работают
- ✅ Данные загружаются и отображаются корректно
- ✅ Состояние приложения синхронизировано
- ✅ Обработка ошибок работает без изменения UI

### Технические критерии

- ✅ Производительность не ухудшилась
- ✅ Код остается читаемым и поддерживаемым
- ✅ Адаптеры легко расширяются
- ✅ Тесты проходят успешно
- ✅ TypeScript ошибок нет

### Пользовательский опыт

- ✅ UX остался полностью неизменным
- ✅ Все анимации и переходы работают
- ✅ Отзывчивость интерфейса сохранена
- ✅ Доступность не нарушена

---

## 🚀 СЛЕДУЮЩИЕ ШАГИ

1. **Создать структуру адаптеров** - папки и базовые файлы
2. **Реализовать базовые адаптеры** - для карточек и списков
3. **Интегрировать с состоянием** - подключить к Zustand store
4. **Добавить обработку ошибок** - без изменения UI
5. **Протестировать производительность** - убедиться в отсутствии деградации

---

**🎯 Цель**: Создать технически надежную систему адаптеров для быстрой интеграции нового дизайна без потери функционала и производительности.
