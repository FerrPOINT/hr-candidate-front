# ТЗ: ЭТАП 1 - КОПИРОВАНИЕ СТРУКТУРЫ (АКТУАЛИЗИРОВАННЫЙ)

## ОБЩАЯ ИНФОРМАЦИЯ
- **Этап**: 1 из 5
- **Название**: Копирование структуры
- **Срок**: 1 день
- **Приоритет**: Критический
- **Статус**: ⏳ Ожидает начала
- **Источник**: `DETAILED_DESIGN_MAP.md`

## ЦЕЛЬ ЭТАПА
Создать базовую структуру папок и скопировать все файлы из `original-candidate-front` в новую архитектуру `src/candidate/` с сохранением **1:1 дизайна** согласно детальной карте.

## ДЕТАЛЬНЫЕ ЗАДАЧИ

### ЗАДАЧА 1.1: Создание структуры папок
**Время**: 30 минут
**Сложность**: Низкая

**Действия**:
1. Создать основную папку `src/candidate/`
2. Создать подпапки согласно архитектуре:
   - `src/candidate/components/`
   - `src/candidate/components/interview/`
   - `src/candidate/components/ui/`
   - `src/candidate/styles/`
   - `src/candidate/imports/`
   - `src/candidate/types/`
   - `src/candidate/hooks/`
   - `src/candidate/utils/`
   - `src/candidate/services/`

**Команды**:
```bash
mkdir -p src/candidate/{components,components/interview,components/ui,styles,imports,types,hooks,utils,services}
```

**Критерии готовности**:
- [ ] Все папки созданы
- [ ] Структура соответствует `DETAILED_DESIGN_MAP.md`
- [ ] Нет лишних папок

### ЗАДАЧА 1.2: Копирование основных компонентов (ПРИОРИТЕТ 1)
**Время**: 3 часа
**Сложность**: Высокая

**Действия**:
1. Скопировать **критические компоненты** согласно приоритетам:

**ПРИОРИТЕТ 1 - ОСНОВНЫЕ ЭТАПЫ**:
- `original-candidate-front/components/AuthForm.tsx` (9.4KB, 213 строк) → `src/candidate/components/AuthForm.tsx`
- `original-candidate-front/components/EmailVerification.tsx` (10KB, 243 строк) → `src/candidate/components/EmailVerification.tsx`
- `original-candidate-front/components/InterviewProcess.tsx` (25KB, 676 строк) → `src/candidate/components/InterviewProcess.tsx` ⚠️ **КРИТИЧЕСКИЙ**

**ПРИОРИТЕТ 2 - КОМПОНЕНТЫ ИНТЕРВЬЮ**:
- `original-candidate-front/components/VoiceRecorder.tsx` (17KB, 472 строк) → `src/candidate/components/VoiceRecorder.tsx`
- `original-candidate-front/components/InterviewChat.tsx` (22KB, 662 строк) → `src/candidate/components/InterviewChat.tsx`
- `original-candidate-front/components/QuestionCard.tsx` (5.7KB, 192 строк) → `src/candidate/components/QuestionCard.tsx`

**ПРИОРИТЕТ 3 - UI КОМПОНЕНТЫ**:
- `original-candidate-front/components/AIAvatarWithWaves.tsx` (3.5KB, 111 строк) → `src/candidate/components/AIAvatarWithWaves.tsx`
- `original-candidate-front/components/ProgressBar.tsx` (1.7KB, 57 строк) → `src/candidate/components/ProgressBar.tsx`
- `original-candidate-front/components/HelpModal.tsx` (3.0KB, 85 строк) → `src/candidate/components/HelpModal.tsx`

**Команды**:
```bash
# Основные компоненты
cp original-candidate-front/components/AuthForm.tsx src/candidate/components/
cp original-candidate-front/components/EmailVerification.tsx src/candidate/components/
cp original-candidate-front/components/InterviewProcess.tsx src/candidate/components/

# Компоненты интервью
cp original-candidate-front/components/VoiceRecorder.tsx src/candidate/components/
cp original-candidate-front/components/InterviewChat.tsx src/candidate/components/
cp original-candidate-front/components/QuestionCard.tsx src/candidate/components/

# UI компоненты
cp original-candidate-front/components/AIAvatarWithWaves.tsx src/candidate/components/
cp original-candidate-front/components/ProgressBar.tsx src/candidate/components/
cp original-candidate-front/components/HelpModal.tsx src/candidate/components/
```

**Критерии готовности**:
- [ ] Все приоритетные компоненты скопированы
- [ ] Файлы не повреждены
- [ ] Размеры файлов соответствуют оригиналу

### ЗАДАЧА 1.3: Копирование компонентов интервью
**Время**: 1 час
**Сложность**: Средняя

**Действия**:
1. Скопировать все компоненты из `original-candidate-front/components/interview/`:
   - `MessageBubble.tsx` (1.1KB, 36 строк)
   - `QuestionProgressIndicator.tsx` (683B, 20 строк)
   - `ReadingTestCard.tsx` (1.3KB, 24 строк)
   - `RulesScreen.tsx` (6.2KB, 135 строк)
   - `MicrophoneTestCard.tsx` (8.6KB, 202 строк)
   - `CompleteScreen.tsx` (5.9KB, 128 строк)
   - `QuestionCardComponent.tsx` (2.1KB, 65 строк)

**Команды**:
```bash
cp -r original-candidate-front/components/interview/* src/candidate/components/interview/
```

**Критерии готовности**:
- [ ] Все компоненты интервью скопированы
- [ ] Структура подпапок сохранена
- [ ] Файлы не повреждены

### ЗАДАЧА 1.4: Копирование стилей (КРИТИЧЕСКИЙ)
**Время**: 1 час
**Сложность**: Средняя

**Действия**:
1. Скопировать `original-candidate-front/styles/globals.css` (446 строк) → `src/candidate/styles/globals.css`
2. Проверить корректность CSS переменных:
   - Цветовая палитра (--interview-bg, --interview-accent, etc.)
   - Типографика (--text-h1, --text-interview-message, etc.)
   - Радиусы и тени (--radius, --elevation-sm, etc.)

**Команды**:
```bash
cp original-candidate-front/styles/globals.css src/candidate/styles/
```

**Критерии готовности**:
- [ ] Файл стилей скопирован (446 строк)
- [ ] CSS переменные корректны
- [ ] Все стили присутствуют
- [ ] Цветовая схема идентична оригиналу

### ЗАДАЧА 1.5: Копирование импортов и ресурсов
**Время**: 30 минут
**Сложность**: Низкая

**Действия**:
1. Скопировать папку `original-candidate-front/imports/` → `src/candidate/imports/`
2. Проверить все SVG и иконки
3. Убедиться в корректности файлов

**Команды**:
```bash
cp -r original-candidate-front/imports/* src/candidate/imports/
```

**Критерии готовности**:
- [ ] Все импорты скопированы
- [ ] SVG файлы корректны
- [ ] Иконки отображаются

### ЗАДАЧА 1.6: Копирование типов и утилит
**Время**: 30 минут
**Сложность**: Низкая

**Действия**:
1. Скопировать типы из `original-candidate-front/components/interview/types.ts` (1.4KB, 72 строки)
2. Скопировать утилиты из `original-candidate-front/components/interview/utils.ts` (1.6KB, 54 строки)
3. Скопировать константы из `original-candidate-front/components/interview/constants.ts` (3.1KB, 85 строк)

**Команды**:
```bash
cp original-candidate-front/components/interview/types.ts src/candidate/types/interview.ts
cp original-candidate-front/components/interview/utils.ts src/candidate/utils/interview.ts
cp original-candidate-front/components/interview/constants.ts src/candidate/utils/constants.ts
```

**Критерии готовности**:
- [ ] Все типы скопированы
- [ ] Утилиты скопированы
- [ ] Константы скопированы

### ЗАДАЧА 1.7: Создание базового роутинга
**Время**: 1 час
**Сложность**: Средняя

**Действия**:
1. Создать `src/candidate/App.tsx` на основе `original-candidate-front/App.tsx` (2.4KB, 95 строк)
2. Настроить базовый роутинг для `/candidate/*`
3. Интегрировать с основным роутингом приложения

**Файлы для создания**:
- `src/candidate/App.tsx` - Главный компонент кандидата
- `src/candidate/index.tsx` - Точка входа

**Критерии готовности**:
- [ ] Роутинг настроен
- [ ] Приложение запускается
- [ ] Базовый флоу работает

## ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ

### СТРУКТУРА ФАЙЛОВ (СОГЛАСНО DETAILED_DESIGN_MAP.md)
```
src/candidate/
├── App.tsx                    # Главный компонент кандидата (95 строк)
├── index.tsx                  # Точка входа
├── components/
│   ├── AuthForm.tsx           # Форма авторизации (213 строк)
│   ├── EmailVerification.tsx  # Подтверждение email (243 строки)
│   ├── InterviewProcess.tsx   # Основной процесс (676 строк!) ⚠️
│   ├── VoiceRecorder.tsx      # Запись аудио (472 строки)
│   ├── InterviewChat.tsx      # Чат с AI (662 строки)
│   ├── QuestionCard.tsx       # Карточка вопроса (192 строки)
│   ├── AIAvatarWithWaves.tsx  # AI аватар (111 строк)
│   ├── ProgressBar.tsx        # Прогресс (57 строк)
│   ├── HelpModal.tsx          # Помощь (85 строк)
│   └── interview/
│       ├── MessageBubble.tsx  # Пузыри сообщений (36 строк)
│       ├── MicrophoneTestCard.tsx # Тест микрофона (202 строки)
│       ├── CompleteScreen.tsx # Завершение (128 строк)
│       ├── types.ts           # Типы интервью (72 строки)
│       ├── utils.ts           # Утилиты (54 строки)
│       └── constants.ts       # Константы (85 строк)
├── styles/
│   └── globals.css            # Все стили (446 строк)
├── imports/                   # SVG и иконки
├── types/
│   └── interview.ts           # Типы интервью
├── hooks/                     # Кастомные хуки
├── utils/
│   ├── interview.ts           # Утилиты интервью
│   └── constants.ts           # Константы
└── services/                  # API сервисы
```

### ТРЕБОВАНИЯ К КАЧЕСТВУ
- **Целостность**: Все файлы должны быть скопированы без потерь
- **Структура**: Сохранить оригинальную структуру папок
- **Совместимость**: Файлы должны быть совместимы с текущей архитектурой
- **Производительность**: Копирование не должно влиять на производительность
- **1:1 дизайн**: Сохранить все визуальные элементы согласно `DETAILED_DESIGN_MAP.md`

## ЧЕКАП ЭТАПА

### ЧТО ПРОВЕРЯЕМ
1. **Структура папок**:
   - [ ] Все папки созданы согласно `DETAILED_DESIGN_MAP.md`
   - [ ] Структура соответствует плану
   - [ ] Нет лишних папок

2. **Критические компоненты**:
   - [ ] `InterviewProcess.tsx` скопирован (676 строк)
   - [ ] `AuthForm.tsx` скопирован (213 строк)
   - [ ] `EmailVerification.tsx` скопирован (243 строки)
   - [ ] `VoiceRecorder.tsx` скопирован (472 строки)

3. **Стили и ресурсы**:
   - [ ] `globals.css` скопирован (446 строк)
   - [ ] CSS переменные корректны
   - [ ] Импорты скопированы
   - [ ] Типы и утилиты скопированы

4. **Функциональность**:
   - [ ] Приложение запускается
   - [ ] Нет критических ошибок
   - [ ] Базовый роутинг работает
   - [ ] Компоненты загружаются

### КОМАНДЫ ДЛЯ ПРОВЕРКИ
```bash
# Проверка структуры
ls -la src/candidate/
ls -la src/candidate/components/
ls -la src/candidate/components/interview/

# Проверка размеров критических файлов
wc -l src/candidate/components/InterviewProcess.tsx  # Должно быть 676
wc -l src/candidate/styles/globals.css              # Должно быть 446

# Проверка компиляции
npm run build

# Проверка запуска
npm start

# Проверка типов
npm run type-check
```

### ОЖИДАЕМЫЙ РЕЗУЛЬТАТ
- Приложение запускается без критических ошибок
- Структура папок создана полностью согласно `DETAILED_DESIGN_MAP.md`
- Все файлы скопированы корректно (включая 676-строчный InterviewProcess)
- Базовый роутинг `/candidate/*` работает
- CSS переменные и стили идентичны оригиналу

## РИСКИ И МИТИГАЦИЯ

### РИСКИ
1. **InterviewProcess.tsx слишком сложный** (676 строк)
   - **Митигация**: Скопировать как есть, разбить на этапе 4

2. **Файлы могут быть повреждены при копировании**
   - **Митигация**: Проверять размеры файлов после копирования

3. **Конфликты с существующими файлами**
   - **Митигация**: Использовать уникальные имена папок

4. **CSS переменные могут не работать**
   - **Митигация**: Проверить импорты стилей

### ПЛАН ДЕЙСТВИЙ ПРИ ОШИБКАХ
1. Остановить процесс
2. Зафиксировать ошибку в `CANDIDATE_INTEGRATION_STATE.md`
3. Определить причину
4. Исправить проблему
5. Повторить проверку

## ДОКУМЕНТАЦИЯ

### ОБНОВЛЯЕМЫЕ ФАЙЛЫ
- `CANDIDATE_INTEGRATION_STATE.md` - обновить статус этапа
- `EXECUTION_PLAN.md` - отметить выполнение
- `DETAILED_DESIGN_MAP.md` - использовать как источник

### ЛОГИ
- Записать время начала и окончания
- Зафиксировать выполненные задачи
- Отметить найденные проблемы
- Записать решения

## СЛЕДУЮЩИЙ ЭТАП
После успешного завершения этапа 1 перейти к **ЭТАПУ 2: АДАПТАЦИЯ ИМПОРТОВ**

---

**Статус**: ⏳ Ожидает начала
**Следующее действие**: Начать выполнение задачи 1.1
**Источник**: `DETAILED_DESIGN_MAP.md`
