# Техническое задание: Реализация двух дизайнов с разделением по ролям (ИСПРАВЛЕННОЕ)

## 📋 Анализ текущего состояния

### Текущая структура роутинга:
```typescript
// ТЕКУЩЕЕ СОСТОЯНИЕ:
/ → EditorLayout (сложный дизайн) - главная страница
/admin/* → Layout (простой дизайн) - админские страницы  
/old/* → Layout (простой дизайн) - старые роуты для совместимости
```

### Проблема:
- **Главная страница** (`/`) показывает сложный дизайн (EditorLayout)
- **Админские страницы** (`/admin/*`) показывают простой дизайн (Layout)
- **Кнопка "Создать собеседование"** ведет на `/admin/interviews/create` (простой дизайн)
- **Нет четкого разделения** по ролям пользователей

## 🎯 Цель

Реализовать правильное разделение дизайнов:
- **Администраторы** (`admin`) → Сложный дизайн (EditorLayout) для всех страниц
- **Рекрутеры и наблюдатели** (`recruiter`, `viewer`) → Простой дизайн (Layout) для всех страниц

## 🏗️ Архитектурное решение

### Вариант 1: Переименование роутов (РЕКОМЕНДУЕМЫЙ)
```
/ → Автоматическое перенаправление на основе роли
/admin/* → Сложный дизайн (EditorLayout) - для администраторов
/user/* → Простой дизайн (Layout) - для рекрутеров и наблюдателей
/old/* → Оставить для совместимости
```

### Вариант 2: Использование существующих роутов
```
/ → Сложный дизайн (EditorLayout) - для администраторов
/admin/* → Простой дизайн (Layout) - для рекрутеров и наблюдателей
```

## 📐 Детальная спецификация

### 1. Обновление системы роутинга

#### 1.1 Структура роутов (Вариант 1 - РЕКОМЕНДУЕМЫЙ)
```typescript
// src/App.tsx
<Routes>
  {/* Публичные страницы */}
  <Route path="/login" element={<Login />} />
  <Route path="/interview-entry" element={<InterviewEntryForm />} />
  <Route path="/interview-entry-demo" element={<InterviewEntryDemo />} />
  
  {/* Страницы кандидатов */}
  <Route path="/interview/:sessionId" element={<CandidateLayout><InterviewSession /></CandidateLayout>} />
  <Route path="/elabs/:sessionId" element={<CandidateLayout><ElabsSession /></CandidateLayout>} />
  
  {/* Тестовые страницы */}
  <Route path="/elevenlabs-test" element={<ElevenLabsTest />} />
  <Route path="/speech-test" element={<SpeechToSpeechTest />} />
  <Route path="/test" element={<TestPage />} />
  
  {/* Админский интерфейс (сложный дизайн) */}
  <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
    <Route index element={<EditorLayout />} />
    <Route path="dashboard" element={<EditorLayout />} />
    <Route path="editor" element={<EditorLayout />} />
    <Route path="vacancies" element={<EditorLayout />} />
    <Route path="vacancies/create" element={<EditorLayout />} />
    <Route path="vacancies/:id/edit" element={<EditorLayout />} />
    <Route path="vacancies/:id" element={<EditorLayout />} />
    <Route path="interviews" element={<EditorLayout />} />
    <Route path="interviews/create" element={<EditorLayout />} />
    <Route path="reports" element={<EditorLayout />} />
    <Route path="account" element={<EditorLayout />} />
    <Route path="team" element={<EditorLayout />} />
    <Route path="branding" element={<EditorLayout />} />
    <Route path="tariffs" element={<EditorLayout />} />
    <Route path="questions/:positionId" element={<EditorLayout />} />
  </Route>
  
  {/* Пользовательский интерфейс (простой дизайн) */}
  <Route path="/user" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="vacancies" element={<VacancyList />} />
    <Route path="vacancies/create" element={<VacancyCreate />} />
    <Route path="vacancies/:id/edit" element={<VacancyCreate />} />
    <Route path="vacancies/:id" element={<VacancyCreate />} />
    <Route path="interviews" element={<InterviewList />} />
    <Route path="interviews/create" element={<InterviewCreate />} />
    <Route path="reports" element={<Reports />} />
    <Route path="account" element={<Account />} />
    <Route path="team" element={<Team />} />
    <Route path="branding" element={<Branding />} />
    <Route path="tariffs" element={<Tariffs />} />
    <Route path="questions/:positionId" element={<Questions />} />
  </Route>
  
  {/* Автоматическое перенаправление */}
  <Route path="/" element={<RoleBasedRedirect />} />
  
  {/* Совместимость со старыми роутами */}
  <Route path="/old" element={<Layout />}>
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
  </Route>
</Routes>
```

#### 1.2 Структура роутов (Вариант 2 - Использование существующих)
```typescript
// src/App.tsx
<Routes>
  {/* Публичные страницы */}
  <Route path="/login" element={<Login />} />
  <Route path="/interview-entry" element={<InterviewEntryForm />} />
  <Route path="/interview-entry-demo" element={<InterviewEntryDemo />} />
  
  {/* Страницы кандидатов */}
  <Route path="/interview/:sessionId" element={<CandidateLayout><InterviewSession /></CandidateLayout>} />
  <Route path="/elabs/:sessionId" element={<CandidateLayout><ElabsSession /></CandidateLayout>} />
  
  {/* Тестовые страницы */}
  <Route path="/elevenlabs-test" element={<ElevenLabsTest />} />
  <Route path="/speech-test" element={<SpeechToSpeechTest />} />
  <Route path="/test" element={<TestPage />} />
  
  {/* Главная страница с автоматическим выбором дизайна */}
  <Route path="/" element={<ProtectedRoute><RoleBasedLayout /></ProtectedRoute>}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="vacancies" element={<VacancyList />} />
    <Route path="vacancies/create" element={<VacancyCreate />} />
    <Route path="vacancies/:id/edit" element={<VacancyCreate />} />
    <Route path="vacancies/:id" element={<VacancyCreate />} />
    <Route path="interviews" element={<InterviewList />} />
    <Route path="interviews/create" element={<InterviewCreate />} />
    <Route path="reports" element={<Reports />} />
    <Route path="account" element={<Account />} />
    <Route path="team" element={<Team />} />
    <Route path="branding" element={<Branding />} />
    <Route path="tariffs" element={<Tariffs />} />
    <Route path="questions/:positionId" element={<Questions />} />
  </Route>
  
  {/* Админские страницы (сложный дизайн) */}
  <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
    <Route index element={<EditorLayout />} />
    <Route path="dashboard" element={<EditorLayout />} />
    <Route path="editor" element={<EditorLayout />} />
    <Route path="vacancies" element={<EditorLayout />} />
    <Route path="vacancies/create" element={<EditorLayout />} />
    <Route path="vacancies/:id/edit" element={<EditorLayout />} />
    <Route path="vacancies/:id" element={<EditorLayout />} />
    <Route path="interviews" element={<EditorLayout />} />
    <Route path="interviews/create" element={<EditorLayout />} />
    <Route path="reports" element={<EditorLayout />} />
    <Route path="account" element={<EditorLayout />} />
    <Route path="team" element={<EditorLayout />} />
    <Route path="branding" element={<EditorLayout />} />
    <Route path="tariffs" element={<EditorLayout />} />
    <Route path="questions/:positionId" element={<EditorLayout />} />
  </Route>
  
  {/* Совместимость со старыми роутами */}
  <Route path="/old" element={<Layout />}>
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
  </Route>
</Routes>
```

### 2. Создание новых Layout компонентов

#### 2.1 RoleBasedLayout (для Варианта 2)
```typescript
// src/components/RoleBasedLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRoleAccess } from '../hooks/useRoleAccess';
import Layout from './Layout';
import EditorLayout from './EditorLayout';

const RoleBasedLayout: React.FC = () => {
  const { isAuth } = useAuthStore();
  const { isAdmin } = useRoleAccess();
  
  if (!isAuth) {
    return null;
  }
  
  // Администраторы → сложный дизайн
  if (isAdmin) {
    return <EditorLayout />;
  }
  
  // Рекрутеры и наблюдатели → простой дизайн
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default RoleBasedLayout;
```

#### 2.2 AdminLayout (для сложного дизайна)
```typescript
// src/components/AdminLayout.tsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRoleAccess } from '../hooks/useRoleAccess';

const AdminLayout: React.FC = () => {
  const { isAuth } = useAuthStore();
  const { isAdmin } = useRoleAccess();
  
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/user" replace />;
  }
  
  return <Outlet />;
};

export default AdminLayout;
```

#### 2.3 UserLayout (для простого дизайна)
```typescript
// src/components/UserLayout.tsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRoleAccess } from '../hooks/useRoleAccess';
import Layout from './Layout';

const UserLayout: React.FC = () => {
  const { isAuth } = useAuthStore();
  const { isAdmin } = useRoleAccess();
  
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default UserLayout;
```

### 3. Обновление навигации

#### 3.1 Обновление Dashboard.tsx
```typescript
// src/pages/Dashboard.tsx
// Заменить все ссылки с /admin/ на /user/ для простого дизайна
// Или использовать динамические ссылки на основе роли

const Dashboard: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const { isAdmin } = useRoleAccess();
  
  // Определяем базовый путь в зависимости от роли
  const basePath = isAdmin ? '/admin' : '/user';
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
          <p className="text-gray-600">Обзор активности и статистики</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`${basePath}/vacancies/create`}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать вакансию
          </Link>
          <Link
            to={`${basePath}/interviews/create`}
            className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Создать интервью
          </Link>
          {isAdmin && (
            <button
              onClick={() => {
                setEditingUser(null);
                setIsUserModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
            >
              <Users className="w-4 h-4 mr-2" />
              Добавить пользователя
            </button>
          )}
        </div>
      </div>
      
      {/* ... остальной код ... */}
    </div>
  );
};
```

#### 3.2 Обновление VacancyListWidget.tsx
```typescript
// src/components/widgets/VacancyListWidget.tsx
// Заменить навигацию на динамическую

const VacancyListWidget: React.FC<VacancyListWidgetProps> = ({ ... }) => {
  const { isAdmin } = useRoleAccess();
  const navigate = useNavigate();
  
  const basePath = isAdmin ? '/admin' : '/user';
  
  // В кнопке создания собеседования
  <button
    onClick={() => navigate(`${basePath}/interviews/create?position=${selectedPosition.id}`)}
    className="p-1.5 hover:bg-green-100 rounded text-green-600"
    title="Добавить собеседование"
  >
    <Plus className="w-4 h-4" />
  </button>
  
  // В ссылках на вакансии
  <Link 
    to={`${basePath}/vacancies/${position.id}`}
    className="hover:text-primary-600 transition-colors"
  >
    {position.title}
  </Link>
};
```

### 4. Обновление Layout.tsx

#### 4.1 Добавить переключатель интерфейсов
```typescript
// src/components/Layout.tsx
import InterfaceSwitcher from './InterfaceSwitcher';

const Layout: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const { isAdmin } = useRoleAccess();
  
  // ... существующий код ...
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-gray-200 justify-between fixed z-40">
        <div>
          {/* Логотип */}
          <div className="flex items-center h-16 px-6 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2 select-none" style={{color: 'var(--wmt-orange)'}}>
              <span className="font-extrabold text-xl tracking-tight">WMT Рекрутер</span>
            </Link>
          </div>
          
          {/* Переключатель интерфейсов (только для админов) */}
          {isAdmin && (
            <div className="p-4 border-b border-gray-100">
              <InterfaceSwitcher />
            </div>
          )}
          
          {/* Меню */}
          <nav className="flex-1 py-4 px-2 space-y-1">
            {sidebarMenu.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary-700'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* ... остальные пункты меню ... */}
          </nav>
        </div>
      </aside>
      
      {/* ... остальной код ... */}
    </div>
  );
};
```

### 5. Создание переключателя интерфейсов

#### 5.1 InterfaceSwitcher
```typescript
// src/components/InterfaceSwitcher.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRoleAccess } from '../hooks/useRoleAccess';
import { Monitor, Palette } from 'lucide-react';

const InterfaceSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { isAdmin } = useRoleAccess();
  
  const isInAdminInterface = location.pathname.startsWith('/admin');
  const isInUserInterface = location.pathname.startsWith('/user') || location.pathname === '/';
  
  if (!isAdmin) return null; // Только администраторы могут переключаться
  
  return (
    <div className="bg-gray-50 rounded-lg p-2">
      <div className="text-xs font-medium text-gray-700 mb-2">Интерфейс</div>
      <div className="flex gap-1">
        <button
          onClick={() => navigate('/')}
          className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
            isInUserInterface
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="Простой интерфейс"
        >
          <Monitor className="w-3 h-3" />
          Простой
        </button>
        
        <button
          onClick={() => navigate('/admin')}
          className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
            isInAdminInterface
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="Продвинутый интерфейс"
        >
          <Palette className="w-3 h-3" />
          Продвинутый
        </button>
      </div>
    </div>
  );
};

export default InterfaceSwitcher;
```

## 🔧 План реализации

### Этап 1: Подготовка (1 день)
- [ ] Создать хук useRoleAccess
- [ ] Создать компоненты RoleBasedRedirect, AdminLayout, UserLayout
- [ ] Создать InterfaceSwitcher

### Этап 2: Обновление роутинга (1 день)
- [ ] Выбрать вариант реализации (1 или 2)
- [ ] Обновить App.tsx с новыми роутами
- [ ] Протестировать перенаправления

### Этап 3: Обновление навигации (1 день)
- [ ] Обновить Dashboard.tsx с динамическими ссылками
- [ ] Обновить VacancyListWidget.tsx
- [ ] Обновить Layout.tsx с переключателем

### Этап 4: Тестирование (1 день)
- [ ] Тестирование с ролью admin
- [ ] Тестирование с ролью recruiter
- [ ] Тестирование с ролью viewer
- [ ] Проверка переключения интерфейсов

## 🎯 Результат

После реализации:

1. **Администраторы** будут видеть:
   - Главная страница (`/`) → Сложный дизайн (EditorLayout)
   - Админские страницы (`/admin/*`) → Сложный дизайн (EditorLayout)
   - Переключатель интерфейсов для выбора

2. **Рекрутеры и наблюдатели** будут видеть:
   - Главная страница (`/`) → Простой дизайн (Layout)
   - Пользовательские страницы (`/user/*`) → Простой дизайн (Layout)
   - Без переключателя интерфейсов

3. **Кнопка "Создать собеседование"** будет вести на правильный интерфейс в зависимости от роли пользователя.

Это решение обеспечит правильное разделение дизайнов по ролям и решит проблему с навигацией. 