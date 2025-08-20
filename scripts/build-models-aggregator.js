const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function buildAggregator() {
  const modelsDir = path.join(process.cwd(), 'generated-src', 'client', 'models');
  const outDir = path.join(process.cwd(), 'src', 'api');
  const outFile = path.join(outDir, 'models.auto.ts');

  if (!fs.existsSync(modelsDir)) {
    console.error('[models-aggregate] Models directory not found:', modelsDir);
    process.exit(0);
  }

  const files = fs
    .readdirSync(modelsDir)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts');

  const lines = [];
  lines.push('/* Auto-generated aggregator. Do not edit manually. */');
  lines.push('/* Aggregates exports from generated-src/client/models for convenience. */');
  lines.push('');
  for (const f of files) {
    const base = f.replace(/\.ts$/, '');
    lines.push(`export * from '../../generated-src/client/models/${base}';`);
  }
  lines.push('');

  ensureDir(outDir);
  fs.writeFileSync(outFile, lines.join('\n'));
  console.log('[models-aggregate] Wrote', outFile, `(${files.length} files)`);
}

if (require.main === module) {
  buildAggregator();
}

module.exports = { buildAggregator }; 