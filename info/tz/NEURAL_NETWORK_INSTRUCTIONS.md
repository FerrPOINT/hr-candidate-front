# 🤖 ИНСТРУКЦИИ ДЛЯ НЕЙРОСЕТИ: ИНТЕГРАЦИЯ ДИЗАЙНА

## 🎯 ПРОСТАЯ СТРАТЕГИЯ

### Главное правило: НЕ ТРОГАТЬ ДИЗАЙН

Все компоненты нового дизайна остаются **БЕЗ ИЗМЕНЕНИЙ**.

---

## 📋 ПОШАГОВЫЙ ПЛАН

### Шаг 1: Подготовка (5 минут)

```bash
# Создать папки
mkdir -p src/adapters/vacancy
mkdir -p src/adapters/candidate  
mkdir -p src/adapters/team
mkdir -p src/new-design
mkdir -p design-backup
```

### Шаг 2: Копирование (5 минут)

```bash
# Скопировать новый дизайн
cp -r [путь_к_новому_дизайну]/* src/new-design/
# Создать backup
cp -r src/new-design/* design-backup/
```

### Шаг 3: Анализ (10 минут)

```bash
# Посмотреть что есть в новом дизайне
ls src/new-design/components/
ls src/new-design/pages/
```

### Шаг 4: Создание адаптеров (30 минут на каждый)

---

## 🔧 ШАБЛОН АДАПТЕРА

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

---

## 📝 КОНКРЕТНЫЕ ЗАДАЧИ

### Задача 1: Вакансии

Создать файлы:

- `src/adapters/vacancy/VacancyCardAdapter.tsx`
- `src/adapters/vacancy/VacancyListAdapter.tsx`
- `src/adapters/vacancy/VacancyFormAdapter.tsx`

Подключить к:

- `src/services/vacancyService.ts`
- `src/store/vacancyStore.ts`

### Задача 2: Кандидаты

Создать файлы:

- `src/adapters/candidate/CandidateCardAdapter.tsx`
- `src/adapters/candidate/CandidateListAdapter.tsx`
- `src/adapters/candidate/CandidateFormAdapter.tsx`

Подключить к:

- `src/services/candidateService.ts`
- `src/store/candidateStore.ts`

### Задача 3: Команда

Создать файлы:

- `src/adapters/team/TeamMemberAdapter.tsx`
- `src/adapters/team/TeamListAdapter.tsx`

Подключить к:

- `src/services/teamService.ts`
- `src/store/teamStore.ts`

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

## 🔍 ПРОВЕРКА

### После каждого адаптера

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

## 📝 КОМАНДЫ

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

После выполнения:

- ✅ Новый дизайн интегрирован
- ✅ Все функции работают
- ✅ Дизайн остался неизменным
- ✅ Код чистый и понятный

**Принцип**: Адаптеры как мосты между дизайном и логикой.
