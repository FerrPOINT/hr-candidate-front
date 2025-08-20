# 🎨 КАРТА ДИЗАЙНА: ТОЧНОЕ ВОСПРОИЗВЕДЕНИЕ ОРИГИНАЛЬНОГО UI КАНДИДАТА

## 📋 **ОБЩАЯ КОНЦЕПЦИЯ**
Полное воспроизведение оригинального дизайна из `original-candidate-front` с точным соответствием цветов, типографики, компонентов и анимаций.

---

## 🎨 **ЦВЕТОВАЯ СИСТЕМА**

### **🎯 ОСНОВНЫЕ ЦВЕТА**
```css
/* Фоны */
--interview-bg: rgba(233, 234, 226, 1);        /* #e9eae2 - светло-зеленый */
--interview-substrate: rgba(245, 246, 241, 1); /* #f5f6f1 - светло-бежевый */

/* Акценты */
--interview-accent: rgba(225, 99, 73, 1);      /* #e16349 - оранжевый */
--interview-accent-hover: rgba(213, 90, 66, 1); /* #d55a42 - оранжевый ховер */

/* Дополнительные */
--destructive: rgba(223, 28, 65, 1);           /* #df1c41 - красный */
--border: rgba(226, 228, 233, 1);              /* #e2e4e9 - границы */
```

### **🎨 ПРИМЕНЕНИЕ ЦВЕТОВ**
```css
/* Основной фон страницы */
.bg-[#e9eae2] /* или */ var(--interview-bg)

/* Карточки и контейнеры */
.bg-[#f5f6f1] /* или */ var(--interview-substrate)

/* Кнопки и акценты */
.bg-[#e16349] /* или */ var(--interview-accent)

/* Ховер состояния */
.hover:bg-[#d55a42] /* или */ var(--interview-accent-hover)

/* Кнопка записи */
.bg-[#df1c41] /* или */ var(--destructive)
```

---

## 📐 **ТИПОГРАФИКА**

### **🔤 ШРИФТ**
```css
font-family: 'Inter', sans-serif;
```

### **📏 РАЗМЕРЫ ТЕКСТА**
```css
/* Основные размеры */
--text-interview-message: 18px;    /* Сообщения в чате */
--text-interview-button: 16px;     /* Кнопки */
--line-height-interview-message: 24px;
--line-height-interview-button: 20px;

/* Дополнительные */
--text-h1: 56px;
--text-h2: 48px;
--text-h3: 40px;
--text-h4: 32px;
--text-h5: 24px;
--text-base: 16px;
--text-sm: 14px;
```

### **📝 ПРИМЕНЕНИЕ ТИПОГРАФИКИ**
```css
/* Заголовки */
.text-[#0a0d14] /* Основной текст */
.text-[#e16349] /* Акцентный текст */

/* Сообщения */
.text-interview-18 /* 18px для сообщений */
.text-interview-16 /* 16px для кнопок */

/* Код подтверждения */
.text-2xl text-center font-mono tracking-widest
```

---

## 🧩 **КОМПОНЕНТЫ**

### **🔐 AUTHFORM (ФОРМА АВТОРИЗАЦИИ)**

#### **📐 СТРУКТУРА**
```tsx
<div className="bg-[#e9eae2] min-h-screen w-full">
  <div className="flex flex-col gap-4 p-6 w-full h-full">
    
    {/* Header */}
    <div className="flex items-center justify-between w-full">
      <WMTLogo size="medium" />
      <HelpButton onClick={() => setIsHelpModalOpen(true)} />
    </div>

    {/* Main Content */}
    <div className="flex-1 flex items-center justify-center px-4 mt-8">
      <div className="bg-[#f5f6f1] rounded-[44px] w-full max-w-2xl">
        <div className="flex flex-col gap-6 p-6 w-full">
          
          {/* Job Position Card */}
          <div className="bg-white rounded-[32px] w-full">
            <div className="flex flex-col gap-5 p-6 w-full">
              
              {/* Job info */}
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Вы проходите интервью на позицию:
                </p>
                <div className="bg-[#e16349]/10 border border-[#e16349]/20 rounded-[20px] p-5 mb-4">
                  <h4 className="text-[#e16349] mb-2">
                    {jobPosition.title}
                  </h4>
                  <p className="text-gray-600">
                    {jobPosition.company} • {jobPosition.questionsCount} вопросов
                  </p>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-6 w-full">
                <div className="space-y-5">
                  {/* Input fields */}
                  <div>
                    <Label className="text-[#0a0d14] mb-2 block text-left">
                      Имя
                    </Label>
                    <div className="bg-white relative rounded-[20px] w-full">
                      <Input
                        className="w-full border-[#e2e4e9] bg-transparent h-14 px-6 rounded-[20px] text-base"
                        placeholder="Введите ваше имя"
                      />
                    </div>
                  </div>
                  
                  {/* Similar for lastName and email */}
                </div>

                {/* Submit button */}
                <Button
                  className="bg-[#e16349] hover:bg-[#d55a42] text-white rounded-3xl px-8 py-4 w-full h-16 text-lg font-medium"
                >
                  Продолжить
                </Button>
              </form>
            </div>
          </div>

          {/* Privacy note */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Ваши данные будут использованы только для проведения интервью
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### **🎨 КЛЮЧЕВЫЕ ЭЛЕМЕНТЫ**
- **Фон**: `bg-[#e9eae2]` (светло-зеленый)
- **Контейнер**: `bg-[#f5f6f1] rounded-[44px]` (светло-бежевый с большим радиусом)
- **Карточка**: `bg-white rounded-[32px]` (белая с большим радиусом)
- **Вакансия**: `bg-[#e16349]/10 border border-[#e16349]/20 rounded-[20px]` (оранжевый акцент)
- **Поля**: `border-[#e2e4e9] bg-transparent h-14 px-6 rounded-[20px]`
- **Кнопка**: `bg-[#e16349] hover:bg-[#d55a42] rounded-3xl h-16`

---

### **📧 EMAILVERIFICATION (ВЕРИФИКАЦИЯ EMAIL)**

#### **📐 СТРУКТУРА**
```tsx
<div className="bg-[#e9eae2] min-h-screen w-full">
  {/* Same header structure as AuthForm */}
  
  <div className="bg-[#f5f6f1] rounded-[44px] w-full max-w-2xl">
    <div className="flex flex-col gap-6 p-6 w-full">
      
      {/* Back button */}
      <div className="flex justify-start">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-white hover:bg-[#e16349] px-4 py-2 h-10 rounded-2xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>
      </div>
      
      {/* Main card */}
      <div className="bg-white rounded-[32px] w-full">
        <div className="flex flex-col gap-6 p-6 w-full">
          
          {/* Job position info */}
          <div className="bg-[#e16349]/10 border border-[#e16349]/20 rounded-[20px] p-5 w-full">
            <div className="text-center">
              <h4 className="text-[#e16349] mb-2">
                {jobPosition.title}
              </h4>
              <p className="text-gray-600">
                {jobPosition.company} • {jobPosition.questionsCount} вопросов
              </p>
            </div>
          </div>

          {/* Email info */}
          <div className="text-center">
            <p className="text-gray-600 mb-3">
              Мы отправили 6-значный код подтверждения на:
            </p>
            <p className="text-[#e16349] font-medium text-lg">
              {email}
            </p>
          </div>

          {/* Code input */}
          <div className="w-full">
            <div className="bg-white relative rounded-[20px] w-full mb-3">
              <Input
                className="w-full border-[#e2e4e9] bg-transparent h-16 px-6 rounded-[20px] text-2xl text-center font-mono tracking-widest"
                placeholder="123456"
                maxLength={6}
              />
            </div>
            <p className="text-gray-500 text-sm text-center">
              Введите 6-значный код из письма. Код действителен 10 минут.
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-5 w-full">
            <Button
              className="bg-[#e16349] hover:bg-[#d55a42] text-white rounded-3xl px-8 py-4 w-full h-16 text-lg font-medium"
            >
              Подтвердить код
            </Button>
            
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-white hover:bg-[#e16349] px-4 py-2 h-10 rounded-2xl"
              >
                Отправить код повторно
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Help text */}
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Не получили код? Проверьте папку "Спам" или "Промоакции"
        </p>
      </div>
    </div>
  </div>
</div>
```

#### **🎨 КЛЮЧЕВЫЕ ЭЛЕМЕНТЫ**
- **Кнопка "Назад"**: `text-gray-600 hover:text-white hover:bg-[#e16349]`
- **Поле кода**: `h-16 text-2xl text-center font-mono tracking-widest`
- **Валидация**: `border-green-500` при правильном коде, `border-red-500` при ошибке

---

### **🎤 INTERVIEWPROCESS (ПРОЦЕСС ИНТЕРВЬЮ)**

#### **📐 СТРУКТУРА**
```tsx
<div className="bg-interview-bg min-h-screen w-full">
  <div className="flex flex-col gap-4 p-6 w-full h-full">
    
    {/* Header */}
    <div className="flex items-center justify-between w-full">
      <WMTLogo size="medium" />
      <HelpButton onClick={() => setIsHelpModalOpen(true)} />
    </div>

    {/* Main Content Area */}
    <div className="flex-1 overflow-hidden relative">
      <div className="h-full overflow-y-auto px-6 pb-80 custom-scroll-container">
        <div className="max-w-4xl mx-auto">
          {/* Stage content */}
          {renderStageContent()}
        </div>
      </div>
    </div>

    {/* Fixed Bottom Controls */}
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-50">
      {/* Gradient Background */}
      <div className="bottom-controls-gradient h-80" />
      
      {/* Controls Container */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        <div className="w-full max-w-2xl mx-auto px-6 pb-8 pointer-events-auto">
          
          {/* AI Avatar */}
          {shouldShowAvatar() && (
            <AIAvatarWithWaves 
              size={stage === 'question-completed' ? 'small' : 'large'} 
              isSpeaking={isAISpeaking}
            />
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-center">
            <Button className="interview-button">
              Записать ответ
            </Button>
            <Button className="interview-button-secondary">
              Пропустить
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### **🎨 КЛЮЧЕВЫЕ ЭЛЕМЕНТЫ**
- **Фон**: `bg-interview-bg` (CSS переменная)
- **Скролл**: `custom-scroll-container` с кастомным скроллбаром
- **Градиент**: `bottom-controls-gradient h-80` для нижних контролов
- **Кнопки**: `interview-button` и `interview-button-secondary` классы

---

## 🎨 **CSS КЛАССЫ И СТИЛИ**

### **🔘 КНОПКИ**
```css
.interview-button {
  background: var(--interview-accent);
  color: white;
  border-radius: 24px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(225, 99, 73, 0.2);
}

.interview-button:hover {
  background: var(--interview-accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(225, 99, 73, 0.3);
}

.interview-button-secondary {
  background: transparent;
  color: var(--interview-accent);
  border: 2px solid var(--interview-accent);
  border-radius: 24px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.2s;
}

.interview-button-secondary:hover {
  background: var(--interview-accent);
  color: white;
}
```

### **🎤 КНОПКА ЗАПИСИ**
```css
.pulse-recording {
  animation: pulse-recording 2s infinite;
}

@keyframes pulse-recording {
  0%, 100% { 
    transform: scale(1); 
    box-shadow: 0 0 0 0 rgba(223, 28, 65, 0.7);
  }
  50% { 
    transform: scale(1.05); 
    box-shadow: 0 0 0 10px rgba(223, 28, 65, 0);
  }
}
```

### **📜 СКРОЛЛ**
```css
.custom-scroll-container {
  scrollbar-width: thin;
  scrollbar-color: var(--interview-accent) transparent;
}

.custom-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.custom-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll-container::-webkit-scrollbar-thumb {
  background: var(--interview-accent);
  border-radius: 3px;
}

.custom-scroll-container::-webkit-scrollbar-thumb:hover {
  background: var(--interview-accent-hover);
}
```

### **🌈 ГРАДИЕНТЫ**
```css
.bottom-controls-gradient {
  background: linear-gradient(
    to top,
    var(--interview-bg) 0%,
    rgba(233, 234, 226, 0.8) 50%,
    transparent 100%
  );
}
```

---

## 🎭 **АНИМАЦИИ И ПЕРЕХОДЫ**

### **📱 ПОЯВЛЕНИЕ КОМПОНЕНТОВ**
```css
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### **🔄 ПЕРЕХОДЫ МЕЖДУ ЭТАПАМИ**
```tsx
// Использование motion.div для плавных переходов
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  {/* Component content */}
</motion.div>
```

---

## 📱 **АДАПТИВНОСТЬ**

### **📱 МОБИЛЬНЫЕ УСТРОЙСТВА**
```css
@media (max-width: 768px) {
  .interview-button {
    font-size: 16px;
    padding: 14px 24px;
  }
  
  .custom-scroll-container {
    padding-bottom: 120px;
  }
  
  .bottom-controls-gradient {
    height: 120px;
  }
}
```

---

## 🎯 **КРИТЕРИИ СООТВЕТСТВИЯ**

### **✅ ЦВЕТА**
- [ ] Все цвета точно соответствуют оригиналу
- [ ] Используются CSS переменные для консистентности
- [ ] Ховер состояния реализованы корректно

### **✅ ТИПОГРАФИКА**
- [ ] Шрифт Inter подключен и используется
- [ ] Размеры текста соответствуют оригиналу
- [ ] Межстрочные интервалы правильные

### **✅ КОМПОНЕНТЫ**
- [ ] Все компоненты скопированы из оригинала
- [ ] Структура HTML соответствует оригиналу
- [ ] CSS классы применяются корректно

### **✅ АНИМАЦИИ**
- [ ] Все анимации работают как в оригинале
- [ ] Переходы между этапами плавные
- [ ] Кнопка записи пульсирует

### **✅ АДАПТИВНОСТЬ**
- [ ] Дизайн корректно отображается на мобильных
- [ ] Все элементы доступны на разных экранах
- [ ] Скролл работает на всех устройствах

---

**Автор**: Cursor AI  
**Дата**: 28 декабря 2024  
**Статус**: ✅ Карта дизайна создана для точного воспроизведения оригинального UI
