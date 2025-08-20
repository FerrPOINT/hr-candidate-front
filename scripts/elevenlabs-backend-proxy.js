#!/usr/bin/env node

/**
 * ElevenLabs Backend Proxy - Пример реализации
 * 
 * Этот скрипт демонстрирует, как создать прокси-сервер для ElevenLabs API
 * на вашем backend. Все запросы от фронтенда будут проходить через этот прокси,
 * а API-ключ ElevenLabs будет храниться только на сервере.
 * 
 * Использование:
 * node scripts/elevenlabs-backend-proxy.js [--port=3001] [--elevenlabs-key=your-key]
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');

// Конфигурация
const CONFIG = {
  port: process.argv.find(arg => arg.startsWith('--port='))?.split('=')[1] || 3001,
  elevenLabsKey: process.argv.find(arg => arg.startsWith('--elevenlabs-key='))?.split('=')[1] || process.env.ELEVENLABS_API_KEY,
  elevenLabsUrl: 'https://api.elevenlabs.io',
  elevenLabsWsUrl: 'wss://api.elevenlabs.io'
};

// Проверка API ключа
if (!CONFIG.elevenLabsKey) {
  console.error('❌ Ошибка: API ключ ElevenLabs не указан');
  console.log('Использование:');
  console.log('  node scripts/elevenlabs-backend-proxy.js --elevenlabs-key=your-key');
  console.log('  или установите переменную окружения ELEVENLABS_API_KEY');
  process.exit(1);
}

// Создаём Express приложение
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://your-frontend-domain.com'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Проверка здоровья сервера
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    elevenLabsUrl: CONFIG.elevenLabsUrl,
    proxyActive: true
  });
});

// Прокси для REST API ElevenLabs
const elevenLabsProxy = createProxyMiddleware({
  target: CONFIG.elevenLabsUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/elevenlabs-proxy': '' // Убираем префикс прокси
  },
  onProxyReq: (proxyReq, req, res) => {
    // Добавляем API ключ ElevenLabs
    proxyReq.setHeader('xi-api-key', CONFIG.elevenLabsKey);
    
    // Логируем запрос
    console.log(`🔄 Проксирование: ${req.method} ${req.path} -> ${CONFIG.elevenLabsUrl}${proxyReq.path}`);
    
    // Добавляем заголовки для отладки
    proxyReq.setHeader('X-Proxy-By', 'ElevenLabs-Backend-Proxy');
    proxyReq.setHeader('X-Original-URL', req.url);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Логируем ответ
    console.log(`✅ Ответ: ${req.method} ${req.path} - ${proxyRes.statusCode}`);
    
    // Добавляем CORS заголовки
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, xi-api-key';
  },
  onError: (err, req, res) => {
    console.error(`❌ Ошибка прокси: ${err.message}`);
    res.status(500).json({
      error: 'Proxy error',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Применяем прокси ко всем запросам к /elevenlabs-proxy
app.use('/elevenlabs-proxy', elevenLabsProxy);

// WebSocket прокси для real-time соединений
const wss = new WebSocket.Server({ 
  server,
  path: '/elevenlabs-proxy/ws'
});

wss.on('connection', (ws, req) => {
  console.log(`🔌 WebSocket соединение установлено: ${req.url}`);
  
  // Создаём WebSocket соединение к ElevenLabs
  const elevenLabsWs = new WebSocket(CONFIG.elevenLabsWsUrl, {
    headers: {
      'xi-api-key': CONFIG.elevenLabsKey
    }
  });
  
  // Пересылаем сообщения от клиента к ElevenLabs
  ws.on('message', (message) => {
    console.log(`📤 Клиент -> ElevenLabs: ${message.toString().substring(0, 100)}...`);
    if (elevenLabsWs.readyState === WebSocket.OPEN) {
      elevenLabsWs.send(message);
    }
  });
  
  // Пересылаем сообщения от ElevenLabs к клиенту
  elevenLabsWs.on('message', (message) => {
    console.log(`📥 ElevenLabs -> Клиент: ${message.toString().substring(0, 100)}...`);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
  
  // Обработка ошибок
  ws.on('error', (error) => {
    console.error(`❌ WebSocket ошибка клиента: ${error.message}`);
  });
  
  elevenLabsWs.on('error', (error) => {
    console.error(`❌ WebSocket ошибка ElevenLabs: ${error.message}`);
  });
  
  // Обработка закрытия соединений
  ws.on('close', () => {
    console.log('🔌 WebSocket соединение клиента закрыто');
    if (elevenLabsWs.readyState === WebSocket.OPEN) {
      elevenLabsWs.close();
    }
  });
  
  elevenLabsWs.on('close', () => {
    console.log('🔌 WebSocket соединение ElevenLabs закрыто');
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  });
});

// Обработка ошибок сервера
server.on('error', (error) => {
  console.error(`❌ Ошибка сервера: ${error.message}`);
});

// Запуск сервера
server.listen(CONFIG.port, () => {
  console.log('🚀 ElevenLabs Backend Proxy запущен');
  console.log(`📍 Порт: ${CONFIG.port}`);
  console.log(`🎯 ElevenLabs URL: ${CONFIG.elevenLabsUrl}`);
  console.log(`🔌 WebSocket URL: ${CONFIG.elevenLabsWsUrl}`);
  console.log(`✅ API ключ: ${CONFIG.elevenLabsKey ? 'Установлен' : 'Не установлен'}`);
  console.log('');
  console.log('📋 Доступные эндпоинты:');
  console.log(`  GET  /health - Проверка здоровья сервера`);
  console.log(`  ALL  /elevenlabs-proxy/* - Прокси к ElevenLabs API`);
  console.log(`  WSS  /elevenlabs-proxy/ws - WebSocket прокси`);
  console.log('');
  console.log('🔧 Для остановки нажмите Ctrl+C');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Остановка сервера...');
  server.close(() => {
    console.log('✅ Сервер остановлен');
    process.exit(0);
  });
});

// Экспорт для использования в других модулях
module.exports = {
  app,
  server,
  wss,
  CONFIG
}; 