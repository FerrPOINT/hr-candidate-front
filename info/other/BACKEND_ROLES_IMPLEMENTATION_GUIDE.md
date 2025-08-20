# Руководство по реализации ролей для бэкенда

## Обзор системы ролей

### Доступные роли:
- **`admin`** - Администратор (полный доступ)
- **`recruiter`** - Рекрутер (ограниченный доступ)
- **`viewer`** - Наблюдатель (только чтение)

## Ключевые принципы реализации

### 1. Фильтрация данных по ролям

#### Для эндпоинтов списков (GET):
```sql
-- Для admin: все данные
SELECT * FROM positions;

-- Для recruiter/viewer: только свои данные
SELECT * FROM positions WHERE owner_id = :current_user_id;
```

#### Для эндпоинтов по ID:
```sql
-- Проверка доступа
SELECT * FROM positions 
WHERE id = :position_id 
AND (owner_id = :current_user_id OR :user_role = 'admin');
```

### 2. Проверки операций

#### Создание (POST):
- `admin` - может создавать любые сущности
- `recruiter` - может создавать вакансии, кандидатов, интервью
- `viewer` - не может создавать ничего

#### Обновление (PUT):
- `admin` - может обновлять любые сущности
- `recruiter` - может обновлять только свои сущности
- `viewer` - не может обновлять ничего

#### Удаление (DELETE):
- `admin` - может удалять любые сущности
- `recruiter` - может удалять только свои сущности
- `viewer` - не может удалять ничего

## Детальные требования по эндпоинтам

### 🔐 Auth (Аутентификация)

#### `POST /auth/login`
- **Статус:** ✅ Публичный
- **Логика:** Принимает email/password, возвращает JWT с ролью
- **Реализация:** Стандартная аутентификация

#### `POST /auth/logout`
- **Статус:** ✅ Все роли
- **Логика:** Инвалидирует JWT токен
- **Реализация:** Добавить токен в blacklist

### 👤 Account (Аккаунт)

#### `GET /account`
- **Статус:** ✅ Все роли
- **Логика:** Возвращает данные текущего пользователя
- **Реализация:** Из JWT токена

#### `PUT /account`
- **Статус:** ✅ Все роли
- **Логика:** Обновляет только свой профиль
- **Реализация:** Проверка ID пользователя

### 💼 Positions (Вакансии)

#### `GET /positions`
- **Статус:** 🔄 Требует фильтрации
- **Логика:** 
  - `admin`: все вакансии
  - `recruiter/viewer`: только свои (owner_id = current_user_id)
- **Реализация:** Добавить WHERE условие по роли

#### `POST /positions`
- **Статус:** 🔄 Требует ограничений
- **Логика:** 
  - `admin/recruiter`: может создавать
  - `viewer`: 403 Forbidden
- **Реализация:** Проверка роли перед созданием

#### `GET /positions/{id}`
- **Статус:** 🔄 Требует проверки доступа
- **Логика:** 
  - `admin`: любая вакансия
  - `recruiter/viewer`: только свои
- **Реализация:** Проверка owner_id

#### `PUT /positions/{id}`
- **Статус:** 🔄 Требует проверки доступа
- **Логика:** 
  - `admin`: любая вакансия
  - `recruiter`: только свои
  - `viewer`: 403 Forbidden
- **Реализация:** Проверка роли и owner_id

#### `DELETE /positions/{id}`
- **Статус:** 🔄 Требует проверки доступа
- **Логика:** 
  - `admin`: любая вакансия
  - `recruiter`: только свои
  - `viewer`: 403 Forbidden
- **Реализация:** Проверка роли и owner_id

### 👥 Candidates (Кандидаты)

#### `GET /candidates`
- **Статус:** 🔄 Требует фильтрации
- **Логика:** 
  - `admin`: все кандидаты
  - `recruiter/viewer`: кандидаты по своим вакансиям
- **Реализация:** JOIN с positions по owner_id

#### `POST /candidates`
- **Статус:** 🔄 Требует ограничений
- **Логика:** 
  - `admin/recruiter`: может создавать
  - `viewer`: 403 Forbidden
- **Реализация:** Проверка роли

#### `GET /candidates/{id}`
- **Статус:** 🔄 Требует проверки доступа
- **Логика:** 
  - `admin`: любой кандидат
  - `recruiter/viewer`: только по своим вакансиям
- **Реализация:** JOIN с positions

### 🎯 Interviews (Интервью)

#### `GET /interviews`
- **Статус:** 🔄 Требует фильтрации
- **Логика:** 
  - `admin`: все интервью
  - `recruiter/viewer`: интервью по своим вакансиям
- **Реализация:** JOIN с positions

#### `POST /interviews`
- **Статус:** 🔄 Требует ограничений
- **Логика:** 
  - `admin/recruiter`: может создавать
  - `viewer`: 403 Forbidden
- **Реализация:** Проверка роли

### 👥 Team & Users (Команда)

#### `GET /team`
- **Статус:** 🔄 Требует ограничений
- **Логика:** 
  - `admin`: все пользователи
  - `recruiter/viewer`: 403 Forbidden
- **Реализация:** Проверка роли = admin

### ⚙️ Settings (Настройки)

#### `GET /tariffs`, `POST /tariffs`, `PUT /tariffs/{id}`, `DELETE /tariffs/{id}`
- **Статус:** 🔄 Требует ограничений
- **Логика:** 
  - `admin`: полный доступ
  - `recruiter/viewer`: 403 Forbidden
- **Реализация:** Проверка роли = admin

### 📊 Analytics & Reports (Аналитика)

#### `GET /analytics-reports/*`
- **Статус:** 🔄 Требует фильтрации
- **Логика:** 
  - `admin`: вся статистика
  - `recruiter/viewer`: статистика по своим вакансиям
- **Реализация:** Фильтрация по owner_id

## Middleware для проверки ролей

### 1. Role-based Access Control (RBAC) Middleware

```typescript
// Пример для Express.js
const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// Использование
app.get('/team', checkRole(['admin']), getTeamController);
app.post('/positions', checkRole(['admin', 'recruiter']), createPositionController);
```

### 2. Owner-based Access Control (OBAC) Middleware

```typescript
const checkOwnership = (entityType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const entityId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    
    if (userRole === 'admin') {
      return next(); // Admin может все
    }
    
    // Проверяем владение
    const entity = await getEntity(entityType, entityId);
    if (entity.owner_id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied to this resource'
      });
    }
    
    next();
  };
};

// Использование
app.put('/positions/:id', checkOwnership('positions'), updatePositionController);
```

### 3. Data Filtering Middleware

```typescript
const filterByOwnership = (entityType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    
    if (userRole === 'admin') {
      return next(); // Admin видит все
    }
    
    // Добавляем фильтр по владельцу
    req.query.owner_id = userId;
    next();
  };
};

// Использование
app.get('/positions', filterByOwnership('positions'), listPositionsController);
```

## Обработка ошибок

### Стандартные HTTP коды:

- **401 Unauthorized** - неверный или отсутствующий токен
- **403 Forbidden** - недостаточно прав для операции
- **404 Not Found** - ресурс не найден или нет доступа

### Примеры ответов:

```json
// 403 Forbidden
{
  "error": "Forbidden",
  "message": "Insufficient permissions for this operation",
  "required_role": "admin",
  "current_role": "recruiter"
}

// 404 Not Found (когда нет доступа)
{
  "error": "Not Found",
  "message": "Resource not found or access denied"
}
```

## Тестирование

### Тестовые сценарии:

1. **Admin тесты:**
   - Доступ ко всем эндпоинтам
   - Создание/обновление/удаление любых сущностей
   - Просмотр всей статистики

2. **Recruiter тесты:**
   - Доступ только к своим данным
   - Создание вакансий/кандидатов/интервью
   - Запрет доступа к управлению командой

3. **Viewer тесты:**
   - Только чтение своих данных
   - Запрет всех операций создания/обновления/удаления

4. **Граничные случаи:**
   - Попытка доступа к чужим данным
   - Попытка создания без прав
   - Попытка обновления чужих сущностей

## Рекомендации по безопасности

1. **Всегда проверяйте роль** перед выполнением операций
2. **Фильтруйте данные** по владельцу для recruiter/viewer
3. **Логируйте попытки** несанкционированного доступа
4. **Используйте prepared statements** для предотвращения SQL injection
5. **Валидируйте входные данные** на всех уровнях
6. **Тестируйте граничные случаи** с разными ролями

## Приоритеты реализации

### 🔴 Высокий приоритет (критично):
1. Фильтрация данных в GET эндпоинтах
2. Проверки доступа в PUT/DELETE эндпоинтах
3. Ограничения на создание для viewer

### 🟡 Средний приоритет:
1. Middleware для проверки ролей
2. Детальное логирование
3. Улучшенные сообщения об ошибках

### 🟢 Низкий приоритет:
1. Кэширование разрешений
2. Динамические роли
3. Расширенная аналитика по ролям 