const fs = require('fs');
const path = require('path');

// Target directory with generated models (outside src)
const targetDir = path.join(process.cwd(), 'generated-src', 'client', 'models');

if (!fs.existsSync(targetDir)) {
  console.error('Models directory not found:', targetDir);
  process.exit(0); // no-op if client not generated yet
}

const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.ts'));
const lines = files
  .filter(f => f !== 'index.ts')
  .map(f => `export * from './${f.replace(/\.ts$/, '')}';`);

const indexPath = path.join(targetDir, 'index.ts');
fs.writeFileSync(indexPath, lines.join('\n') + '\n');
console.log('Generated models index at', indexPath); 