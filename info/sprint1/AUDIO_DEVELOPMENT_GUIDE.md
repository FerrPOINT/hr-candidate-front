# 🎤 Руководство по разработке аудио функциональности

## 📋 Содержание

1. [Архитектура системы](#архитектура-системы)
2. [Проблемы и решения](#проблемы-и-решения)
3. [Структура кода](#структура-кода)
4. [Настройка HTTPS](#настройка-https)
5. [Диагностика](#диагностика)
6. [Тестирование](#тестирование)
7. [Деплой](#деплой)
8. [Устранение неполадок](#устранение-неполадок)

## 🏗️ Архитектура системы

### Общая схема
```
Пользователь → HTTPS → Nginx → HTTP → Приложения
     ↑         ↑        ↑       ↑         ↑
   Микрофон  SSL     Прокси  Внутри    Node.js API
             сертификат      сети      React App
```

### Компоненты
- **Клиент (React)** - запись аудио в браузере
- **Сервер (Node.js)** - обработка аудио файлов
- **Nginx** - SSL терминация и проксирование
- **Браузерные API** - MediaDevices, MediaRecorder, AudioContext

### Поток данных
1. Пользователь разрешает доступ к микрофону
2. React приложение записывает аудио через браузерные API
3. Аудио файл отправляется на сервер
4. Сервер обрабатывает и транскрибирует аудио
5. Результат возвращается клиенту

## 🐛 Проблемы и решения

### Основная проблема: HTTP vs HTTPS

**Проблема:** Браузеры требуют HTTPS для доступа к микрофону
- ❌ HTTP на сервере → `navigator.mediaDevices` недоступен
- ✅ HTTPS на сервере → полный доступ к микрофону
- ✅ HTTP на localhost → исключение для разработки

**Решение:** Настроить HTTPS с SSL терминацией в Nginx

### Другие проблемы
- **CSP заголовки** - блокируют доступ к медиа устройствам
- **Блокировщики рекламы** - могут блокировать MediaDevices API
- **Разрешения браузера** - пользователь может отклонить доступ
- **Старые браузеры** - могут не поддерживать современные API

## 📁 Структура кода

### Основные файлы

```
src/
├── services/
│   ├── audioService.ts          # Основной аудио сервис
│   ├── browserAudioService.ts   # Браузерные API
│   └── apiService.ts            # API для отправки аудио
├── pages/
│   └── InterviewSession.tsx     # Интерфейс интервью
└── components/
    └── AudioRecorder.tsx        # Компонент записи

public/
├── microphone-test.html         # Простой тест микрофона
├── audio-diagnostic.html        # Диагностика аудио API
└── comprehensive-audio-test.html # Полная диагностика

scripts/
├── start-https.js               # Запуск с HTTPS локально
├── setup-ssl.sh                 # Настройка SSL на сервере
└── analyze-audio-support.js     # Анализ поддержки аудио
```

### Ключевые классы

#### AudioService
```typescript
export class AudioService {
  private browserService: BrowserAudioService | null = null;
  
  async checkSupport(): Promise<AudioSupport>
  async startRecording(options: AudioRecordingOptions): Promise<void>
  async stopRecording(): Promise<Blob>
  async transcribeAudio(audioBlob: Blob): Promise<AudioTranscriptionResult>
}
```

#### BrowserAudioService
```typescript
export class BrowserAudioService {
  checkSupport(): AudioSupport
  async getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream>
  async startRecording(options: any): Promise<void>
  async stopRecording(): Promise<Blob>
}
```

## 🔐 Настройка HTTPS

### Локальная разработка

```bash
# Запуск с HTTPS
npm run start:https

# Или вручную
HTTPS=true npm start
```

### Продакшн (Nginx)

```nginx
# Редирект с HTTP на HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS сервер
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL сертификаты
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # CSP для микрофона
    add_header Content-Security-Policy "
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        media-src 'self' blob:;
        connect-src 'self' https://your-api-host:8080;
        frame-ancestors 'none';
    " always;
    
    # Прокси на React App
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Прокси на API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Автоматическая настройка SSL

```bash
# Использование Let's Encrypt
chmod +x scripts/setup-ssl.sh
./scripts/setup-ssl.sh your-domain.com
```

## 🔍 Диагностика

### Анализ поддержки аудио

```bash
npm run analyze:audio
```

**Результат:**
```
🎯 Общая вероятность успеха: 93.0%
✅ Высокая вероятность успеха! Микрофон должен заработать после настройки HTTPS.
```

### Тестовые страницы

1. **Простой тест:** `/microphone-test.html`
2. **Диагностика:** `/audio-diagnostic.html`
3. **Комплексная диагностика:** `/comprehensive-audio-test.html`

### Проверка в консоли браузера

```javascript
// Проверка протокола
console.log('Protocol:', window.location.protocol);

// Проверка Secure Context
console.log('Secure Context:', window.isSecureContext);

// Проверка MediaDevices
console.log('MediaDevices:', !!navigator.mediaDevices);

// Тест микрофона
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log('✅ Микрофон работает!'))
  .catch(e => console.log('❌ Ошибка:', e.name, e.message));
```

## 🧪 Тестирование

### Локальное тестирование

```bash
# HTTP (только localhost)
npm start

# HTTPS (для тестирования продакшн сценария)
npm run start:https
```

### Тестовые сценарии

1. **Тест микрофона**
   - Открыть интервью
   - Нажать "Тест микрофона"
   - Разрешить доступ
   - Говорить 10 секунд
   - Проверить транскрибацию

2. **Полное интервью**
   - Пройти все вопросы
   - Проверить качество записи
   - Убедиться в сохранении ответов

3. **Кросс-браузерное тестирование**
   - Chrome (рекомендуется)
   - Firefox
   - Safari
   - Edge

### Автоматизированные тесты

```bash
# Запуск тестов
npm test

# Тесты с покрытием
npm run test:coverage
```

## 🚀 Деплой

### Подготовка к деплою

1. **Сборка приложения**
   ```bash
   npm run build
   ```

2. **Настройка переменных окружения**
   ```bash
   REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
   NODE_ENV=production
   ```

3. **Настройка SSL сертификатов**
   ```bash
   ./scripts/setup-ssl.sh your-domain.com
   ```

### Проверка после деплоя

1. **Открыть диагностическую страницу**
   ```
   https://your-domain.com/audio-diagnostic.html
   ```

2. **Проверить логи в консоли**
   ```
   🎵 BrowserAudioService: Is Secure Context: true
   🎵 BrowserAudioService: getUserMedia supported: true
   ```

3. **Протестировать интервью**
   - Создать тестовое интервью
   - Пройти полный цикл записи
   - Проверить качество транскрибации

## 🔧 Устранение неполадок

### Частые проблемы

#### 1. getUserMedia не поддерживается
**Симптомы:** `navigator.mediaDevices: false`
**Причины:** HTTP протокол, неправильные CSP заголовки
**Решение:** Настроить HTTPS и CSP

#### 2. SecurityError
**Симптомы:** `SecurityError: The request is not allowed`
**Причины:** Не HTTPS, неправильные сертификаты
**Решение:** Проверить SSL сертификаты

#### 3. NotAllowedError
**Симптомы:** `NotAllowedError: Permission denied`
**Причины:** Пользователь отклонил разрешение
**Решение:** Показать инструкцию пользователю

#### 4. NotReadableError
**Симптомы:** `NotReadableError: Could not start video source`
**Причины:** Микрофон занят другим приложением
**Решение:** Закрыть другие приложения, использующие микрофон

#### 5. CSP ошибки
**Симптомы:** `Refused to execute inline script`
**Причины:** Неправильные CSP заголовки
**Решение:** Добавить `media-src 'self' blob:` в CSP

### Диагностические команды

```bash
# Проверка SSL сертификатов
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Проверка CSP заголовков
curl -I https://your-domain.com

# Проверка доступности API
curl https://your-domain.com/api/health
```

### Логи для мониторинга

**Клиентские логи:**
- `🎵 BrowserAudioService:` - все аудио операции
- `🎵 InterviewSession:` - проверки поддержки
- `=== START AUDIO RECORDING ===` - начало записи
- `=== STOP AUDIO RECORDING ===` - остановка записи

**Серверные логи:**
- Запросы к API транскрибации
- Ошибки обработки аудио файлов
- Время обработки запросов

## 📊 Мониторинг и метрики

### Ключевые метрики

1. **Успешность записи**
   - Процент успешных записей
   - Средняя длительность записи
   - Размер аудио файлов

2. **Качество транскрибации**
   - Точность распознавания
   - Время обработки
   - Ошибки транскрибации

3. **Пользовательский опыт**
   - Время до первого разрешения микрофона
   - Количество повторных попыток
   - Успешность прохождения интервью

### Алерты

- Ошибки доступа к микрофону > 5%
- Время транскрибации > 30 секунд
- Ошибки SSL сертификатов
- Недоступность API транскрибации

## 🔄 Обновления и поддержка

### Планы развития

1. **Улучшение качества аудио**
   - Шумоподавление
   - Автоматическая настройка громкости
   - Поддержка различных форматов

2. **Расширенная аналитика**
   - Анализ тона голоса
   - Определение эмоций
   - Оценка уверенности

3. **Мобильная поддержка**
   - Адаптация для мобильных браузеров
   - PWA функциональность
   - Офлайн режим

### Поддержка браузеров

- **Chrome 47+** ✅
- **Firefox 44+** ✅
- **Safari 11+** ✅
- **Edge 12+** ✅

### Устаревшие браузеры

Для старых браузеров рекомендуется:
- Показать предупреждение
- Предложить обновить браузер
- Предоставить альтернативный способ (текстовый ввод)

## 📚 Дополнительные ресурсы

### Документация
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

### Инструменты
- [Web Audio API Inspector](https://github.com/WebAudio/web-audio-api-inspector)
- [Audio Context Tester](https://webaudio.github.io/web-audio-api/)

### Примеры кода
- [Web Audio Examples](https://github.com/mdn/webaudio-examples)
- [MediaRecorder Examples](https://github.com/mdn/dom-examples/tree/main/media/mediarecorder)

---

**Версия:** 1.0  
**Последнее обновление:** 2024  
**Автор:** Команда разработки HR Recruiter 