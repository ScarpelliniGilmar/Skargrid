# Configuração de colunas

Cada item do array `columns` descreve uma coluna:

```js
{
  field: 'name',            // Campo do objeto de dados (obrigatório)
  title: 'Nome completo',   // Título do cabeçalho
  width: '200px',           // Largura (opcional)
  visible: true,             // Visibilidade inicial (padrão: true)
  sortable: true,             // Permite ordenação (padrão: false)
  sortType: 'string',         // 'string' | 'number' | 'date'
  filterable: true,           // Mostra o ícone de filtro (padrão: false)
  filterType: 'text',         // 'text' | 'number' | 'date' | 'select'
  frozen: false,               // Fixa a coluna à esquerda no scroll horizontal
  render: (value, row, index) => value.toUpperCase(),
  aggregate: 'sum',            // Requer options.footerAggregates: true
  aggregateFormatter: (value, rows) => `R$ ${value.toFixed(2)}`,
}
```

## `render` / `formatter`

Ambos recebem `(value, row, index)` e podem retornar:

- **Uma string** — tratada como texto puro (`textContent`) por padrão. Tags HTML não são interpretadas.
- **Um `Node`** — sempre anexado com segurança, independentemente de qualquer flag. É a forma recomendada quando você precisa de HTML/DOM (badges, ícones, links).

```js
// Texto simples — seguro por padrão, nenhuma configuração extra
{ field: 'status', render: (v) => v.toUpperCase() }

// HTML/DOM — retorne um Node, sempre seguro
{
  field: 'status',
  render: (v) => {
    const badge = document.createElement('span');
    badge.className = `badge badge-${v}`;
    badge.textContent = v;
    return badge;
  },
}
```

Ver [Acessibilidade e segurança](/guide/accessibility-security) para o caso — desencorajado — de retornar uma string HTML.

## `frozen`

Fixa a coluna à esquerda durante o scroll horizontal (`position: sticky`). Precisa formar um **prefixo contíguo** a partir da primeira coluna de dados (depois da coluna de seleção, se `selectable: true`). Uma coluna `frozen: true` que aparece depois de uma coluna não-congelada é ignorada com um `console.warn`, em vez de aplicada de forma inconsistente.

```js
columns: [
  { field: 'id', title: 'ID', frozen: true },
  { field: 'nome', title: 'Nome', frozen: true },
  { field: 'email', title: 'Email' }, // não congelada — ok, ID e Nome já formam o prefixo
]
```

## `aggregate` / `aggregateFormatter`

Requer `options.footerAggregates: true` no grid. Aceita os agregadores embutidos (`'sum'`, `'avg'`, `'count'`, `'min'`, `'max'`) ou uma função customizada `(rows, field) => valor`. O cálculo usa os dados filtrados (`filteredData`), refletindo busca e filtros ativos — não apenas a página atual.

```js
{
  field: 'idade',
  aggregate: 'avg',
  aggregateFormatter: (value) => value.toFixed(1),
}
```

Valores `null`/`undefined`/`''` são excluídos do cálculo (não contam como zero).
