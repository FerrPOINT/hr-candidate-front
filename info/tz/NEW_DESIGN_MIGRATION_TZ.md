# 🎨 ТЕХНИЧЕСКОЕ ЗАДАНИЕ: ИНТЕГРАЦИЯ НОВОГО ДИЗАЙНА

## ВЕРСИЯ: 2.0.0 - УПРОЩЕННАЯ ДЛЯ НЕЙРОСЕТИ

### ДАТА: 2024-12-28

### СТАТУС: ГОТОВ К ВЫПОЛНЕНИЮ

### ИНСТРУМЕНТ: Cursor AI

---

## 🎯 ГЛАВНОЕ ПРАВИЛО

**НЕ ТРОГАТЬ ДИЗАЙН!** - Все компоненты нового дизайна остаются без изменений.

---

## 📁 СТРУКТУРА ПРОЕКТА

```
hr-recruiter-front/
├── src/
│   ├── components/          # СУЩЕСТВУЮЩИЕ компоненты (НЕ ТРОГАТЬ)
│   ├── pages/              # СУЩЕСТВУЮЩИЕ страницы (НЕ ТРОГАТЬ)
│   ├── new-design/         # НОВЫЙ ДИЗАЙН (НЕ ТРОГАТЬ)
│   │   ├── components/     # React компоненты нового дизайна
│   │   ├── pages/          # Страницы нового дизайна
│   │   └── styles/         # Стили нового дизайна
│   └── adapters/           # АДАПТЕРЫ (СОЗДАВАТЬ ЗДЕСЬ)
│       ├── vacancy/        # Адаптеры для вакансий
│       ├── candidate/      # Адаптеры для кандидатов
│       └── team/           # Адаптеры для команды
└── design-backup/          # РЕЗЕРВНАЯ КОПИЯ (НЕ ТРОГАТЬ)
```

---

## 🔧 ПРОСТАЯ СТРАТЕГИЯ РАБОТЫ

### Шаг 1: Изучить новый дизайн

```bash
# Посмотреть что есть в новом дизайне
ls src/new-design/components/
ls src/new-design/pages/
```

### Шаг 2: Создать адаптер для каждого компонента

```typescript
// src/adapters/vacancy/VacancyCardAdapter.tsx
import React from 'react';
import { VacancyCard } from '../../new-design/components/VacancyCard';
import { useVacancyStore } from '../../store/vacancyStore';

export const VacancyCardAdapter = ({ vacancyId }) => {
  const vacancy = useVacancyStore(state => state.getVacancy(vacancyId));
  
  return <VacancyCard data={vacancy} />;
};
```

### Шаг 3: Подключить к существующим API

```typescript
// Использовать существующие сервисы
import { vacancyService } from '../../services/vacancyService';
import { candidateService } from '../../services/candidateService';
```

---

## 📋 ПЛАН РАБОТЫ (ПРОСТОЙ)

### 1. Подготовка (30 минут)

- [ ] Создать папку `src/adapters/`
- [ ] Скопировать новый дизайн в `src/new-design/`
- [ ] Создать backup в `design-backup/`

### 2. Анализ компонентов (1 час)

- [ ] Посмотреть все компоненты в `src/new-design/components/`
- [ ] Записать список компонентов
- [ ] Определить какие данные нужны каждому компоненту

### 3. Создание адаптеров (2-3 часа)

- [ ] Создать адаптер для каждого компонента
- [ ] Подключить к существующим API
- [ ] Протестировать работу

### 4. Интеграция (1 час)

- [ ] Заменить старые компоненты на адаптеры
- [ ] Проверить что все работает
- [ ] Убедиться что дизайн не изменился

---

## 🎯 КОНКРЕТНЫЕ ЗАДАЧИ

### Задача 1: Вакансии

```typescript
// Создать эти файлы:
src/adapters/vacancy/VacancyCardAdapter.tsx
src/adapters/vacancy/VacancyListAdapter.tsx
src/adapters/vacancy/VacancyFormAdapter.tsx

// Подключить к:
src/services/vacancyService.ts
src/store/vacancyStore.ts
```

### Задача 2: Кандидаты

```typescript
// Создать эти файлы:
src/adapters/candidate/CandidateCardAdapter.tsx
src/adapters/candidate/CandidateListAdapter.tsx
src/adapters/candidate/CandidateFormAdapter.tsx

// Подключить к:
src/services/candidateService.ts
src/store/candidateStore.ts
```

### Задача 3: Команда

```typescript
// Создать эти файлы:
src/adapters/team/TeamMemberAdapter.tsx
src/adapters/team/TeamListAdapter.tsx

// Подключить к:
src/services/teamService.ts
src/store/teamStore.ts
```

---

## 🔧 ШАБЛОН АДАПТЕРА

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

## 🚨 ВАЖНЫЕ ПРАВИЛА

### НЕ ДЕЛАТЬ

- ❌ НЕ изменять файлы в `src/new-design/`
- ❌ НЕ изменять существующие компоненты в `src/components/`
- ❌ НЕ изменять стили в `src/new-design/styles/`
- ❌ НЕ удалять существующие файлы

### ДЕЛАТЬ

- ✅ Создавать адаптеры в `src/adapters/`
- ✅ Использовать существующие API сервисы
- ✅ Подключать к существующим store
- ✅ Тестировать каждую интеграцию

---

## 🔍 ПРОВЕРКА РАБОТЫ

### После каждого адаптера

1. Запустить приложение: `npm start`
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

## 📝 КОМАНДЫ ДЛЯ РАБОТЫ

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

После выполнения ТЗ:

- ✅ Новый дизайн интегрирован
- ✅ Все функции работают
- ✅ Дизайн остался неизменным
- ✅ Код чистый и понятный

---

**Цель**: Быстро и безопасно интегрировать новый дизайн без потери функционала.

**Принцип**: Адаптеры как мосты между дизайном и логикой.
