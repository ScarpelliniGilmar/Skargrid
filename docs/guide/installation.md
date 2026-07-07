# Instalação

## CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.css">
<script src="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.js"></script>
```

Fixe uma versão em produção (`skargrid@1.4.0` em vez de `@latest`) para evitar que um release novo mude o comportamento sem aviso.

## npm

```bash
npm install skargrid
```

```js
import Skargrid from 'skargrid';
import 'skargrid/styles.css';

const grid = new Skargrid('tabela', { data, columns });
```

O pacote publica ESM, CommonJS e tipos TypeScript via `exports` no `package.json` — funciona com qualquer bundler moderno (Vite, Webpack, esbuild, Rollup) sem configuração adicional.

## Download direto

```bash
git clone https://github.com/ScarpelliniGilmar/Skargrid.git
cp Skargrid/dist/* seu-projeto/
```

Útil para sistemas legados ou ambientes sem bundler/npm.

## Verificando a instalação

```js
console.log(typeof Skargrid); // 'function'
```

Se `Skargrid` não estiver definido ao usar a tag `<script>`, confirme que o script foi carregado **antes** do seu código de inicialização, e que não há bloqueio de CSP impedindo o carregamento do CDN.
