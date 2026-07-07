/**
 * Testes para o event bus (on/off/emit) e os atalhos options.onX
 */

describe('SkarGrid - event bus', () => {
  let container;
  let data;
  let columns;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'events-test-container';
    document.body.appendChild(container);

    data = [
      { id: 1, nome: 'Ana', cidade: 'SP' },
      { id: 2, nome: 'Bruno', cidade: 'RJ' },
      { id: 3, nome: 'Carla', cidade: 'SP' },
    ];

    columns = [
      { field: 'id', title: 'ID', sortable: true },
      { field: 'nome', title: 'Nome', filterable: true },
      { field: 'cidade', title: 'Cidade', filterable: true, filterType: 'select' },
    ];
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  test('emite "sort" com coluna e direção ao ordenar e ao limpar ordenação', () => {
    const grid = new window.Skargrid('events-test-container', { data, columns, sortable: true });
    const events = [];
    grid.on('sort', (column, direction) => events.push({ column, direction }));

    grid.handleSort('nome');
    grid.clearSort();

    expect(events).toEqual([
      { column: 'nome', direction: 'asc' },
      { column: null, direction: null },
    ]);
  });

  test('emite "pageChange" com a página atual ao navegar e ao mudar o tamanho da página', () => {
    const grid = new window.Skargrid('events-test-container', {
      data, columns, pagination: true, pageSize: 1,
    });
    const pages = [];
    grid.on('pageChange', page => pages.push(page));

    grid.goToPage(2);
    grid.changePageSize(2);

    expect(pages).toEqual([2, 1]);
  });

  test('emite "selectionChange" com as linhas selecionadas', () => {
    const grid = new window.Skargrid('events-test-container', { data, columns, selectable: true });
    const calls = [];
    grid.on('selectionChange', rows => calls.push(rows.map(r => r.id)));

    grid.selectRows([0, 2]);
    grid.clearSelection();

    expect(calls).toEqual([[1, 3], []]);
  });

  test('emite "filterChange" ao buscar, filtrar por coluna e limpar filtros', () => {
    const grid = new window.Skargrid('events-test-container', {
      data, columns, searchable: true, columnFilters: true,
    });
    let count = 0;
    grid.on('filterChange', () => { count += 1; });

    grid.handleSearch('ana');
    grid.handleColumnFilter('cidade', 'SP');
    grid.clearAllFilters();

    expect(count).toBe(3);
  });

  test('emite "rowClick" com a linha e o índice ao clicar numa linha', () => {
    const grid = new window.Skargrid('events-test-container', { data, columns });
    const clicks = [];
    grid.on('rowClick', (row, index) => clicks.push({ id: row.id, index }));

    container.querySelector('tbody tr').dispatchEvent(new Event('click', { bubbles: true }));

    expect(clicks).toEqual([{ id: 1, index: 0 }]);
  });

  test('off() remove um listener específico sem afetar os demais', () => {
    const grid = new window.Skargrid('events-test-container', { data, columns, sortable: true });
    const a = jest.fn();
    const b = jest.fn();
    grid.on('sort', a);
    grid.on('sort', b);

    grid.off('sort', a);
    grid.handleSort('nome');

    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });

  test('um listener que lança erro não impede os demais nem quebra a operação', () => {
    const grid = new window.Skargrid('events-test-container', { data, columns, sortable: true });
    const ok = jest.fn();
    grid.on('sort', () => { throw new Error('listener quebrado'); });
    grid.on('sort', ok);

    expect(() => grid.handleSort('nome')).not.toThrow();
    expect(ok).toHaveBeenCalledTimes(1);
  });

  test('destroy() limpa todos os listeners registrados', () => {
    const grid = new window.Skargrid('events-test-container', { data, columns, sortable: true });
    const handler = jest.fn();
    grid.on('sort', handler);

    grid.destroy();
    // emitir manualmente após destroy não deve chamar o handler nem lançar erro
    expect(() => grid.emit('sort', 'nome', 'asc')).not.toThrow();
    expect(handler).not.toHaveBeenCalled();
  });

  test('options.onSortChange/onPageChange/onSelectionChange/onFilterChange/onRowClick funcionam como atalho para on()', () => {
    const onSortChange = jest.fn();
    const onPageChange = jest.fn();
    const onSelectionChange = jest.fn();
    const onFilterChange = jest.fn();
    const onRowClick = jest.fn();

    const grid = new window.Skargrid('events-test-container', {
      data, columns,
      sortable: true, pagination: true, pageSize: 1, selectable: true, searchable: true,
      onSortChange, onPageChange, onSelectionChange, onFilterChange, onRowClick,
    });

    grid.handleSort('nome');
    grid.goToPage(2);
    grid.selectRows([0]);
    grid.handleSearch('ana');
    container.querySelector('tbody tr').dispatchEvent(new Event('click', { bubbles: true }));

    expect(onSortChange).toHaveBeenCalledWith('nome', 'asc');
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(onSelectionChange).toHaveBeenCalledWith(expect.any(Array));
    expect(onFilterChange).toHaveBeenCalled();
    expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }), 0);
  });
});
