#!/bin/bash

# Скрипт для настройки SSL с Let's Encrypt
# Использование: ./scripts/setup-ssl.sh your-domain.com

set -e

DOMAIN=$1
EMAIL="your-email@example.com"  # Измените на ваш email

if [ -z "$DOMAIN" ]; then
    echo "❌ Ошибка: Укажите домен"
    echo "Использование: $0 your-domain.com"
    exit 1
fi

echo "🔐 Настройка SSL для домена: $DOMAIN"

# Проверяем, установлен ли certbot
if ! command -v certbot &> /dev/null; then
    echo "📦 Установка certbot..."
    if command -v apt-get &> /dev/null; then
        # Ubuntu/Debian
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        sudo yum install -y certbot python3-certbot-nginx
    else
        echo "❌ Не удалось установить certbot. Установите вручную."
        exit 1
    fi
fi

# Проверяем, что Nginx установлен
if ! command -v nginx &> /dev/null; then
    echo "❌ Nginx не установлен. Установите Nginx сначала."
    exit 1
fi

# Создаем временную конфигурацию Nginx для получения сертификата
echo "📝 Создание временной конфигурации Nginx..."
sudo tee /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    root /var/www/$DOMAIN/build;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Для Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/$DOMAIN;
    }
}
EOF

# Активируем сайт
echo "🔗 Активация сайта..."
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Получаем SSL сертификат
echo "🎫 Получение SSL сертификата от Let's Encrypt..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Обновляем конфигурацию с CSP заголовками
echo "🔧 Обновление конфигурации с CSP заголовками..."
sudo tee /etc/nginx/sites-available/$DOMAIN << EOF
# Редирект с HTTP на HTTPS
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

# Основной HTTPS сервер
server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL сертификаты (автоматически настроены certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # CSP заголовки для микрофона и ElevenLabs
    add_header Content-Security-Policy "
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        media-src 'self' blob: https://api.elevenlabs.io https://elevenlabs.io;
        connect-src 'self' 
            https://your-api-host:8080 
            https://api.elevenlabs.io 
            https://elevenlabs.io;
        frame-ancestors 'none';
        worker-src 'self' blob:;
        child-src 'self' blob:;
    " always;
    
    root /var/www/$DOMAIN/build;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Проверяем и перезагружаем Nginx
echo "✅ Проверка конфигурации Nginx..."
sudo nginx -t
sudo systemctl reload nginx

# Настраиваем автообновление сертификата
echo "🔄 Настройка автообновления сертификата..."
sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

echo "🎉 SSL успешно настроен для домена: $DOMAIN"
echo "🌐 Сайт доступен по адресу: https://$DOMAIN"
echo "📝 Не забудьте:"
echo "  1. Заменить 'your-api-host:8080' в CSP на реальный адрес API"
echo "  2. Обновить email в скрипте для уведомлений Let's Encrypt"
echo "  3. Разместить собранное приложение в /var/www/$DOMAIN/build" 