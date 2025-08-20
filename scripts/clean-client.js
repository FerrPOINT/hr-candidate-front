const fs = require('fs');
const path = require('path');

function rmDirRecursive(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    return true;
  }
  return false;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Полная очистка каталога generated-src/client перед генерацией
const generatedDir = path.join(process.cwd(), 'generated-src');
const clientDir = path.join(generatedDir, 'client');

console.log('🧹 Очистка каталога сгенерированного клиента...');
console.log('   Путь:', clientDir);

// Удаляем весь clientDir, включая apis, models, base/common и служебные файлы
const removed = rmDirRecursive(clientDir);
if (removed) {
  console.log('   Удалена папка:', clientDir);
} else {
  console.log('   Папка отсутствует, нечего удалять');
}

// Пересоздаём пустую структуру
ensureDir(clientDir);
ensureDir(path.join(clientDir, 'apis'));
ensureDir(path.join(clientDir, 'models'));
console.log('   Создана структура: apis/, models/');

console.log('✅ Полная очистка завершена'); 