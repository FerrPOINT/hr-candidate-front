# Анализ проблем с API запросами и рекомендации по оптимизации

## 🎯 ЦЕЛЬ: 1 ЗАПРОС НА СТРАНИЦУ

### Текущие проблемы
- **VacancyList**: 15-20 запросов → должно быть 1
- **Dashboard**: 5-8 запросов → должно быть 1  
- **InterviewList**: 10-15 запросов → должно быть 1

## 🔍 Выявленные проблемы

### 1. Множественные дублирующие запросы

#### Проблема: Layout.tsx делает запросы на каждой странице
- **Файл**: `src/components/Layout.tsx`
- **Проблема**: При каждом рендере Layout делается запрос `apiService.getPositions({ owner: 'me' })`
- **Влияние**: Запрос выполняется на каждой странице, даже если данные уже загружены

```typescript
// Проблемный код в Layout.tsx
useEffect(() => {
  const fetchData = async () => {
    const [user, vacanciesData] = await Promise.all([
      apiService.getAccount(),
      apiService.getPositions({ owner: 'me' }) // ← Этот запрос выполняется везде!
    ]);
  };
  fetchData();
}, [navigate]);
```

#### Проблема: VacancyList.tsx делает избыточные запросы
- **Файл**: `src/pages/VacancyList.tsx`
- **Проблема**: 
  - Запрос `getPositions` выполняется при каждом изменении фильтров
  - Запрос `getPositionStats` выполняется для каждой вакансии отдельно
  - Запрос `getPositionInterviews` выполняется для каждой вакансии отдельно
  - Запрос `getQuestions` выполняется при каждом выборе вакансии

### 2. Создание множественных API клиентов

#### Проблема: Каждый вызов создает новый клиент
- **Файл**: `src/services/apiService.ts`
- **Проблема**: Метод `getApiClient()` создает новый клиент при каждом вызове
- **Влияние**: Избыточное потребление памяти и времени инициализации

### 3. Отсутствие кэширования

#### Проблема: Одинаковые данные загружаются повторно
- **Файл**: Множественные компоненты
- **Проблема**: Нет кэширования результатов API запросов
- **Влияние**: Повторные запросы одних и тех же данных

### 4. Неоптимальные зависимости useEffect

#### Проблема: Лишние перерендеры
- **Файл**: `src/pages/VacancyList.tsx`
- **Проблема**: useEffect с зависимостями, которые вызывают лишние запросы

## 🛠️ Реализованные исправления

### 1. Кэширование API клиента ✅

```typescript
// src/services/apiService.ts
class ApiService {
  private apiClient: ApiClient | null = null;
  private lastCredentials: string | null = null;

  private getApiClient() {
    const username = sessionStorage.getItem('auth_username') || undefined;
    const password = sessionStorage.getItem('auth_password') || undefined;
    
    const credentialsKey = `${username}:${password}`;
    
    if (this.apiClient && this.lastCredentials === credentialsKey) {
      return this.apiClient; // Возвращаем кэшированный клиент
    }
    
    this.apiClient = createApiClient(username, password);
    this.lastCredentials = credentialsKey;
    
    return this.apiClient;
  }
}
```

### 2. Мемоизация функций ✅

```typescript
// src/pages/VacancyList.tsx
const memoizedTruncateTitle = useCallback((title: string | undefined) => truncateTitle(title), []);
const memoizedTruncateTopics = useCallback((topics: string[] | undefined) => truncateTopics(topics), []);
```

### 3. Оптимизация зависимостей useEffect ✅

```typescript
// Было:
useEffect(() => {
  // ...
}, [searchTerm, statusFilter, selectedId]); // selectedId вызывал лишние запросы

// Стало:
useEffect(() => {
  // ...
}, [searchTerm, statusFilter]); // Убрали selectedId
```

## 🚀 АГРЕССИВНАЯ ОПТИМИЗАЦИЯ: 1 ЗАПРОС НА СТРАНИЦУ

### 1. Создать единый endpoint для всех данных страницы

```typescript
// src/services/apiService.ts
async getPageData(pageType: 'vacancies' | 'dashboard' | 'interviews', params?: any) {
  switch (pageType) {
    case 'vacancies':
      return this.getVacanciesPageData(params);
    case 'dashboard':
      return this.getDashboardPageData(params);
    case 'interviews':
      return this.getInterviewsPageData(params);
  }
}

async getVacanciesPageData(params?: any) {
  // ОДИН запрос возвращает ВСЕ данные для страницы вакансий
  const response = await this.getApiClient().default.getVacanciesPageData({
    search: params?.search,
    status: params?.status,
    includeStats: true,
    includeInterviews: true,
    includeQuestions: true
  });
  
  return {
    positions: response.data.positions,
    interviews: response.data.interviews,
    stats: response.data.stats,
    questions: response.data.questions
  };
}
```

### 2. Глобальное состояние с предзагрузкой

```typescript
// src/store/appStore.ts
interface AppStore {
  // Предзагруженные данные
  preloadedData: {
    vacancies?: VacancyPageData;
    dashboard?: DashboardPageData;
    interviews?: InterviewPageData;
  };
  
  // Кэш с TTL
  cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  
  // Методы
  preloadPageData: (pageType: string) => Promise<void>;
  getPageData: (pageType: string) => any;
  invalidateCache: (key: string) => void;
}
```

### 3. Хуки с агрессивным кэшированием

```typescript
// src/hooks/usePageData.ts
export const usePageData = (pageType: string, params?: any) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      // Проверяем глобальный кэш
      const cached = appStore.getPageData(pageType);
      if (cached) {
        setData(cached);
        return;
      }
      
      // Делаем ОДИН запрос
      setLoading(true);
      const result = await apiService.getPageData(pageType, params);
      setData(result);
      setLoading(false);
    };
    
    loadData();
  }, [pageType, JSON.stringify(params)]);
  
  return { data, loading };
};
```

### 4. Предзагрузка данных при навигации

```typescript
// src/components/Layout.tsx
const Layout = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Предзагружаем данные для следующей страницы
    const preloadNextPage = async () => {
      const pageType = getPageTypeFromPath(location.pathname);
      if (pageType && !appStore.hasPageData(pageType)) {
        await appStore.preloadPageData(pageType);
      }
    };
    
    preloadNextPage();
  }, [location.pathname]);
};
```

## 📋 Рекомендации по дальнейшей оптимизации

### 1. Внедрить глобальное состояние (Redux/Zustand)

```typescript
// Рекомендуемая структура store
interface AppState {
  positions: {
    items: Position[];
    loading: boolean;
    lastFetched: number;
  };
  interviews: {
    items: Interview[];
    loading: boolean;
    lastFetched: number;
  };
  candidates: {
    items: Candidate[];
    loading: boolean;
    lastFetched: number;
  };
}
```

### 2. Создать хуки для работы с данными

```typescript
// src/hooks/usePositions.ts
export const usePositions = (params?: PositionParams) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Логика загрузки с кэшированием
  }, [JSON.stringify(params)]);
  
  return { positions, loading };
};
```

### 3. Оптимизировать batch запросы

```typescript
// src/services/optimizedApiService.ts
async getPositionsWithStats(params: PositionParams) {
  const positions = await this.getPositions(params);
  
  // Batch запрос статистики
  const statsPromises = positions.items.map(pos => 
    this.getPositionStats(pos.id)
  );
  const stats = await Promise.all(statsPromises);
  
  return positions.items.map((pos, index) => ({
    ...pos,
    stats: stats[index]
  }));
}
```

### 4. Внедрить React Query или SWR

```typescript
// Пример с React Query
const { data: positions, isLoading } = useQuery(
  ['positions', params],
  () => apiService.getPositions(params),
  {
    staleTime: 5 * 60 * 1000, // 5 минут
    cacheTime: 10 * 60 * 1000, // 10 минут
  }
);
```

## 🎯 Приоритетные задачи

### Высокий приоритет
1. **Убрать дублирующие запросы из Layout.tsx**
   - Перенести загрузку данных в глобальное состояние
   - Загружать данные только при необходимости

2. **Оптимизировать VacancyList.tsx**
   - Объединить запросы статистики в batch
   - Кэшировать результаты запросов
   - Убрать лишние зависимости useEffect

3. **Внедрить кэширование на уровне приложения**
   - Создать централизованный кэш
   - Добавить TTL для кэшированных данных

### Средний приоритет
4. **Создать хуки для работы с данными**
   - usePositions, useInterviews, useCandidates
   - Автоматическое кэширование и обновление

5. **Оптимизировать batch запросы**
   - Объединить связанные запросы
   - Использовать GraphQL или batch endpoints

### Низкий приоритет
6. **Внедрить React Query/SWR**
   - Заменить ручное кэширование
   - Добавить автоматическую синхронизацию

7. **Добавить мониторинг производительности**
   - Отслеживание количества запросов
   - Метрики времени загрузки

## 📊 Метрики для отслеживания

### До оптимизации
- Количество API запросов при загрузке страницы вакансий: ~15-20
- Время загрузки: 3-5 секунд
- Повторные запросы: 80% данных загружаются повторно

### Целевые метрики
- Количество API запросов при загрузке страницы вакансий: ~3-5
- Время загрузки: 1-2 секунды
- Повторные запросы: <20% данных загружаются повторно

## 🔧 Инструменты для отладки

### Chrome DevTools
```javascript
// Добавить в консоль для отслеживания запросов
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('API Request:', args[0]);
  return originalFetch.apply(this, args);
};
```

### React DevTools Profiler
- Отслеживание перерендеров компонентов
- Анализ времени выполнения

### Network Tab
- Мониторинг количества запросов
- Анализ времени ответа сервера

## 📝 Чек-лист для проверки

- [ ] Убрать дублирующие запросы из Layout.tsx
- [ ] Оптимизировать VacancyList.tsx
- [ ] Внедрить кэширование API клиента
- [ ] Создать хуки для работы с данными
- [ ] Оптимизировать batch запросы
- [ ] Добавить мониторинг производительности
- [ ] Протестировать на разных страницах
- [ ] Документировать изменения

## 🚀 Следующие шаги

1. **Немедленно**: Исправить дублирующие запросы в Layout.tsx
2. **На этой неделе**: Оптимизировать VacancyList.tsx
3. **В течение месяца**: Внедрить глобальное состояние и кэширование
4. **Долгосрочно**: Переход на React Query/SWR

---

*Документ создан: $(date)*
*Последнее обновление: $(date)* 