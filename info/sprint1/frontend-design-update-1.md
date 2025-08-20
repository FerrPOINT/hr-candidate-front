# HR Recruiter Frontend - Строгий профессиональный дизайн

## 🎯 Принципы строгого дизайна

### 1. Сетка и выравнивание
- **12-колоночная сетка** для всех страниц
- **Строгое выравнивание** по базовой линии (baseline grid)
- **Консистентные отступы**: 8px, 16px, 24px, 32px, 48px
- **Фиксированные размеры** карточек и блоков

### 2. Типографика
- **Моноширинный подход**: максимум 2-3 размера шрифта на странице
- **Иерархия**: H1 (32px), H2 (24px), H3 (20px), Body (16px), Caption (14px)
- **Межстрочные интервалы**: 1.4 для заголовков, 1.5 для текста
- **Ограничение ширины строки**: максимум 70-80 символов

### 3. Цветовая система
```css
/* Строгая палитра */
:root {
  /* Основные цвета */
  --primary-500: #FF6600;
  --primary-600: #E65C00;
  
  /* Нейтральные */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* Семантические */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
}
```

## 📐 Строгая структура карточек

### 1. Базовый шаблон карточки
```tsx
interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  title, 
  subtitle, 
  children, 
  actions, 
  variant = 'default',
  size = 'md' 
}) => {
  const cardClasses = clsx(
    'bg-white rounded-lg border',
    {
      'shadow-sm border-gray-200': variant === 'default',
      'shadow-md border-gray-300': variant === 'elevated',
      'shadow-none border-gray-300': variant === 'outlined',
      'p-4': size === 'sm',
      'p-6': size === 'md',
      'p-8': size === 'lg',
    }
  );

  return (
    <div className={cardClasses}>
      {(title || subtitle) && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
      {actions && (
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
};
```

### 2. Статистические карточки
```tsx
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, trend }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={clsx(
                'text-sm font-medium',
                change.isPositive ? 'text-success' : 'text-error'
              )}>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-gray-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
```

## 🏗️ Строгая структура Dashboard

### 1. Макет с фиксированными размерами
```tsx
const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Контейнер с максимальной шириной */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Заголовок страницы */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your recruitment activities</p>
        </div>

        {/* Основная сетка */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Левая колонка - 8 колонок */}
          <div className="col-span-8 space-y-8">
            
            {/* Статистические карточки */}
            <div className="grid grid-cols-3 gap-6">
              <StatCard
                title="Active Positions"
                value="12"
                change={{ value: 8, isPositive: true }}
                icon={<BriefcaseIcon className="w-6 h-6 text-primary-500" />}
              />
              <StatCard
                title="Interviews This Week"
                value="24"
                change={{ value: 12, isPositive: true }}
                icon={<UsersIcon className="w-6 h-6 text-primary-500" />}
              />
              <StatCard
                title="Hire Rate"
                value="68%"
                change={{ value: 5, isPositive: true }}
                icon={<TrendingUpIcon className="w-6 h-6 text-primary-500" />}
              />
            </div>

            {/* Лента активности */}
            <Card title="Recent Activity" size="lg">
              <ActivityFeed />
            </Card>
          </div>

          {/* Правая колонка - 4 колонки */}
          <div className="col-span-4 space-y-6">
            
            {/* Список вакансий */}
            <Card title="Active Positions" size="md">
              <VacancyList />
            </Card>

            {/* Детали вакансии */}
            {selectedVacancy && (
              <Card title="Position Details" size="md">
                <VacancyDetails vacancy={selectedVacancy} />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 2. Строгая лента активности
```tsx
interface ActivityItem {
  id: string;
  type: 'interview' | 'application' | 'hiring' | 'position';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
}

const ActivityFeed: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'interview',
      title: 'Interview completed',
      description: 'Frontend Developer position - John Smith',
      timestamp: new Date(),
      user: 'Anna Johnson'
    },
    // ... другие активности
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <ActivityIcon type={activity.type} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
            <div className="flex items-center mt-2 space-x-4">
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </span>
              {activity.user && (
                <span className="text-xs text-gray-500">by {activity.user}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
```

## 📋 Строгие таблицы и списки

### 1. Таблица вакансий
```tsx
const VacancyTable: React.FC<{ vacancies: Position[] }> = ({ vacancies }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Active Positions</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Candidates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vacancies.map((vacancy) => (
              <tr key={vacancy.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{vacancy.title}</div>
                    <div className="text-sm text-gray-500">{vacancy.company}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={vacancy.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vacancy.candidatesCount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(vacancy.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### 2. Строгий список вакансий
```tsx
const VacancyList: React.FC = () => {
  return (
    <div className="space-y-3">
      {vacancies.map((vacancy) => (
        <div
          key={vacancy.id}
          className={clsx(
            'p-4 rounded-lg border cursor-pointer transition-colors',
            selectedVacancy?.id === vacancy.id
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          )}
          onClick={() => setSelectedVacancy(vacancy)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {vacancy.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1">{vacancy.company}</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className="text-xs text-gray-500">
                  {vacancy.candidatesCount || 0} candidates
                </span>
                <StatusBadge status={vacancy.status} size="sm" />
              </div>
            </div>
            <div className="flex-shrink-0 ml-3">
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
```

## 🎨 Строгие компоненты UI

### 1. Кнопки с фиксированными размерами
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled,
  loading
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-sm h-10',
    lg: 'px-6 py-3 text-base h-12'
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <Spinner className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};
```

### 2. Строгие поля ввода
```tsx
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  type = 'text'
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          error
            ? 'border-error focus:ring-error'
            : 'border-gray-300 hover:border-gray-400'
        )}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};
```

## 📱 Адаптивность с сохранением строгости

### 1. Адаптивная сетка
```tsx
// Мобильная версия (1 колонка)
<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
  <div className="lg:col-span-8 space-y-6 lg:space-y-8">
    {/* Контент */}
  </div>
  <div className="lg:col-span-4 space-y-6">
    {/* Сайдбар */}
  </div>
</div>
```

### 2. Адаптивные карточки
```tsx
// Статистические карточки
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
  {/* Карточки */}
</div>
```

## 🎯 Ключевые принципы строгого дизайна

1. **Консистентность**: Все элементы следуют единым правилам
2. **Предсказуемость**: Пользователь всегда знает, что ожидать
3. **Читаемость**: Максимальная ясность информации
4. **Эффективность**: Минимум действий для достижения цели
5. **Профессионализм**: Деловой, корпоративный стиль

## 📐 Размеры и отступы

### Базовые размеры
- **8px** - минимальный отступ
- **16px** - стандартный отступ
- **24px** - средний отступ
- **32px** - большой отступ
- **48px** - очень большой отступ

### Высота элементов
- **Кнопки**: 32px (sm), 40px (md), 48px (lg)
- **Поля ввода**: 40px
- **Карточки**: минимальная высота 120px
- **Строки таблицы**: 64px

### Ширина контейнеров
- **Максимальная ширина**: 1280px (max-w-7xl)
- **Боковые отступы**: 24px на мобильных, 48px на десктопе
- **Межколоночные отступы**: 32px

Этот подход обеспечивает строгий, профессиональный дизайн без "болтающегося" контента и с четкой структурой всех элементов. 