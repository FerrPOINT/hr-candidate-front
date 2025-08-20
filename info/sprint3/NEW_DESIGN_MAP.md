# 🗺️ КАРТА ПАПКИ NEW-DESIGN

## 📁 **СТРУКТУРА ПАПКИ**

```
new-design/
├── App.tsx                    # Главный компонент приложения
├── Attributions.md            # Атрибуты и лицензии
├── components/                # Основные компоненты
│   ├── ui/                    # UI компоненты (shadcn/ui)
│   ├── figma/                 # Компоненты из Figma
│   └── vacancies/             # Компоненты вакансий
├── styles/                    # Стили и CSS
└── guidelines/                # Руководства по дизайну
```

---

## 🎯 **АНАЛИЗ КОМПОНЕНТОВ**

### **📱 ОСНОВНЫЕ СТРАНИЦЫ**

#### **🔐 АВТОРИЗАЦИЯ**
- `login-page.tsx` (5.1KB) - **ЛОГИН** ✅ **ПРИОРИТЕТ 1**

#### **💼 ВАКАНСИИ**
- `vacancies-page-unified.tsx` (87KB) - **ОСНОВНАЯ СТРАНИЦА ВАКАНСИЙ** ✅ **ПРИОРИТЕТ 2**
- `vacancies-page-v2.tsx` (65KB) - **ВАКАНСИИ V2** (дубликат)
- `vacancies-page-v3.tsx` (46KB) - **ВАКАНСИИ V3** (дубликат)

#### **➕ СОЗДАНИЕ ВАКАНСИЙ**
- `vacancy-creation-page-final.tsx` (70KB) - **СОЗДАНИЕ ВАКАНСИИ ФИНАЛ** ✅ **ПРИОРИТЕТ 3**
- `vacancy-creation-page-figma.tsx` (44KB) - **СОЗДАНИЕ ВАКАНСИИ FIGMA** (дубликат)
- `vacancy-creation-page-v2.tsx` (21KB) - **СОЗДАНИЕ ВАКАНСИИ V2** (дубликат)
- `vacancy-creation-page-v3.tsx` (22KB) - **СОЗДАНИЕ ВАКАНСИИ V3** (дубликат)
- `vacancy-creation-page.tsx` (28KB) - **СОЗДАНИЕ ВАКАНСИИ БАЗОВАЯ** (дубликат)
- `vacancy-creation-exact.tsx` (56KB) - **СОЗДАНИЕ ВАКАНСИИ ТОЧНАЯ** (дубликат)

#### **👤 КАНДИДАТЫ**
- `candidate-answers-page.tsx` (34KB) - **ОТВЕТЫ КАНДИДАТА** ✅ **ПРИОРИТЕТ 4**

#### **📊 СТАТИСТИКА**
- `statistics-page-complete.tsx` (32KB) - **СТАТИСТИКА ПОЛНАЯ** ✅ **ПРИОРИТЕТ 5**
- `statistics-page-figma.tsx` (75KB) - **СТАТИСТИКА FIGMA** (дубликат)
- `statistics-page.tsx` (39KB) - **СТАТИСТИКА БАЗОВАЯ** (дубликат)

#### **🏢 КОМПАНИЯ**
- `company-info-page.tsx` (22KB) - **ИНФОРМАЦИЯ О КОМПАНИИ** ✅ **ПРИОРИТЕТ 6**
- `company-info-content.tsx` (4.1KB) - **КОНТЕНТ КОМПАНИИ**

#### **👥 КОМАНДА**
- `team-management-content.tsx` (3.7KB) - **УПРАВЛЕНИЕ КОМАНДОЙ** ✅ **ПРИОРИТЕТ 7**
- `team-member-card.tsx` (3.2KB) - **КАРТОЧКА ЧЛЕНА КОМАНДЫ**

#### **📝 ИНТЕРВЬЮ**
- `interview-details-page.tsx` (34KB) - **ДЕТАЛИ ИНТЕРВЬЮ** ✅ **ПРИОРИТЕТ 8**
- `interview-details-layout.tsx` (5.4KB) - **МАКЕТ ДЕТАЛЕЙ ИНТЕРВЬЮ**
- `interview-details-layout-fixed.tsx` (52KB) - **ДЕТАЛИ ИНТЕРВЬЮ ИСПРАВЛЕННЫЕ** (дубликат)
- `create-interview-modal.tsx` (7.5KB) - **МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ИНТЕРВЬЮ**

#### **🔧 УПРАВЛЕНИЕ**
- `app-management-sidebar.tsx` (2.4KB) - **БОКОВАЯ ПАНЕЛЬ УПРАВЛЕНИЯ**
- `management-sidebar.tsx` (4.6KB) - **БОКОВАЯ ПАНЕЛЬ УПРАВЛЕНИЯ БАЗОВАЯ**
- `management-sidebar-v2.tsx` (4.8KB) - **БОКОВАЯ ПАНЕЛЬ V2** (дубликат)
- `management-sidebar-v3.tsx` (4.7KB) - **БОКОВАЯ ПАНЕЛЬ V3** (дубликат)
- `management-sidebar-v4.tsx` (4.7KB) - **БОКОВАЯ ПАНЕЛЬ V4** (дубликат)
- `management-sidebar-v5.tsx` (3.8KB) - **БОКОВАЯ ПАНЕЛЬ V5** (дубликат)

#### **📋 ВОПРОСЫ**
- `questions_tab.tsx` (6.0KB) - **ВКЛАДКА ВОПРОСОВ** ✅ **ПРИОРИТЕТ 9**

#### **🎨 БРЕНДИНГ**
- `branding-content.tsx` (4.4KB) - **КОНТЕНТ БРЕНДИНГА** ✅ **ПРИОРИТЕТ 10**

#### **👤 ПРОФИЛЬ**
- `personal-info-content.tsx` (3.5KB) - **ЛИЧНАЯ ИНФОРМАЦИЯ** ✅ **ПРИОРИТЕТ 11**

---

### **🧩 UI КОМПОНЕНТЫ**

#### **🎨 ОСНОВНЫЕ**
- `button.tsx` - Кнопки
- `input.tsx` - Поля ввода
- `select.tsx` - Выпадающие списки
- `card.tsx` - Карточки
- `dialog.tsx` - Модальные окна
- `form.tsx` - Формы

#### **🔧 СПЕЦИАЛЬНЫЕ**
- `synergy-logo.tsx` - Логотип Synergy
- `synergy-logo-figma.tsx` - Логотип Synergy из Figma
- `figma-icons.tsx` - Иконки из Figma (несколько версий)
- `vacancy-card.tsx` - Карточка вакансии
- `vacancy-filters-panel.tsx` - Панель фильтров вакансий

#### **📱 АДАПТИВНОСТЬ**
- `use-mobile.ts` - Хук для мобильных устройств

---

### **📁 IMPORTS (SVG и FIGMA)**

#### **🎨 SVG ИКОНКИ**
- `svg-*.ts` - 30+ SVG иконок (3dtpg5txi7, 3h9xy9w5fh, 3tthbeg816, и т.д.)

#### **📊 FIGMA КОМПОНЕНТЫ**
- `ВакансииV2.tsx` - Страница вакансий (104KB)
- `СозданиеВакансии.tsx` - Создание вакансии (120KB)
- `Статистика.tsx` - Статистика (185KB)
- `ОтветыКандидата.tsx` - Ответы кандидата (80KB)
- `Команда.tsx` - Команда (42KB)
- `Текст.tsx` - Текстовые блоки (67KB)

---

## 🚨 **ПРОБЛЕМЫ И ДУБЛИКАТЫ**

### **❌ ДУБЛИКАТЫ (НЕ НУЖНЫ)**
- **Вакансии**: v2, v3, unified (3 версии)
- **Создание вакансий**: 6 версий (final, figma, v2, v3, базовая, exact)
- **Статистика**: 3 версии (complete, figma, базовая)
- **Боковые панели**: 6 версий (базовая, v2-v5)
- **Figma иконки**: 7 версий (v2-v7)

### **⚠️ ПРОБЛЕМЫ**
- **Размеры файлов**: Некоторые файлы очень большие (185KB, 120KB)
- **Дублирование кода**: Много одинаковых компонентов с разными версиями
- **Figma зависимости**: Много компонентов зависят от Figma импортов

---

## 🎯 **ПЛАН ОПТИМИЗАЦИИ**

### **✅ ПРИОРИТЕТ 1-6 (ОСНОВНЫЕ СТРАНИЦЫ)**
1. **Логин** - `login-page.tsx` (5.1KB)
2. **Вакансии** - `vacancies-page-unified.tsx` (87KB)
3. **Создание вакансии** - `vacancy-creation-page-final.tsx` (70KB)
4. **Ответы кандидата** - `candidate-answers-page.tsx` (34KB)
5. **Статистика** - `statistics-page-complete.tsx` (32KB)
6. **Создание собеседования** - `create-interview-modal.tsx` (7.5KB)

### **✅ ПРИОРИТЕТ 7-12 (ДОПОЛНИТЕЛЬНЫЕ)**
7. **Информация о компании** - `company-info-page.tsx` (22KB)
8. **Управление командой** - `team-management-content.tsx` (3.7KB)
9. **Детали интервью** - `interview-details-page.tsx` (34KB)
10. **Вопросы** - `questions_tab.tsx` (6.0KB)
11. **Брендинг** - `branding-content.tsx` (4.4KB)
12. **Личная информация** - `personal-info-content.tsx` (3.5KB)

---

## 💡 **РЕКОМЕНДАЦИИ**

### **🔧 ПРИ КОПИРОВАНИИ**
1. **Брать только финальные версии** (final, complete, unified)
2. **Игнорировать дубликаты** (v2, v3, figma версии)
3. **Создавать заглушки** для Figma зависимостей
4. **Заменять страницу с предварительным бэкапом**: переименовывать текущую в `*-old`, класть новую на её место, после одобрения — удалять `*-old`

### **📁 СТРУКТУРА КОПИРОВАНИЯ**
```
src/components/
├── LoginPage.tsx              # Из login-page.tsx
├── VacanciesPage.tsx          # Из vacancies-page-unified.tsx
├── VacancyCreationPage.tsx    # Из vacancy-creation-page-final.tsx
├── CandidateAnswersPage.tsx   # Из candidate-answers-page.tsx
├── StatisticsPage.tsx         # Из statistics-page-complete.tsx
├── CreateInterviewModal.tsx   # Из create-interview-modal.tsx
├── CompanyInfoPage.tsx        # Из company-info-page.tsx
├── TeamManagementPage.tsx     # Из team-management-content.tsx
├── InterviewDetailsPage.tsx   # Из interview-details-page.tsx
├── QuestionsPage.tsx          # Из questions_tab.tsx
├── BrandingPage.tsx           # Из branding-content.tsx
└── PersonalInfoPage.tsx       # Из personal-info-content.tsx
```

---

**Автор**: Cursor AI  
**Дата**: 2024-12-28  
**Статус**: 🎉 Карта создана, ВСЕ 13 ШАГОВ ЗАВЕРШЕНЫ, модальные окна убраны, готов к проверке в браузере 