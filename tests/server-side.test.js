/**
 * Testes para o modo server-side (options.serverSide + setTotalRecords()).
 * O grid não busca dados sozinho — o consumidor escuta pageChange/sortChange/
 * filterChange, faz a requisição e chama updateData() + setTotalRecords().
 * Estes testes simulam esse fluxo.
 */

describe('SkarGrid - modo server-side', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'server-test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  function page(n, size = 10) {
    return Array.from({ length: size }, (_, i) => ({ id: (n - 1) * size + i + 1, nome: `Usuário ${(n - 1) * size + i + 1}` }));
  }

  test('totalPages é calculado a partir de totalRecords, não do tamanho da página atual', () => {
    const grid = new window.Skargrid('server-test-container', {
      data: page(1),
      columns: [{ field: 'id', title: 'ID' }, { field: 'nome', title: 'Nome' }],
      pagination: true,
      pageSize: 10,
      serverSide: true,
      totalRecords: 95,
    });

    expect(grid.totalPages).toBe(10); // ceil(95/10)
    expect(container.querySelectorAll('tbody tr')).toHaveLength(10);
  });

  test('getPageData() não fatia — options.data já é a página atual', () => {
    new window.Skargrid('server-test-container', {
      data: page(1, 7), // servidor retornou só 7 linhas (última página)
      columns: [{ field: 'id', title: 'ID' }, { field: 'nome', title: 'Nome' }],
      pagination: true,
      pageSize: 10,
      serverSide: true,
      totalRecords: 7,
    });

    expect(container.querySelectorAll('tbody tr')).toHaveLength(7);
  });

  test('setTotalRecords() recalcula totalPages e re-renderiza a paginação', () => {
    const grid = new window.Skargrid('server-test-container', {
      data: page(1),
      columns: [{ field: 'id', title: 'ID' }, { field: 'nome', title: 'Nome' }],
      pagination: true,
      pageSize: 10,
      serverSide: true,
      totalRecords: 10,
    });

    expect(grid.totalPages).toBe(1);

    grid.setTotalRecords(237);
    expect(grid.totalPages).toBe(24); // ceil(237/10)
  });

  test('updateData() preserva página/ordenação/busca atuais em vez de resetar', () => {
    const grid = new window.Skargrid('server-test-container', {
      data: page(3),
      columns: [{ field: 'id', title: 'ID', sortable: true }, { field: 'nome', title: 'Nome' }],
      pagination: true,
      pageSize: 10,
      sortable: true,
      searchable: true,
      serverSide: true,
      totalRecords: 95,
    });

    grid.goToPage(3);
    grid.handleSort('nome');
    grid.handleSearch('usuário 2');
    expect(grid.currentPage).toBe(1); // handleSearch reseta para página 1 (comportamento esperado)

    grid.currentPage = 5; // simula estar em outra página no momento da resposta do servidor
    grid.updateData(page(5));

    expect(grid.currentPage).toBe(5);
    expect(grid.sortColumn).toBe('nome');
    expect(grid.searchText).toBe('usuário 2');
  });

  test('handleSort() não ordena localmente nem tenta restaurar "ordem original" — dados já vêm do servidor', () => {
    const originalOrder = page(1);
    const grid = new window.Skargrid('server-test-container', {
      data: [...originalOrder],
      columns: [{ field: 'id', title: 'ID', sortable: true }, { field: 'nome', title: 'Nome' }],
      sortable: true,
      serverSide: true,
      totalRecords: 10,
    });

    grid.handleSort('nome'); // asc
    grid.handleSort('nome'); // desc
    grid.handleSort('nome'); // limpa ordenação

    expect(grid.sortColumn).toBeNull();
    // dados não foram embaralhados/restaurados localmente — options.data é o
    // que veio da última resposta do servidor, sem mutação client-side
    expect(grid.getData()).toEqual(originalOrder);
  });

  test('filteredData é só um espelho de options.data — filtro/busca não removem linhas no cliente', () => {
    const grid = new window.Skargrid('server-test-container', {
      data: page(1),
      columns: [{ field: 'id', title: 'ID' }, { field: 'nome', title: 'Nome', filterable: true }],
      searchable: true,
      columnFilters: true,
      serverSide: true,
      totalRecords: 10,
    });

    grid.handleSearch('não existe na página atual');

    // Em modo client-side isso zeraria filteredData; em server-side as
    // linhas continuam visíveis (o servidor decide o que já filtrar)
    expect(grid.filteredData).toHaveLength(10);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(10);
  });

  test('pageChange, sortChange e filterChange disparam normalmente, permitindo o consumidor buscar a próxima página', () => {
    const grid = new window.Skargrid('server-test-container', {
      data: page(1),
      columns: [{ field: 'id', title: 'ID', sortable: true }, { field: 'nome', title: 'Nome', filterable: true }],
      pagination: true,
      pageSize: 10,
      sortable: true,
      searchable: true,
      columnFilters: true,
      serverSide: true,
      totalRecords: 30,
    });

    const events = [];
    grid.on('pageChange', p => events.push(['pageChange', p]));
    grid.on('sortChange', (c, d) => events.push(['sortChange', c, d]));
    grid.on('filterChange', () => events.push(['filterChange']));

    grid.goToPage(2);
    grid.handleSort('nome');
    grid.handleSearch('ana');

    expect(events).toEqual([
      ['pageChange', 2],
      ['sortChange', 'nome', 'asc'],
      ['filterChange'],
    ]);
  });
});
