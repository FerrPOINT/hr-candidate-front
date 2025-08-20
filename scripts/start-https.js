#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Пути к SSL сертификатам
const sslDir = path.join(__dirname, '..', 'ssl');
const certPath = path.join(sslDir, 'localhost.crt');
const keyPath = path.join(sslDir, 'localhost.key');

// Создаем директорию SSL если её нет
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir, { recursive: true });
}

// Проверяем наличие сертификатов
if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.log('🔐 SSL сертификаты не найдены. Создаем самоподписанные...');
  
  // Создаем самоподписанный сертификат
  const { execSync } = require('child_process');
  
  try {
    execSync(`openssl req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/CN=localhost"`, {
      stdio: 'inherit'
    });
    console.log('✅ SSL сертификаты созданы');
  } catch (error) {
    console.error('❌ Ошибка создания SSL сертификатов:', error.message);
    console.log('💡 Установите OpenSSL или создайте сертификаты вручную');
    process.exit(1);
  }
}

// Устанавливаем переменные окружения для HTTPS
process.env.HTTPS = 'true';
process.env.SSL_CRT_FILE = certPath;
process.env.SSL_KEY_FILE = keyPath;

console.log('🚀 Запуск приложения с HTTPS...');
console.log(`📁 Сертификат: ${certPath}`);
console.log(`🔑 Ключ: ${keyPath}`);
console.log('🌐 Приложение будет доступно по адресу: https://localhost:3000');

// Запускаем React приложение
const child = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('❌ Ошибка запуска:', error);
  process.exit(1);
});

child.on('close', (code) => {
  console.log(`📱 Приложение завершено с кодом: ${code}`);
  process.exit(code);
});

// Обработка сигналов завершения
process.on('SIGINT', () => {
  console.log('\n🛑 Получен сигнал завершения...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Получен сигнал завершения...');
  child.kill('SIGTERM');
}); 