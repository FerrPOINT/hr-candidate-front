# План реализации: Два дизайна с разделением по ролям

## 🚀 Быстрый старт

### Шаг 1: Создание базовых компонентов (1 день)

#### 1.1 Создать хук для проверки ролей
```typescript
// src/hooks/useRoleAccess.ts
import { useAuthStore } from '../store/authStore';

export const useRoleAccess = () => {
  const { user } = useAuthStore();
  
  return {
    isAdmin: user?.role === 'admin',
    isRecruiter: user?.role === 'recruiter',
    isViewer: user?.role === 'viewer',
    canCreate: user?.role === 'admin' || user?.role === 'recruiter',
    canEdit: user?.role === 'admin' || user?.role === 'recruiter',
    canDelete: user?.role === 'admin',
    canManageTeam: user?.role === 'admin',
    canManageSettings: user?.role === 'admin',
  };
};
```

#### 1.2 Создать компонент перенаправления
```typescript
// src/components/RoleBasedRedirect.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const RoleBasedRedirect: React.FC = () => {
  const { user, isAuth } = useAuthStore();
  
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  // Администраторы → сложный дизайн
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  // Рекрутеры и наблюдатели → простой дизайн
  return <Navigate to="/user" replace />;
};

export default RoleBasedRedirect;
```

### Шаг 2: Обновление роутинга (1 день)

#### 2.1 Обновить App.tsx
```typescript
// src/App.tsx
import RoleBasedRedirect from './components/RoleBasedRedirect';
import AdminLayout from './components/AdminLayout';
import UserLayout from './components/UserLayout';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster />
          <SessionExpiredModal />
          
          <Routes>
            {/* Публичные страницы */}
            <Route path="/login" element={<Login />} />
            <Route path="/interview-entry" element={<InterviewEntryForm />} />
            <Route path="/interview-entry-demo" element={<InterviewEntryDemo />} />
            
            {/* Страницы кандидатов */}
            <Route path="/interview/:sessionId" element={<CandidateLayout><InterviewSession /></CandidateLayout>} />
            <Route path="/elabs/:sessionId" element={<CandidateLayout><ElabsSession /></CandidateLayout>} />
            
            {/* Админский интерфейс (сложный дизайн) */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<EditorLayout />} />
              <Route path="dashboard" element={<EditorLayout />} />
              <Route path="editor" element={<EditorLayout />} />
            </Route>
            
            {/* Пользовательский интерфейс (простой дизайн) */}
            <Route path="/user" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
              <Route index element={<UserDashboard />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="vacancies" element={<UserVacancyList />} />
              <Route path="vacancies/create" element={<UserVacancyCreate />} />
              <Route path="interviews" element={<UserInterviewList />} />
              <Route path="reports" element={<UserReports />} />
              <Route path="account" element={<UserAccount />} />
              <Route path="team" element={<UserTeam />} />
            </Route>
            
            {/* Автоматическое перенаправление */}
            <Route path="/" element={<RoleBasedRedirect />} />
            
            {/* Совместимость со старыми роутами */}
            <Route path="/old" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="vacancies" element={<VacancyList />} />
              <Route path="interviews" element={<InterviewList />} />
              <Route path="reports" element={<Reports />} />
              <Route path="account" element={<Account />} />
              <Route path="team" element={<Team />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}
```

### Шаг 3: Создание Layout компонентов (1 день)

#### 3.1 AdminLayout
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

#### 3.2 UserLayout
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

### Шаг 4: Создание упрощенных страниц (2-3 дня)

#### 4.1 UserDashboard
```typescript
// src/pages/user/UserDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, TrendingUp } from 'lucide-react';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { useDashboardData } from '../../hooks/usePageData';

const UserDashboard: React.FC = () => {
  const { isRecruiter, isViewer } = useRoleAccess();
  const { positions, interviews, stats, loading } = useDashboardData();

  if (loading) {
    return <div className="flex items-center justify-center min-h-96">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
          <p className="text-gray-600">
            {isRecruiter ? 'Управление вашими вакансиями и интервью' : 'Просмотр статистики и отчетов'}
          </p>
        </div>
        
        {isRecruiter && (
          <div className="flex gap-3">
            <Link 
              to="/user/vacancies/create" 
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать вакансию
            </Link>
            <Link 
              to="/user/interviews/create" 
              className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Создать интервью
            </Link>
          </div>
        )}
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Активные вакансии</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activePositions || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Интервью сегодня</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.todayInterviews || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Кандидаты</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalCandidates || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Последние вакансии */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Последние вакансии</h2>
        </div>
        <div className="p-6">
          {positions?.slice(0, 5).map((position: any) => (
            <div key={position.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <h3 className="font-medium text-gray-900">{position.title}</h3>
                <p className="text-sm text-gray-600">{position.company}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  position.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {position.status === 'active' ? 'Активна' : 'Неактивна'}
                </span>
                <Link 
                  to={`/user/vacancies/${position.id}`}
                  className="text-primary-600 hover:text-primary-800 text-sm"
                >
                  Просмотр
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
```

#### 4.2 UserVacancyList
```typescript
// src/pages/user/UserVacancyList.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { useDashboardData } from '../../hooks/usePageData';

const UserVacancyList: React.FC = () => {
  const { isRecruiter } = useRoleAccess();
  const { positions, loading } = useDashboardData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPositions = positions?.filter((position: any) => {
    const matchesSearch = position.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         position.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || position.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Вакансии</h1>
          <p className="text-gray-600">Управление вакансиями и кандидатами</p>
        </div>
        
        {isRecruiter && (
          <Link 
            to="/user/vacancies/create" 
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать вакансию
          </Link>
        )}
      </div>

      {/* Фильтры */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск вакансий..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
              <option value="draft">Черновики</option>
            </select>
          </div>
        </div>
      </div>

      {/* Список вакансий */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Вакансии ({filteredPositions?.length || 0})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredPositions?.map((position: any) => (
            <div key={position.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    <Link 
                      to={`/user/vacancies/${position.id}`}
                      className="hover:text-primary-600"
                    >
                      {position.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{position.company}</p>
                  <p className="text-sm text-gray-500 mt-2">{position.description}</p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm text-gray-600">
                      {position.candidatesCount || 0} кандидатов
                    </span>
                    <span className="text-sm text-gray-600">
                      {position.interviewsCount || 0} интервью
                    </span>
                    <span className="text-sm text-gray-600">
                      Создана {new Date(position.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    position.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : position.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {position.status === 'active' ? 'Активна' : 
                     position.status === 'draft' ? 'Черновик' : 'Неактивна'}
                  </span>
                  
                  {isRecruiter && (
                    <Link 
                      to={`/user/vacancies/${position.id}/edit`}
                      className="text-primary-600 hover:text-primary-800 text-sm"
                    >
                      Редактировать
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPositions?.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">Вакансии не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVacancyList;
```

### Шаг 5: Обновление существующего Layout (1 день)

#### 5.1 Адаптировать Layout.tsx
```typescript
// src/components/Layout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRoleAccess } from '../hooks/useRoleAccess';
import InterfaceSwitcher from './InterfaceSwitcher';

const Layout: React.FC = () => {
  const { isAuth, logout, user: currentUser } = useAuthStore();
  const { canManageTeam, canManageSettings } = useRoleAccess();
  const location = useLocation();
  const navigate = useNavigate();

  // ... существующий код загрузки данных

  const sidebarMenu = [
    { name: 'Дашборд', href: '/user/dashboard', icon: Home },
    { name: 'Вакансии', href: '/user/vacancies', icon: Briefcase },
    { name: 'Интервью', href: '/user/interviews', icon: Calendar },
    { name: 'Отчеты', href: '/user/reports', icon: BarChart2 },
  ];

  // Добавить пункты меню только для администраторов
  if (canManageTeam) {
    sidebarMenu.push({ name: 'Команда', href: '/user/team', icon: Users });
  }

  if (canManageSettings) {
    sidebarMenu.push(
      { name: 'Брендинг', href: '/user/branding', icon: Palette },
      { name: 'Тарифы', href: '/user/tariffs', icon: CreditCard }
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-gray-200 justify-between fixed z-40">
        <div>
          {/* Логотип */}
          <div className="flex items-center h-16 px-6 border-b border-gray-100">
            <Link to="/user" className="flex items-center gap-2 select-none" style={{color: 'var(--wmt-orange)'}}>
              <span className="font-extrabold text-xl tracking-tight">WMT Рекрутер</span>
            </Link>
          </div>
          
          {/* Переключатель интерфейсов (только для админов) */}
          {currentUser?.role === 'admin' && (
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
                    location.pathname.startsWith(item.href)
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary-700'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Аккаунт */}
            <button
              onClick={() => {
                setEditingUser(currentUser);
                setIsUserModalOpen(true);
              }}
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-700 w-full"
            >
              <User className="mr-3 h-5 w-5" />
              Аккаунт
            </button>
            
            {/* Выйти */}
            <button 
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-700 w-full mt-2"
              onClick={logout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Выйти
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {userInfo ? (
                <span className="text-sm text-gray-700 font-medium">{userInfo.email}</span>
              ) : (
                <span className="text-sm text-gray-400">Загрузка...</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>

      {/* Модальные окна */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSuccess={() => {
          fetchData();
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
      />
    </div>
  );
};
```

### Шаг 6: Создание переключателя интерфейсов (1 день)

#### 6.1 InterfaceSwitcher
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
  const isInUserInterface = location.pathname.startsWith('/user');
  
  if (!isAdmin) return null; // Только администраторы могут переключаться
  
  return (
    <div className="bg-gray-50 rounded-lg p-2">
      <div className="text-xs font-medium text-gray-700 mb-2">Интерфейс</div>
      <div className="flex gap-1">
        <button
          onClick={() => navigate('/user')}
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

## 🧪 Тестирование

### 1. Создать тестовые пользователи
```typescript
// Тестовые данные для разных ролей
const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  },
  recruiter: {
    email: 'recruiter@test.com', 
    password: 'password123',
    role: 'recruiter'
  },
  viewer: {
    email: 'viewer@test.com',
    password: 'password123', 
    role: 'viewer'
  }
};
```

### 2. Тестовые сценарии
```typescript
// Тестовые сценарии для проверки
const testScenarios = [
  {
    name: 'Админ входит в систему',
    user: testUsers.admin,
    expectedRedirect: '/admin',
    expectedInterface: 'admin'
  },
  {
    name: 'Рекрутер входит в систему', 
    user: testUsers.recruiter,
    expectedRedirect: '/user',
    expectedInterface: 'user'
  },
  {
    name: 'Наблюдатель входит в систему',
    user: testUsers.viewer, 
    expectedRedirect: '/user',
    expectedInterface: 'user'
  },
  {
    name: 'Админ переключается на простой интерфейс',
    user: testUsers.admin,
    action: () => navigate('/user'),
    expectedAccess: true
  },
  {
    name: 'Рекрутер пытается войти в админский интерфейс',
    user: testUsers.recruiter,
    action: () => navigate('/admin'),
    expectedRedirect: '/user'
  }
];
```

## 🚀 Развертывание

### 1. Поэтапное развертывание
```bash
# Этап 1: Развернуть новые компоненты
git checkout feature/dual-design
npm run build
# Развернуть на staging

# Этап 2: Включить новые роуты
# Обновить конфигурацию nginx
# Добавить новые роуты

# Этап 3: Тестирование
# Протестировать с разными ролями
# Проверить перенаправления

# Этап 4: Продакшн
git merge main
npm run build
# Развернуть на production
```

### 2. Конфигурация nginx
```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /var/www/hr-recruiter-front/build;
        try_files $uri $uri/ /index.html;
    }
    
    # API проксирование
    location /api/ {
        proxy_pass http://backend:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 Мониторинг

### 1. Логирование
```typescript
// src/utils/analytics.ts
export const trackInterfaceUsage = (role: string, interface: string) => {
  console.log(`User with role ${role} using ${interface} interface`);
  
  // Отправка в аналитику
  if (window.gtag) {
    window.gtag('event', 'interface_used', {
      role,
      interface,
      timestamp: new Date().toISOString()
    });
  }
};
```

### 2. Метрики
```typescript
// src/utils/metrics.ts
export const trackPageLoad = (page: string, role: string) => {
  const startTime = performance.now();
  
  window.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    
    console.log(`Page ${page} loaded in ${loadTime}ms for role ${role}`);
  });
};
```

## ✅ Чек-лист завершения

### Функциональность
- [ ] Создан хук useRoleAccess
- [ ] Создан компонент RoleBasedRedirect
- [ ] Обновлен App.tsx с новыми роутами
- [ ] Созданы AdminLayout и UserLayout
- [ ] Созданы упрощенные страницы для пользователей
- [ ] Обновлен Layout.tsx с ролевыми ограничениями
- [ ] Создан InterfaceSwitcher для администраторов

### Тестирование
- [ ] Тестирование с ролью admin
- [ ] Тестирование с ролью recruiter
- [ ] Тестирование с ролью viewer
- [ ] Проверка перенаправлений
- [ ] Проверка ограничений доступа
- [ ] Тестирование переключения интерфейсов

### Развертывание
- [ ] Сборка проекта
- [ ] Тестирование на staging
- [ ] Развертывание на production
- [ ] Мониторинг ошибок
- [ ] Сбор метрик использования

## 🎯 Результат

После выполнения всех шагов у вас будет:

1. **Автоматическое переключение** между интерфейсами по ролям
2. **Упрощенный интерфейс** для рекрутеров и наблюдателей
3. **Продвинутый интерфейс** для администраторов
4. **Гибкая система ролей** с четкими ограничениями
5. **Возможность масштабирования** для новых ролей

Система будет готова к использованию в продакшене и сможет удовлетворить потребности как опытных, так и начинающих пользователей. 