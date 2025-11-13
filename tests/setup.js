// Setup para testes Jest
// Configurações globais para testes

// Mock para console.warn e console.error durante testes
global.console = {
  ...console,
  // Uncomment to ignore console logs during tests
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Carregar SkarGrid para testes
const fs = require('fs');
const path = require('path');

// Carregar o arquivo minificado
const skargridScript = fs.readFileSync(path.join(__dirname, '../dist/skargrid.min.js'), 'utf8');

// Executar o script no contexto global do jsdom
const script = document.createElement('script');
script.textContent = skargridScript;
document.head.appendChild(script);

// Verificar se SkarGrid foi carregado
if (typeof window.Skargrid === 'undefined') {
  throw new Error('SkarGrid não foi carregado corretamente nos testes');
}