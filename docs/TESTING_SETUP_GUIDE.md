# Руководство по настройке тестов для React + TypeScript + Jest

## Обзор

Данное руководство описывает полную настройку тестирования для проектов на React + TypeScript + Jest с использованием современных инструментов и лучших практик.

## Технологический стек

- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Jest** - тестовый фреймворк
- **React Testing Library** - тестирование компонентов
- **Axios** - HTTP клиент
- **Zustand** - управление состоянием
- **React Router** - маршрутизация
- **Tailwind CSS** - стилизация

## 1. Установка зависимостей

### Основные зависимости
```bash
npm install --save-dev jest @types/jest ts-jest jest-environment-jsdom
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev identity-obj-proxy
```

### Дополнительные зависимости для моков
```bash
npm install --save-dev @types/node
```

## 2. Конфигурация Jest

### jest.config.js
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    }
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-dnd|react-dnd-html5-backend|@react-dnd|@radix-ui|lucide-react|@testing-library|react-dnd-core|@elevenlabs|react-router-dom|react-router|@hookform|react-hook-form|framer-motion|embla-carousel|cmdk|sonner|vaul|recharts|next-themes|input-otp|jwt-decode|web-vitals|zod|zustand|class-variance-authority|clsx|tailwind-merge|date-fns|form-data|react-dom|react|axios)/)'
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  moduleNameMapper: {
    '^generated-src/(.*)$': '<rootDir>/tests/mocks/generated-client.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
    '^react-dnd$': '<rootDir>/node_modules/react-dnd/dist/index.js',
    '^react-dnd-html5-backend$': '<rootDir>/node_modules/react-dnd-html5-backend/dist/index.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
};
```

## 3. Настройка Jest Setup

### jest.setup.js
```javascript
// Простые моки для node/jsdom environment

// Мокаем axios сразу в начале
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
    patch: jest.fn().mockResolvedValue({ data: {} }),
    request: jest.fn().mockResolvedValue({ data: {} }),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    },
    defaults: {
      headers: {
        common: {}
      }
    }
  })),
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} }),
  patch: jest.fn().mockResolvedValue({ data: {} }),
  request: jest.fn().mockResolvedValue({ data: {} }),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() }
  },
  defaults: {
    headers: {
      common: {}
    }
  }
}));

// Мокаем localStorage глобально
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    key: jest.fn((index) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Также мокаем глобальный localStorage
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Include jest-dom matchers
require('@testing-library/jest-dom');

// Mock для React Testing Library
const { configure } = require('@testing-library/react');

configure({
  testIdAttribute: 'data-testid',
});

// Mock для React DOM
const React = require('react');

// Убеждаемся, что React доступен глобально
global.React = React;

// Mock для React Testing Library renderHook
const { renderHook, render, screen, fireEvent, waitFor } = require('@testing-library/react');
global.renderHook = renderHook;
global.render = render;
global.screen = screen;
global.fireEvent = fireEvent;
global.waitFor = waitFor;

// Mock sessionStorage for tests
if (typeof window !== 'undefined') {
  const createStorageMock = () => {
    let store = {};
    return {
      getItem: (key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
      setItem: (key, value) => {
        store[key] = String(value);
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      key: (index) => Object.keys(store)[index] || null,
      get length() {
        return Object.keys(store).length;
      },
    };
  };

  if (!('sessionStorage' in window)) {
    Object.defineProperty(window, 'sessionStorage', {
      value: createStorageMock(),
      configurable: true,
      writable: true,
    });
  }

  // MediaRecorder mock (глобально, безопасный минимум)
  if (!('MediaRecorder' in window)) {
    Object.defineProperty(window, 'MediaRecorder', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        stop: jest.fn(),
        pause: jest.fn(),
        resume: jest.fn(),
        requestData: jest.fn(),
        ondataavailable: null,
        onstop: null,
        mimeType: 'audio/webm',
        stream: { getTracks: () => [{ stop: jest.fn() }] },
      })),
    });
  }

  // URL.createObjectURL mock
  if (!window.URL || !window.URL.createObjectURL) {
    Object.defineProperty(window, 'URL', {
      value: {
        createObjectURL: jest.fn(() => 'blob:mock'),
        revokeObjectURL: jest.fn(),
      },
    });
  }

  // requestAnimationFrame mock
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (cb) => setTimeout(cb, 16);
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = () => {};
  }

  // Mock matchMedia
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }),
    });
  }

  // Mock media APIs used by audio components if needed
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {
      getUserMedia: jest.fn().mockResolvedValue({}),
    };
  }

  // Mock Web Audio API
  if (!window.AudioContext) {
    window.AudioContext = jest.fn().mockImplementation(() => ({
      createMediaStreamSource: jest.fn(),
      createAnalyser: jest.fn(),
      createGain: jest.fn(),
      createOscillator: jest.fn(),
      createMediaElementSource: jest.fn(),
      resume: jest.fn(),
      suspend: jest.fn(),
      close: jest.fn(),
    }));
  }

  // Mock ResizeObserver
  if (!window.ResizeObserver) {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  }

  // Mock URL constructor for axios compatibility
  if (!window.URL) {
    window.URL = jest.fn().mockImplementation((url, base) => {
      const mockUrl = {
        href: url,
        origin: 'http://localhost',
        protocol: 'http:',
        host: 'localhost',
        hostname: 'localhost',
        port: '',
        pathname: '/',
        search: '',
        hash: '',
        toString: () => url,
      };
      return mockUrl;
    });
  }

  // Global URL mock for axios
  global.URL = window.URL;
}

// Ensure console.error does not crash tests on expected warnings
const originalError = console.error;
console.error = (...args) => {
  // Suppress specific React warnings that are expected in tests
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Warning: useLayoutEffect does nothing on the server'))
  ) {
    return;
  }
  originalError.apply(console, args);
};

// Моки для react-dnd
jest.mock('react-dnd', () => ({
  DndProvider: ({ children }) => children,
  useDrag: () => [{ isDragging: false }, jest.fn()],
  useDrop: () => [{ isOver: false }, jest.fn()],
}));

jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: jest.fn(),
}));
```

## 4. Настройка package.json

### Скрипты для тестирования
```json
{
  "scripts": {
    "test": "jest --config jest.config.js --watchAll=false",
    "test:watch": "jest --config jest.config.js",
    "test:jest": "jest --ci",
    "test:coverage": "jest --config jest.config.js --coverage",
    "test:debug": "jest --config jest.config.js --detectOpenHandles"
  }
}
```

## 5. Структура тестов

### Рекомендуемая структура файлов
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── __tests__/
│   │       └── Button.integration.test.tsx
│   └── __tests__/
│       └── components.test.tsx
├── hooks/
│   ├── useAuth.ts
│   └── __tests__/
│       └── useAuth.test.ts
├── services/
│   ├── apiService.ts
│   └── __tests__/
│       └── apiService.test.ts
└── __tests__/
    ├── setup.test.ts
    └── integration.test.tsx
```

## 6. Примеры тестов

### Тест компонента
```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Тест хука
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### Тест сервиса
```typescript
import { apiService } from '../apiService';

// Мокаем axios
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await apiService.getData();
    
    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/data');
  });
});
```

## 7. Настройка Craco (если используется)

### craco.config.js
```javascript
const path = require('path');

module.exports = {
  webpack: {
    configure: (config) => {
      // Webpack конфигурация
      return config;
    },
  },
  jest: {
    configure: (jestConfig) => {
      // Применяем настройки из jest.config.js
      return {
        ...jestConfig,
        transformIgnorePatterns: [
          '/node_modules/(?!(react-dnd|react-dnd-html5-backend|@react-dnd|@radix-ui|lucide-react|@testing-library|react-dnd-core|@elevenlabs|react-router-dom|react-router|@hookform|react-hook-form|framer-motion|embla-carousel|cmdk|sonner|vaul|recharts|next-themes|input-otp|jwt-decode|web-vitals|zod|zustand|class-variance-authority|clsx|tailwind-merge|date-fns|form-data|react-dom|react|axios)/)'
        ],
        moduleNameMapper: {
          ...jestConfig.moduleNameMapper,
          '^generated-src/(.*)$': '<rootDir>/tests/mocks/generated-client.ts',
          '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
          '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
          '^react-dnd$': '<rootDir>/node_modules/react-dnd/dist/index.js',
          '^react-dnd-html5-backend$': '<rootDir>/node_modules/react-dnd-html5-backend/dist/index.js',
          '^(\\.{1,2}/.*)\\.js$': '$1',
        },
        coverageThreshold: {
          global: {
            branches: 30,
            functions: 30,
            lines: 30,
            statements: 30
          }
        }
      };
    }
  }
};
```

## 8. Лучшие практики

### 1. Именование тестов
- Используйте описательные имена: `should render login form when user is not authenticated`
- Группируйте тесты с помощью `describe`
- Используйте `it` для отдельных тестов

### 2. Структура тестов
```typescript
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should do something', () => {
      // тест
    });
  });
});
```

### 3. Моки и заглушки
- Мокайте внешние зависимости
- Используйте `jest.fn()` для функций
- Создавайте реалистичные моки

### 4. Покрытие кода
- Начните с низких порогов (30%)
- Постепенно увеличивайте требования
- Фокусируйтесь на критических путях

### 5. Асинхронные тесты
```typescript
it('should handle async operations', async () => {
  const { result } = renderHook(() => useAsyncHook());
  
  await waitFor(() => {
    expect(result.current.data).toBeDefined();
  });
});
```

## 9. Отладка тестов

### Полезные команды
```bash
# Запуск тестов в watch режиме
npm run test:watch

# Запуск конкретного теста
npm test Button.test.tsx

# Запуск с отладкой
npm run test:debug

# Покрытие кода
npm run test:coverage
```

### Отладка в VS Code
Создайте `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Debug",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## 10. CI/CD интеграция

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
```

## 11. Решение проблем

### Частые ошибки
1. **"Cannot use import statement outside a module"**
   - Добавьте библиотеку в `transformIgnorePatterns`

2. **"Cannot read properties of undefined"**
   - Проверьте моки в `jest.setup.js`

3. **"localStorage is not defined"**
   - Добавьте мок для localStorage

4. **"URL is not a constructor"**
   - Добавьте мок для URL в `jest.setup.js`

### Отладка
```bash
# Запуск с подробным выводом
npm test -- --verbose

# Запуск одного теста
npm test -- --testNamePattern="should render"

# Очистка кэша
npm test -- --clearCache
```

## 12. Дополнительные инструменты

### ESLint для тестов
```bash
npm install --save-dev eslint-plugin-jest
```

### Prettier для тестов
```json
{
  "overrides": [
    {
      "files": ["**/*.test.*", "**/*.spec.*"],
      "options": {
        "singleQuote": true,
        "semi": true
      }
    }
  ]
}
```

## Заключение

Данная настройка обеспечивает:
- ✅ Стабильную работу тестов
- ✅ Покрытие кода
- ✅ Поддержку современных библиотек
- ✅ Отладку и профилирование
- ✅ CI/CD интеграцию

Следуйте этому руководству для создания надежной тестовой инфраструктуры в ваших проектах.
