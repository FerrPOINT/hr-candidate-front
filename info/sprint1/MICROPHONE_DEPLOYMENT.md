# Деплой с поддержкой микрофона

## 🎯 Основные требования

1. **HTTPS обязателен** - браузеры требуют HTTPS для доступа к микрофону
2. **Правильные CSP заголовки** - для разрешения доступа к медиа устройствам
3. **SSL сертификаты** - валидные сертификаты для домена

## 🚀 Быстрый старт

### Локальное тестирование с HTTPS
```bash
npm run start:https
```
Приложение будет доступно по адресу: https://localhost:3000

### Продакшн деплой
1. Соберите приложение: `npm run build`
2. Настройте веб-сервер с HTTPS
3. Добавьте CSP заголовки (см. ниже)

## 🔧 Настройка сервера

### Nginx (рекомендуется)
```nginx
server {
    listen 443 ssl http2;
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
```

### Apache
```apache
<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /path/to/build
    
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    Header always set Content-Security-Policy "
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        media-src 'self' blob:;
        connect-src 'self' https://your-api-host:8080;
        frame-ancestors 'none';
    "
</VirtualHost>
```

## ✅ Проверка работы

1. Откройте DevTools (F12)
2. Перейдите на вкладку Console
3. Найдите логи с префиксом 🎵
4. Убедитесь, что все API поддерживаются:
   ```
   🎵 BrowserAudioService: getUserMedia supported: true
   🎵 BrowserAudioService: MediaRecorder supported: true
   🎵 BrowserAudioService: AudioContext supported: true
   ```

## 🐛 Устранение проблем

### getUserMedia not supported
- ✅ Убедитесь, что используется HTTPS
- ✅ Проверьте CSP заголовки
- ✅ Проверьте разрешения браузера

### Permission denied
- ✅ Проверьте разрешения браузера на микрофон
- ✅ Убедитесь, что пользователь разрешил доступ

### MediaDevices API not available
- ✅ Проверьте поддержку браузера
- ✅ Убедитесь, что нет блокировщиков рекламы

## 📝 Примечания

- Локально HTTP работает только для localhost
- Для продакшна HTTPS обязателен
- CSP заголовки критически важны для работы микрофона
- Рекомендуется использовать современные браузеры (Chrome 47+, Firefox 44+, Safari 11+) 