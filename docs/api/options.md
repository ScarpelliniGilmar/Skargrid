# Opções

## Opções do grid (`options`)

| Opção | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `data` | `Row[]` | `[]` | Array de objetos de dados |
| `columns` | `SkargridColumn[]` | `[]` | Configuração de colunas — veja [Configuração de colunas](/guide/columns) |
| `className` | `string` | `'skargrid'` | Classe CSS da tabela |
| `theme` | `'light' \| 'dark'` | `'light'` | Tema visual |
| `pagination` | `boolean` | `false` | Habilita paginação |
| `pageSize` | `number` | `10` | Itens por página |
| `pageSizeOptions` | `number[]` | `[10,25,50,100]` | Opções do seletor de tamanho de página |
| `sortable` | `boolean` | `false` | Habilita ordenação global |
| `selectable` | `boolean` | `false` | Habilita seleção múltipla de linhas |
| `searchable` | `boolean` | `false` | Habilita busca global (insensível a acentos) |
| `columnFilters` | `boolean` | `false` | Habilita filtros por coluna |
| `columnConfig` | `boolean` | `false` | Habilita o botão de configuração de colunas |
| `persistColumnConfig` | `boolean` | `false` | Salva a config de colunas em `localStorage` |
| `storageKey` | `string` | `'skargrid-config-{id}'` | Chave do `localStorage` para a config de colunas |
| `exportCSV` | `boolean` | `false` | Habilita botão de exportação CSV |
| `exportXLSX` | `boolean` | `false` | Habilita botão de exportação XLSX |
| `exportFilename` | `string` | `'skargrid-export'` | Nome base dos arquivos exportados |
| `virtualization` | `boolean` | `false` | Habilita virtualização (não combina com `pagination`) |
| `height` | `string` | — | Altura fixa do container (necessária para `virtualization`) |
| `allowUnsafeHtml` | `boolean` | `false` | Padrão global para colunas sem `allowUnsafeHtml` próprio — veja [Acessibilidade e segurança](/guide/accessibility-security) |
| `persistState` | `boolean` | `false` | Persiste/restaura `getState()`/`setState()` via `localStorage` — veja [Estado](/api/state) |
| `stateStorageKey` | `string` | `'skargrid-state-{id}'` | Chave do `localStorage` para `persistState` |
| `stateVersion` | `number \| string` | `1` | Estado salvo com versão diferente é descartado |
| `footerAggregates` | `boolean` | `false` | Mostra um `<tfoot>` com os valores de `column.aggregate` |
| `serverSide` | `boolean` | `false` | Delega paginação/ordenação/filtro/busca ao servidor — veja [Estado § Server-Side Processing](/api/state#server-side-processing) |
| `totalRecords` | `number` | `0` | Total de registros no servidor; atualize com `setTotalRecords()` |
| `labels` | `Partial<SkargridLabels>` | — | Textos customizáveis (i18n) — veja abaixo |
| `onRowClick` | `(row, index) => void` | — | Atalho de construtor equivalente a `grid.on('rowClick', ...)` |
| `onSelectionChange` | `(rows) => void` | — | Atalho equivalente a `grid.on('selectionChange', ...)` |
| `onFilterChange` | `() => void` | — | Atalho equivalente a `grid.on('filterChange', ...)` |
| `onPageChange` | `(page) => void` | — | Atalho equivalente a `grid.on('pageChange', ...)` |
| `onSortChange` | `(column, direction) => void` | — | Atalho equivalente a `grid.on('sortChange', ...)` |

## Internacionalização (`labels`)

```js
new Skargrid('tabela', {
  // ...
  labels: {
    searchPlaceholder: 'Buscar em todas as colunas...',
    clearFilters: 'Limpar Filtros',
    exportCSV: 'Exportar CSV',
    exportXLSX: 'Exportar XLSX',
    filterTitle: 'Filtrar: {title}',
    selectAll: 'Selecionar Todos',
    filterSearchPlaceholder: 'Buscar...',
    filterInputPlaceholder: 'Digite para filtrar...',
    clear: 'Limpar',
    apply: 'Aplicar',
    showing: 'Mostrando {start} até {end} de {total} registros',
    filteredOfTotal: 'filtrados de {total} total',
    itemsPerPage: 'Itens por página:',
    noRowsSelected: 'Nenhuma linha selecionada para exportar.',
    columnConfigTitle: 'Configurar Colunas',
    columnConfigDescription: 'Marque para exibir, arraste ou use setas para reordenar',
    restore: 'Restaurar',
    cancel: 'Cancelar',
    noData: 'Nenhum dado disponível',
    loading: 'Carregando...',
  },
});
```

`{title}`, `{start}`, `{end}` e `{total}` são placeholders substituídos em runtime, quando suportados pela chave.

## Configuração de colunas

Veja [Configuração de colunas](/guide/columns) para a lista completa de propriedades por coluna (`field`, `render`, `frozen`, `aggregate`, etc.).
