# 🧠 УМНЫЙ ПЛАН ИНТЕГРАЦИИ ДВУХ ВЕРСИЙ

## 📋 ПРОБЛЕМА ПРЕДЫДУЩЕГО ПОДХОДА
- ❌ Дублирование 70% общего кода
- ❌ Сложность поддержки
- ❌ Большой размер проекта
- ❌ Трудности с обновлениями

## 🎯 УМНОЕ РЕШЕНИЕ

### Структура с условными импортами:
```
src/
├── components/              # Общие компоненты
├── pages/                   # Общие страницы
├── services/                # Общие сервисы
├── utils/                   # Общие утилиты
├── store/                   # Общие стейты
├── config/                  # Конфигурация версий
│   ├── version.ts           # Переключатель версий
│   ├── legacy.ts            # Настройки старой версии
│   └── new.ts               # Настройки новой версии
├── legacy/                  # Только специфичные для старой версии
│   ├── components/          # Старые компоненты
│   ├── services/            # Старые сервисы
│   └── pages/               # Старые страницы
├── new/                     # Только специфичные для новой версии
│   ├── components/          # Новые компоненты (ElevenLabs)
│   ├── services/            # Новые сервисы
│   └── pages/               # Новые страницы
└── App.tsx                  # Умный переключатель
```

---

## 🔧 РЕАЛИЗАЦИЯ

### 1. Конфигурация версий

#### 1.1 Переключатель версий
```typescript
// src/config/version.ts
export const APP_VERSION = process.env.REACT_APP_VERSION || 'new';

export const isLegacyVersion = APP_VERSION === 'legacy';
export const isNewVersion = APP_VERSION === 'new';

// Определение версии по роли пользователя
export const getVersionByRole = (role?: string) => {
  if (role === 'admin') return 'new';
  if (role === 'recruiter' || role === 'viewer') return 'legacy';
  return 'new'; // по умолчанию
};

// Определение версии по URL
export const getVersionByUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('version') || 'new';
};
```

#### 1.2 Настройки старой версии
```typescript
// src/config/legacy.ts
export const LEGACY_CONFIG = {
  api: {
    baseUrl: 'http://localhost:8080/api/v1',
    useMock: false,
    version: 'legacy'
  },
  features: {
    elevenLabs: false,
    voiceToVoice: false,
    advancedEditor: false,
    complexLayout: false
  },
  layout: {
    type: 'simple',
    components: ['basic', 'forms', 'lists']
  }
};
```

#### 1.3 Настройки новой версии
```typescript
// src/config/new.ts
export const NEW_CONFIG = {
  api: {
    baseUrl: 'http://localhost:8080/api/v1',
    useMock: false,
    version: 'new'
  },
  features: {
    elevenLabs: true,
    voiceToVoice: true,
    advancedEditor: true,
    complexLayout: true
  },
  layout: {
    type: 'complex',
    components: ['editor', 'widgets', 'advanced']
  }
};
```

### 2. Умные сервисы

#### 2.1 API сервис с переключением
```typescript
// src/services/apiService.ts
import { isLegacyVersion } from '../config/version';
import { LEGACY_CONFIG } from '../config/legacy';
import { NEW_CONFIG } from '../config/new';

// Импорт нужной версии API
const getApiImplementation = () => {
  if (isLegacyVersion) {
    return require('../legacy/services/legacyApiService').default;
  } else {
    return require('./newApiService').default;
  }
};

export class ApiService {
  private apiImpl: any;

  constructor() {
    this.apiImpl = getApiImplementation();
  }

  // Общие методы
  async login(email: string, password: string) {
    return this.apiImpl.login(email, password);
  }

  async getPositions(params?: any) {
    return this.apiImpl.getPositions(params);
  }

  // Условные методы
  async startVoiceInterview(interviewId: number) {
    if (isLegacyVersion) {
      throw new Error('Voice interviews not available in legacy version');
    }
    return this.apiImpl.startVoiceInterview(interviewId);
  }
}
```

#### 2.2 Компоненты с условным рендерингом
```typescript
// src/components/Layout.tsx
import React from 'react';
import { isLegacyVersion } from '../config/version';
import { LEGACY_CONFIG } from '../config/legacy';
import { NEW_CONFIG } from '../config/new';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config = isLegacyVersion ? LEGACY_CONFIG : NEW_CONFIG;

  if (config.layout.type === 'simple') {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          {/* Простая навигация */}
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg">
          {/* Сложная навигация с виджетами */}
        </nav>
        <main className="flex">
          <aside className="w-64 bg-white shadow">
            {/* Боковая панель */}
          </aside>
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    );
  }
};
```

### 3. Умный App.tsx

```typescript
// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { getVersionByRole, getVersionByUrl, isLegacyVersion } from './config/version';
import { ThemeProvider } from './components/ThemeProvider';
import SessionExpiredModal from './components/SessionExpiredModal';

// Условные импорты
const getLayoutComponent = () => {
  if (isLegacyVersion) {
    return require('./components/Layout').default;
  } else {
    return require('./components/EditorLayout').default;
  }
};

const getDashboardComponent = () => {
  if (isLegacyVersion) {
    return require('./pages/Dashboard').default;
  } else {
    return require('./pages/Dashboard').default; // Общий компонент
  }
};

function App() {
  const { user, restoreSession, showSessionExpiredModal, hideSessionExpired } = useAuthStore();

  useEffect(() => {
    restoreSession().catch(error => {
      console.error('Failed to restore session:', error);
    });
  }, [restoreSession]);

  // Определяем версию
  const version = getVersionByUrl() || getVersionByRole(user?.role);
  const isLegacy = version === 'legacy';

  const Layout = getLayoutComponent();
  const Dashboard = getDashboardComponent();

  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-gray-50">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                zIndex: 10001,
              },
            }}
          />
          
          <SessionExpiredModal 
            isOpen={showSessionExpiredModal} 
            onLogin={() => {
              hideSessionExpired();
              useAuthStore.getState().logout();
              window.location.href = '/login';
            }} 
          />
          
          <Routes>
            {/* Публичные страницы */}
            <Route path="/login" element={<Login />} />
            <Route path="/interview/:sessionId" element={<InterviewSession />} />
            
            {/* Основные роуты с условным Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="vacancies" element={<VacancyList />} />
              <Route path="vacancies/create" element={<VacancyCreate />} />
              <Route path="interviews" element={<InterviewList />} />
              <Route path="interviews/create" element={<InterviewCreate />} />
              <Route path="reports" element={<Reports />} />
              <Route path="account" element={<Account />} />
              <Route path="team" element={<Team />} />
              <Route path="branding" element={<Branding />} />
              <Route path="tariffs" element={<Tariffs />} />
              <Route path="questions/:positionId" element={<Questions />} />
              
              {/* Условные роуты для новой версии */}
              {!isLegacy && (
                <>
                  <Route path="editor" element={<EditorLayout />} />
                  <Route path="elabs/:sessionId" element={<ElabsSession />} />
                  <Route path="voice-test" element={<SpeechToSpeechTest />} />
                </>
              )}
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
```

---

## 📁 СТРУКТУРА ФАЙЛОВ

### Общие файлы (70% кода):
```
src/
├── components/              # Общие компоненты
│   ├── Layout.tsx          # Умный Layout с переключением
│   ├── Dashboard.tsx       # Общий Dashboard
│   ├── VacancyList.tsx     # Общий список вакансий
│   ├── InterviewList.tsx   # Общий список интервью
│   └── ...
├── pages/                   # Общие страницы
├── services/                # Общие сервисы
├── utils/                   # Общие утилиты
├── store/                   # Общие стейты
└── config/                  # Конфигурация
```

### Специфичные файлы (30% кода):
```
src/
├── legacy/                  # Только для старой версии
│   ├── services/
│   │   └── legacyApiService.ts  # Старый API
│   └── components/
│       └── SimpleLayout.tsx     # Простой Layout
└── new/                     # Только для новой версии
    ├── services/
    │   └── elevenLabsService.ts # ElevenLabs интеграция
    └── components/
        └── EditorLayout.tsx     # Сложный Layout
```

---

## 🚀 ПРЕИМУЩЕСТВА

### ✅ Экономия кода:
- **70% общего кода** не дублируется
- **30% специфичного кода** в отдельных папках
- **Легкая поддержка** общих компонентов

### ✅ Гибкость:
- **Простое переключение** между версиями
- **Условная загрузка** компонентов
- **Настройка по ролям** и URL

### ✅ Производительность:
- **Меньший размер** бандла
- **Ленивая загрузка** специфичных компонентов
- **Кэширование** общих компонентов

---

## 📋 ПЛАН РЕАЛИЗАЦИИ

### Этап 1: Создание конфигурации (30 мин)
- [ ] Создать `src/config/version.ts`
- [ ] Создать `src/config/legacy.ts`
- [ ] Создать `src/config/new.ts`

### Этап 2: Умные сервисы (1 час)
- [ ] Обновить `src/services/apiService.ts`
- [ ] Создать условные импорты
- [ ] Добавить проверки версий

### Этап 3: Умные компоненты (1 час)
- [ ] Обновить `src/components/Layout.tsx`
- [ ] Добавить условный рендеринг
- [ ] Создать переключатели

### Этап 4: Умный App.tsx (30 мин)
- [ ] Обновить роутинг
- [ ] Добавить условные роуты
- [ ] Настроить переключение версий

### Этап 5: Тестирование (30 мин)
- [ ] Проверить старую версию
- [ ] Проверить новую версию
- [ ] Проверить переключение

---

## 🎯 РЕЗУЛЬТАТ

### После реализации:
1. **Один проект** с двумя версиями
2. **70% общего кода** без дублирования
3. **30% специфичного кода** в отдельных папках
4. **Простое переключение** по ролям/URL
5. **Легкая поддержка** и развитие

### Команды для запуска:
```bash
# Старая версия
npm run start:legacy

# Новая версия
npm run start:new

# По умолчанию (новая)
npm start
```

**Время выполнения: 3-4 часа**
**Сложность: Средняя**
**Экономия кода: 70%** 