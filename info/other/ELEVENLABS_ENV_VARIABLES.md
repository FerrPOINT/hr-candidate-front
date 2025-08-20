# 🔧 Переменные окружения для ElevenLabs интеграции

## 📋 Обязательные переменные

### 1. **ElevenLabs API Key** (ОБЯЗАТЕЛЬНО)
```bash
REACT_APP_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```
**Как получить:**
1. Зарегистрируйтесь на [elevenlabs.io](https://elevenlabs.io)
2. Перейдите в [API Keys](https://elevenlabs.io/app/api-keys)
3. Создайте новый API ключ
4. Скопируйте ключ

### 2. **Backend API URL** (ОБЯЗАТЕЛЬНО)
```bash
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
```
**Описание:** URL вашего backend API для интервью

## 🔧 Опциональные переменные

### 3. **ElevenLabs Voice ID** (ОПЦИОНАЛЬНО)
```bash
REACT_APP_ELEVENLABS_DEFAULT_VOICE_ID=pNInz6obpgDQGcFmaJgB
```
**Описание:** ID голоса по умолчанию для агента
**Значение по умолчанию:** `pNInz6obpgDQGcFmaJgB` (Adam voice)

### 4. **Backend URL для прокси** (ОПЦИОНАЛЬНО)
```bash
REACT_APP_BACKEND_URL=http://localhost:8080
```
**Описание:** URL backend для прокси запросов

### 5. **Использование прокси** (ОПЦИОНАЛЬНО)
```bash
REACT_APP_USE_PROXY=true
```
**Описание:** Включить прокси для API запросов

## 🔒 HTTPS переменные (для продакшена)

### 6. **HTTPS включение** (ОПЦИОНАЛЬНО)
```bash
REACT_APP_HTTPS=true
```
**Описание:** Включить HTTPS для локальной разработки

### 7. **SSL сертификаты** (ОПЦИОНАЛЬНО)
```bash
REACT_APP_SSL_CRT_FILE=./ssl/cert.pem
REACT_APP_SSL_KEY_FILE=./ssl/key.pem
```
**Описание:** Пути к SSL сертификатам для HTTPS

## 📁 Создание файла .env.local

Создайте файл `.env.local` в корне проекта:

```bash
# ElevenLabs Configuration
REACT_APP_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
REACT_APP_ELEVENLABS_DEFAULT_VOICE_ID=pNInz6obpgDQGcFmaJgB

# Backend Configuration
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
REACT_APP_USE_PROXY=true
REACT_APP_BACKEND_URL=http://localhost:8080

# Optional: HTTPS Configuration
REACT_APP_HTTPS=false
REACT_APP_SSL_CRT_FILE=./ssl/cert.pem
REACT_APP_SSL_KEY_FILE=./ssl/key.pem
```

## 🚀 Быстрый старт

### 1. Создайте .env.local:
```bash
cp .env.example .env.local
```

### 2. Отредактируйте .env.local:
```bash
# Замените на ваш API ключ
REACT_APP_ELEVENLABS_API_KEY=sk-your-actual-api-key-here

# Укажите URL вашего backend
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
```

### 3. Запустите приложение:
```bash
npm start
```

## ⚠️ Важные замечания

1. **API ключ обязателен** - без него ElevenLabs не будет работать
2. **Backend URL обязателен** - без него не будут работать интервью
3. **Файл .env.local** не должен попадать в git (уже в .gitignore)
4. **Перезапуск** - после изменения переменных нужно перезапустить dev сервер

## 🔍 Проверка переменных

В консоли браузера можно проверить, что переменные загружены:

```javascript
console.log('ElevenLabs API Key:', process.env.REACT_APP_ELEVENLABS_API_KEY);
console.log('Backend URL:', process.env.REACT_APP_API_BASE_URL);
```

## 🛠️ Troubleshooting

### Ошибка "ElevenLabs API Key not found"
- Проверьте, что `REACT_APP_ELEVENLABS_API_KEY` установлен в `.env.local`
- Перезапустите dev сервер

### Ошибка "Backend connection failed"
- Проверьте, что `REACT_APP_API_BASE_URL` правильный
- Убедитесь, что backend сервер запущен

### Ошибка "Voice not found"
- Проверьте `REACT_APP_ELEVENLABS_DEFAULT_VOICE_ID`
- Убедитесь, что голос существует в вашем ElevenLabs аккаунте 