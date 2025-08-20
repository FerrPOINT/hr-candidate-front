# 🏗️ ПЛАН АРХИТЕКТУРЫ СПРИНТА 4

## 📋 **ОБЩАЯ ЗАДАЧА**
Создать архитектуру с разделением UI рекрутера и кандидата по отдельным пакетам для избежания конфликтов и обеспечения чистоты кода.

## 🎯 **ЦЕЛИ АРХИТЕКТУРЫ**

### **✅ ОСНОВНЫЕ ПРИНЦИПЫ**
1. **Изоляция пакетов**: UI рекрутера и кандидата полностью независимы
2. **Переиспользование**: общие компоненты вынесены в shared
3. **Типизация**: строгая типизация для каждого пакета
4. **Масштабируемость**: легко добавлять новые пакеты
5. **Производительность**: оптимизация загрузки по пакетам

### **🚫 ОГРАНИЧЕНИЯ**
- Нет пересечений между UI рекрутера и кандидата
- Общие зависимости только в shared
- Строгое разделение роутинга

---

## 📁 **СТРУКТУРА ПРОЕКТА**

### **🏗️ НОВАЯ СТРУКТУРА**
```
hr-recruiter-front/
├── src/
│   ├── recruiter/              # UI рекрутера (существующий)
│   │   ├── components/         # Компоненты рекрутера
│   │   │   ├── LoginPage.tsx
│   │   │   ├── VacanciesPage.tsx
│   │   │   ├── VacancyCreationPage.tsx
│   │   │   ├── StatisticsPage.tsx
│   │   │   ├── CompanyInfoPage.tsx
│   │   │   ├── TeamManagementPage.tsx
│   │   │   ├── InterviewDetailsPage.tsx
│   │   │   ├── QuestionsPage.tsx
│   │   │   ├── BrandingPage.tsx
│   │   │   └── PersonalInfoPage.tsx
│   │   ├── pages/             # Страницы рекрутера
│   │   │   ├── Login.tsx
│   │   │   ├── VacancyList.tsx
│   │   │   └── ...
│   │   ├── hooks/             # Хуки рекрутера
│   │   │   ├── useRoleAccess.ts
│   │   │   └── usePageData.ts
│   │   └── types/             # Типы рекрутера
│   │       ├── recruiter.ts
│   │       └── vacancies.ts
│   ├── candidate/              # UI кандидата (новый)
│   │   ├── components/         # Компоненты кандидата
│   │   │   ├── AuthForm.tsx
│   │   │   ├── EmailVerification.tsx
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── MicrophoneTest.tsx
│   │   │   ├── InterviewProcess.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── InterviewChat.tsx
│   │   │   ├── ProgressIndicators.tsx
│   │   │   ├── CompleteScreen.tsx
│   │   │   └── HelpComponents.tsx
│   │   ├── pages/             # Страницы кандидата
│   │   │   ├── Auth.tsx
│   │   │   ├── Verify.tsx
│   │   │   ├── Welcome.tsx
│   │   │   ├── MicrophoneTest.tsx
│   │   │   └── Interview.tsx
│   │   ├── hooks/             # Хуки кандидата
│   │   │   ├── useInterview.ts
│   │   │   ├── useAudio.ts
│   │   │   └── useProgress.ts
│   │   └── types/             # Типы кандидата
│   │       ├── interview.ts
│   │       ├── auth.ts
│   │       └── audio.ts
│   ├── shared/                 # Общие компоненты
│   │   ├── ui/                # UI компоненты (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── utils/             # Утилиты
│   │   │   ├── phoneFormatter.ts
│   │   │   ├── enumMapper.ts
│   │   │   └── elevenLabsSafe.ts
│   │   ├── services/          # API сервисы
│   │   │   ├── apiService.ts
│   │   │   ├── authService.ts
│   │   │   ├── audioService.ts
│   │   │   └── agentService.ts
│   │   ├── store/             # Общее состояние
│   │   │   ├── authStore.ts
│   │   │   └── pagesStore.ts
│   │   └── config/            # Конфигурация
│   │       ├── elevenLabsConfig.ts
│   │       └── version.ts
│   ├── client/                # API клиенты (остается как есть)
│   ├── App.tsx                # Главный роутер
│   └── index.tsx              # Точка входа
```

---

## 🔄 **РОУТИНГ**

### **🎯 СТРУКТУРА РОУТИНГА**
```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Рекрутер роуты
import RecruiterLayout from './recruiter/layout/RecruiterLayout';
import Login from './recruiter/pages/Login';
import VacancyList from './recruiter/pages/VacancyList';
// ... другие страницы рекрутера

// Кандидат роуты
import CandidateLayout from './candidate/layout/CandidateLayout';
import Auth from './candidate/pages/Auth';
import Verify from './candidate/pages/Verify';
import Welcome from './candidate/pages/Welcome';
import MicrophoneTest from './candidate/pages/MicrophoneTest';
import Interview from './candidate/pages/Interview';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Рекрутер роуты */}
        <Route path="/recruiter" element={<RecruiterLayout />}>
          <Route index element={<Navigate to="/recruiter/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="vacancies" element={<VacancyList />} />
          <Route path="create-vacancy" element={<VacancyCreation />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="company-info" element={<CompanyInfo />} />
          <Route path="team-management" element={<TeamManagement />} />
          <Route path="interview-details" element={<InterviewDetails />} />
          <Route path="questions" element={<Questions />} />
          <Route path="branding" element={<Branding />} />
          <Route path="personal-info" element={<PersonalInfo />} />
        </Route>

        {/* Кандидат роуты */}
        <Route path="/candidate" element={<CandidateLayout />}>
          <Route index element={<Navigate to="/candidate/auth" replace />} />
          <Route path="auth" element={<Auth />} />
          <Route path="verify" element={<Verify />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="microphone-test" element={<MicrophoneTest />} />
          <Route path="interview" element={<Interview />} />
          <Route path="complete" element={<Complete />} />
        </Route>

        {/* Редирект с корня */}
        <Route path="/" element={<Navigate to="/recruiter" replace />} />
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/recruiter" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### **🎯 ЛАЙАУТЫ**
```typescript
// src/recruiter/layout/RecruiterLayout.tsx
export default function RecruiterLayout() {
  return (
    <div className="recruiter-layout">
      <RecruiterHeader />
      <RecruiterSidebar />
      <main className="recruiter-main">
        <Outlet />
      </main>
    </div>
  );
}

// src/candidate/layout/CandidateLayout.tsx
export default function CandidateLayout() {
  return (
    <div className="candidate-layout">
      <CandidateHeader />
      <main className="candidate-main">
        <Outlet />
      </main>
    </div>
  );
}
```

---

## 📦 **МИГРАЦИЯ КОМПОНЕНТОВ**

### **🔄 ПЛАН МИГРАЦИИ**

#### **ШАГ 1: СОЗДАНИЕ СТРУКТУРЫ**
- [ ] Создать папки `src/recruiter/`, `src/candidate/`, `src/shared/`
- [ ] Создать подпапки в каждой папке
- [ ] Создать базовые файлы layout

#### **ШАГ 2: ПЕРЕНОС UI КОМПОНЕНТОВ**
- [ ] Перенести `src/components/ui/` → `src/shared/ui/`
- [ ] Обновить все импорты в проекте
- [ ] Проверить работоспособность

#### **ШАГ 3: ПЕРЕНОС СЕРВИСОВ**
- [ ] Перенести `src/services/` → `src/shared/services/`
- [ ] Перенести `src/store/` → `src/shared/store/`
- [ ] Перенести `src/config/` → `src/shared/config/`
- [ ] Обновить импорты

#### **ШАГ 4: ПЕРЕНОС РЕКРУТЕРА**
- [ ] Перенести `src/pages/` → `src/recruiter/pages/`
- [ ] Перенести `src/components/` (рекрутер) → `src/recruiter/components/`
- [ ] Перенести `src/hooks/` → `src/recruiter/hooks/`
- [ ] Обновить импорты

#### **ШАГ 5: СОЗДАНИЕ КАНДИДАТА**
- [ ] Создать компоненты кандидата из `original-candidate-front/`
- [ ] Адаптировать под новую структуру
- [ ] Интегрировать с API

#### **ШАГ 6: НАСТРОЙКА РОУТИНГА**
- [ ] Обновить `src/App.tsx`
- [ ] Создать layout компоненты
- [ ] Протестировать навигацию

---

## 🎨 **СТИЛИ И ТЕМЫ**

### **🎯 РАЗДЕЛЕНИЕ СТИЛЕЙ**
```css
/* src/recruiter/styles/recruiter.css */
.recruiter-layout {
  @apply bg-gray-50;
}

.recruiter-main {
  @apply p-6;
}

/* src/candidate/styles/candidate.css */
.candidate-layout {
  @apply bg-interview-bg;
}

.candidate-main {
  @apply min-h-screen;
}
```

### **🎨 ЦВЕТОВЫЕ СХЕМЫ**
- **Рекрутер**: серые тона, профессиональный вид
- **Кандидат**: `#e9eae2` (фон), `#f5f6f1` (карточки), `#e16349` (акцент)

---

## 🔧 **ТЕХНИЧЕСКИЕ ДЕТАЛИ**

### **📦 ЗАВИСИМОСТИ**
```json
{
  "dependencies": {
    "react-router-dom": "^6.x",
    "framer-motion": "^10.x",
    "lucide-react": "^0.x"
  }
}
```

### **🎯 ТИПИЗАЦИЯ**
```typescript
// src/recruiter/types/recruiter.ts
export interface RecruiterUser {
  id: string;
  email: string;
  role: 'recruiter';
  permissions: string[];
}

// src/candidate/types/candidate.ts
export interface CandidateUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  interviewId: string;
}
```

### **🔒 БЕЗОПАСНОСТЬ**
- Разделение доступа по ролям
- Изоляция данных между пакетами
- Защищенные роуты

---

## 📊 **ПРОГРЕСС МИГРАЦИИ**

### **🏗️ СТРУКТУРНЫЕ ЗАДАЧИ**
- [ ] Создание структуры папок: ⏳ 0%
- [ ] Перенос UI компонентов: ⏳ 0%
- [ ] Перенос сервисов: ⏳ 0%
- [ ] Перенос рекрутера: ⏳ 0%
- [ ] Создание кандидата: ⏳ 0%
- [ ] Настройка роутинга: ⏳ 0%

### **🎯 КОМПОНЕНТЫ КАНДИДАТА**
- [ ] AuthForm: ⏳ 0%
- [ ] EmailVerification: ⏳ 0%
- [ ] WelcomeScreen: ⏳ 0%
- [ ] MicrophoneTest: ⏳ 0%
- [ ] InterviewProcess: ⏳ 0%

**Общий прогресс**: **0%** (готов к началу миграции)

---

## 🧪 **ТЕСТИРОВАНИЕ**

### **✅ UNIT ТЕСТЫ**
- Тесты для каждого пакета отдельно
- Моки для shared компонентов
- Изоляция тестовых данных

### **🔗 INTEGRATION ТЕСТЫ**
- Тестирование роутинга между пакетами
- Проверка shared компонентов
- Тестирование API интеграции

### **🌐 E2E ТЕСТЫ**
- Полный флоу рекрутера
- Полный флоу кандидата
- Переключение между пакетами

---

**Автор**: Cursor AI  
**Дата**: 2024-12-28  
**Статус**: ✅ План архитектуры создан, готов к пошаговой миграции
