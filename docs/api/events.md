# Eventos

O grid expõe um event bus tipado: `on(event, handler)`, `off(event, handler?)` e `emit(event, ...args)`. Um listener que lança erro não interrompe o grid nem os demais listeners — cada chamada é protegida individualmente.

## Eventos disponíveis

| Evento | Payload | Disparado em |
| --- | --- | --- |
| `sortChange` | `(column: string \| null, direction: 'asc' \| 'desc' \| null)` | `handleSort()`, `clearSort()` |
| `pageChange` | `(page: number)` | `goToPage()`, `changePageSize()`, cliques reais nos controles de paginação |
| `selectionChange` | `(rows: Row[])` | `toggleSelectRow()`, `toggleSelectAll()`, `selectRows()`, `deselectRows()`, `clearSelection()` |
| `filterChange` | `()` (sem payload) | busca global, filtro por coluna, `clearAllFilters()`, `clearSearch()` |
| `rowClick` | `(row: Row, index: number)` | clique em uma linha do corpo da tabela |

## Uso

```js
grid.on('sortChange', (column, direction) => {
  console.log('Ordenado por', column, direction);
});

grid.on('pageChange', (page) => {
  console.log('Página atual:', page);
});

grid.on('selectionChange', (rows) => {
  console.log('Seleção mudou:', rows);
});

grid.on('filterChange', () => {
  console.log('Filtros mudaram. Linhas atuais:', grid.getData().length);
});

grid.on('rowClick', (row, index) => {
  console.log('Linha clicada:', row, index);
});
```

## Removendo listeners

```js
function meuHandler(column, direction) { /* ... */ }

grid.on('sortChange', meuHandler);
grid.off('sortChange', meuHandler); // remove só esse listener
grid.off('sortChange');             // remove todos os listeners desse evento
```

## Atalhos via `options`

Os cinco eventos têm equivalentes no construtor, úteis quando você só precisa de um listener fixo desde a criação:

```js
new Skargrid('tabela', {
  data, columns,
  onSortChange: (column, direction) => { /* ... */ },
  onPageChange: (page) => { /* ... */ },
  onSelectionChange: (rows) => { /* ... */ },
  onFilterChange: () => { /* ... */ },
  onRowClick: (row, index) => { /* ... */ },
});
```

`destroy()` limpa todos os listeners registrados, sem necessidade de removê-los manualmente antes.
