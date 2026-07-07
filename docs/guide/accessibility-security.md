# Acessibilidade e segurança

## Segurança de renderização

`column.render()` / `column.formatter()` são tratados como **texto puro por padrão** (`textContent`). Tags HTML na string retornada não são interpretadas — dados não confiáveis (entrada de usuário, resposta de API) não conseguem injetar markup ou scripts.

Há duas formas seguras de renderizar HTML/DOM de verdade:

1. **Preferencial:** retorne um `Node` (ex.: `document.createElement(...)`) — sempre anexado com segurança, independente de qualquer flag.
2. Retorne uma string HTML e habilite `allowUnsafeHtml: true`, globalmente (`options.allowUnsafeHtml`) ou por coluna (`column.allowUnsafeHtml`). Faça isso **apenas** para conteúdo que você controla — nunca para entrada de usuário sem escape.

```js
columns: [
  // Seguro: Node, nenhuma flag necessária
  { field: 'status', render: v => { const s = document.createElement('span'); s.textContent = v; return s; } },
  // Opt-in: string HTML, só nesta coluna
  { field: 'nota', render: v => `<b>${v}</b>`, allowUnsafeHtml: true },
]
```

Um teste de regressão cobre explicitamente o caso de XSS: um `render()` retornando `<img src=x onerror=...>` não cria o elemento nem executa o handler quando `allowUnsafeHtml` está desligado (padrão).

## Acessibilidade — estado atual

**Isto ainda não é um requisito verificado no código.** Nenhum atributo ARIA, gerenciamento de foco por teclado ou anúncio para leitores de tela foi implementado até o momento — é um item aberto no roadmap (seção 8.6 e 9.3 do plano de consolidação), priorizado antes do lançamento estável 2.0.

O que isso significa na prática hoje:

- A tabela usa elementos semânticos padrão (`<table>`, `<thead>`, `<tbody>`, `<tfoot>`), o que dá alguma leitura básica para leitores de tela via semântica nativa do HTML.
- **Não há** `aria-sort`, navegação por teclado dedicada, gerenciamento de foco em modais (configuração de colunas, dropdown de filtro) ou anúncios de estado (carregamento, resultados filtrados).
- Contraste de cores não foi auditado formalmente contra WCAG AA.

Se acessibilidade é um requisito do seu projeto, trate isso como uma limitação conhecida, não como um recurso parcialmente pronto. Contribuições nessa frente são bem-vindas — veja o roadmap público no repositório.
