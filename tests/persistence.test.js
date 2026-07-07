/**
 * Testes para a persistência de estado (persistState / stateVersion) via localStorage.
 */

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('SkarGrid - persistência de estado', () => {
  let container;
  let data;
  let columns;

  beforeEach(() => {
    localStorage.clear();

    container = document.createElement('div');
    container.id = 'persist-test-container';
    document.body.appendChild(container);

    data = [
      { id: 1, nome: 'Ana', cidade: 'SP' },
      { id: 2, nome: 'Bruno', cidade: 'RJ' },
      { id: 3, nome: 'Carla', cidade: 'SP' },
    ];

    columns = [
      { field: 'id', title: 'ID', sortable: true },
      { field: 'nome', title: 'Nome', filterable: true, sortable: true },
      { field: 'cidade', title: 'Cidade', filterable: true, filterType: 'select' },
    ];
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    localStorage.clear();
  });

  test('desabilitada por padrão: nada é escrito no localStorage', async () => {
    const grid = new window.Skargrid('persist-test-container', { data, columns, sortable: true });
    grid.handleSort('nome');
    await wait(200);

    expect(localStorage.length).toBe(0);
  });

  test('salva e restaura ordenação, seleção e filtro numa nova instância', async () => {
    const gridA = new window.Skargrid('persist-test-container', {
      data, columns, sortable: true, selectable: true, columnFilters: true,
      persistState: true, stateStorageKey: 'skargrid-test-state',
    });

    gridA.handleSort('nome');
    gridA.selectRows([0, 2]);
    gridA.handleColumnFilter('cidade', 'SP');
    await wait(200);

    gridA.destroy();

    const containerB = document.createElement('div');
    containerB.id = 'persist-test-container-b';
    document.body.appendChild(containerB);

    const gridB = new window.Skargrid('persist-test-container-b', {
      data, columns, sortable: true, selectable: true, columnFilters: true,
      persistState: true, stateStorageKey: 'skargrid-test-state',
    });

    expect(gridB.sortColumn).toBe('nome');
    expect(gridB.getSelectedIndices().sort()).toEqual([0, 2]);
    expect(gridB.columnFilterValues.cidade).toBe('SP');

    containerB.remove();
  });

  test('estado salvo com stateVersion diferente é descartado', async () => {
    const gridA = new window.Skargrid('persist-test-container', {
      data, columns, sortable: true,
      persistState: true, stateStorageKey: 'skargrid-test-version', stateVersion: 1,
    });
    gridA.handleSort('nome');
    await wait(200);
    gridA.destroy();

    const containerB = document.createElement('div');
    containerB.id = 'persist-test-container-b';
    document.body.appendChild(containerB);

    const gridB = new window.Skargrid('persist-test-container-b', {
      data, columns, sortable: true,
      persistState: true, stateStorageKey: 'skargrid-test-version', stateVersion: 2,
    });

    expect(gridB.sortColumn).toBeNull();

    containerB.remove();
  });

  test('clearPersistedState() remove a entrada salva', async () => {
    const grid = new window.Skargrid('persist-test-container', {
      data, columns, sortable: true,
      persistState: true, stateStorageKey: 'skargrid-test-clear',
    });
    grid.handleSort('nome');
    await wait(200);

    expect(localStorage.getItem('skargrid-test-clear')).not.toBeNull();

    grid.clearPersistedState();
    expect(localStorage.getItem('skargrid-test-clear')).toBeNull();
  });

  test('clearPersistedState() seguido de destroy() sem mudanças novas não ressuscita o estado limpo', async () => {
    const grid = new window.Skargrid('persist-test-container', {
      data, columns, sortable: true,
      persistState: true, stateStorageKey: 'skargrid-test-clear-then-destroy',
    });
    grid.handleSort('nome');
    await wait(200); // deixa o debounce disparar e zerar _persistTimeout

    grid.clearPersistedState();
    grid.destroy(); // não deve re-salvar, já que não há mudança pendente após o clear

    expect(localStorage.getItem('skargrid-test-clear-then-destroy')).toBeNull();
  });

  test('destroy() logo após uma mudança finaliza o salvamento pendente em vez de descartá-lo', async () => {
    const grid = new window.Skargrid('persist-test-container', {
      data, columns, sortable: true,
      persistState: true, stateStorageKey: 'skargrid-test-flush',
    });

    // Sem aguardar o debounce (150ms) — destroy() deve salvar mesmo assim.
    grid.handleSort('nome');
    grid.destroy();

    const raw = localStorage.getItem('skargrid-test-flush');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw).state.sortColumn).toBe('nome');
  });

  test('sem stateStorageKey explícito, a chave é derivada do id do container', async () => {
    const grid = new window.Skargrid('persist-test-container', {
      data, columns, sortable: true, persistState: true,
    });
    grid.handleSort('nome');
    await wait(200);

    expect(localStorage.getItem('skargrid-state-persist-test-container')).not.toBeNull();
  });
});
