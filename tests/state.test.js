/**
 * Testes para getState()/setState() e limpeza de destroy()
 */

describe('SkarGrid - estado serializável', () => {
  let container;
  let data;
  let columns;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'state-test-container';
    document.body.appendChild(container);

    data = [
      { id: 1, nome: 'Ana', cidade: 'SP', idade: 30 },
      { id: 2, nome: 'Bruno', cidade: 'RJ', idade: 25 },
      { id: 3, nome: 'Carla', cidade: 'SP', idade: 40 },
      { id: 4, nome: 'Duda', cidade: 'MG', idade: 22 },
    ];

    columns = [
      { field: 'id', title: 'ID', sortable: true },
      { field: 'nome', title: 'Nome', filterable: true, sortable: true },
      { field: 'cidade', title: 'Cidade', filterable: true, filterType: 'select' },
      { field: 'idade', title: 'Idade', filterable: true, filterType: 'number' },
    ];
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  test('getState() reflete página, ordenação, filtros, busca, seleção e tema atuais', () => {
    const grid = new window.Skargrid('state-test-container', {
      data,
      columns,
      pagination: true,
      pageSize: 2,
      sortable: true,
      searchable: true,
      selectable: true,
      columnFilters: true,
      theme: 'light',
    });

    grid.handleSort('nome');
    grid.handleColumnFilter('cidade', 'SP');
    grid.selectRows([0, 2]);
    grid.goToPage(1);
    grid.setTheme('dark');

    const state = grid.getState();

    expect(state.sortColumn).toBe('nome');
    expect(state.sortDirection).toBe('asc');
    expect(state.columnFilterValues.cidade).toBe('SP');
    expect(state.selectedIndices.sort()).toEqual([0, 2]);
    expect(state.theme).toBe('dark');
    expect(state.pageSize).toBe(2);
    expect(state.columnOrder).toEqual(['id', 'nome', 'cidade', 'idade']);
    expect(state.visibleColumns).toEqual(expect.arrayContaining(['id', 'nome', 'cidade', 'idade']));
  });

  test('setState() restaura um estado obtido de outra instância', () => {
    const gridA = new window.Skargrid('state-test-container', {
      data,
      columns,
      pagination: true,
      pageSize: 2,
      sortable: true,
      selectable: true,
      columnFilters: true,
    });

    gridA.handleSort('idade');
    gridA.handleColumnFilter('cidade', 'SP');
    gridA.selectRows([1]);
    const savedState = gridA.getState();
    gridA.destroy();

    const containerB = document.createElement('div');
    containerB.id = 'state-test-container-b';
    document.body.appendChild(containerB);

    const gridB = new window.Skargrid('state-test-container-b', {
      data,
      columns,
      pagination: true,
      pageSize: 2,
      sortable: true,
      selectable: true,
      columnFilters: true,
    });

    gridB.setState(savedState);

    expect(gridB.sortColumn).toBe('idade');
    expect(gridB.columnFilterValues.cidade).toBe('SP');
    expect(gridB.getSelectedIndices()).toEqual([1]);

    containerB.remove();
  });

  test('setState() ignora chaves ausentes sem quebrar o estado atual', () => {
    const grid = new window.Skargrid('state-test-container', {
      data,
      columns,
      sortable: true,
    });

    grid.handleSort('nome');
    grid.setState({ theme: 'dark' });

    expect(grid.sortColumn).toBe('nome');
    expect(grid.options.theme).toBe('dark');
  });

  test('destroy() limpa o container, o timeout de busca e listeners de scroll de filtro', () => {
    const grid = new window.Skargrid('state-test-container', {
      data,
      columns,
      searchable: true,
      columnFilters: true,
    });

    grid.searchTimeout = setTimeout(() => {}, 10000);

    const th = container.querySelector('thead th[data-field="cidade"]');
    const filterButton = th ? th.querySelector('button') : null;
    if (filterButton) {
      filterButton.click();
      expect(grid.openFilterDropdown).not.toBeNull();
    }

    const removeSpy = jest.spyOn(window, 'removeEventListener');

    grid.destroy();

    expect(container.innerHTML).toBe('');
    expect(grid.searchTimeout).toBeNull();
    expect(grid.openFilterDropdown).toBeNull();
    if (filterButton) {
      expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
    }

    removeSpy.mockRestore();
  });
});
