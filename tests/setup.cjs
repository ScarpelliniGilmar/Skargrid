// Setup de compatibilidade para a suíte Jest durante a migração Community 2.0.
global.console = {
  ...console,
};

const fs = require('node:fs');
const path = require('node:path');

const skargridScript = fs.readFileSync(
  path.join(__dirname, '../dist/skargrid.min.js'),
  'utf8',
);

const script = document.createElement('script');
script.textContent = skargridScript;
document.head.appendChild(script);

if (typeof window.Skargrid === 'undefined') {
  throw new Error('SkarGrid não foi carregado corretamente nos testes');
}
