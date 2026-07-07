# Estado

## `getState()` / `setState()`

`getState()` retorna um objeto serializável com o estado atual do grid; `setState()` restaura esse estado em qualquer instância (mesma origem de dados/colunas).

```ts
interface SkargridState {
  currentPage: number;
  pageSize: number;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  searchText: string;
  columnFilterValues: Record<string, unknown>;
  columnFilterSelected: Record<string, unknown[]>;
  selectedIndices: number[];
  visibleColumns: string[];
  columnOrder: string[];
  theme: 'light' | 'dark';
}
```

```js
const estado = grid.getState();
// ... mais tarde, na mesma instância ou em outra recém-criada com os mesmos dados/colunas:
grid.setState(estado);
```

Este é o mesmo formato que o [JSON Schema de estado](/ai/#schemas) descreve — útil tanto para persistência manual quanto para um agente de IA inspecionar/gerar estado programaticamente.

## Persistência automática (`persistState`)

```js
new Skargrid('tabela', {
  data, columns,
  persistState: true,
  stateStorageKey: 'minha-tabela', // opcional; padrão derivado do id do container
  stateVersion: 1,                  // mude para invalidar estado salvo de uma versão anterior
});

grid.clearPersistedState(); // remove o estado salvo do localStorage
```

Funcionamento:

- Ao montar, se houver estado salvo com a **mesma** `stateVersion`, ele é restaurado via `setState()`. Versão divergente é descartada (não aplicada).
- Toda mudança de estado agenda um salvamento com debounce de 150ms.
- `destroy()` finaliza (`flush`) um salvamento pendente em vez de descartá-lo — nenhuma mudança feita logo antes de destruir a instância é perdida.

## Server-Side Processing

Com `serverSide: true`, o grid **para de paginar, ordenar, filtrar e buscar localmente**: `data` é sempre entendido como exatamente a página atual, já ordenada e filtrada pelo seu servidor. O grid não é dono do fetch — você escuta os mesmos eventos `pageChange` / `sortChange` / `filterChange`, faz a requisição (qualquer cliente HTTP) e devolve o resultado com `updateData()` + `setTotalRecords()`:

```js
const grid = new Skargrid('tabela', {
  data: [],
  columns: [
    { field: 'id', title: 'ID' },
    { field: 'nome', title: 'Nome', sortable: true },
    { field: 'cidade', title: 'Cidade', filterable: true },
  ],
  pagination: true,
  pageSize: 20,
  sortable: true,
  searchable: true,
  columnFilters: true,
  serverSide: true,
});

async function buscarPagina() {
  grid.showLoading();

  const resp = await fetch(
    `/api/usuarios?page=${grid.currentPage}&pageSize=${grid.options.pageSize}` +
    `&sort=${grid.sortColumn ?? ''}&dir=${grid.sortDirection ?? ''}&q=${grid.searchText}`
  );
  const { data, total } = await resp.json();

  grid.hideLoading();
  grid.updateData(data);       // as linhas da página atual — não reseta página/ordenação/busca em modo server
  grid.setTotalRecords(total); // recalcula o total de páginas
}

grid.on('pageChange', buscarPagina);
grid.on('sortChange', buscarPagina);
grid.on('filterChange', buscarPagina); // cobre busca e filtros de coluna
buscarPagina(); // carga inicial
```

### Limitações conhecidas

- Filtros do tipo `select` (`filterType: 'select'`) calculam a lista de valores a partir de `data` — em modo server-side isso é só a página atual, não o conjunto completo de valores distintos. Busque os valores distintos no seu próprio endpoint se precisar da lista completa.
- Seleção de linhas usa índices relativos à página; selecionar através de várias páginas do servidor não é rastreado automaticamente.
