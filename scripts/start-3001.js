#!/usr/bin/env node

/**
 * Скрипт для запуска React приложения на порту 3001
 * Совместим с Windows и Unix системами
 */

const { spawn } = require('child_process');
const path = require('path');

// Устанавливаем порт
process.env.PORT = '3001';

console.log('🚀 Запуск приложения на порту 3001...');
console.log('📍 URL: http://localhost:3001');

// Запускаем craco start
const cracoProcess = spawn('npx', ['craco', 'start'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    PORT: '3001'
  }
});

cracoProcess.on('error', (error) => {
  console.error('❌ Ошибка запуска:', error.message);
  process.exit(1);
});

cracoProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Процесс завершился с кодом ${code}`);
    process.exit(code);
  }
});

// Обработка сигналов завершения
process.on('SIGINT', () => {
  console.log('\n🛑 Получен сигнал SIGINT, завершаем...');
  cracoProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Получен сигнал SIGTERM, завершаем...');
  cracoProcess.kill('SIGTERM');
}); 