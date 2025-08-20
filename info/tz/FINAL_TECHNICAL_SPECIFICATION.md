# ИТОГОВОЕ ТЕХНИЧЕСКОЕ ЗАДАНИЕ

## HR Recruiter System - Адаптация нового дизайна с сохранением функционала

### ОБЩАЯ ИНФОРМАЦИЯ

**Проект**: HR Recruiter System  
**Дата обновления**: 2024-12-28  
**Подход**: Адаптация нового дизайна БЕЗ изменения самого дизайна  
**Стратегия**: Только добавление функционала к готовой верстке  
**Приоритет**: Сохранение UX/UI нового дизайна  

---

## 🎯 СТРАТЕГИЯ АДАПТАЦИИ

### 1.1 Принципы работы с новым дизайном

#### **Золотое правило**
>
> **НЕ ИЗМЕНЯТЬ ДИЗАЙН** - только добавлять функционал

#### **Подход к интеграции**

1. **Анализ готовой верстки** - изучение структуры и компонентов
2. **Выявление точек интеграции** - где можно добавить функционал
3. **Создание адаптеров** - мосты между дизайном и логикой
4. **Тестирование совместимости** - проверка работы без изменений

#### **Структура адаптации**

```
Новый дизайн (React) → Адаптеры → Существующий функционал
     ↓                      ↓              ↓
   UI/UX компоненты    →  Хуки/Сервисы → API/Состояние
```

---

## 2. АРХИТЕКТУРА ИНТЕРФЕЙСА

### 2.1 Основные экраны (готовые к адаптации)

#### **Vacancies v2 (Вакансии версия 2)**

- **Статус**: Готов к интеграции
- **Размеры**: 1920x1080px
- **Точки интеграции**:
  - ✅ Карточки вакансий → API данные
  - ✅ Фильтры → Состояние приложения
  - ✅ Поиск → API поиск
  - ✅ Действия → API методы

#### **Candidate Answers (Ответы кандидата)**

- **Статус**: Готов к интеграции
- **Размеры**: 1920x1080px
- **Точки интеграции**:
  - ✅ Список ответов → API кандидатов
  - ✅ Система оценки → API оценок
  - ✅ Комментарии → API комментариев
  - ✅ Навигация → Состояние приложения

#### **Team (Команда - 3 варианта)**

1. **Team Management (Управление командой)**
   - ✅ Список сотрудников → API пользователей
   - ✅ Роли → API ролей
   - ✅ Статистика → API аналитики

2. **Team Collaboration (Совместная работа)**
   - ✅ Назначения → API назначений
   - ✅ Оценки → API оценок
   - ✅ Комментарии → API комментариев

3. **Team Analytics (Аналитика команды)**
   - ✅ KPI → API метрик
   - ✅ Графики → API данных
   - ✅ Распределение → API нагрузки

#### **Create Vacancy (Создание вакансии - 2 варианта)**

1. **Quick Create (Быстрое создание)**
   - ✅ Форма → API создания
   - ✅ Валидация → Клиентская валидация
   - ✅ Сохранение → API сохранения

2. **Detailed Create (Детальное создание)**
   - ✅ Расширенная форма → API создания
   - ✅ Настройки → API настроек
   - ✅ Шаблоны → API шаблонов

#### **Text (Текстовые элементы)**

- **Статус**: Готов к интеграции
- **Точки интеграции**:
  - ✅ Библиотека → API шаблонов
  - ✅ Редактор → API сохранения

#### **Questions (Вопросы)**

- **Статус**: Готов к интеграции
- **Точки интеграции**:
  - ✅ Банк вопросов → API вопросов
  - ✅ Категории → API категорий
  - ✅ Шаблоны → API шаблонов

---

## 3. ДИЗАЙН-СИСТЕМА (НЕ ИЗМЕНЯТЬ)

### 3.1 Цветовая палитра (сохранить)

#### **Основные цвета**

- **Primary Blue**: #2563eb (основной синий)
- **Primary Dark**: #1d4ed8 (темно-синий)
- **Secondary**: #64748b (серо-синий)

#### **Статусные цвета**

- **Success**: #10b981 (зеленый)
- **Warning**: #f59e0b (оранжевый)
- **Error**: #ef4444 (красный)
- **Info**: #3b82f6 (синий)

#### **Нейтральные цвета**

- **Gray 50**: #f8fafc
- **Gray 100**: #f1f5f9
- **Gray 200**: #e2e8f0
- **Gray 300**: #cbd5e1
- **Gray 400**: #94a3b8
- **Gray 500**: #64748b
- **Gray 600**: #475569
- **Gray 700**: #334155

### 3.2 Типографика (сохранить)

#### **Заголовки**

- **H1**: 32px, font-weight: 700, line-height: 1.2
- **H2**: 28px, font-weight: 600, line-height: 1.3
- **H3**: 24px, font-weight: 600, line-height: 1.4
- **H4**: 20px, font-weight: 500, line-height: 1.4
- **H5**: 18px, font-weight: 500, line-height: 1.5
- **H6**: 16px, font-weight: 500, line-height: 1.5

#### **Текст**

- **Body Large**: 16px, font-weight: 400, line-height: 1.6
- **Body Medium**: 14px, font-weight: 400, line-height: 1.5
- **Body Small**: 12px, font-weight: 400, line-height: 1.4
- **Caption**: 11px, font-weight: 400, line-height: 1.3

---

## 4. ПЛАН АДАПТАЦИИ НОВОГО ДИЗАЙНА

### 4.1 Этап 1: Анализ готовой верстки (1-2 дня)

#### **Задачи анализа**

- [ ] Изучить структуру компонентов нового дизайна
- [ ] Выявить все интерактивные элементы
- [ ] Определить точки интеграции с API
- [ ] Создать карту компонентов и их назначений

#### **Документирование**

```typescript
// Карта компонентов для адаптации
interface ComponentMap {
  [componentName: string]: {
    purpose: string;           // Назначение компонента
    integrationPoints: string[]; // Точки интеграции
    apiEndpoints: string[];    // Используемые API
    stateManagement: string;   // Управление состоянием
  }
}
```

### 4.2 Этап 2: Создание адаптеров (3-5 дней)

#### **Адаптеры для интеграции**

```typescript
// Пример адаптера для карточки вакансии
interface VacancyCardAdapter {
  // Сохраняем оригинальный дизайн
  originalComponent: React.ComponentType<VacancyCardProps>;
  
  // Добавляем функционал
  dataSource: () => Promise<Vacancy[]>;
  onAction: (action: string, vacancyId: string) => void;
  stateManagement: () => VacancyCardState;
}

// Хук для интеграции
const useVacancyCardIntegration = (vacancyId: string) => {
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Загрузка данных
  const loadVacancy = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vacancyService.getVacancy(vacancyId);
      setVacancy(data);
    } catch (error) {
      console.error('Failed to load vacancy:', error);
    } finally {
      setLoading(false);
    }
  }, [vacancyId]);
  
  // Действия
  const handleAction = useCallback(async (action: string) => {
    try {
      await vacancyService.performAction(vacancyId, action);
      await loadVacancy(); // Перезагружаем данные
    } catch (error) {
      console.error('Failed to perform action:', error);
    }
  }, [vacancyId, loadVacancy]);
  
  return {
    vacancy,
    loading,
    loadVacancy,
    handleAction
  };
};
```

### 4.3 Этап 3: Интеграция API (2-3 дня)

#### **Подключение существующих API**

```typescript
// Интеграция с существующими сервисами
const integrateWithExistingAPI = {
  // Вакансии
  vacancies: {
    list: vacancyService.getVacancies,
    create: vacancyService.createVacancy,
    update: vacancyService.updateVacancy,
    delete: vacancyService.deleteVacancy
  },
  
  // Кандидаты
  candidates: {
    list: candidateService.getCandidates,
    getAnswers: candidateService.getAnswers,
    rateAnswer: candidateService.rateAnswer
  },
  
  // Интервью
  interviews: {
    list: interviewService.getInterviews,
    start: interviewService.startInterview,
    finish: interviewService.finishInterview
  },
  
  // Команда
  team: {
    members: teamService.getMembers,
    roles: teamService.getRoles,
    analytics: teamService.getAnalytics
  }
};
```

### 4.4 Этап 4: Тестирование совместимости (1-2 дня)

#### **Критерии тестирования**

- [ ] Дизайн остается неизменным
- [ ] Функционал работает корректно
- [ ] Производительность не ухудшается
- [ ] Все интерактивные элементы работают
- [ ] Состояние приложения синхронизировано

#### **Чек-лист интеграции**

```typescript
const integrationChecklist = {
  design: {
    colors: 'Соответствие цветовой палитре',
    typography: 'Соответствие типографике',
    spacing: 'Соответствие отступам',
    animations: 'Сохранение анимаций'
  },
  functionality: {
    dataLoading: 'Загрузка данных работает',
    userActions: 'Действия пользователя работают',
    stateSync: 'Состояние синхронизировано',
    errorHandling: 'Обработка ошибок работает'
  },
  performance: {
    loadTime: 'Время загрузки не увеличилось',
    memoryUsage: 'Использование памяти не выросло',
    responsiveness: 'Отзывчивость сохранена'
  }
};
```

---

## 5. ТЕХНИЧЕСКАЯ СПЕЦИФИКАЦИЯ АДАПТАЦИИ

### 5.1 Структура адаптеров

#### **Базовый адаптер**

```typescript
interface BaseAdapter<TProps, TData> {
  // Оригинальный компонент (НЕ ИЗМЕНЯТЬ)
  OriginalComponent: React.ComponentType<TProps>;
  
  // Данные для компонента
  data: TData;
  
  // Состояние загрузки
  loading: boolean;
  
  // Обработчики событий
  handlers: Record<string, (...args: any[]) => void>;
  
  // Ошибки
  errors: string[];
}

// Пример использования
const VacancyCardAdapter: React.FC<VacancyCardProps> = (props) => {
  const { vacancy, loading, handleAction } = useVacancyCardIntegration(props.id);
  
  if (loading) {
    return <VacancyCardSkeleton />; // Используем существующий скелетон
  }
  
  return (
    <OriginalVacancyCard
      {...props}
      vacancy={vacancy}
      onAction={handleAction}
    />
  );
};
```

### 5.2 Интеграция с состоянием

#### **Подключение к существующему store**

```typescript
// Интеграция с существующим Zustand store
const useIntegratedStore = () => {
  const authStore = useAuthStore();
  const vacancyStore = useVacancyStore();
  const candidateStore = useCandidateStore();
  
  return {
    // Аутентификация
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    login: authStore.login,
    logout: authStore.logout,
    
    // Вакансии
    vacancies: vacancyStore.vacancies,
    loadingVacancies: vacancyStore.loading,
    createVacancy: vacancyStore.create,
    updateVacancy: vacancyStore.update,
    
    // Кандидаты
    candidates: candidateStore.candidates,
    loadingCandidates: candidateStore.loading,
    getCandidateAnswers: candidateStore.getAnswers
  };
};
```

### 5.3 Обработка ошибок

#### **Стратегия обработки ошибок**

```typescript
const useErrorHandling = () => {
  const [errors, setErrors] = useState<string[]>([]);
  
  const handleError = useCallback((error: Error, context: string) => {
    console.error(`Error in ${context}:`, error);
    
    // Показываем ошибку пользователю (НЕ ИЗМЕНЯЯ ДИЗАЙН)
    setErrors(prev => [...prev, `${context}: ${error.message}`]);
    
    // Автоматически очищаем ошибки через 5 секунд
    setTimeout(() => {
      setErrors(prev => prev.filter(e => e !== `${context}: ${error.message}`));
    }, 5000);
  }, []);
  
  return { errors, handleError };
};
```

---

## 6. КРИТЕРИИ ПРИЕМКИ АДАПТАЦИИ

### 6.1 Функциональные критерии

- ✅ Дизайн остался полностью неизменным
- ✅ Все интерактивные элементы работают
- ✅ Данные загружаются и отображаются корректно
- ✅ Состояние приложения синхронизировано
- ✅ Обработка ошибок работает без изменения UI

### 6.2 Технические критерии

- ✅ Производительность не ухудшилась
- ✅ Код остается читаемым и поддерживаемым
- ✅ Адаптеры легко расширяются
- ✅ Тесты проходят успешно
- ✅ TypeScript ошибок нет

### 6.3 Пользовательский опыт

- ✅ UX остался полностью неизменным
- ✅ Все анимации и переходы работают
- ✅ Отзывчивость интерфейса сохранена
- ✅ Доступность не нарушена

---

## 7. ЗАКЛЮЧЕНИЕ

Данное техническое задание обеспечивает **быструю адаптацию нового дизайна** с сохранением всего функционала и **без изменения самого дизайна**.

### 7.1 Ключевые принципы

1. **НЕ ИЗМЕНЯТЬ ДИЗАЙН** - только добавлять функционал
2. **Использовать адаптеры** - мосты между дизайном и логикой
3. **Сохранять производительность** - не ухудшать UX
4. **Тестировать совместимость** - убедиться в корректной работе

### 7.2 Следующие шаги

1. **Анализ нового дизайна** - изучение структуры компонентов
2. **Создание адаптеров** - интеграция с существующим функционалом
3. **Тестирование** - проверка совместимости и производительности
4. **Документирование** - создание гайдов по адаптации

Реализация данного ТЗ позволит **быстро интегрировать новый дизайн** без потери функционала и с сохранением качества пользовательского опыта.
