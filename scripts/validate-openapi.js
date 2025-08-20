const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Валидирует все OpenAPI файлы на корректность синтаксиса и структуры
 */
function validateOpenApiFiles() {
  console.log('🔍 Валидация OpenAPI файлов...\n');

  const apiDir = path.join(process.cwd(), 'api');
  const files = fs.readdirSync(apiDir).filter(file => file.startsWith('openapi-') && file.endsWith('.yaml'));

  let hasErrors = false;

  files.forEach(file => {
    const filePath = path.join(apiDir, file);
    console.log(`📄 Проверяю ${file}...`);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const spec = yaml.load(content);

      // Базовая валидация структуры OpenAPI
      if (!spec.openapi) {
        console.error(`  ❌ Отсутствует поле 'openapi'`);
        hasErrors = true;
      }

      if (!spec.info || !spec.info.title || !spec.info.version) {
        console.error(`  ❌ Некорректная секция 'info'`);
        hasErrors = true;
      }

      if (!spec.paths || Object.keys(spec.paths).length === 0) {
        console.error(`  ❌ Отсутствуют или пусты 'paths'`);
        hasErrors = true;
      }

      // Проверка на дублирующиеся operationId
      const operationIds = new Set();
      Object.values(spec.paths).forEach(pathItem => {
        Object.values(pathItem).forEach(operation => {
          if (operation.operationId) {
            if (operationIds.has(operation.operationId)) {
              console.error(`  ❌ Дублирующийся operationId: ${operation.operationId}`);
              hasErrors = true;
            }
            operationIds.add(operation.operationId);
          }
        });
      });

      if (!hasErrors) {
        console.log(`  ✅ Валидация пройдена`);
      }

    } catch (error) {
      console.error(`  ❌ Ошибка парсинга: ${error.message}`);
      hasErrors = true;
    }

    console.log('');
  });

  if (hasErrors) {
    console.error('❌ Найдены ошибки в OpenAPI файлах!');
    process.exit(1);
  } else {
    console.log('✅ Все OpenAPI файлы прошли валидацию!');
  }
}

// Запуск если скрипт вызван напрямую
if (require.main === module) {
  validateOpenApiFiles();
}

module.exports = { validateOpenApiFiles }; 