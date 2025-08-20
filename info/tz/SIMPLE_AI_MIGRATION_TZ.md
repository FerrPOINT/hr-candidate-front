# 🤖 ПРОСТОЕ ТЗ ДЛЯ НЕЙРОСЕТИ: ПЕРЕХОД К НОВОМУ ДИЗАЙНУ

## Максимально простые инструкции для Cursor AI

### ВЕРСИЯ: 1.0.0

### ДАТА: 2024-12-28

### СТАТУС: ГОТОВ К ВЫПОЛНЕНИЮ

### ИНСТРУМЕНТ: Cursor AI

---

## 🎯 ГЛАВНОЕ ПРАВИЛО

> **НЕ ИЗМЕНЯТЬ ДИЗАЙН** - только подключать API к готовым компонентам

---

## 📋 ЧТО ДЕЛАТЬ (ПОШАГОВО)

### Шаг 1: Создать папки

```bash
mkdir src/new-design
mkdir design-original
```

### Шаг 2: Скопировать новый дизайн

```bash
# Скопировать все файлы нового дизайна в src/new-design/
cp -r /path/to/new-design/* src/new-design/

# Создать backup
cp -r src/new-design/* design-original/
```

### Шаг 3: Изучить структуру

```bash
# Посмотреть что есть в новом дизайне
ls src/new-design/components/
ls src/new-design/pages/
```

### Шаг 4: Копировать компоненты по одному

```bash
# Пример: скопировать VacancyCard
cp src/new-design/components/VacancyCard.tsx src/components/
```

### Шаг 5: Подключить API к компоненту

```typescript
// В скопированном компоненте добавить:
import { useVacancyStore } from '../store/vacancyStore';
import { vacancyService } from '../services/vacancyService';
```

---

## 🔧 ПРИМЕРЫ ИНТЕГРАЦИИ

### Пример 1: VacancyCard

#### Исходный компонент (НЕ ИЗМЕНЯТЬ)

```typescript
// src/new-design/components/VacancyCard.tsx
interface VacancyCardProps {
  title: string;
  department: string;
  status: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const VacancyCard: React.FC<VacancyCardProps> = ({
  title,
  department,
  status,
  onEdit,
  onDelete
}) => {
  return (
    <div className="vacancy-card">
      <h3>{title}</h3>
      <p>{department}</p>
      <span>{status}</span>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};
```

#### После интеграции (ДОБАВИТЬ API)

```typescript
// src/components/VacancyCard.tsx
import { useVacancyStore } from '../store/vacancyStore';
import { vacancyService } from '../services/vacancyService';

interface VacancyCardProps {
  vacancyId: string; // Изменить на ID
}

export const VacancyCard: React.FC<VacancyCardProps> = ({ vacancyId }) => {
  const { vacancy, loading, error } = useVacancyStore(state => ({
    vacancy: state.getVacancy(vacancyId),
    loading: state.loading,
    error: state.error
  }));

  const handleEdit = () => {
    vacancyService.editVacancy(vacancyId);
  };

  const handleDelete = () => {
    vacancyService.deleteVacancy(vacancyId);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!vacancy) return null;

  return (
    <div className="vacancy-card">
      <h3>{vacancy.title}</h3>
      <p>{vacancy.department}</p>
      <span>{vacancy.status}</span>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};
```

### Пример 2: VacancyList

#### Исходный компонент

```typescript
// src/new-design/components/VacancyList.tsx
interface VacancyListProps {
  vacancies: Array<{
    id: string;
    title: string;
    department: string;
    status: string;
  }>;
}

export const VacancyList: React.FC<VacancyListProps> = ({ vacancies }) => {
  return (
    <div className="vacancy-list">
      {vacancies.map(vacancy => (
        <VacancyCard key={vacancy.id} {...vacancy} />
      ))}
    </div>
  );
};
```

#### После интеграции

```typescript
// src/components/VacancyList.tsx
import { useVacancyStore } from '../store/vacancyStore';

export const VacancyList: React.FC = () => {
  const { vacancies, loading, error } = useVacancyStore(state => ({
    vacancies: state.vacancies,
    loading: state.loading,
    error: state.error
  }));

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="vacancy-list">
      {vacancies.map(vacancy => (
        <VacancyCard key={vacancy.id} vacancyId={vacancy.id} />
      ))}
    </div>
  );
};
```

---

## 📋 ЧЕК-ЛИСТ ДЛЯ НЕЙРОСЕТИ

### Для каждого компонента

1. **Скопировать компонент** из `src/new-design/` в `src/components/`
2. **Добавить импорты**:

   ```typescript
   import { useVacancyStore } from '../store/vacancyStore';
   import { vacancyService } from '../services/vacancyService';
   ```

3. **Заменить пропсы** на ID (например, `vacancyId` вместо `title`, `department`)
4. **Добавить загрузку данных** из store
5. **Добавить обработку ошибок**
6. **Подключить API вызовы** к кнопкам
7. **Проверить что дизайн не изменился**

### Для каждой страницы

1. **Скопировать страницу** из `src/new-design/pages/` в `src/pages/`
2. **Подключить компоненты** с API
3. **Добавить роут** в существующую систему
4. **Протестировать**

---

## 🔧 ГОТОВЫЕ СЕРВИСЫ ДЛЯ ПОДКЛЮЧЕНИЯ

### Vacancy API

```typescript
// Уже готово в проекте
import { useVacancyStore } from '../store/vacancyStore';
import { vacancyService } from '../services/vacancyService';

// Методы:
vacancyService.getVacancies()     // Получить список
vacancyService.getVacancy(id)     // Получить одну
vacancyService.createVacancy(data) // Создать
vacancyService.editVacancy(id)    // Редактировать
vacancyService.deleteVacancy(id)  // Удалить
```

### Candidate API

```typescript
// Уже готово в проекте
import { useCandidateStore } from '../store/candidateStore';
import { candidateService } from '../services/candidateService';

// Методы:
candidateService.getCandidates()     // Получить список
candidateService.getCandidate(id)    // Получить одного
candidateService.createCandidate(data) // Создать
candidateService.editCandidate(id)   // Редактировать
candidateService.deleteCandidate(id) // Удалить
```

### ElevenLabs API

```typescript
// Уже готово в проекте
import { useElevenLabs } from '../hooks/useElevenLabs';

// Методы:
elevenLabs.startRecording()    // Начать запись
elevenLabs.stopRecording()     // Остановить запись
elevenLabs.playAudio(url)      // Воспроизвести
```

---

## 📋 ПЛАН РАБОТЫ

### День 1: Подготовка

- [ ] Создать папки `src/new-design/` и `design-original/`
- [ ] Скопировать новый дизайн
- [ ] Изучить структуру

### День 2-3: Компоненты вакансий

- [ ] Скопировать `VacancyCard.tsx`
- [ ] Подключить `useVacancyStore`
- [ ] Подключить `vacancyService`
- [ ] Протестировать

### День 4-5: Компоненты кандидатов

- [ ] Скопировать `CandidateCard.tsx`
- [ ] Подключить `useCandidateStore`
- [ ] Подключить `candidateService`
- [ ] Протестировать

### День 6-7: Страницы

- [ ] Скопировать страницы
- [ ] Подключить роуты
- [ ] Протестировать

### День 8: Финальная проверка

- [ ] Проверить что дизайн не изменился
- [ ] Протестировать все функции
- [ ] Исправить ошибки

---

## 🎯 КРИТЕРИИ УСПЕХА

### ✅ Обязательно

- Дизайн остался точно таким же
- Все кнопки работают
- Данные загружаются из API
- Ошибки обрабатываются

### ❌ Запрещено

- Изменять CSS стили
- Изменять структуру HTML
- Изменять названия классов
- Удалять элементы дизайна

---

## 🚀 КОМАНДЫ ДЛЯ ВЫПОЛНЕНИЯ

```bash
# 1. Создать папки
mkdir src/new-design
mkdir design-original

# 2. Скопировать дизайн
cp -r /path/to/new-design/* src/new-design/
cp -r src/new-design/* design-original/

# 3. Скопировать компонент
cp src/new-design/components/VacancyCard.tsx src/components/

# 4. Отредактировать компонент (добавить API)
# 5. Протестировать
npm start
```

---

## 📝 ПРИМЕРЫ КОМАНД ДЛЯ CURSOR AI

### Для копирования компонента

```
Скопируй файл src/new-design/components/VacancyCard.tsx в src/components/ и подключи к нему API из vacancyService
```

### Для подключения API

```
В компоненте VacancyCard замени пропсы title, department, status на vacancyId и подключи данные из useVacancyStore
```

### Для тестирования

```
Проверь что компонент VacancyCard отображается точно так же как в оригинале, но данные загружаются из API
```

---

**🎯 ЦЕЛЬ**: Быстро скопировать новый дизайн и подключить к нему существующий API без изменения дизайна.

**ПРАВИЛО**: НЕ ИЗМЕНЯТЬ ДИЗАЙН - только подключать API!
