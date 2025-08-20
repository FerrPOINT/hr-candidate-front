# Конфигурация деплоя

Используйте только REACT_APP_API_BASE_URL для настройки API:
```
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
```

Для продакшена переменную не указывайте.

## Требования для работы микрофона

### HTTPS обязателен
Браузеры требуют HTTPS для доступа к микрофону. Локально работает HTTP только для localhost.

### Content Security Policy (CSP)
Нужно настроить CSP для разрешения доступа к медиа устройствам.

## Переменные окружения

### Production
```bash
REACT_APP_RECRUITER_API_HOST=your-production-api-host:8080
NODE_ENV=production
HTTPS=true
SSL_CRT_FILE=path/to/certificate.crt
SSL_KEY_FILE=path/to/private.key
```

### Development
```bash
REACT_APP_RECRUITER_API_HOST=your-dev-api-host:8080
NODE_ENV=development
```

## Запуск

### Development (локально)
```bash
REACT_APP_RECRUITER_API_HOST=localhost:8080 npm start
```

### Development с HTTPS (для тестирования микрофона)
```bash
HTTPS=true npm start
```

### Production
```bash
npm run build
serve -s build
```

## Настройка сервера

### Nginx конфигурация
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
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
    ";
    
    location / {
        root /path/to/build;
        try_files $uri $uri/ /index.html;
    }
}

# Редирект с HTTP на HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### Apache конфигурация
```apache
<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /path/to/build
    
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    # CSP для микрофона
    Header always set Content-Security-Policy "
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        media-src 'self' blob:;
        connect-src 'self' https://your-api-host:8080;
        frame-ancestors 'none';
    "
    
    <Directory /path/to/build>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

## Проверка работы микрофона

1. Откройте DevTools (F12)
2. Перейдите на вкладку Console
3. Найдите логи с префиксом 🎵
4. Убедитесь, что все API поддерживаются:
   - `getUserMedia: true`
   - `MediaRecorder: true`
   - `AudioContext: true`

## Устранение проблем

### Ошибка "getUserMedia not supported"
- Убедитесь, что используется HTTPS
- Проверьте CSP заголовки
- Проверьте разрешения браузера на микрофон

### Ошибка "MediaDevices API not available"
- Проверьте, что браузер поддерживает MediaDevices API
- Убедитесь, что нет блокировщиков рекламы

### Ошибка "Permission denied"
- Проверьте разрешения браузера
- Убедитесь, что пользователь разрешил доступ к микрофону