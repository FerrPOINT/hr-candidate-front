# HR Recruiter - Строгий профессиональный дизайн

## 🎯 Основные принципы

### 1. Фиксированные размеры и отступы
- **Базовые отступы**: 8px, 16px, 24px, 32px, 48px
- **Высота элементов**: кнопки (32px, 40px, 48px), поля ввода (40px), карточки (минимум 120px)
- **Максимальная ширина**: 1280px (max-w-7xl)
- **Межколоночные отступы**: 32px

### 2. Строгая типографика
- **Заголовки**: H1 (32px), H2 (24px), H3 (20px)
- **Текст**: Body (16px), Caption (14px)
- **Межстрочные интервалы**: 1.4 для заголовков, 1.5 для текста
- **Ограничение ширины строки**: максимум 70-80 символов

### 3. Консистентная цветовая система
```css
/* Основные цвета */
--primary-500: #FF6600 (оранжевый)
--primary-600: #E65C00 (темно-оранжевый)

/* Нейтральные оттенки */
--gray-50: #F9FAFB (светло-серый фон)
--gray-100: #F3F4F6 (серый фон)
--gray-200: #E5E7EB (светлая граница)
--gray-300: #D1D5DB (граница)
--gray-400: #9CA3AF (плейсхолдер)
--gray-500: #6B7280 (вторичный текст)
--gray-600: #4B5563 (основной текст)
--gray-700: #374151 (заголовки)
--gray-800: #1F2937 (темные заголовки)
--gray-900: #111827 (очень темный текст)

/* Семантические цвета */
--success: #10B981 (зеленый)
--warning: #F59E0B (желтый)
--error: #EF4444 (красный)
--info: #3B82F6 (синий)
```

## 📐 Компоненты с фиксированными размерами

### 1. Статистические карточки (StatCard)
```tsx
<StatCard
  title="Active Positions"
  value={12}
  change={{ value: 8, isPositive: true }}
  icon={<BriefcaseIcon className="w-6 h-6" />}
  color="orange"
  size="md" // sm, md, lg
/>
```

**Фиксированные размеры:**
- **sm**: высота 128px, отступы 16px
- **md**: высота 160px, отступы 24px  
- **lg**: высота 192px, отступы 32px

### 2. Карточки списков (ListCard)
```tsx
<ListCard 
  title="Active Positions" 
  maxHeight="max-h-96"
  actions={<StrictButton>View All</StrictButton>}
>
  <VacancyList />
</ListCard>
```

**Фиксированные размеры:**
- **Отступы**: 24px (md), 32px (lg)
- **Максимальная высота**: настраивается через maxHeight
- **Скролл**: автоматический при переполнении

### 3. Строгие кнопки (StrictButton)
```tsx
<StrictButton
  variant="primary" // primary, secondary, outline, ghost, danger
  size="md" // sm, md, lg, xl
  loading={false}
  fullWidth={false}
  icon={<PlusIcon />}
  iconPosition="left" // left, right
>
  Create Position
</StrictButton>
```

**Фиксированные размеры:**
- **sm**: 32px высота, 12px/6px отступы
- **md**: 40px высота, 16px/8px отступы
- **lg**: 48px высота, 24px/12px отступы
- **xl**: 56px высота, 32px/16px отступы

### 4. Строгие поля ввода (StrictInput)
```tsx
<StrictInput
  label="Position Title"
  placeholder="Enter position title"
  value={title}
  onChange={setTitle}
  required={true}
  size="md" // sm, md, lg
  icon={<BriefcaseIcon />}
  error={errors.title}
/>
```

**Фиксированные размеры:**
- **sm**: 32px высота, 12px/6px отступы
- **md**: 40px высота, 16px/8px отступы
- **lg**: 48px высота, 24px/12px отступы

### 5. Строгие бейджи (StrictBadge)
```tsx
<StrictBadge
  variant="success" // default, success, warning, error, info
  size="md" // sm, md, lg
>
  Active
</StrictBadge>
```

**Фиксированные размеры:**
- **sm**: 16px/4px отступы, 12px шрифт
- **md**: 20px/8px отступы, 14px шрифт
- **lg**: 24px/12px отступы, 16px шрифт

## 🏗️ Строгая структура страниц

### 1. Макет Dashboard
```tsx
<div className="min-h-screen bg-gray-50">
  <div className="max-w-7xl mx-auto px-6 py-8">
    {/* Заголовок с фиксированной высотой */}
    <div className="mb-8 h-16 flex flex-col justify-center">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600 mt-2">Overview of your recruitment activities</p>
    </div>

    {/* 12-колоночная сетка */}
    <div className="grid grid-cols-12 gap-8">
      {/* Левая колонка - 8 колонок */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        {/* Статистические карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard ... />
        </div>
        
        {/* Лента активности */}
        <ListCard title="Recent Activity" maxHeight="max-h-96">
          <ActivityFeed />
        </ListCard>
      </div>

      {/* Правая колонка - 4 колонки */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <ListCard title="Active Positions" maxHeight="max-h-96">
          <VacancyList />
        </ListCard>
      </div>
    </div>
  </div>
</div>
```

### 2. Адаптивность с сохранением строгости
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

// Статистические карточки
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
  {/* Карточки */}
</div>
```

## 📋 Строгие таблицы и списки

### 1. Таблица с фиксированными размерами
```tsx
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
          {/* Другие заголовки */}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {/* Строки таблицы */}
      </tbody>
    </table>
  </div>
</div>
```

### 2. Список с фиксированной высотой элементов
```tsx
<div className="space-y-3">
  {items.map((item) => (
    <div
      key={item.id}
      className="p-4 rounded-lg border cursor-pointer transition-colors h-20 flex items-center"
    >
      {/* Содержимое элемента */}
    </div>
  ))}
</div>
```

## 🎨 Строгие стили и анимации

### 1. Переходы и анимации
```css
/* Базовые переходы */
.transition-colors { transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out; }
.transition-all { transition: all 0.2s ease-in-out; }

/* Hover эффекты */
.hover:bg-gray-50:hover { background-color: #F9FAFB; }
.hover:border-gray-300:hover { border-color: #D1D5DB; }
.hover:shadow-md:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }

/* Focus состояния */
.focus:ring-2:focus { box-shadow: 0 0 0 2px rgba(255, 102, 0, 0.5); }
.focus:outline-none:focus { outline: none; }
```

### 2. Состояния загрузки
```tsx
// Спиннер с фиксированным размером
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>

// Состояние disabled
<button disabled className="opacity-50 cursor-not-allowed">
  Loading...
</button>
```

## 📱 Адаптивность и мобильная версия

### 1. Брейкпоинты
```css
/* Tailwind CSS брейкпоинты */
sm: 640px   /* Планшеты */
md: 768px   /* Малые десктопы */
lg: 1024px  /* Средние десктопы */
xl: 1280px  /* Большие десктопы */
2xl: 1536px /* Очень большие экраны */
```

### 2. Мобильная адаптация
```tsx
// На мобильных - одна колонка
<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
  <div className="lg:col-span-8 space-y-6 lg:space-y-8">
    {/* Контент */}
  </div>
  <div className="lg:col-span-4 space-y-6">
    {/* Сайдбар уходит вниз */}
  </div>
</div>

// Карточки в одну колонку на мобильных
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
  {/* Карточки */}
</div>
```

## 🔧 Рекомендации по реализации

### 1. Использование компонентов
- Всегда используйте `StrictCard`, `StrictButton`, `StrictInput` вместо кастомных стилей
- Придерживайтесь фиксированных размеров (sm, md, lg, xl)
- Используйте консистентные отступы и высоты

### 2. Типографика
- Максимум 2-3 размера шрифта на странице
- Используйте семантические заголовки (h1, h2, h3)
- Ограничивайте ширину строки для читаемости

### 3. Цвета и контраст
- Используйте только определенные цвета из палитры
- Обеспечивайте достаточный контраст (WCAG AA)
- Применяйте семантические цвета для статусов

### 4. Пространство и выравнивание
- Используйте консистентные отступы (8px, 16px, 24px, 32px, 48px)
- Выравнивайте элементы по базовой линии
- Применяйте 12-колоночную сетку для сложных макетов

### 5. Интерактивность
- Всегда добавляйте hover и focus состояния
- Используйте плавные переходы (0.2s)
- Показывайте состояния загрузки

## 📊 Примеры использования

### Dashboard с строгим дизайном
- ✅ Фиксированные размеры карточек
- ✅ Консистентные отступы
- ✅ Семантические цвета
- ✅ Адаптивная сетка
- ✅ Профессиональная типографика

### Формы с строгим дизайном
- ✅ Фиксированная высота полей ввода
- ✅ Консистентные отступы между полями
- ✅ Семантические сообщения об ошибках
- ✅ Фиксированные размеры кнопок

### Списки с строгим дизайном
- ✅ Фиксированная высота элементов списка
- ✅ Консистентные отступы
- ✅ Семантические бейджи для статусов
- ✅ Плавные hover эффекты

## 🎯 Ключевые принципы строгого дизайна

1. **Консистентность**: Все элементы следуют единым правилам
2. **Предсказуемость**: Пользователь всегда знает, что ожидать
3. **Читаемость**: Максимальная ясность информации
4. **Эффективность**: Минимум действий для достижения цели
5. **Профессионализм**: Деловой, корпоративный стиль
6. **Фиксированность**: Все размеры и отступы строго определены
7. **Адаптивность**: Сохранение строгости на всех устройствах

Этот подход обеспечивает строгий, профессиональный дизайн без "болтающегося" контента и с четкой структурой всех элементов. 