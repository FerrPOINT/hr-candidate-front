#!/usr/bin/env node

/**
 * Скрипт для патчинга ElevenLabs SDK
 * 
 * Этот скрипт:
 * 1. Находит установленный пакет @elevenlabs/react
 * 2. Создаёт резервную копию
 * 3. Модифицирует исходный код для перенаправления трафика через backend
 * 4. Создаёт патч-файл для повторного применения
 * 
 * Использование:
 * node scripts/patch-elevenlabs-sdk.js [--backend-url=http://localhost:8080] [--restore]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Конфигурация
const CONFIG = {
  packageName: '@elevenlabs/react',
  backendUrl: process.argv.find(arg => arg.startsWith('--backend-url='))?.split('=')[1] || 'http://localhost:8080',
  restore: process.argv.includes('--restore'),
  patchDir: path.join(__dirname, '..', 'patches'),
  backupDir: path.join(__dirname, '..', 'node_modules', '@elevenlabs', 'react-backup')
};

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

/**
 * Находит путь к установленному пакету
 */
function findPackagePath() {
  try {
    const packagePath = require.resolve(CONFIG.packageName);
    return path.dirname(packagePath);
  } catch (error) {
    logError(`Пакет ${CONFIG.packageName} не найден. Установите его: npm install ${CONFIG.packageName}`);
    process.exit(1);
  }
}

/**
 * Создаёт резервную копию пакета
 */
function createBackup(packagePath) {
  logInfo('Создание резервной копии...');
  
  if (fs.existsSync(CONFIG.backupDir)) {
    logWarning('Резервная копия уже существует');
    return;
  }
  
  try {
    // Создаём директорию для бэкапа
    fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    
    // Копируем все файлы
    copyDirectory(packagePath, CONFIG.backupDir);
    
    logSuccess('Резервная копия создана');
  } catch (error) {
    logError(`Ошибка создания резервной копии: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Восстанавливает пакет из резервной копии
 */
function restoreFromBackup(packagePath) {
  logInfo('Восстановление из резервной копии...');
  
  if (!fs.existsSync(CONFIG.backupDir)) {
    logError('Резервная копия не найдена');
    process.exit(1);
  }
  
  try {
    // Удаляем текущий пакет
    fs.rmSync(packagePath, { recursive: true, force: true });
    
    // Копируем из бэкапа
    copyDirectory(CONFIG.backupDir, packagePath);
    
    logSuccess('Пакет восстановлен из резервной копии');
  } catch (error) {
    logError(`Ошибка восстановления: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Рекурсивно копирует директорию
 */
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Патчит файлы пакета
 */
function patchPackage(packagePath) {
  logInfo('Применение патчей...');
  
  const patches = [
    {
      file: 'dist/index.js',
      description: 'Основной файл SDK',
      patches: [
        {
          find: /https:\/\/api\.elevenlabs\.io/g,
          replace: `${CONFIG.backendUrl}/elevenlabs-proxy`
        },
        {
          find: /wss:\/\/api\.elevenlabs\.io/g,
          replace: `${CONFIG.backendUrl.replace('https://', 'wss://').replace('http://', 'ws://')}/elevenlabs-proxy/ws`
        }
      ]
    },
    {
      file: 'dist/index.d.ts',
      description: 'TypeScript определения',
      patches: [
        {
          find: /https:\/\/api\.elevenlabs\.io/g,
          replace: `${CONFIG.backendUrl}/elevenlabs-proxy`
        }
      ]
    }
  ];
  
  for (const patch of patches) {
    const filePath = path.join(packagePath, patch.file);
    
    if (!fs.existsSync(filePath)) {
      logWarning(`Файл ${patch.file} не найден, пропускаем`);
      continue;
    }
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      for (const { find, replace } of patch.patches) {
        if (find.test(content)) {
          content = content.replace(find, replace);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        logSuccess(`Патч применён к ${patch.file}`);
      } else {
        logWarning(`Патч не найден в ${patch.file}`);
      }
    } catch (error) {
      logError(`Ошибка патчинга ${patch.file}: ${error.message}`);
    }
  }
}

/**
 * Создаёт патч-файл для повторного применения
 */
function createPatchFile(packagePath) {
  logInfo('Создание патч-файла...');
  
  if (!fs.existsSync(CONFIG.patchDir)) {
    fs.mkdirSync(CONFIG.patchDir, { recursive: true });
  }
  
  const patchFile = path.join(CONFIG.patchDir, 'elevenlabs-sdk.patch');
  
  try {
    // Создаём diff между оригиналом и патченной версией
    const diff = execSync(`diff -r "${CONFIG.backupDir}" "${packagePath}"`, { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).stdout;
    
    if (diff) {
      fs.writeFileSync(patchFile, diff, 'utf8');
      logSuccess(`Патч-файл создан: ${patchFile}`);
    } else {
      logWarning('Изменения не обнаружены');
    }
  } catch (error) {
    logWarning('Не удалось создать патч-файл (возможно, нет изменений)');
  }
}

/**
 * Проверяет версию пакета
 */
function checkPackageVersion(packagePath) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8'));
    logInfo(`Версия пакета: ${packageJson.version}`);
    return packageJson.version;
  } catch (error) {
    logWarning('Не удалось определить версию пакета');
    return 'unknown';
  }
}

/**
 * Основная функция
 */
function main() {
  log('🔧 ElevenLabs SDK Patcher', 'bright');
  log(`Backend URL: ${CONFIG.backendUrl}`, 'cyan');
  
  const packagePath = findPackagePath();
  logInfo(`Путь к пакету: ${packagePath}`);
  
  const version = checkPackageVersion(packagePath);
  
  if (CONFIG.restore) {
    restoreFromBackup(packagePath);
  } else {
    createBackup(packagePath);
    patchPackage(packagePath);
    createPatchFile(packagePath);
  }
  
  logSuccess('Операция завершена!');
  logInfo(`Для восстановления используйте: node scripts/patch-elevenlabs-sdk.js --restore`);
}

// Запуск
if (require.main === module) {
  main();
}

module.exports = {
  patchPackage,
  createBackup,
  restoreFromBackup,
  findPackagePath
}; 