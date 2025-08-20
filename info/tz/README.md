# 🎨 ТЕХНИЧЕСКОЕ ЗАДАНИЕ: ИНТЕГРАЦИЯ НОВОГО ДИЗАЙНА

## 📋 ОБЗОР ДОКУМЕНТОВ

### Основные файлы

- **`NEW_DESIGN_MIGRATION_TZ.md`** - Полное ТЗ (версия 2.0)
- **`NEURAL_NETWORK_INSTRUCTIONS.md`** - Простые инструкции для нейросети
- **`PROJECT_STRUCTURE_MAP.md`** - Визуальная карта структуры проекта
- **`CHECKLIST_FOR_NEURAL_NETWORK.md`** - Пошаговый чек-лист

---

## 🎯 ГЛАВНАЯ ЦЕЛЬ

**Быстро и безопасно интегрировать новый дизайн без потери функционала.**

### Ключевые принципы

- ✅ **НЕ ТРОГАТЬ ДИЗАЙН** - все компоненты нового дизайна остаются без изменений
- ✅ **СОЗДАВАТЬ АДАПТЕРЫ** - мосты между дизайном и существующим API
- ✅ **ИСПОЛЬЗОВАТЬ СУЩЕСТВУЮЩИЕ API** - не переписывать логику

---

## 📁 СТРУКТУРА ПРОЕКТА

```
hr-recruiter-front/
├── src/
│   ├── components/          # 🔒 СУЩЕСТВУЮЩИЕ (НЕ ТРОГАТЬ)
│   ├── pages/              # 🔒 СУЩЕСТВУЮЩИЕ (НЕ ТРОГАТЬ)
│   ├── services/           # ✅ СУЩЕСТВУЮЩИЕ API (ИСПОЛЬЗОВАТЬ)
│   ├── store/              # ✅ СУЩЕСТВУЮЩИЕ STORE (ИСПОЛЬЗОВАТЬ)
│   ├── new-design/         # 🆕 НОВЫЙ ДИЗАЙН (НЕ ТРОГАТЬ)
│   └── adapters/           # 🆕 АДАПТЕРЫ (СОЗДАВАТЬ ЗДЕСЬ)
└── design-backup/          # 🔒 РЕЗЕРВНАЯ КОПИЯ (НЕ ТРОГАТЬ)
```

---

## 🔧 ПРОСТАЯ СТРАТЕГИЯ

### Шаг 1: Подготовка (5 минут)

```bash
mkdir -p src/adapters/vacancy src/adapters/candidate src/adapters/team
mkdir -p src/new-design design-backup
```

### Шаг 2: Копирование (5 минут)

```bash
cp -r [новый_дизайн]/* src/new-design/
cp -r src/new-design/* design-backup/
```

### Шаг 3: Создание адаптеров (по одному)

```typescript
// src/adapters/vacancy/VacancyCardAdapter.tsx
import { VacancyCard } from '../../new-design/components/VacancyCard';
import { useVacancyStore } from '../../store/vacancyStore';

export const VacancyCardAdapter = ({ vacancyId }) => {
  const vacancy = useVacancyStore(state => state.getVacancy(vacancyId));
  return <VacancyCard data={vacancy} />;
};
```

### Шаг 4: Тестирование

```bash
npm start
# Проверить что дизайн не изменился
# Проверить что данные загружаются
# Проверить что кнопки работают
```

---

## 📝 КОНКРЕТНЫЕ ЗАДАЧИ

### Задача 1: Вакансии

Создать:

- `src/adapters/vacancy/VacancyCardAdapter.tsx`
- `src/adapters/vacancy/VacancyListAdapter.tsx`
- `src/adapters/vacancy/VacancyFormAdapter.tsx`

### Задача 2: Кандидаты

Создать:

- `src/adapters/candidate/CandidateCardAdapter.tsx`
- `src/adapters/candidate/CandidateListAdapter.tsx`
- `src/adapters/candidate/CandidateFormAdapter.tsx`

### Задача 3: Команда

Создать:

- `src/adapters/team/TeamMemberAdapter.tsx`
- `src/adapters/team/TeamListAdapter.tsx`

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

---

## 📚 ДОПОЛНИТЕЛЬНЫЕ ДОКУМЕНТЫ

- **`NEW_DESIGN_MIGRATION_TZ.md`** - Полное техническое задание
- **`NEURAL_NETWORK_INSTRUCTIONS.md`** - Простые инструкции для нейросети
- **`PROJECT_STRUCTURE_MAP.md`** - Визуальная карта структуры
- **`CHECKLIST_FOR_NEURAL_NETWORK.md`** - Пошаговый чек-лист

---

**Цель**: Быстро и безопасно интегрировать новый дизайн без потери функционала.
