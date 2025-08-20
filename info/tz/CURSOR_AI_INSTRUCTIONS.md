# 🤖 ИНСТРУКЦИИ ДЛЯ CURSOR AI: РАБОТА С НОВЫМ ДИЗАЙНОМ

## Детальные инструкции для интеграции готовых React компонентов

### ВЕРСИЯ: 1.0.0

### ДАТА: 2024-12-28

### СТАТУС: ГОТОВ К ВЫПОЛНЕНИЮ

### ИНСТРУМЕНТ: Cursor AI

---

## 🎯 ОСНОВНЫЕ ПРИНЦИПЫ ДЛЯ AI

### Золотое правило для Cursor AI
>
> **СОХРАНИТЬ ДИЗАЙН 1:1** - НИКОГДА не изменяйте файлы в `src/new-design/`

### Критерии успеха для AI

- ✅ Дизайн остался полностью неизменным
- ✅ Все стили и анимации сохранены
- ✅ Компоненты работают без модификации
- ✅ Функционал добавлен через адаптеры
- ✅ Оригинал всегда доступен для сравнения

---

## 📋 СТРАТЕГИЯ РАБОТЫ ДЛЯ CURSOR AI

### 1. Структура папок (СОЗДАТЬ)

```
hr-recruiter-front/
├── src/
│   ├── new-design/              # НОВОЕ: Новый дизайн (оригинал)
│   │   ├── components/          # React компоненты нового дизайна
│   │   ├── pages/               # Страницы нового дизайна
│   │   ├── styles/              # Стили нового дизайна
│   │   ├── routes/              # Роуты нового дизайна
│   │   └── README.md            # Документация нового дизайна
│   ├── adapters/                # НОВОЕ: Адаптеры для интеграции
│   │   ├── types.ts             # Типы адаптеров
│   │   ├── base/                # Базовые адаптеры
│   │   ├── vacancy/             # Адаптеры для вакансий
│   │   ├── candidate/           # Адаптеры для кандидатов
│   │   └── team/                # Адаптеры для команды
│   └── ...                      # Существующий код
├── design-original/             # НОВОЕ: Оригинальный дизайн (backup)
│   ├── components/              # Копия оригинальных компонентов
│   ├── pages/                   # Копия оригинальных страниц
│   ├── styles/                  # Копия оригинальных стилей
│   └── routes/                  # Копия оригинальных роутов
└── info/                        # Документация проекта
```

### 2. Процесс интеграции для AI

#### Этап 1: Подготовка структуры

1. **Создать папки**:

   ```bash
   mkdir -p src/new-design/components
   mkdir -p src/new-design/pages
   mkdir -p src/new-design/styles
   mkdir -p src/new-design/routes
   mkdir -p src/adapters/base
   mkdir -p src/adapters/vacancy
   mkdir -p src/adapters/candidate
   mkdir -p src/adapters/team
   mkdir -p design-original
   ```

2. **Скопировать файлы**:

   ```bash
   # Скопировать новый дизайн в src/new-design/
   cp -r /path/to/new-design/* src/new-design/
   
   # Создать backup в design-original/
   cp -r src/new-design/* design-original/
   ```

#### Этап 2: Анализ компонентов

1. **Изучить структуру** в `src/new-design/`
2. **Выявить интерактивные элементы**
3. **Определить точки интеграции**
4. **Создать карту зависимостей**

#### Этап 3: Создание адаптеров

1. **Создать адаптеры** в `src/adapters/`
2. **Подключить к существующему функционалу**
3. **Протестировать интеграцию**
4. **Убедиться в сохранении дизайна**

---

## 🔧 ТЕХНИЧЕСКАЯ РЕАЛИЗАЦИЯ ДЛЯ AI

### 1. Создание базовых типов

```typescript
// src/adapters/types.ts
export interface BaseAdapter<TData, TProps> {
  data: TData;
  loading: boolean;
  error: Error | null;
  actions: {
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onSave?: (data: TData) => void;
    onCancel?: () => void;
  };
}

export interface AdapterConfig {
  enableLoading?: boolean;
  enableError?: boolean;
  enableCache?: boolean;
  cacheTime?: number;
}
```

### 2. Создание базового адаптера

```typescript
// src/adapters/base/BaseAdapter.tsx
import React from 'react';
import { BaseAdapter as BaseAdapterType } from '../types';

interface BaseAdapterProps<TData, TProps> {
  data: TData;
  loading: boolean;
  error: Error | null;
  children: (props: TProps) => React.ReactNode;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSave?: (data: TData) => void;
  onCancel?: () => void;
}

export function BaseAdapter<TData, TProps>({
  data,
  loading,
  error,
  children,
  onEdit,
  onDelete,
  onSave,
  onCancel
}: BaseAdapterProps<TData, TProps>) {
  if (loading) {
    return <div className="loading-skeleton">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error.message}</div>;
  }

  const props = {
    data,
    onEdit,
    onDelete,
    onSave,
    onCancel
  } as TProps;

  return <>{children(props)}</>;
}
```

### 3. Создание адаптера для вакансий

```typescript
// src/adapters/vacancy/VacancyCardAdapter.tsx
import React from 'react';
import { VacancyCard } from '../../new-design/components/VacancyCard';
import { useVacancyStore } from '../../store/vacancyStore';

interface VacancyCardAdapterProps {
  vacancyId: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const VacancyCardAdapter: React.FC<VacancyCardAdapterProps> = ({
  vacancyId,
  onEdit,
  onDelete
}) => {
  const { vacancy, loading, error } = useVacancyStore(state => ({
    vacancy: state.getVacancy(vacancyId),
    loading: state.loading,
    error: state.error
  }));

  if (loading) return <VacancyCard.Skeleton />;
  if (error) return <VacancyCard.Error error={error} />;
  if (!vacancy) return null;

  return (
    <VacancyCard
      data={vacancy}
      onEdit={() => onEdit?.(vacancyId)}
      onDelete={() => onDelete?.(vacancyId)}
    />
  );
};
```

### 4. Интеграция с роутами

```typescript
// src/routes/newDesignRoutes.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { VacanciesPage } from '../new-design/pages/VacanciesPage';
import { CandidatesPage } from '../new-design/pages/CandidatesPage';
import { TeamPage } from '../new-design/pages/TeamPage';

export const NewDesignRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/vacancies" element={<VacanciesPage />} />
      <Route path="/candidates" element={<CandidatesPage />} />
      <Route path="/team" element={<TeamPage />} />
    </Routes>
  );
};
```

---

## 📋 ПЛАН ВЫПОЛНЕНИЯ ДЛЯ AI

### Фаза 1: Подготовка структуры (1 день)

#### 1.1 Создание папок

- [ ] Создать `src/new-design/` папку
- [ ] Создать `design-original/` папку
- [ ] Создать `src/adapters/` папку
- [ ] Настроить структуру подпапок

#### 1.2 Копирование файлов

- [ ] Скопировать все файлы нового дизайна в `src/new-design/`
- [ ] Создать backup в `design-original/`
- [ ] Проверить корректность копирования
- [ ] Создать документацию структуры

#### 1.3 Настройка импортов

- [ ] Настроить пути импортов в `tsconfig.json`
- [ ] Создать index файлы для экспорта
- [ ] Проверить корректность импортов
- [ ] Настроить алиасы для удобства

### Фаза 2: Анализ компонентов (1 день)

#### 2.1 Изучение структуры

- [ ] Проанализировать все компоненты в `src/new-design/`
- [ ] Выявить иерархию компонентов
- [ ] Определить пропсы и события
- [ ] Создать карту компонентов

#### 2.2 Выявление интерактивных элементов

- [ ] Найти все кнопки и их назначения
- [ ] Определить формы и поля ввода
- [ ] Выявить модальные окна
- [ ] Найти элементы навигации

#### 2.3 Определение точек интеграции

- [ ] Создать список API вызовов
- [ ] Определить зависимости от состояния
- [ ] Выявить точки для обработки ошибок
- [ ] Создать план интеграции

### Фаза 3: Создание адаптеров (3-5 дней)

#### 3.1 Базовые адаптеры

- [ ] Создать `BaseAdapter.tsx`
- [ ] Создать `ErrorBoundary.tsx`
- [ ] Настроить типы адаптеров
- [ ] Протестировать базовую функциональность

#### 3.2 Адаптеры для вакансий

- [ ] Создать `VacancyCardAdapter.tsx`
- [ ] Создать `VacancyListAdapter.tsx`
- [ ] Создать `VacancyFormAdapter.tsx`
- [ ] Интегрировать с `vacancyStore`

#### 3.3 Адаптеры для кандидатов

- [ ] Создать `CandidateCardAdapter.tsx`
- [ ] Создать `CandidateListAdapter.tsx`
- [ ] Создать `CandidateFormAdapter.tsx`
- [ ] Интегрировать с `candidateStore`

#### 3.4 Адаптеры для команды

- [ ] Создать `TeamMemberAdapter.tsx`
- [ ] Создать `TeamListAdapter.tsx`
- [ ] Создать `TeamAnalyticsAdapter.tsx`
- [ ] Интегрировать с `teamStore`

### Фаза 4: Интеграция API (2-3 дня)

#### 4.1 Основные API

- [ ] Подключить `vacancyService` к адаптерам
- [ ] Интегрировать `candidateService` к адаптерам
- [ ] Подключить `teamService` к адаптерам
- [ ] Настроить обработку состояний загрузки

#### 4.2 Специальные API

- [ ] Подключить `ElevenLabs` для голосовых интервью
- [ ] Интегрировать аналитические API
- [ ] Настроить обработку ошибок API
- [ ] Протестировать все API интеграции

### Фаза 5: Тестирование совместимости (1-2 дня)

#### 5.1 Функциональное тестирование

- [ ] Проверить что дизайн остался неизменным
- [ ] Протестировать все интерактивные элементы
- [ ] Проверить корректность отображения данных
- [ ] Убедиться в работе состояния приложения

#### 5.2 Производительность и стабильность

- [ ] Проверить производительность (не должна ухудшиться)
- [ ] Протестировать обработку ошибок
- [ ] Проверить совместимость с браузерами
- [ ] Провести финальное тестирование

---

## 🎯 КРИТЕРИИ ПРИЕМКИ ДЛЯ AI

### Функциональные критерии

- ✅ Дизайн остался полностью неизменным (1:1)
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

## 🔧 ИНСТРУКЦИИ ДЛЯ CURSOR AI

### 1. Работа с файлами

#### При создании адаптеров

```typescript
// Всегда импортируйте компоненты из new-design
import { ComponentName } from '../new-design/components/ComponentName';

// Создавайте адаптеры в src/adapters/
// Не изменяйте оригинальные компоненты в src/new-design/
```

#### При интеграции стилей

```css
/* Используйте стили из new-design/styles/ */
/* Не изменяйте оригинальные стили */
/* Создавайте дополнительные стили только в adapters/ */
```

### 2. Принципы работы

#### Золотое правило

- **НЕ ИЗМЕНЯТЬ** файлы в `src/new-design/`
- **СОЗДАВАТЬ** адаптеры в `src/adapters/`
- **ИНТЕГРИРОВАТЬ** через адаптеры
- **СОХРАНЯТЬ** дизайн 1:1

#### При работе с компонентами

1. Изучите оригинальный компонент в `src/new-design/`
2. Создайте адаптер в `src/adapters/`
3. Подключите к существующему функционалу
4. Протестируйте интеграцию
5. Убедитесь в сохранении дизайна

### 3. Структура команд

#### Для создания адаптера

```bash
# 1. Изучить оригинальный компонент
cat src/new-design/components/ComponentName.tsx

# 2. Создать адаптер
touch src/adapters/component/ComponentNameAdapter.tsx

# 3. Интегрировать с существующим функционалом
# 4. Протестировать
```

#### Для тестирования

```bash
# Проверить что дизайн не изменился
npm run test:visual

# Проверить функциональность
npm run test:integration

# Проверить производительность
npm run test:performance
```

---

## 🚀 СЛЕДУЮЩИЕ ШАГИ ДЛЯ AI

1. **Создать структуру папок** - `src/new-design/` и `design-original/`
2. **Скопировать файлы** - новый дизайн в `src/new-design/`
3. **Создать backup** - оригинал в `design-original/`
4. **Начать анализ** - изучить структуру компонентов
5. **Создать адаптеры** - по плану интеграции

---

## 📋 ПРИОРИТЕТЫ РЕАЛИЗАЦИИ ДЛЯ AI

1. **CRITICAL**: Сохранение дизайна 1:1
2. **HIGH**: Создание адаптеров для интеграции
3. **MEDIUM**: Тестирование совместимости
4. **LOW**: Оптимизация производительности

---

**🎯 Цель**: Быстро и качественно интегрировать новый дизайн без потери функционала и с сохранением дизайна 1:1.

**Ключевые принципы для AI**:

- СОХРАНИТЬ ДИЗАЙН 1:1 - никаких изменений в UI/UX
- Создание адаптеров - мосты между дизайном и логикой
- Оригинал всегда доступен для сравнения
- Профессиональная стратегия для работы в Cursor AI
