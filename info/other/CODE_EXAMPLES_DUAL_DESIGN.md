# Примеры кода: Реализация двух дизайнов

## 🚀 Быстрая реализация

### 1. Основные файлы для создания

#### 1.1 Хук для проверки ролей
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

#### 1.2 Компонент перенаправления
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

#### 1.3 Layout компоненты
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

### 2. Обновление App.tsx

```typescript
// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import CandidateLayout from './components/CandidateLayout';
import AdminLayout from './components/AdminLayout';
import UserLayout from './components/UserLayout';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/user/UserDashboard';
import VacancyCreate from './pages/VacancyCreate';
import VacancyList from './pages/VacancyList';
import UserVacancyList from './pages/user/UserVacancyList';
import UserVacancyCreate from './pages/user/UserVacancyCreate';
import InterviewCreate from './pages/InterviewCreate';
import InterviewList from './pages/InterviewList';
import UserInterviewList from './pages/user/UserInterviewList';
import UserInterviewCreate from './pages/user/UserInterviewCreate';
import InterviewSession from './pages/InterviewSession';
import ElabsSession from './pages/ElabsSession';
import ElevenLabsTest from './components/ElevenLabsTest';
import SpeechToSpeechTest from './components/SpeechToSpeechTest';
import TestPage from './pages/TestPage';
import InterviewEntryForm from './pages/InterviewEntryForm';
import InterviewEntryDemo from './pages/InterviewEntryDemo';
import Reports from './pages/Reports';
import UserReports from './pages/user/UserReports';
import Login from './pages/Login';
import Account from './pages/Account';
import UserAccount from './pages/user/UserAccount';
import Team from './pages/Team';
import UserTeam from './pages/user/UserTeam';
import Branding from './pages/Branding';
import UserBranding from './pages/user/UserBranding';
import Tariffs from './pages/Tariffs';
import UserTariffs from './pages/user/UserTariffs';
import Questions from './pages/Questions';
import { ThemeProvider } from './components/ThemeProvider';
import EditorLayout from './components/EditorLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import SessionExpiredModal from './components/SessionExpiredModal';

function App() {
  const { restoreSession, showSessionExpiredModal, hideSessionExpired } = useAuthStore();

  useEffect(() => {
    restoreSession().catch(error => {
      console.error('Failed to restore session:', error);
    });
  }, [restoreSession]);

  const handleSessionExpiredLogin = () => {
    hideSessionExpired();
    useAuthStore.getState().logout();
    window.location.href = '/login';
  };

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
                fontFamily: 'inherit',
              },
            }}
            containerStyle={{
              zIndex: 10001,
            }}
          />
          
          <SessionExpiredModal 
            isOpen={showSessionExpiredModal} 
            onLogin={handleSessionExpiredLogin} 
          />
          
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
            </Route>
            
            {/* Пользовательский интерфейс (простой дизайн) */}
            <Route path="/user" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
              <Route index element={<UserDashboard />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="vacancies" element={<UserVacancyList />} />
              <Route path="vacancies/create" element={<UserVacancyCreate />} />
              <Route path="vacancies/:id/edit" element={<UserVacancyCreate />} />
              <Route path="vacancies/:id" element={<UserVacancyCreate />} />
              <Route path="interviews" element={<UserInterviewList />} />
              <Route path="interviews/create" element={<UserInterviewCreate />} />
              <Route path="reports" element={<UserReports />} />
              <Route path="account" element={<UserAccount />} />
              <Route path="team" element={<UserTeam />} />
              <Route path="branding" element={<UserBranding />} />
              <Route path="tariffs" element={<UserTariffs />} />
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
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
```

### 3. Упрощенные страницы для пользователей

#### 3.1 UserDashboard
```typescript
// src/pages/user/UserDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, TrendingUp, Users } from 'lucide-react';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { useDashboardData } from '../../hooks/usePageData';

const UserDashboard: React.FC = () => {
  const { isRecruiter, isViewer } = useRoleAccess();
  const { positions, interviews, stats, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
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
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать вакансию
            </Link>
            <Link 
              to="/user/interviews/create" 
              className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
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
              <Users className="w-6 h-6 text-purple-600" />
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
                <h3 className="font-medium text-gray-900">
                  <Link 
                    to={`/user/vacancies/${position.id}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {position.title}
                  </Link>
                </h3>
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
                  className="text-primary-600 hover:text-primary-800 text-sm transition-colors"
                >
                  Просмотр
                </Link>
              </div>
            </div>
          ))}
          
          {positions?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Вакансии не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
```

#### 3.2 UserVacancyList
```typescript
// src/pages/user/UserVacancyList.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Eye } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-500">Загрузка вакансий...</div>
      </div>
    );
  }

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
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
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
            <div key={position.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    <Link 
                      to={`/user/vacancies/${position.id}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {position.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{position.company}</p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{position.description}</p>
                  
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
                  
                  <div className="flex gap-1">
                    <Link 
                      to={`/user/vacancies/${position.id}`}
                      className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Просмотр"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    
                    {isRecruiter && (
                      <Link 
                        to={`/user/vacancies/${position.id}/edit`}
                        className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
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

### 4. Обновление существующего Layout

```typescript
// src/components/Layout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BarChart2,
  Users,
  User,
  LogOut,
  Plus,
  Palette,
  CreditCard,
  Sun,
  Moon,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { useAuthStore } from '../store/authStore';
import { useRoleAccess } from '../hooks/useRoleAccess';
import toast from 'react-hot-toast';
import { useTheme } from './ThemeProvider';
import UserModal from './UserModal';
import InterfaceSwitcher from './InterfaceSwitcher';

interface UserInfo {
  email: string;
  language: string;
}

const Layout: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const { isAuth, logout, user: currentUser } = useAuthStore();
  const { canManageTeam, canManageSettings } = useRoleAccess();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const fetchData = async () => {
    try {
      const user = await apiService.getAccount();
      setUserInfo({
        email: user.email || '',
        language: user.language || 'Русский',
      });
    } catch (error: any) {
      console.error('Error loading user data:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate, isAuth, logout]);

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

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  if (isAuth === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Проверка аутентификации...</div>
      </div>
    );
  }

  if (!isAuth) {
    return null;
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
              onClick={async () => {
                try {
                  logout();
                  toast.success('Выход выполнен успешно');
                  navigate('/login');
                } catch (error: any) {
                  console.error('Error logging out:', error);
                  toast.error('Ошибка при выходе');
                  navigate('/login');
                }
              }}
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
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => {
              console.log('Mobile menu not implemented yet');
            }}
          >
            <Plus className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
              
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

export default Layout;
```

### 5. Переключатель интерфейсов

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

### 1. Создать тестовые данные
```typescript
// src/utils/testData.ts
export const testUsers = {
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

export const testPositions = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Tech Corp',
    status: 'active',
    candidatesCount: 12,
    interviewsCount: 5,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'Startup Inc',
    status: 'active',
    candidatesCount: 8,
    interviewsCount: 3,
    createdAt: '2024-01-10'
  }
];
```

### 2. Тестовые сценарии
```typescript
// src/utils/testScenarios.ts
export const testScenarios = [
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
  }
];
```

## 🚀 Быстрый запуск

### 1. Создать все необходимые файлы
```bash
# Создать папки
mkdir -p src/hooks
mkdir -p src/components/layouts
mkdir -p src/pages/user

# Создать файлы
touch src/hooks/useRoleAccess.ts
touch src/components/RoleBasedRedirect.tsx
touch src/components/AdminLayout.tsx
touch src/components/UserLayout.tsx
touch src/components/InterfaceSwitcher.tsx
touch src/pages/user/UserDashboard.tsx
touch src/pages/user/UserVacancyList.tsx
```

### 2. Скопировать код из примеров выше

### 3. Обновить App.tsx

### 4. Запустить проект
```bash
npm start
```

### 5. Протестировать с разными ролями

После выполнения всех шагов у вас будет полностью функциональная система с двумя дизайнами, автоматическим переключением по ролям и всеми необходимыми компонентами. 