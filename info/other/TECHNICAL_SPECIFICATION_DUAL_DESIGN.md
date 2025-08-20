# Техническое задание: Реализация двух дизайнов с разделением по ролям

## 📋 Обзор проекта

### Текущее состояние
- **Сложный дизайн**: EditorLayout с drag-and-drop редактором (стиль Figma/Photoshop)
- **Простой дизайн**: Layout с традиционной навигацией (уже существует в `/old` роутах)
- **Система ролей**: admin, recruiter, viewer
- **Бэкенд**: Поддерживает все роли с фильтрацией данных

### Проблема
Для MVP требуется упрощенный интерфейс для низкоквалифицированной аудитории, при этом сохранив продвинутый дизайн для администраторов.

## 🎯 Цель

Реализовать автоматическое переключение между двумя дизайнами в зависимости от роли пользователя:
- **Администраторы** (`admin`) → Сложный дизайн (EditorLayout)
- **Рекрутеры и наблюдатели** (`recruiter`, `viewer`) → Простой дизайн (Layout)

## 🏗️ Архитектурное решение

### Вариант 1: Разделение по эндпоинтам (РЕКОМЕНДУЕМЫЙ)
```
/admin/* → Сложный дизайн (EditorLayout) - для администраторов
/user/*  → Простой дизайн (Layout) - для рекрутеров и наблюдателей
```

### Вариант 2: Автоматическое переключение
```
/ → Автоматический выбор дизайна на основе роли пользователя
```

## 📐 Детальная спецификация

### 1. Обновление системы роутинга

#### 1.1 Структура роутов
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
  
  {/* Админский интерфейс (сложный дизайн) */}
  <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
    <Route index element={<EditorLayout />} />
    <Route path="dashboard" element={<EditorLayout />} />
    <Route path="editor" element={<EditorLayout />} />
    {/* Все существующие роуты EditorLayout */}
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
    {/* Существующие роуты для совместимости */}
  </Route>
</Routes>
```

#### 1.2 Компонент автоматического перенаправления
```typescript
// src/components/RoleBasedRedirect.tsx
import React, { useEffect } from 'react';
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

### 2. Обновление системы аутентификации

#### 2.1 Расширение типов ролей
```typescript
// src/store/authStore.ts
export type UserRole = 'admin' | 'recruiter' | 'viewer' | 'CANDIDATE' | null;

interface AuthState {
  // ... существующие поля
  userRole: UserRole;
  isAdmin: boolean;
  isRecruiter: boolean;
  isViewer: boolean;
  redirectToAppropriateInterface: () => void;
}
```

#### 2.2 Хуки для проверки ролей
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

### 3. Создание новых Layout компонентов

#### 3.1 AdminLayout (для сложного дизайна)
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

#### 3.2 UserLayout (для простого дизайна)
```typescript
// src/components/UserLayout.tsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRoleAccess } from '../hooks/useRoleAccess';
import Layout from './Layout'; // Используем существующий простой Layout

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

### 4. Адаптация существующих компонентов

#### 4.1 Обновление Layout.tsx
```typescript
// src/components/Layout.tsx
// Удалить проверки ролей, оставить только базовую навигацию
// Добавить условное отображение пунктов меню на основе ролей

const Layout: React.FC = () => {
  const { isAuth, logout, user: currentUser } = useAuthStore();
  const { canManageTeam, canManageSettings } = useRoleAccess();
  
  // ... существующий код
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-gray-200">
        {/* ... существующий код */}
        
        <nav className="flex-1 py-4 px-2 space-y-1">
          {/* Базовые пункты меню для всех ролей */}
          <Link to="/user/vacancies" className="...">Вакансии</Link>
          <Link to="/user/interviews" className="...">Интервью</Link>
          <Link to="/user/reports" className="...">Отчеты</Link>
          
          {/* Пункты меню только для администраторов */}
          {canManageTeam && (
            <Link to="/user/team" className="...">Команда</Link>
          )}
          
          {canManageSettings && (
            <>
              <Link to="/user/branding" className="...">Брендинг</Link>
              <Link to="/user/tariffs" className="...">Тарифы</Link>
            </>
          )}
        </nav>
      </aside>
      
      {/* ... остальной код */}
    </div>
  );
};
```

#### 4.2 Обновление страниц для простого дизайна
```typescript
// src/pages/UserDashboard.tsx (упрощенная версия Dashboard)
import React from 'react';
import { useRoleAccess } from '../hooks/useRoleAccess';

const UserDashboard: React.FC = () => {
  const { isRecruiter, isViewer } = useRoleAccess();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
          <p className="text-gray-600">
            {isRecruiter ? 'Управление вашими вакансиями и интервью' : 'Просмотр статистики и отчетов'}
          </p>
        </div>
        
        {isRecruiter && (
          <div className="flex gap-3">
            <Link to="/user/vacancies/create" className="btn-primary">
              Создать вакансию
            </Link>
            <Link to="/user/interviews/create" className="btn-secondary">
              Создать интервью
            </Link>
          </div>
        )}
      </div>
      
      {/* Упрощенные виджеты без drag-and-drop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Активные вакансии" value={12} />
        <StatCard title="Интервью сегодня" value={5} />
        <StatCard title="Кандидаты" value={28} />
      </div>
      
      {/* Простой список вакансий */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Последние вакансии</h2>
        <VacancyList simplified={true} />
      </div>
    </div>
  );
};
```

### 5. Создание упрощенных компонентов

#### 5.1 Упрощенные виджеты
```typescript
// src/components/widgets/SimpleVacancyList.tsx
import React from 'react';
import { useRoleAccess } from '../../hooks/useRoleAccess';

interface SimpleVacancyListProps {
  simplified?: boolean;
}

const SimpleVacancyList: React.FC<SimpleVacancyListProps> = ({ simplified = false }) => {
  const { isRecruiter } = useRoleAccess();
  
  return (
    <div className="space-y-4">
      {vacancies.map(vacancy => (
        <div key={vacancy.id} className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{vacancy.title}</h3>
              <p className="text-sm text-gray-600">{vacancy.company}</p>
            </div>
            
            {isRecruiter && !simplified && (
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-800">Редактировать</button>
                <button className="text-red-600 hover:text-red-800">Удалить</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
```

#### 5.2 Упрощенные формы
```typescript
// src/components/SimpleVacancyForm.tsx
import React from 'react';
import { useRoleAccess } from '../hooks/useRoleAccess';

const SimpleVacancyForm: React.FC = () => {
  const { isRecruiter } = useRoleAccess();
  
  if (!isRecruiter) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">У вас нет прав для создания вакансий</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Создать вакансию</h1>
      
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название вакансии
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Введите название вакансии"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Описание
          </label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Опишите требования к кандидату"
          />
        </div>
        
        <div className="flex gap-4">
          <button type="submit" className="btn-primary">
            Создать вакансию
          </button>
          <button type="button" className="btn-secondary">
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
```

### 6. Обновление навигации и меню

#### 6.1 Переключатель интерфейсов
```typescript
// src/components/InterfaceSwitcher.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRoleAccess } from '../hooks/useRoleAccess';

const InterfaceSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { isAdmin } = useRoleAccess();
  
  const isInAdminInterface = location.pathname.startsWith('/admin');
  const isInUserInterface = location.pathname.startsWith('/user');
  
  if (!isAdmin) return null; // Только администраторы могут переключаться
  
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
      <button
        onClick={() => navigate('/user')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          isInUserInterface
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Простой интерфейс
      </button>
      
      <button
        onClick={() => navigate('/admin')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          isInAdminInterface
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Продвинутый интерфейс
      </button>
    </div>
  );
};
```

### 7. Обновление системы уведомлений

#### 7.1 Ролевые уведомления
```typescript
// src/components/RoleBasedNotifications.tsx
import React from 'react';
import { useRoleAccess } from '../hooks/useRoleAccess';

const RoleBasedNotifications: React.FC = () => {
  const { isAdmin, isRecruiter, isViewer } = useRoleAccess();
  
  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-900 font-medium">Администратор</h3>
          <p className="text-blue-700 text-sm">
            У вас есть доступ ко всем функциям системы, включая продвинутый редактор интерфейса.
          </p>
        </div>
      )}
      
      {isRecruiter && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-900 font-medium">Рекрутер</h3>
          <p className="text-green-700 text-sm">
            Вы можете создавать и управлять вакансиями, проводить интервью.
          </p>
        </div>
      )}
      
      {isViewer && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-gray-900 font-medium">Наблюдатель</h3>
          <p className="text-gray-700 text-sm">
            У вас есть доступ только для просмотра данных и отчетов.
          </p>
        </div>
      )}
    </div>
  );
};
```

## 🔧 Техническая реализация

### 1. Этапы разработки

#### Этап 1: Подготовка (1-2 дня)
- [ ] Создать новые типы и интерфейсы
- [ ] Обновить систему ролей в authStore
- [ ] Создать хуки для проверки доступа

#### Этап 2: Роутинг (2-3 дня)
- [ ] Создать RoleBasedRedirect компонент
- [ ] Обновить App.tsx с новыми роутами
- [ ] Создать AdminLayout и UserLayout
- [ ] Протестировать перенаправления

#### Этап 3: Простой интерфейс (3-4 дня)
- [ ] Адаптировать существующий Layout.tsx
- [ ] Создать упрощенные версии страниц
- [ ] Создать упрощенные компоненты виджетов
- [ ] Добавить ролевые ограничения

#### Этап 4: Интеграция (2-3 дня)
- [ ] Добавить переключатель интерфейсов
- [ ] Обновить навигацию
- [ ] Добавить ролевые уведомления
- [ ] Протестировать все сценарии

#### Этап 5: Тестирование (2-3 дня)
- [ ] Тестирование с разными ролями
- [ ] Проверка перенаправлений
- [ ] Тестирование ограничений доступа
- [ ] Проверка совместимости

### 2. Файловая структура

```
src/
├── components/
│   ├── layouts/
│   │   ├── AdminLayout.tsx
│   │   ├── UserLayout.tsx
│   │   └── RoleBasedRedirect.tsx
│   ├── widgets/
│   │   ├── SimpleVacancyList.tsx
│   │   ├── SimpleInterviewList.tsx
│   │   └── SimpleStatsWidget.tsx
│   └── InterfaceSwitcher.tsx
├── hooks/
│   └── useRoleAccess.ts
├── pages/
│   ├── user/
│   │   ├── UserDashboard.tsx
│   │   ├── UserVacancyList.tsx
│   │   └── UserInterviewList.tsx
│   └── admin/
│       └── AdminDashboard.tsx
└── store/
    └── authStore.ts (обновленный)
```

### 3. Конфигурация

#### 3.1 Переменные окружения
```env
# .env
REACT_APP_ENABLE_DUAL_DESIGN=true
REACT_APP_DEFAULT_INTERFACE=user
REACT_APP_ADMIN_INTERFACE=admin
```

#### 3.2 Конфигурация ролей
```typescript
// src/config/roles.ts
export const ROLE_CONFIG = {
  admin: {
    interface: 'admin',
    features: ['all'],
    redirectTo: '/admin'
  },
  recruiter: {
    interface: 'user',
    features: ['create', 'edit', 'view'],
    redirectTo: '/user'
  },
  viewer: {
    interface: 'user',
    features: ['view'],
    redirectTo: '/user'
  }
};
```

## 🎨 Дизайн и UX

### 1. Простой интерфейс (для рекрутеров и наблюдателей)

#### Принципы дизайна:
- **Минимализм**: Только необходимые элементы
- **Интуитивность**: Понятная навигация
- **Консистентность**: Единый стиль всех элементов
- **Доступность**: WCAG 2.1 AA стандарты

#### Цветовая схема:
```css
/* Простая палитра */
--primary: #FF6600;
--secondary: #6B7280;
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--background: #F9FAFB;
--surface: #FFFFFF;
--text-primary: #111827;
--text-secondary: #6B7280;
```

#### Типографика:
- **Заголовки**: 24px, 20px, 18px
- **Текст**: 16px, 14px
- **Мелкий текст**: 12px
- **Шрифт**: Segoe UI, система

### 2. Продвинутый интерфейс (для администраторов)

#### Сохраняется текущий дизайн:
- Drag-and-drop редактор
- Множественные панели
- Продвинутые виджеты
- Профессиональные инструменты

## 🔒 Безопасность

### 1. Проверки ролей
- Все компоненты проверяют роли на клиенте
- Дополнительные проверки на сервере
- Защита от несанкционированного доступа

### 2. Перенаправления
- Автоматические перенаправления при смене ролей
- Защита от прямого доступа к неразрешенным роутам
- Логирование попыток несанкционированного доступа

## 📊 Мониторинг и аналитика

### 1. Отслеживание использования
```typescript
// src/utils/analytics.ts
export const trackInterfaceUsage = (role: string, interface: string) => {
  analytics.track('interface_used', {
    role,
    interface,
    timestamp: new Date().toISOString()
  });
};
```

### 2. Метрики производительности
- Время загрузки каждого интерфейса
- Использование функций по ролям
- Ошибки и их частота

## 🚀 Развертывание

### 1. Поэтапное развертывание
1. **Фаза 1**: Развертывание простого интерфейса для тестирования
2. **Фаза 2**: Включение автоматического переключения
3. **Фаза 3**: Полное развертывание для всех пользователей

### 2. Откат
- Возможность быстрого отключения новой системы
- Сохранение старых роутов для совместимости
- A/B тестирование интерфейсов

## 📝 Документация

### 1. Пользовательская документация
- Руководство по использованию простого интерфейса
- Сравнение возможностей интерфейсов
- FAQ по часто задаваемым вопросам

### 2. Техническая документация
- Архитектура системы
- API документация
- Руководство по развертыванию

## ✅ Критерии приемки

### Функциональные требования:
- [ ] Автоматическое перенаправление по ролям
- [ ] Работающий простой интерфейс для рекрутеров
- [ ] Работающий сложный интерфейс для администраторов
- [ ] Переключатель интерфейсов для администраторов
- [ ] Ролевые ограничения доступа

### Нефункциональные требования:
- [ ] Время загрузки < 2 секунд
- [ ] Совместимость с современными браузерами
- [ ] Адаптивность для мобильных устройств
- [ ] Соответствие WCAG 2.1 AA

### Тестирование:
- [ ] Unit тесты для всех компонентов
- [ ] Integration тесты для роутинга
- [ ] E2E тесты для пользовательских сценариев
- [ ] Тестирование производительности

## 🎯 Результат

После реализации данного технического задания система будет иметь:

1. **Два отдельных интерфейса** с автоматическим переключением по ролям
2. **Упрощенный интерфейс** для рекрутеров и наблюдателей
3. **Продвинутый интерфейс** для администраторов
4. **Гибкую систему ролей** с четкими ограничениями доступа
5. **Возможность масштабирования** для добавления новых ролей и интерфейсов

Это решение позволит удовлетворить потребности как опытных пользователей, так и новичков, обеспечивая оптимальный пользовательский опыт для каждой категории пользователей. 