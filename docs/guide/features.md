# Recursos

Visão geral dos recursos disponíveis. Para a lista completa de opções, veja [Opções](/api/options).

## Paginação, ordenação e busca

```js
new Skargrid('tabela', {
  data, columns,
  pagination: true,
  pageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
  sortable: true,
  searchable: true, // busca global, insensível a acentos (José = jose)
});
```

## Filtros por coluna

```js
columns: [
  { field: 'nome', filterable: true, filterType: 'text' },
  { field: 'idade', filterable: true, filterType: 'number' },
  { field: 'cidade', filterable: true, filterType: 'select' }, // dropdown com valores únicos
]
```

Filtros de seleção (`filterType: 'select'`) mostram apenas os valores ainda disponíveis dado o que já está filtrado nas outras colunas.

## Seleção de linhas

```js
new Skargrid('tabela', { data, columns, selectable: true });

grid.getSelectedRows();
grid.selectRows([0, 1, 2]);
grid.clearSelection();
```

## Colunas congeladas (`frozen`)

Ver [Configuração de colunas](/guide/columns#frozen).

## Agregações no rodapé (`footerAggregates`)

```js
new Skargrid('tabela', {
  data, columns, footerAggregates: true,
});
```

Ver [Configuração de colunas](/guide/columns#aggregate-aggregateformatter).

## Persistência de estado (`persistState`)

Salva e restaura `getState()`/`setState()` via `localStorage` automaticamente:

```js
new Skargrid('tabela', {
  data, columns,
  persistState: true,
  stateStorageKey: 'minha-tabela', // opcional; padrão derivado do id do container
  stateVersion: 1,                  // estado salvo com versão diferente é descartado
});
```

Ver [Estado](/api/state) para o que exatamente é persistido.

## Processamento server-side (`serverSide`)

Delega paginação, ordenação, filtro e busca ao servidor — o grid nunca corta/ordena/filtra localmente nesse modo. Ver [Server-Side Processing](/api/state#server-side-processing) para o padrão completo com eventos.

## Exportação (CSV / XLSX)

```js
new Skargrid('tabela', {
  data, columns,
  exportCSV: true,
  exportXLSX: true,
  exportFilename: 'relatorio',
});

grid.exportToCSV('dados.csv');
grid.exportSelectedToCSV('selecionados.csv');
```

Sem dependências externas — XLSX é gerado puramente em JS.

## Virtualização

Para datasets grandes (10k+ linhas) sem paginação:

```js
new Skargrid('lista-virtual', {
  data: dataset100k,
  virtualization: true,
  height: '500px', // obrigatório: altura fixa para o scroll interno
});
```

::: warning
`virtualization` e `pagination` não se combinam — a biblioteca escolhe um modelo por vez.
:::

## Configuração de colunas (mostrar/ocultar/reordenar)

```js
new Skargrid('tabela', {
  data, columns,
  columnConfig: true,
  persistColumnConfig: true, // salva a config em localStorage
});
```

## Temas

```js
new Skargrid('tabela', { data, columns, theme: 'dark' });
grid.setTheme('light');
```

Customize via variáveis CSS (`--sg-primary`, `--sg-accent`, `--sg-gray`, `--sg-white`, etc.) — veja o `:root` em `skargrid.css`.
