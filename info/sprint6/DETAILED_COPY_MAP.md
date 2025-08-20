# 🗺️ ДЕТАЛЬНАЯ КАРТА КОПИРОВАНИЯ: ТОЧНОЕ ВОСПРОИЗВЕДЕНИЕ ОРИГИНАЛЬНОГО ДИЗАЙНА

## 📋 **ОБЩАЯ КОНЦЕПЦИЯ**
Пошаговое руководство для точного копирования оригинального дизайна из `original-candidate-front` в `src/candidate` с сохранением всех цветов, стилей, компонентов и функциональности.

---

## 🎯 **ЭТАП 1: ПОДГОТОВКА СТРУКТУРЫ**

### **📁 СОЗДАНИЕ ДИРЕКТОРИЙ**
```bash
# Создать структуру директорий
mkdir -p src/candidate/components/interview
mkdir -p src/candidate/components/ui
mkdir -p src/candidate/styles
mkdir -p src/candidate/imports
mkdir -p src/candidate/figma
```

### **📋 СПИСОК ФАЙЛОВ ДЛЯ КОПИРОВАНИЯ**

#### **🔧 ОСНОВНЫЕ КОМПОНЕНТЫ**
```
original-candidate-front/components/ → src/candidate/components/

✅ AuthForm.tsx                    # Форма авторизации
✅ EmailVerification.tsx           # Верификация email
✅ InterviewProcess.tsx            # Процесс интервью
✅ WMTLogo.tsx                     # Логотип WMT
✅ HelpButton.tsx                  # Кнопка помощи
✅ HelpModal.tsx                   # Модальное окно помощи
✅ AIAvatarWithWaves.tsx           # Аватар AI с волнами
✅ AudioVisualizer.tsx             # Визуализация аудио
✅ VoiceRecorder.tsx               # Запись голоса
✅ InstructionsModal.tsx           # Модальное окно инструкций
✅ InterviewComplete.tsx           # Экран завершения
✅ QuestionResponseInterface.tsx   # Интерфейс ответов
✅ ReferenceStyleMessage.tsx       # Стилизованные сообщения
✅ InteractiveChatMessage.tsx      # Интерактивные сообщения
✅ InterviewChatMessage.tsx        # Сообщения чата
✅ InterviewChat.tsx               # Чат интервью
✅ InterviewChatFixed.tsx          # Исправленный чат
✅ NewInterviewChat.tsx            # Новый чат
✅ InterviewFlow.tsx               # Флоу интервью
✅ InterviewRules.tsx              # Правила интервью
✅ InterviewControls.tsx           # Контролы интервью
✅ QuestionCard.tsx                # Карточка вопроса
✅ QuestionTimer.tsx               # Таймер вопроса
✅ QuestionHeader.tsx              # Заголовок вопроса
✅ LiveTranscription.tsx           # Живая транскрипция
✅ TypewriterText.tsx              # Печатный текст
✅ WelcomeScreen.tsx               # Экран приветствия
✅ PreStartScreen.tsx              # Предстартовый экран
✅ CompanyInfo.tsx                 # Информация о компании
✅ CompanyQuestionsButtons.tsx     # Кнопки вопросов компании
✅ CandidateQuestions.tsx          # Вопросы кандидата
✅ ChatMessage.tsx                 # Сообщение чата
✅ MicrophoneTest.tsx              # Тест микрофона
✅ MicrophoneTestNew.tsx           # Новый тест микрофона
✅ VoiceRecorder.tsx               # Запись голоса
```

#### **🎤 КОМПОНЕНТЫ ИНТЕРВЬЮ**
```
original-candidate-front/components/interview/ → src/candidate/components/interview/

✅ MessageBubble.tsx               # Пузырь сообщения
✅ MicrophoneTestCard.tsx          # Карточка теста микрофона
✅ ReadingTestCard.tsx             # Карточка теста чтения
✅ QuestionCardComponent.tsx       # Компонент карточки вопроса
✅ QuestionProgressIndicator.tsx   # Индикатор прогресса
✅ CompleteScreen.tsx              # Экран завершения
✅ RulesScreen.tsx                 # Экран правил
✅ types.ts                        # Типы интервью
✅ constants.ts                    # Константы интервью
✅ utils.ts                        # Утилиты интервью
```

#### **🎨 UI КОМПОНЕНТЫ**
```
original-candidate-front/components/ui/ → src/candidate/components/ui/

✅ button.tsx                      # Кнопка
✅ input.tsx                       # Поле ввода
✅ label.tsx                       # Метка
✅ card.tsx                        # Карточка
✅ dialog.tsx                      # Диалог
✅ modal.tsx                       # Модальное окно
✅ progress.tsx                    # Прогресс
✅ badge.tsx                       # Бейдж
✅ avatar.tsx                      # Аватар
✅ separator.tsx                   # Разделитель
✅ utils.ts                        # Утилиты UI
```

#### **📐 СТИЛИ И ИМПОРТЫ**
```
original-candidate-front/styles/ → src/candidate/styles/
✅ globals.css                     # Глобальные стили

original-candidate-front/imports/ → src/candidate/imports/
✅ Synergy-49-121.tsx              # Логотип Synergy
✅ Все SVG файлы                   # Иконки и изображения

original-candidate-front/figma/ → src/candidate/figma/
✅ ImageWithFallback.tsx           # Изображение с fallback
```

---

## 🎯 **ЭТАП 2: КОПИРОВАНИЕ ФАЙЛОВ**

### **📋 КОМАНДЫ КОПИРОВАНИЯ**

#### **🔧 ОСНОВНЫЕ КОМПОНЕНТЫ**
```bash
# Копирование основных компонентов
cp original-candidate-front/components/AuthForm.tsx src/candidate/components/
cp original-candidate-front/components/EmailVerification.tsx src/candidate/components/
cp original-candidate-front/components/InterviewProcess.tsx src/candidate/components/
cp original-candidate-front/components/WMTLogo.tsx src/candidate/components/
cp original-candidate-front/components/HelpButton.tsx src/candidate/components/
cp original-candidate-front/components/HelpModal.tsx src/candidate/components/
cp original-candidate-front/components/AIAvatarWithWaves.tsx src/candidate/components/
cp original-candidate-front/components/AudioVisualizer.tsx src/candidate/components/
cp original-candidate-front/components/VoiceRecorder.tsx src/candidate/components/
cp original-candidate-front/components/InstructionsModal.tsx src/candidate/components/
cp original-candidate-front/components/InterviewComplete.tsx src/candidate/components/
cp original-candidate-front/components/QuestionResponseInterface.tsx src/candidate/components/
cp original-candidate-front/components/ReferenceStyleMessage.tsx src/candidate/components/
cp original-candidate-front/components/InteractiveChatMessage.tsx src/candidate/components/
cp original-candidate-front/components/InterviewChatMessage.tsx src/candidate/components/
cp original-candidate-front/components/InterviewChat.tsx src/candidate/components/
cp original-candidate-front/components/InterviewChatFixed.tsx src/candidate/components/
cp original-candidate-front/components/NewInterviewChat.tsx src/candidate/components/
cp original-candidate-front/components/InterviewFlow.tsx src/candidate/components/
cp original-candidate-front/components/InterviewRules.tsx src/candidate/components/
cp original-candidate-front/components/InterviewControls.tsx src/candidate/components/
cp original-candidate-front/components/QuestionCard.tsx src/candidate/components/
cp original-candidate-front/components/QuestionTimer.tsx src/candidate/components/
cp original-candidate-front/components/QuestionHeader.tsx src/candidate/components/
cp original-candidate-front/components/LiveTranscription.tsx src/candidate/components/
cp original-candidate-front/components/TypewriterText.tsx src/candidate/components/
cp original-candidate-front/components/WelcomeScreen.tsx src/candidate/components/
cp original-candidate-front/components/PreStartScreen.tsx src/candidate/components/
cp original-candidate-front/components/CompanyInfo.tsx src/candidate/components/
cp original-candidate-front/components/CompanyQuestionsButtons.tsx src/candidate/components/
cp original-candidate-front/components/CandidateQuestions.tsx src/candidate/components/
cp original-candidate-front/components/ChatMessage.tsx src/candidate/components/
cp original-candidate-front/components/MicrophoneTest.tsx src/candidate/components/
cp original-candidate-front/components/MicrophoneTestNew.tsx src/candidate/components/
```

#### **🎤 КОМПОНЕНТЫ ИНТЕРВЬЮ**
```bash
# Копирование компонентов интервью
cp original-candidate-front/components/interview/MessageBubble.tsx src/candidate/components/interview/
cp original-candidate-front/components/interview/MicrophoneTestCard.tsx src/candidate/components/interview/
cp original-candidate-front/components/interview/ReadingTestCard.tsx src/candidate/components/interview/
cp original-candidate-front/components/interview/QuestionCardComponent.tsx src/candidate/components/interview/
cp original-candidate-front/components/interview/QuestionProgressIndicator.tsx src/candidate/components/interview/
cp original-candidate-front/components/interview/CompleteScreen.tsx src/candidate/components/interview/
cp original-candidate-front/components/interview/RulesScreen.tsx src/candidate/components/interview/
cp original-candidate-front/components/interview/types.ts src/candidate/components/interview/
cp original-candidate-front/components/interview/constants.ts src/candidate/components/interview/
cp original-candidate-front/components/interview/utils.ts src/candidate/components/interview/
```

#### **🎨 UI КОМПОНЕНТЫ**
```bash
# Копирование UI компонентов
cp original-candidate-front/components/ui/button.tsx src/candidate/components/ui/
cp original-candidate-front/components/ui/input.tsx src/candidate/components/ui/
cp original-candidate-front/components/ui/label.tsx src/candidate/components/ui/
cp original-candidate-front/components/ui/card.tsx src/candidate/components/ui/
cp original-candidate-front/components/ui/dialog.tsx src/candidate/components/ui/
cp original-candidate-front/components/ui/progress.tsx src/candidate/components/ui/
cp original-candidate-front/components/ui/badge.tsx src/candidate/components/ui/
cp original-candidate-front/components/ui/avatar.tsx src/candidate/components/ui/
cp original-candidate-front/components/ui/separator.tsx src/candidate/components/ui/
cp original-candidate-front/components/ui/utils.ts src/candidate/components/ui/
```

#### **📐 СТИЛИ И ИМПОРТЫ**
```bash
# Копирование стилей
cp original-candidate-front/styles/globals.css src/candidate/styles/

# Копирование импортов
cp original-candidate-front/imports/Synergy-49-121.tsx src/candidate/imports/
cp original-candidate-front/imports/*.ts src/candidate/imports/

# Копирование figma компонентов
cp original-candidate-front/components/figma/ImageWithFallback.tsx src/candidate/figma/
```

---

## 🎯 **ЭТАП 3: СОЗДАНИЕ ОСНОВНОГО APP.TSX**

### **📝 ЗАМЕНА SRC/CANDIDATE/APP.TSX**

```typescript
// src/candidate/App.tsx
import { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { EmailVerification } from './components/EmailVerification';
import { InterviewProcess } from './components/InterviewProcess';

type AppStage = 'auth' | 'email-verification' | 'interview';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

interface JobPosition {
  title: string;
  department: string;
  company: string;
  type: string;
  questionsCount: number;
}

const defaultJobPosition: JobPosition = {
  title: "Frontend Developer",
  department: "Engineering", 
  company: "ВМТ Группа",
  type: "Full-time",
  questionsCount: 3
};

export default function App() {
  const [currentStage, setCurrentStage] = useState<AppStage>('auth');
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleAuthComplete = (data: UserData) => {
    console.log('🔐 Auth completed:', data);
    setUserData(data);
    setCurrentStage('email-verification');
  };

  const handleGoBackToAuth = () => {
    console.log('⬅️ Going back to auth');
    setCurrentStage('auth');
  };

  const handleEmailVerified = () => {
    console.log('✅ Email verified, starting interview');
    setCurrentStage('interview');
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 'auth':
        return (
          <AuthForm 
            onContinue={handleAuthComplete}
            jobPosition={defaultJobPosition}
          />
        );
      
      case 'email-verification':
        return (
          <EmailVerification 
            email={userData?.email || ''} 
            onContinue={handleEmailVerified}
            onGoBack={handleGoBackToAuth}
            jobPosition={defaultJobPosition}
          />
        );
      
      case 'interview':
        return <InterviewProcess />;
      
      default:
        return (
          <AuthForm 
            onContinue={handleAuthComplete}
            jobPosition={defaultJobPosition}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-interview-bg">
      {/* Debug Info - показываем только в development режиме */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-stage">
          App Stage: {currentStage}
        </div>
      )}
      {renderCurrentStage()}
    </div>
  );
}
```

---

## 🎯 **ЭТАП 4: ИСПРАВЛЕНИЕ ИМПОРТОВ**

### **📝 ОБНОВЛЕНИЕ ПУТЕЙ ИМПОРТОВ**

#### **🔧 В КОМПОНЕНТАХ**
```typescript
// Заменить импорты в скопированных файлах

// Было:
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

// Стало:
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
```

#### **🎨 В UI КОМПОНЕНТАХ**
```typescript
// Заменить импорты в UI компонентах

// Было:
import { cn } from "./utils"

// Стало:
import { cn } from "./utils"
```

#### **📐 В СТИЛЯХ**
```css
/* Подключить стили в index.css или App.tsx */
@import './candidate/styles/globals.css';
```

---

## 🎯 **ЭТАП 5: ИНТЕГРАЦИЯ С API**

### **📝 ОБНОВЛЕНИЕ AUTHFORM.TSX**

```typescript
// Добавить интеграцию с API в AuthForm.tsx
import { candidateAuthService } from '../services/candidateAuthService';

// В handleSubmit добавить:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (validateForm()) {
    setIsLoading(true);
    try {
      const response = await candidateAuthService.authenticate({
        firstName,
        lastName,
        email
      });
      
      if (response.success) {
        onContinue({ firstName, lastName, email });
      } else {
        setError(response.error || 'Ошибка авторизации');
      }
    } catch (error) {
      setError('Произошла ошибка при авторизации');
    } finally {
      setIsLoading(false);
    }
  }
};
```

### **📝 ОБНОВЛЕНИЕ EMAILVERIFICATION.TSX**

```typescript
// Добавить интеграцию с API в EmailVerification.tsx
import { candidateAuthService } from '../services/candidateAuthService';

// В handleVerifyCode добавить:
const handleVerifyCode = async () => {
  setError('');
  
  if (!code.trim()) {
    setError('Введите код подтверждения');
    return;
  }

  if (code.length !== 6) {
    setError('Код должен содержать 6 цифр');
    return;
  }

  setIsVerifying(true);
  
  try {
    const response = await candidateAuthService.verifyEmail(email, code);
    
    if (response.success) {
      onContinue();
    } else {
      setError(response.error || 'Неверный код');
    }
  } catch (error) {
    setError('Произошла ошибка при проверке кода');
  } finally {
    setIsVerifying(false);
  }
};
```

---

## 🎯 **ЭТАП 6: ПРОВЕРКА И ТЕСТИРОВАНИЕ**

### **✅ ЧЕКАПЫ ДЛЯ ПРОВЕРКИ**

#### **🎨 ВИЗУАЛЬНОЕ СООТВЕТСТВИЕ**
- [ ] Цвета точно соответствуют оригиналу
- [ ] Типографика использует Inter шрифт
- [ ] Радиусы и отступы правильные
- [ ] Анимации работают корректно

#### **🔧 ФУНКЦИОНАЛЬНОСТЬ**
- [ ] AuthForm работает с API
- [ ] EmailVerification работает с API
- [ ] InterviewProcess запускается
- [ ] Аудио функциональность работает

#### **📐 СТРУКТУРА**
- [ ] Все файлы скопированы
- [ ] Импорты исправлены
- [ ] Стили подключены
- [ ] Нет ошибок компиляции

---

## 🎯 **ЭТАП 7: ФИНАЛЬНАЯ НАСТРОЙКА**

### **📝 ОБНОВЛЕНИЕ PACKAGE.JSON**

```json
{
  "dependencies": {
    "motion": "^10.16.4",
    "lucide-react": "^0.294.0"
  }
}
```

### **📝 ОБНОВЛЕНИЕ TSCONFIG.JSON**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "figma:asset/*": ["./src/assets/*"]
    }
  }
}
```

---

## 🎯 **КРИТЕРИИ ГОТОВНОСТИ**

### **✅ ВИЗУАЛЬНОЕ СООТВЕТСТВИЕ**
- [ ] Цветовая схема точно соответствует оригиналу
- [ ] Типографика использует Inter шрифт с правильными размерами
- [ ] Все компоненты имеют оригинальные радиусы и отступы
- [ ] Анимации и переходы работают как в оригинале

### **✅ ФУНКЦИОНАЛЬНОСТЬ**
- [ ] Флоу авторизации работает корректно
- [ ] Верификация email функционирует
- [ ] Процесс интервью с аудио работает
- [ ] Все API интеграции сохранены

### **✅ КОД**
- [ ] Структура соответствует оригиналу
- [ ] Компоненты переиспользуют оригинальный код
- [ ] Стили используют оригинальные CSS переменные
- [ ] Нет дублирования кода

---

**Автор**: Cursor AI  
**Дата**: 28 декабря 2024  
**Статус**: ✅ Детальная карта копирования создана
