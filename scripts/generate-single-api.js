const { spawn } = require('child_process');
const { generateCommand, getDomainDescription, validateDomainFile } = require('./api-config');

/**
 * Генерирует API клиент для одного домена
 */
async function generateSingleApi(domain) {
  console.log(`🚀 Генерация API для домена: ${domain}`);
  console.log(`📝 Описание: ${getDomainDescription(domain)}\n`);

  // Валидация
  const validation = validateDomainFile(domain);
  if (!validation.valid) {
    console.error(`❌ Ошибка валидации: ${validation.error}`);
    process.exit(1);
  }

  // Генерация команды
  const command = generateCommand(domain);
  console.log(`🔧 Команда: ${command.join(' ')}\n`);

  return new Promise((resolve, reject) => {
    const child = spawn(command[0], command.slice(1), {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ API для домена '${domain}' успешно сгенерирован!`);
        resolve();
      } else {
        console.error(`\n❌ Ошибка генерации API для домена '${domain}' (код ${code})`);
        reject(new Error(`Generation failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      console.error(`\n❌ Ошибка запуска генератора:`, error);
      reject(error);
    });
  });
}

// Запуск если скрипт вызван напрямую
if (require.main === module) {
  const domain = process.argv[2];
  
  if (!domain) {
    console.error('❌ Укажите домен для генерации');
    console.log('Использование: node generate-single-api.js <domain>');
    console.log('Доступные домены:', require('./api-config').getAllDomains().join(', '));
    process.exit(1);
  }

  generateSingleApi(domain).catch(error => {
    console.error('❌ Генерация завершилась с ошибкой:', error);
    process.exit(1);
  });
}

module.exports = { generateSingleApi }; 