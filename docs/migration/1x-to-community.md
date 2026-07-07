# Migração: 1.x → Community 2.x

## Resumo

A API pública **não foi renomeada**. Construtor, nomes de opções, nomes de colunas e a maioria dos métodos permanecem os mesmos. A mudança real é interna (arquitetura, módulos ES reais, build) e um único comportamento de segurança que muda por padrão. Se você não usa `render()`/`formatter()` retornando HTML, a migração deve ser transparente.

## O que muda de fato

### 1. `render()` / `formatter()` deixam de injetar HTML por padrão

**Antes (1.x):** o retorno de `render`/`formatter` era sempre inserido via `innerHTML`, sem opção de desligar.

**Agora (Community 2.x):** o retorno é tratado como **texto puro** (`textContent`) por padrão. HTML é opt-in explícito.

Se algum dos seus renderers retorna uma string com tags HTML (badges, links, negrito, etc.), ela vai aparecer como texto literal (`<b>Ativo</b>` na tela) até você migrar para uma das duas formas seguras:

```js
// Antes (1.x) — dependia de innerHTML implícito
{ field: 'status', render: v => `<b>${v}</b>` }

// Depois — opção A (recomendada): retorne um Node
{
  field: 'status',
  render: v => {
    const b = document.createElement('b');
    b.textContent = v;
    return b;
  },
}

// Depois — opção B: mantenha a string HTML, com opt-in explícito
{ field: 'status', render: v => `<b>${v}</b>`, allowUnsafeHtml: true }
```

Veja [Acessibilidade e segurança](/guide/accessibility-security) para o porquê dessa mudança (proteção contra XSS quando o valor renderizado vem de dado não confiável).

### 2. `options.onSortChange` / `onPageChange` / `onSelectionChange` / `onFilterChange` / `onRowClick` agora funcionam de verdade

Essas opções já apareciam nos tipos TypeScript publicados em versões anteriores, mas **nunca foram implementadas** — passá-las não tinha efeito algum. Na Community 2.x elas disparam de fato (atalhos para `grid.on(...)`). Se você já passava algum desses callbacks "por precaução" ou copiando de um exemplo, ele agora **será chamado** — confira se o handler está pronto para isso.

### 3. Distribuição do pacote

O pacote agora publica ESM, CommonJS, IIFE/CDN, CSS e tipos TypeScript via `exports` no `package.json`. Se você usa `<script src=".../dist/skargrid.min.js">` (CDN) ou `require('skargrid')`/`import Skargrid from 'skargrid'` (npm), nada muda na forma de uso — apenas passou a haver mais formatos disponíveis.

## O que **não** muda

- Nomes de opções do construtor (`data`, `columns`, `pagination`, `sortable`, etc.).
- Nomes e propriedades de coluna (`field`, `title`, `sortable`, `filterType`, etc.).
- Métodos existentes (`updateData`, `getSelectedRows`, `exportToCSV`, etc.) mantêm assinatura e comportamento.

## Checklist de migração

1. Atualize a versão (`npm install skargrid@latest` ou aponte o CDN para a versão nova).
2. Rode sua suíte de testes/QA visual — o único ponto de atenção real é `render()`/`formatter()` retornando strings HTML.
3. Para cada `render`/`formatter` que retornava HTML, escolha: migrar para retornar um `Node` (recomendado) ou adicionar `allowUnsafeHtml: true`.
4. Se você usa `onSortChange`/`onPageChange`/`onSelectionChange`/`onFilterChange`/`onRowClick` nas opções, confirme que o handler está correto — agora ele é chamado de verdade.
