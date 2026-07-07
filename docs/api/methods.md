# Métodos

Métodos públicos disponíveis na instância retornada por `new Skargrid(...)`.

## Dados

```js
grid.updateData(newData);   // substitui os dados; em serverSide não reseta página/ordenação/busca
grid.getData();              // cópia do array de dados atual (seguro mutar o retorno)
```

## Seleção

```js
grid.getSelectedRows();      // Row[]
grid.getSelectedIndices();   // number[]
grid.selectRows([0, 1, 2]);
grid.deselectRows([0]);
grid.clearSelection();
```

## Filtros e busca

```js
grid.clearAllFilters();
grid.clearSearch();
grid.clearSort();
```

## Navegação

```js
grid.goToPage(3);
grid.changePageSize(25);
grid.setTotalRecords(5000); // modo serverSide — recalcula o total de páginas
```

## Tema

```js
grid.setTheme('dark'); // 'light' | 'dark'
```

## Configuração de colunas

```js
grid.saveColumnConfig();
grid.loadColumnConfig();
grid.clearSavedColumnConfig();
```

## Exportação

```js
grid.exportToCSV('dados.csv');
grid.exportSelectedToCSV('selecionados.csv');
grid.exportToXLSX('dados.xlsx');
grid.exportSelectedToXLSX('selecionados.xlsx');
```

## Estado

```js
const state = grid.getState();
grid.setState(state);
grid.clearPersistedState(); // só relevante com options.persistState: true
```

Detalhes em [Estado](/api/state).

## Eventos

```js
grid.on('sortChange', handler);
grid.off('sortChange', handler); // sem handler, remove todos os listeners do evento
grid.emit('sortChange', 'nome', 'asc'); // uso interno; raramente necessário chamar diretamente
```

Detalhes em [Eventos](/api/events).

## Loading (uso manual, típico em `serverSide`)

```js
grid.showLoading();
grid.hideLoading();
```

## Ciclo de vida

```js
grid.refreshTable(); // força um re-render sem mudar dados/estado
grid.destroy();      // remove listeners, timers e nós DOM associados
```

Sempre chame `destroy()` antes de descartar o container (ex.: ao desmontar um componente de framework), para não vazar o listener de scroll da busca nem o dropdown de filtro anexado a `document.body`.
