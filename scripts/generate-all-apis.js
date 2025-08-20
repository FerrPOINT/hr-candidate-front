const { spawn } = require('child_process');
const { getAllDomains, generateCommand, getDomainDescription, validateDomainFile } = require('./api-config');

/**
 * Генерирует все API клиенты параллельно для максимальной производительности
 */
async function generateAllApis() {
  console.log('🚀 Запуск генерации всех API клиентов...\n');

  const domains = getAllDomains();
  console.log(`📦 Будет сгенерировано доменов: ${domains.length}`);
  domains.forEach(domain => {
    console.log(`  • ${domain}: ${getDomainDescription(domain)}`);
  });
  console.log('');

  // Валидация всех файлов
  console.log('🔍 Валидация файлов...');
  for (const domain of domains) {
    const validation = validateDomainFile(domain);
    if (!validation.valid) {
      console.error(`❌ ${domain}: ${validation.error}`);
      process.exit(1);
    }
    console.log(`✅ ${domain}: файл найден`);
  }
  console.log('');

  // Параллельная генерация
  const promises = domains.map(domain => generateApiDomain(domain));
  
  try {
    await Promise.all(promises);
    console.log('\n🎉 Все API клиенты успешно сгенерированы!');
    
    // Статистика
    console.log('\n📊 Статистика:');
    console.log(`  • Доменов обработано: ${domains.length}`);
    console.log(`  • Время генерации: параллельно`);
    console.log(`  • Статус: ✅ Успешно`);
    
  } catch (error) {
    console.error('\n❌ Ошибка при генерации API клиентов:', error.message);
    process.exit(1);
  }
}

function generateApiDomain(domain) {
  return new Promise((resolve, reject) => {
    console.log(`📦 Запуск генерации ${domain}...`);
    
    const command = generateCommand(domain);
    const child = spawn(command[0], command.slice(1), {
      stdio: 'pipe',
      shell: true,
      cwd: process.cwd()
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${domain} - успешно сгенерирован`);
        resolve();
      } else {
        console.error(`❌ ${domain} - ошибка (код ${code})`);
        if (errorOutput) {
          console.error(`   Детали ошибки: ${errorOutput.substring(0, 200)}...`);
        }
        reject(new Error(`Генерация ${domain} завершилась с ошибкой ${code}`));
      }
    });

    child.on('error', (error) => {
      console.error(`❌ ${domain} - ошибка запуска:`, error.message);
      reject(error);
    });
  });
}

// Запуск если скрипт вызван напрямую
if (require.main === module) {
  generateAllApis();
}

module.exports = { generateAllApis }; 