# ТЗ: Цветные аватары на основе хеша email

## Цель
Заменить фиксированный цвет аватаров на динамически вычисляемый цвет на основе хеша email пользователя для уникальности и визуального разнообразия.

## Текущее состояние
- Все аватары имеют фиксированный цвет `bg-[#cac2ff]` (фиолетовый)
- Используется в 3 местах: хедер, управление командой, список вакансий

## Техническое решение

### 1. Система кеширования цветов
Создать **AvatarColorCache** - мини-кеш для хранения цветов аватаров по email:

```typescript
// utils/avatarColorCache.ts
class AvatarColorCache {
  private static instance: AvatarColorCache;
  private cache = new Map<string, string>();
  
  static getInstance(): AvatarColorCache {
    if (!AvatarColorCache.instance) {
      AvatarColorCache.instance = new AvatarColorCache();
    }
    return AvatarColorCache.instance;
  }
  
  getColor(email: string): string {
    if (this.cache.has(email)) {
      return this.cache.get(email)!;
    }
    
    const color = this.generateColor(email);
    this.cache.set(email, color);
    return color;
  }
  
  private generateColor(email: string): string {
    const hash = email.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 80%)`;
  }
  
  // Очистка кеша при необходимости
  clear(): void {
    this.cache.clear();
  }
  
  // Получение статистики кеша
  getStats(): { size: number; emails: string[] } {
    return {
      size: this.cache.size,
      emails: Array.from(this.cache.keys())
    };
  }
}

export const avatarColorCache = AvatarColorCache.getInstance();
```

### 2. Использование в компонентах
```typescript
// В компонентах аватаров
import { avatarColorCache } from '../utils/avatarColorCache';

const avatarColor = avatarColorCache.getColor(userEmail);
```

### 3. Альтернатива - готовые библиотеки
Если предпочитаете готовые решения:
- **`@uiw/react-color-avatar`** - с встроенным кешированием
- **`react-avatar`** - популярная библиотека с кешем цветов

## Компоненты для обновления

### 1. UserAvatar (хедер)
- Заменить `bg-[#cac2ff]` на динамический цвет
- Добавить email в props

### 2. TeamMemberAvatar (управление командой)  
- Заменить `bg-[#cac2ff]` на динамический цвет
- Добавить email в props

### 3. VacancyCard (список вакансий)
- Заменить встроенный аватар на компонент UserAvatar
- Передавать email исполнителя

## Преимущества решения
- ✅ Уникальный цвет для каждого пользователя
- ✅ Визуальное разнообразие интерфейса
- ✅ Легкая идентификация пользователей
- ✅ **Кеширование цветов** - цвета вычисляются только один раз
- ✅ **Производительность** - нет повторных вычислений при ре-рендерах
- ✅ **Консистентность** - один email = один цвет на всю сессию
- ✅ **Масштабируемость** - кеш растет только с новыми пользователями

## Риски
- ⚠️ Возможны конфликтующие цвета (решается настройкой HSL)
- ⚠️ Нужно обеспечить контрастность текста

## Критерии готовности
- [x] Создан AvatarColorCache с паттерном Singleton
- [x] Все аватары используют кешированные цвета
- [x] Цвета стабильны для одного email на всю сессию
- [x] Сохранена читаемость инициалов (темно-синий текст на светлом фоне)
- [ ] Тесты покрывают кеширование и генерацию цветов
- [x] Кеш работает корректно при множественных вызовах

## Время реализации
**Оценка: 3-5 часов**
- Создание AvatarColorCache: 1 час
- Обновление компонентов: 1-2 часа  
- Тестирование кеширования: 1-2 часа

## Технические детали

### Архитектура кеша
- **Singleton паттерн** - один экземпляр на все приложение
- **Map<string, string>** - email → цвет
- **Приватные методы** - generateColor() скрыт от внешнего доступа
- **Типизация** - полная поддержка TypeScript

### Жизненный цикл
- Кеш создается при первом обращении
- Цвета сохраняются на всю сессию приложения
- Возможность очистки через `clear()` метод
- Статистика через `getStats()` для мониторинга

### Производительность
- **O(1)** - получение цвета из кеша
- **O(n)** - только при первом обращении для нового email
- Память: ~100 байт на email (при 1000 пользователей = ~100KB) 