const fs = require('fs');
const path = require('path');

// Маппинг старых переменных на новые с префиксом
const variableMapping = {
  '--interview-bg': '--candidate-interview-bg',
  '--interview-substrate': '--candidate-interview-substrate',
  '--interview-accent': '--candidate-interview-accent',
  '--interview-accent-hover': '--candidate-interview-accent-hover',
  '--interview-accent-50': '--candidate-interview-accent-50',
  '--interview-accent-40': '--candidate-interview-accent-40',
  '--interview-accent-35': '--candidate-interview-accent-35',
  '--interview-accent-30': '--candidate-interview-accent-30',
  '--interview-accent-25': '--candidate-interview-accent-25',
  '--interview-accent-18': '--candidate-interview-accent-18',
  '--interview-accent-55': '--candidate-interview-accent-55',
  '--background': '--candidate-background',
  '--foreground': '--candidate-foreground',
  '--card': '--candidate-card',
  '--card-foreground': '--candidate-card-foreground',
  '--popover': '--candidate-popover',
  '--popover-foreground': '--candidate-popover-foreground',
  '--primary': '--candidate-primary',
  '--primary-foreground': '--candidate-primary-foreground',
  '--secondary': '--candidate-secondary',
  '--secondary-foreground': '--candidate-secondary-foreground',
  '--muted': '--candidate-muted',
  '--muted-foreground': '--candidate-muted-foreground',
  '--accent': '--candidate-accent',
  '--accent-foreground': '--candidate-accent-foreground',
  '--destructive': '--candidate-destructive',
  '--destructive-foreground': '--candidate-destructive-foreground',
  '--border': '--candidate-border',
  '--input': '--candidate-input',
  '--input-background': '--candidate-input-background',
  '--ring': '--candidate-ring',
  '--radius': '--candidate-radius',
  '--radius-button': '--candidate-radius-button',
  '--radius-card': '--candidate-radius-card',
  '--radius-tooltip': '--candidate-radius-tooltip',
  '--elevation-sm': '--candidate-elevation-sm'
};

// Функция для замены переменных в файле
function replaceVariablesInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Заменяем все переменные
    for (const [oldVar, newVar] of Object.entries(variableMapping)) {
      if (content.includes(oldVar)) {
        content = content.replace(new RegExp(oldVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newVar);
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Обновлен: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Ошибка при обработке ${filePath}:`, error.message);
  }
}

// Функция для рекурсивного обхода директории
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      replaceVariablesInFile(fullPath);
    }
  }
}

// Основная функция
function main() {
  console.log('🔧 Начинаю замену CSS переменных candidate...');
  
  const candidateDir = path.join(__dirname, '..', 'src', 'candidate');
  
  if (!fs.existsSync(candidateDir)) {
    console.error('❌ Директория candidate не найдена!');
    return;
  }
  
  processDirectory(candidateDir);
  
  console.log('✅ Замена CSS переменных завершена!');
  console.log('📝 Теперь все переменные имеют префикс --candidate-');
}

main(); 