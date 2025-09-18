# 🚀 Руководство по развертыванию

**Проект:** HR Recruiter Frontend  
**Версия:** 0.1.0  
**Дата:** 2025-01-27

## 📋 Обзор

Данное руководство описывает процесс развертывания HR Recruiter Frontend в различных окружениях: разработка, тестирование и продакшен.

## 🎯 Окружения

### Development (Разработка)
- **URL:** `http://localhost:3003`
- **Назначение:** Локальная разработка
- **Особенности:** Hot reload, debug режим

### Staging (Тестирование)
- **URL:** `https://staging.hr-recruiter.com`
- **Назначение:** Тестирование перед продакшеном
- **Особенности:** Продакшен-подобная среда

### Production (Продакшен)
- **URL:** `https://hr-recruiter.com`
- **Назначение:** Рабочая среда
- **Особенности:** Оптимизация, мониторинг

## 🔧 Предварительные требования

### Системные требования

- **Node.js:** 16.0.0 или выше
- **npm:** 8.0.0 или выше
- **Git:** 2.30.0 или выше
- **Память:** Минимум 4GB RAM
- **Диск:** Минимум 2GB свободного места

### Внешние зависимости

- **Backend API:** Доступен и настроен
- **SSL сертификат:** Для HTTPS окружений
- **Domain:** Настроен DNS

## 🏗️ Подготовка к развертыванию

### 1. Клонирование репозитория

```bash
# Клонирование
git clone <repository-url>
cd hr-candidate-front

# Переключение на нужную ветку
git checkout main  # или staging, production
```

### 2. Установка зависимостей

```bash
# Установка зависимостей
npm ci  # Использует package-lock.json

# Проверка версий
node --version  # Должно быть 16+
npm --version   # Должно быть 8+
```

### 3. Генерация API клиентов

```bash
# Валидация OpenAPI спецификации
npm run validate:openapi

# Генерация API клиентов
npm run generate:api

# Проверка генерации
npm run generate:models:index
```

### 4. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
# .env.local
# API Configuration
REACT_APP_API_BASE_URL=https://api.hr-recruiter.com
REACT_APP_API_TIMEOUT=30000

# Backend API Configuration
REACT_APP_BACKEND_API_URL=https://api.hr-recruiter.com

# Environment
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false

# Analytics (опционально)
REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
REACT_APP_SENTRY_DSN=your_sentry_dsn_here
```

### 5. Проверка конфигурации

```bash
# Линтинг
npm run lint

# Тестирование
npm run test:jest

# Полная проверка
npm run check
```

## 🚀 Развертывание

### Development (Локальная разработка)

```bash
# Запуск в режиме разработки
npm start

# Или с HTTPS
npm run start:https

# Или с переменными окружения
npm run start:env
```

**Проверка:**
- Откройте `http://localhost:3003/candidate`
- Проверьте работу всех функций
- Убедитесь в отсутствии ошибок в консоли

### Staging (Тестирование)

#### 1. Сборка для staging

```bash
# Установка staging переменных
export REACT_APP_ENVIRONMENT=staging
export REACT_APP_API_BASE_URL=https://staging-api.hr-recruiter.com

# Сборка
npm run build

# Проверка сборки
ls -la build/
```

#### 2. Развертывание на сервер

```bash
# Копирование файлов на сервер
scp -r build/* user@staging-server:/var/www/html/

# Или через rsync
rsync -avz --delete build/ user@staging-server:/var/www/html/
```

#### 3. Настройка веб-сервера (Nginx)

```nginx
# /etc/nginx/sites-available/hr-recruiter-staging
server {
    listen 80;
    server_name staging.hr-recruiter.com;
    
    root /var/www/html;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static assets caching
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 4. SSL сертификат (Let's Encrypt)

```bash
# Установка certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d staging.hr-recruiter.com

# Автообновление
sudo crontab -e
# Добавить: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Production (Продакшен)

#### 1. Подготовка продакшен сборки

```bash
# Установка продакшен переменных
export NODE_ENV=production
export REACT_APP_ENVIRONMENT=production
export REACT_APP_API_BASE_URL=https://api.hr-recruiter.com

# Сборка с оптимизацией
npm run build

# Проверка размера bundle
npm run analyze  # Если настроен webpack-bundle-analyzer
```

#### 2. Развертывание

```bash
# Создание backup текущей версии
sudo cp -r /var/www/html /var/www/html.backup.$(date +%Y%m%d_%H%M%S)

# Развертывание новой версии
sudo rsync -avz --delete build/ /var/www/html/

# Установка правильных прав
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

#### 3. Настройка Nginx для продакшена

```nginx
# /etc/nginx/sites-available/hr-recruiter
server {
    listen 80;
    server_name hr-recruiter.com www.hr-recruiter.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hr-recruiter.com www.hr-recruiter.com;
    
    root /var/www/html;
    index index.html;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/hr-recruiter.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hr-recruiter.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static assets caching
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy (если нужно)
    location /api/ {
        proxy_pass https://api.hr-recruiter.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 4. Настройка мониторинга

```bash
# Установка PM2 для управления процессами
npm install -g pm2

# Создание ecosystem файла
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'hr-recruiter-frontend',
    script: 'serve',
    args: '-s build -l 3000',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Запуск приложения
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔧 Конфигурация сервера

### Nginx оптимизация

```nginx
# /etc/nginx/nginx.conf
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Buffer sizes
    client_body_buffer_size 128k;
    client_max_body_size 100m;  # Для больших аудио файлов
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    
    # Timeouts
    client_body_timeout 12;
    client_header_timeout 12;
    keepalive_timeout 15;
    send_timeout 10;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
```

### SSL/TLS конфигурация

```bash
# Генерация сильного DH параметра
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

# Добавление в nginx конфигурацию
ssl_dhparam /etc/ssl/certs/dhparam.pem;
```

## 📊 Мониторинг и логирование

### Настройка логирования

```bash
# Создание директории для логов
sudo mkdir -p /var/log/hr-recruiter
sudo chown www-data:www-data /var/log/hr-recruiter

# Настройка logrotate
sudo tee /etc/logrotate.d/hr-recruiter << EOF
/var/log/hr-recruiter/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
EOF
```

### Мониторинг производительности

```bash
# Установка htop для мониторинга
sudo apt install htop

# Установка nginx monitoring
sudo apt install nginx-module-njs

# Настройка мониторинга диска
df -h
du -sh /var/www/html/*
```

## 🔒 Безопасность

### Firewall настройка

```bash
# UFW настройка
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 80
sudo ufw allow 443
sudo ufw status
```

### Обновление системы

```bash
# Регулярные обновления
sudo apt update
sudo apt upgrade -y

# Автоматические обновления безопасности
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 🚨 Troubleshooting

### Частые проблемы

#### 1. Ошибка 413 (Payload Too Large)

```nginx
# В nginx конфигурации
client_max_body_size 100m;
```

#### 2. Проблемы с SPA роутингом

```nginx
# Убедитесь что есть fallback на index.html
location / {
    try_files $uri $uri/ /index.html;
}
```

#### 3. Проблемы с CORS

```bash
# Проверьте настройки API сервера
curl -H "Origin: https://hr-recruiter.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://api.hr-recruiter.com/candidates/login
```

### Логи для диагностики

```bash
# Nginx логи
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Системные логи
sudo journalctl -u nginx -f

# PM2 логи (если используется)
pm2 logs hr-recruiter-frontend
```

## 🔄 Автоматизация развертывания

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Generate API clients
      run: npm run generate:api
    
    - name: Run tests
      run: npm run test:jest
    
    - name: Build application
      run: npm run build
      env:
        REACT_APP_ENVIRONMENT: production
        REACT_APP_API_BASE_URL: ${{ secrets.API_BASE_URL }}
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/html
          sudo cp -r . ../html.backup.$(date +%Y%m%d_%H%M%S)
          sudo rsync -avz --delete /tmp/build/ ./
          sudo chown -R www-data:www-data .
          sudo systemctl reload nginx
```

### Docker развертывание

```dockerfile
# Dockerfile
FROM node:16-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run generate:api
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/ssl/certs
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 📋 Чек-лист развертывания

### Перед развертыванием

- [ ] Все тесты проходят
- [ ] Линтинг без ошибок
- [ ] API клиенты сгенерированы
- [ ] Переменные окружения настроены
- [ ] SSL сертификат действителен
- [ ] Backup создан

### После развертывания

- [ ] Приложение доступно по URL
- [ ] Все функции работают
- [ ] Нет ошибок в консоли браузера
- [ ] Нет ошибок в логах сервера
- [ ] SSL сертификат работает
- [ ] Мониторинг настроен
- [ ] Backup процедуры работают

## 📞 Поддержка

При возникновении проблем:

1. **Проверьте логи** - nginx, приложения, системы
2. **Проверьте конфигурацию** - nginx, переменные окружения
3. **Проверьте сеть** - DNS, SSL, API доступность
4. **Обратитесь к команде** - DevOps или разработчики

**Контакты:**
- **DevOps:** devops@hr-recruiter.com
- **Разработка:** dev@hr-recruiter.com
- **Экстренные случаи:** +7-XXX-XXX-XXXX

---

**Документ поддерживается командой DevOps**  
**Последнее обновление:** 2025-01-27
