# ✅ ЧЕК-ЛИСТ ДЛЯ НЕЙРОСЕТИ: ИНТЕГРАЦИЯ ДИЗАЙНА

## 🎯 ПРОСТОЙ ПЛАН ВЫПОЛНЕНИЯ

### Шаг 1: Подготовка (5 минут)

- [ ] Создать папку `src/adapters/`
- [ ] Создать папку `src/new-design/`
- [ ] Создать папку `design-backup/`
- [ ] Скопировать новый дизайн в `src/new-design/`
- [ ] Создать backup в `design-backup/`

### Шаг 2: Анализ (10 минут)

- [ ] Посмотреть компоненты в `src/new-design/components/`
- [ ] Записать список всех компонентов
- [ ] Определить какие данные нужны каждому компоненту

### Шаг 3: Создание адаптеров (по одному)

- [ ] Создать `src/adapters/vacancy/VacancyCardAdapter.tsx`
- [ ] Создать `src/adapters/vacancy/VacancyListAdapter.tsx`
- [ ] Создать `src/adapters/vacancy/VacancyFormAdapter.tsx`
- [ ] Создать `src/adapters/candidate/CandidateCardAdapter.tsx`
- [ ] Создать `src/adapters/candidate/CandidateListAdapter.tsx`
- [ ] Создать `src/adapters/candidate/CandidateFormAdapter.tsx`
- [ ] Создать `src/adapters/team/TeamMemberAdapter.tsx`
- [ ] Создать `src/adapters/team/TeamListAdapter.tsx`

### Шаг 4: Тестирование (после каждого адаптера)

- [ ] Запустить `npm start`
- [ ] Открыть страницу с компонентом
- [ ] Проверить что дизайн не изменился
- [ ] Проверить что данные загружаются
- [ ] Проверить что кнопки работают

---

## 🔧 ШАБЛОН ДЛЯ КАЖДОГО АДАПТЕРА

```typescript
// src/adapters/[тип]/[Компонент]Adapter.tsx
import React from 'react';
import { [Компонент] } from '../../new-design/components/[Компонент]';
import { use[Тип]Store } from '../../store/[тип]Store';

interface [Компонент]AdapterProps {
  [id]: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const [Компонент]Adapter: React.FC<[Компонент]AdapterProps> = ({
  [id],
  onEdit,
  onDelete
}) => {
  const { [данные], loading, error } = use[Тип]Store(state => ({
    [данные]: state.get[Тип]([id]),
    loading: state.loading,
    error: state.error
  }));

  if (loading) return <[Компонент].Skeleton />;
  if (error) return <[Компонент].Error error={error} />;
  if (![данные]) return null;

  return (
    <[Компонент]
      data={[данные]}
      onEdit={() => onEdit?.([id])}
      onDelete={() => onDelete?.([id])}
    />
  );
};
```

---

## 📝 КОНКРЕТНЫЕ ПРИМЕРЫ

### Пример 1: VacancyCardAdapter

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

### Пример 2: CandidateCardAdapter

```typescript
// src/adapters/candidate/CandidateCardAdapter.tsx
import React from 'react';
import { CandidateCard } from '../../new-design/components/CandidateCard';
import { useCandidateStore } from '../../store/candidateStore';

interface CandidateCardAdapterProps {
  candidateId: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const CandidateCardAdapter: React.FC<CandidateCardAdapterProps> = ({
  candidateId,
  onEdit,
  onDelete
}) => {
  const { candidate, loading, error } = useCandidateStore(state => ({
    candidate: state.getCandidate(candidateId),
    loading: state.loading,
    error: state.error
  }));

  if (loading) return <CandidateCard.Skeleton />;
  if (error) return <CandidateCard.Error error={error} />;
  if (!candidate) return null;

  return (
    <CandidateCard
      data={candidate}
      onEdit={() => onEdit?.(candidateId)}
      onDelete={() => onDelete?.(candidateId)}
    />
  );
};
```

---

## 🚨 ВАЖНЫЕ ПРАВИЛА

### ❌ НЕ ДЕЛАТЬ

- НЕ изменять файлы в `src/new-design/`
- НЕ изменять существующие компоненты в `src/components/`
- НЕ изменять стили в `src/new-design/styles/`
- НЕ удалять существующие файлы

### ✅ ДЕЛАТЬ

- Создавать адаптеры в `src/adapters/`
- Использовать существующие API сервисы
- Подключать к существующим store
- Тестировать каждую интеграцию

---

## 🔍 ПРОВЕРКА ПОСЛЕ КАЖДОГО ШАГА

### После создания адаптера

1. `npm start` - запустить приложение
2. Открыть страницу с компонентом
3. Проверить что дизайн не изменился
4. Проверить что данные загружаются
5. Проверить что кнопки работают

### Финальная проверка

- [ ] Все страницы открываются
- [ ] Дизайн остался неизменным
- [ ] Данные загружаются корректно
- [ ] Все функции работают
- [ ] Нет ошибок в консоли

---

## 📝 КОМАНДЫ ДЛЯ ПРОВЕРКИ

```bash
# Запустить проект
npm start

# Проверить TypeScript ошибки
npm run type-check

# Запустить тесты
npm test

# Проверить что все работает
npm run build
```

---

## 🎯 РЕЗУЛЬТАТ

После выполнения всех шагов:

- ✅ Новый дизайн интегрирован
- ✅ Все функции работают
- ✅ Дизайн остался неизменным
- ✅ Код чистый и понятный

**Принцип**: Адаптеры как мосты между дизайном и логикой.
