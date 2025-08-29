#!/bin/bash
set -e

APP_NAME="hr-candidate-front"
APP_DIR="/opt/$APP_NAME"
PORT=3003
REPO_SSH="git@github.com:FerrPOINT/hr-candidate-front.git"
LOG_FILE="/opt/candidate.log"

echo "[1/7] Остановка предыдущего процесса..."

# Более агрессивная остановка всех процессов на порту
echo "Останавливаем все процессы на порту $PORT..."

# Убиваем процессы serve
pkill -f "serve.*$PORT" || true
sleep 1
pkill -9 -f "serve.*$PORT" || true

# Убиваем процессы node на этом порту
pkill -f "node.*$PORT" || true
sleep 1
pkill -9 -f "node.*$PORT" || true

# Проверяем, не занят ли порт и убиваем все процессы на нем
if command -v lsof >/dev/null 2>&1; then
    if lsof -i :$PORT > /dev/null 2>&1; then
        echo "⚠️  Порт $PORT занят. Останавливаем все процессы..."
        lsof -ti :$PORT | xargs kill -9 || true
        sleep 3
    fi
fi

# Дополнительная проверка через netstat (если доступен)
if command -v netstat >/dev/null 2>&1; then
    if netstat -tuln | grep ":$PORT " > /dev/null 2>&1; then
        echo "⚠️  Порт $PORT все еще занят (netstat). Принудительная очистка..."
        # Находим PID процесса на порту
        PID=$(netstat -tulnp 2>/dev/null | grep ":$PORT " | awk '{print $7}' | cut -d'/' -f1 | head -1)
        if [ ! -z "$PID" ] && [ "$PID" != "-" ]; then
            echo "Убиваем процесс $PID на порту $PORT"
            kill -9 $PID || true
            sleep 2
        fi
    fi
fi

# Финальная проверка
if command -v lsof >/dev/null 2>&1; then
    if lsof -i :$PORT > /dev/null 2>&1; then
        echo "❌ Порт $PORT все еще занят после попыток очистки!"
        lsof -i :$PORT
        echo "Попробуйте вручную: sudo lsof -ti :$PORT | xargs kill -9"
        exit 1
    else
        echo "✅ Порт $PORT свободен"
    fi
fi

if [ ! -d "$APP_DIR" ]; then
  echo "[2/7] Клонирование репозитория..."
  git clone "$REPO_SSH" "$APP_DIR"
else
  echo "[2/7] Обновление репозитория..."
  cd "$APP_DIR"
  git remote set-url origin "$REPO_SSH"
  git reset --hard
  git pull --rebase
fi

cd "$APP_DIR"

echo "[3/7] Установка зависимостей..."
npm install

echo "[4/7] Генерация API-клиента..."
npm run generate:api || true

echo "[5/7] Сборка с правильным PUBLIC_URL..."
PUBLIC_URL=/candidate npm run build

echo "[6/7] Проверка build папки..."
if [ ! -d "build" ]; then
    echo "❌ Папка build не найдена!"
    exit 1
fi

if [ ! -f "build/index.html" ]; then
    echo "❌ Файл build/index.html не найден!"
    exit 1
fi

echo "[7/7] Запуск сервера на порту $PORT..."
cd build

# Проверяем, что serve установлен
if ! command -v npx >/dev/null 2>&1; then
    echo "❌ npx не найден. Устанавливаем serve глобально..."
    npm install -g serve
fi

# Очищаем старый лог
> "$LOG_FILE"

# Запускаем serve с подробным логированием
echo "=== $(date) ===" >> "$LOG_FILE"
echo "Запуск serve на порту $PORT..." >> "$LOG_FILE"
echo "Текущая директория: $(pwd)" >> "$LOG_FILE"
echo "Содержимое директории:" >> "$LOG_FILE"
ls -la >> "$LOG_FILE" 2>&1

# Пробуем запустить serve
npx serve -s . -l $PORT >> "$LOG_FILE" 2>&1 &
SERVE_PID=$!

echo "PID сервера: $SERVE_PID" >> "$LOG_FILE"

# Ждем немного больше для запуска
sleep 5

# Проверяем, что процесс жив
if ! kill -0 $SERVE_PID 2>/dev/null; then
    echo "❌ Процесс serve завершился"
    echo "Последние строки лога:"
    tail -30 "$LOG_FILE"
    
    # Пробуем альтернативный способ запуска
    echo "Пробуем альтернативный способ запуска..."
    
    # Пробуем через python или node
    if command -v python3 >/dev/null 2>&1; then
        echo "Запускаем через python3 http.server..."
        python3 -m http.server $PORT >> "$LOG_FILE" 2>&1 &
        SERVE_PID=$!
    elif command -v python >/dev/null 2>&1; then
        echo "Запускаем через python http.server..."
        python -m http.server $PORT >> "$LOG_FILE" 2>&1 &
        SERVE_PID=$!
    elif command -v node >/dev/null 2>&1; then
        echo "Запускаем через node http-server..."
        npx http-server . -p $PORT >> "$LOG_FILE" 2>&1 &
        SERVE_PID=$!
    else
        echo "❌ Не найдены альтернативные способы запуска сервера"
        exit 1
    fi
    
    sleep 3
    
    # Проверяем альтернативный процесс
    if ! kill -0 $SERVE_PID 2>/dev/null; then
        echo "❌ Альтернативный сервер тоже не запустился"
        echo "Последние строки лога:"
        tail -20 "$LOG_FILE"
        exit 1
    fi
    
    echo "✅ Альтернативный сервер запущен с PID: $SERVE_PID"
fi

# Проверяем доступность порта
if command -v lsof >/dev/null 2>&1; then
    if lsof -i :$PORT > /dev/null 2>&1; then
        echo "✅ Порт $PORT открыт"
    else
        echo "❌ Порт $PORT не открыт"
        echo "Последние строки лога:"
        tail -20 "$LOG_FILE"
        exit 1
    fi
fi

# Проверяем HTTP ответ
if command -v curl >/dev/null 2>&1; then
    if curl -s -f http://localhost:$PORT > /dev/null 2>&1; then
        echo "✅ Сервер отвечает на HTTP запросы"
    else
        echo "⚠️  Сервер не отвечает на HTTP запросы, но процесс запущен"
        echo "Проверьте логи: tail -f $LOG_FILE"
    fi
else
    echo "⚠️  curl не установлен, пропускаем HTTP проверку"
fi

echo "✅ Деплой завершён. PID: $SERVE_PID"
echo "Логи: tail -f $LOG_FILE"
echo "Остановить: kill $SERVE_PID"
echo ""
echo "Для диагностики проблем:"
echo "1. Проверьте логи: tail -f $LOG_FILE"
echo "2. Проверьте порт: lsof -i :$PORT"
echo "3. Проверьте процесс: ps aux | grep $SERVE_PID"
