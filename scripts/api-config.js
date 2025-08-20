/**
 * Централизованная конфигурация для генерации OpenAPI клиентов
 * Следует принципу DRY и обеспечивает единообразие настроек
 */

const fs = require('fs');
const path = require('path');

// Общие параметры для всех генераторов
const commonProperties = {
  supportsES6: true,
  withSeparateModelsAndApi: true,
  apiPackage: 'apis',
  modelPackage: 'models',
  enumPropertyNaming: 'original',
  modelPropertyNaming: 'original',
  typescriptThreePlus: true,
  withoutPrefixEnums: true,
  apiNameSuffix: 'Api'
};

/**
 * Динамически читает все .yaml файлы из папки api/
 */
function getDomains() {
  const apiFolder = path.join(process.cwd(), 'api');
  
  if (!fs.existsSync(apiFolder)) {
    console.warn('⚠️ Папка api/ не найдена');
    return {};
  }

  const files = fs.readdirSync(apiFolder)
    .filter(file => file.endsWith('.yaml'))
    .map(file => {
      const domain = file.replace('openapi-', '').replace('.yaml', '');
      return {
        [domain]: {
          inputFile: `api/${file}`,
          description: getDomainDescription(domain)
        }
      };
    })
    .reduce((acc, domain) => ({ ...acc, ...domain }), {});

  return files;
}

// Динамически получаем домены из папки api/
const domains = getDomains();

/**
 * Генерирует команду для OpenAPI Generator CLI
 */
function generateCommand(domain) {
  if (!domains[domain]) {
    throw new Error(`Unknown domain: ${domain}`);
  }

  const config = domains[domain];
  const properties = Object.entries(commonProperties)
    .map(([key, value]) => `${key}=${value}`)
    .join(',');

  return [
    'openapi-generator-cli',
    'generate',
    '-i', config.inputFile,
    '-g', 'typescript-axios',
    '-o', 'generated-src/client',
    '--additional-properties', properties,
    '--ignore-file-override', '.openapi-generator-ignore'
  ];
}

/**
 * Получает список всех доменов
 */
function getAllDomains() {
  return Object.keys(domains);
}

/**
 * Получает описание домена
 */
function getDomainDescription(domain) {
  const descriptions = {
    'agents-ai': 'AI агенты и конверсационный ИИ',
    'analytics': 'Аналитика и отчеты',
    'auth-users': 'Аутентификация и управление пользователями',
    'candidates': 'Управление кандидатами',
    'interviews-questions': 'Интервью и вопросы',
    'positions': 'Позиции и вакансии',
    'settings': 'Настройки системы',
    'webhooks': 'Веб-хуки и интеграции'
  };
  
  return descriptions[domain] || `API для ${domain}`;
}

/**
 * Валидирует существование файла OpenAPI для домена
 */
function validateDomainFile(domain) {
  if (!domains[domain]) {
    return { valid: false, error: `Неизвестный домен: ${domain}` };
  }

  const filePath = path.join(process.cwd(), domains[domain].inputFile);
  if (!fs.existsSync(filePath)) {
    return { valid: false, error: `Файл не найден: ${domains[domain].inputFile}` };
  }

  return { valid: true };
}

module.exports = {
  commonProperties,
  domains,
  generateCommand,
  getAllDomains,
  getDomainDescription,
  validateDomainFile
}; 