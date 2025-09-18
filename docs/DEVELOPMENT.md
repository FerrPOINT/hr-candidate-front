# 👨‍💻 Руководство разработчика

**Проект:** HR Recruiter Frontend  
**Версия:** 0.1.0  
**Дата:** 2025-01-27

## 📋 Обзор

Данное руководство предназначено для разработчиков, работающих с HR Recruiter Frontend. Оно содержит стандарты кодирования, процессы разработки, инструменты и лучшие практики.

## 🚀 Быстрый старт для разработчиков

### Первоначальная настройка

```bash
# 1. Клонирование репозитория
git clone <repository-url>
cd hr-candidate-front

# 2. Установка зависимостей
npm install

# 3. Генерация API клиентов
npm run generate:api

# 4. Запуск в режиме разработки
npm start
```

### Проверка работоспособности

```bash
# Запуск тестов
npm test

# Проверка линтера
npm run lint

# Полная проверка
npm run check
```

## 🏗️ Архитектура разработки

### Структура проекта

```
src/
├── candidate/              # Кандидатская часть
│   ├── components/         # UI компоненты
│   │   ├── interview/      # Компоненты интервью
│   │   ├── ui/            # Базовые UI компоненты
│   │   └── common/        # Общие компоненты
│   ├── pages/             # Страницы приложения
│   ├── services/          # API сервисы
│   ├── hooks/             # React хуки
│   ├── types/             # TypeScript типы
│   └── utils/             # Утилиты
├── admin/                 # Административная часть
├── api/                   # Автогенерируемые API клиенты
├── store/                 # Zustand хранилища
└── utils/                 # Общие утилиты
```

### Принципы архитектуры

1. **Разделение ответственности** - Каждый модуль имеет четкую роль
2. **Переиспользование** - Общие компоненты и утилиты
3. **Типизация** - Строгая типизация с TypeScript
4. **Тестируемость** - Покрытие тестами критической функциональности

## 📝 Стандарты кодирования

### TypeScript

#### Именование

```typescript
// Интерфейсы - PascalCase с префиксом I (опционально)
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

// Типы - PascalCase
type InterviewStage = 'welcome' | 'test' | 'questions' | 'complete';

// Функции - camelCase
const getUserData = (userId: string): UserData => {
  // ...
};

// Константы - UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.hr-recruiter.com';

// Компоненты - PascalCase
export const InterviewProcess: React.FC<InterviewProcessProps> = ({ ... }) => {
  // ...
};
```

#### Типизация

```typescript
// Строгая типизация пропсов
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// Типизация хуков
export const useInterviewStage = (interviewId: number): {
  stage: InterviewStage;
  loading: boolean;
  nextStage: () => void;
} => {
  // ...
};

// Типизация API ответов
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

### React компоненты

#### Структура компонента

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/Button';
import { useInterviewStage } from '../hooks/useInterviewStage';
import type { InterviewStage } from '../types/interview';

interface ComponentProps {
  interviewId: number;
  onComplete?: () => void;
}

export const Component: React.FC<ComponentProps> = ({ 
  interviewId, 
  onComplete 
}) => {
  // 1. Хуки состояния
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 2. Кастомные хуки
  const { stage, nextStage } = useInterviewStage(interviewId);
  
  // 3. Обработчики событий
  const handleClick = useCallback(() => {
    setLoading(true);
    // ...
  }, []);
  
  // 4. Эффекты
  useEffect(() => {
    // ...
  }, [interviewId]);
  
  // 5. Рендер
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <Button onClick={handleClick}>
        Click me
      </Button>
    </div>
  );
};
```

#### Правила компонентов

1. **Один компонент = один файл**
2. **Именование файлов** - PascalCase (ComponentName.tsx)
3. **Экспорт по умолчанию** для компонентов
4. **Именованный экспорт** для утилит и типов
5. **Props интерфейс** в том же файле или отдельном types файле

### Стилизация

#### Tailwind CSS

```typescript
// Используйте утилитарные классы
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-800">
    Interview Progress
  </h2>
  <Button variant="primary" size="sm">
    Continue
  </Button>
</div>

// Создавайте переиспользуемые компоненты для сложных стилей
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    {children}
  </div>
);
```

#### CSS переменные

```css
/* В globals.css */
:root {
  --interview-bg: #f5f6f1;
  --interview-primary: #e16349;
  --interview-secondary: #e9eae2;
}
```

### Обработка ошибок

#### API ошибки

```typescript
// Централизованная обработка ошибок
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Произошла неизвестная ошибка';
};

// Использование в компонентах
const [error, setError] = useState<string | null>(null);

try {
  const result = await apiService.getData();
  // ...
} catch (err) {
  setError(handleApiError(err));
}
```

#### Пользовательские ошибки

```typescript
// Создание пользовательских ошибок
export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Использование
if (!email.includes('@')) {
  throw new ValidationError('Invalid email format', 'email');
}
```

## 🧪 Тестирование

### Стратегия тестирования

#### Unit тесты

```typescript
// utils/phoneFormatter.test.ts
import { formatPhone } from './phoneFormatter';

describe('formatPhone', () => {
  it('should format phone number correctly', () => {
    expect(formatPhone('+71234567890')).toBe('+7 (123) 456-78-90');
  });
  
  it('should handle invalid input', () => {
    expect(formatPhone('invalid')).toBe('');
  });
});
```

#### Component тесты

```typescript
// components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Hook тесты

```typescript
// hooks/useInterviewStage.test.ts
import { renderHook, act } from '@testing-library/react';
import { useInterviewStage } from './useInterviewStage';

describe('useInterviewStage', () => {
  it('should initialize with welcome stage', () => {
    const { result } = renderHook(() => useInterviewStage(1));
    
    expect(result.current.stage).toBe('welcome');
    expect(result.current.loading).toBe(false);
  });
  
  it('should advance to next stage', () => {
    const { result } = renderHook(() => useInterviewStage(1));
    
    act(() => {
      result.current.nextStage();
    });
    
    expect(result.current.stage).toBe('test');
  });
});
```

### Запуск тестов

```bash
# Все тесты
npm test

# Конкретный файл
npm test -- Button.test.tsx

# С покрытием
npm test -- --coverage

# Watch режим
npm test -- --watch

# Обновление снапшотов
npm test -- --updateSnapshot
```

## 🔧 Инструменты разработки

### VS Code настройка

#### Рекомендуемые расширения

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-jest",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

#### Настройки workspace

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### Git workflow

#### Соглашения о коммитах

```bash
# Формат: type(scope): description
feat(auth): add email verification
fix(interview): resolve microphone test issue
docs(readme): update installation instructions
refactor(components): extract common button component
test(utils): add phone formatter tests
```

#### Ветки

```bash
# Основные ветки
main          # Продакшен код
develop       # Разработка
feature/*     # Новые функции
bugfix/*      # Исправления багов
hotfix/*      # Критические исправления
```

#### Pull Request процесс

1. **Создание ветки** от `develop`
2. **Разработка** с тестами
3. **Проверка** `npm run check`
4. **Создание PR** с описанием
5. **Code review** от коллег
6. **Merge** после одобрения

### API разработка

#### Генерация клиентов

```bash
# Валидация OpenAPI
npm run validate:openapi

# Генерация всех API
npm run generate:api

# Генерация конкретного API
npm run generate:api:candidates
```

#### Работа с API

```typescript
// Использование автогенерированных клиентов
import { apiClient } from '../api';

// Типизированные запросы
const response = await apiClient.candidates.getInterviewData(interviewId);
const data: InterviewData = response.data;

// Обработка ошибок
try {
  const result = await apiClient.candidates.submitAnswer(interviewId, answer);
} catch (error) {
  const errorMessage = handleApiError(error);
  setError(errorMessage);
}
```

## 📊 Производительность

### Оптимизация React

#### Мемоизация

```typescript
// React.memo для предотвращения лишних рендеров
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});

// useMemo для дорогих вычислений
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// useCallback для стабильных ссылок
const handleClick = useCallback(() => {
  onItemClick(item.id);
}, [item.id, onItemClick]);
```

#### Lazy loading

```typescript
// Ленивая загрузка компонентов
const AdminPanel = React.lazy(() => import('./AdminPanel'));

// Использование с Suspense
<Suspense fallback={<div>Loading...</div>}>
  <AdminPanel />
</Suspense>
```

### Оптимизация bundle

#### Code splitting

```typescript
// Разделение по роутам
const CandidateInterview = React.lazy(() => import('./pages/CandidateInterview'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
```

#### Tree shaking

```typescript
// Импорт только нужных функций
import { formatPhone } from 'utils/phoneFormatter';
// Вместо
import * as utils from 'utils';
```

## 🔍 Отладка

### React DevTools

```typescript
// Добавление отладочной информации
const Component = () => {
  const [state, setState] = useState(initialState);
  
  // Отладка в DevTools
  useEffect(() => {
    console.log('Component state:', state);
  }, [state]);
  
  return <div>{/* ... */}</div>;
};
```

### Логирование

```typescript
// Структурированное логирование
import { logger } from '../utils/logger';

logger.info('User action', {
  action: 'startInterview',
  interviewId,
  timestamp: new Date().toISOString()
});

logger.error('API error', {
  endpoint: '/candidates/interview/start',
  error: error.message,
  status: error.response?.status
});
```

### Профилирование

```typescript
// React Profiler для измерения производительности
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration) => {
  console.log('Render:', { id, phase, actualDuration });
};

<Profiler id="InterviewProcess" onRender={onRenderCallback}>
  <InterviewProcess />
</Profiler>
```

## 🚀 Процесс разработки

### Планирование задачи

1. **Анализ требований** - Понимание задачи
2. **Проектирование** - Архитектура решения
3. **Разбивка** - На подзадачи
4. **Оценка** - Время выполнения
5. **Реализация** - Разработка с тестами

### Разработка функции

```bash
# 1. Создание ветки
git checkout -b feature/new-interview-stage

# 2. Разработка
# - Создание компонентов
# - Написание тестов
# - Обновление типов

# 3. Проверка
npm run check

# 4. Коммит
git add .
git commit -m "feat(interview): add new interview stage"

# 5. Push и PR
git push origin feature/new-interview-stage
```

### Code review

#### Что проверять

- [ ] **Функциональность** - Код работает как ожидается
- [ ] **Архитектура** - Следует принципам проекта
- [ ] **Производительность** - Нет утечек памяти
- [ ] **Безопасность** - Нет уязвимостей
- [ ] **Тестирование** - Покрытие тестами
- [ ] **Документация** - Обновлена при необходимости

#### Комментарии в PR

```markdown
## Описание
Добавлена новая стадия интервью для проверки технических навыков.

## Изменения
- Добавлен компонент `TechnicalTestStage`
- Обновлен хук `useInterviewStage`
- Добавлены тесты для новой функциональности

## Тестирование
- [ ] Unit тесты проходят
- [ ] Integration тесты проходят
- [ ] Ручное тестирование выполнено

## Скриншоты
[Добавить скриншоты UI]
```

## 📚 Ресурсы

### Документация

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Testing Library](https://testing-library.com/docs/)

### Внутренние ресурсы

- [Архитектурная документация](ARCHITECTURE.md)
- [Руководство по развертыванию](DEPLOYMENT.md)
- [API документация](../api/openapi-candidates.yaml)
- [Технические отчеты](../info/)

### Инструменты

- [VS Code](https://code.visualstudio.com/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [Postman](https://www.postman.com/) - для тестирования API

## 🤝 Командная работа

### Коммуникация

- **Slack** - Ежедневная коммуникация
- **GitHub Issues** - Отслеживание задач
- **Pull Requests** - Code review
- **Еженедельные встречи** - Планирование

### Стандарты команды

1. **Ежедневные коммиты** - Небольшие, частые изменения
2. **Code review** - Обязательно для всех PR
3. **Тестирование** - Покрытие критической функциональности
4. **Документация** - Обновление при изменениях

## 🆘 Получение помощи

### Внутренние ресурсы

- **Команда разработки** - dev@hr-recruiter.com
- **Tech Lead** - tech-lead@hr-recruiter.com
- **DevOps** - devops@hr-recruiter.com

### Внешние ресурсы

- **Stack Overflow** - Общие вопросы
- **React Community** - React специфичные вопросы
- **TypeScript Community** - TypeScript вопросы

### Процедуры

1. **Поиск в документации** - Проверьте существующую документацию
2. **Поиск в коде** - Найдите похожие реализации
3. **Обращение к команде** - Slack или email
4. **Создание issue** - Если нашли баг

---

**Документ поддерживается командой разработки**  
**Последнее обновление:** 2025-01-27
