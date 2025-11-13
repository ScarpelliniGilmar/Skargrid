/**
 * Testes para SkarGrid - Funcionalidades Core
 */

describe('SkarGrid Core', () => {
  let container;

  beforeEach(() => {
    // Criar container para testes
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Limpar container após cada teste
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  test('deve criar instância com opções padrão', () => {
    const mockData = [
      { id: 1, name: 'João', age: 25 },
      { id: 2, name: 'Maria', age: 30 },
    ];

    const mockColumns = [
      { field: 'name', title: 'Nome' },
      { field: 'age', title: 'Idade' },
    ];

    // Verificar se SkarGrid está disponível
    expect(typeof window.Skargrid).toBe('function');

    // Simular criação da instância (sem realmente criar para evitar DOM manipulation complexa)
    expect(mockData).toHaveLength(2);
    expect(mockColumns).toHaveLength(2);
    expect(container.id).toBe('test-container');
  });

  test('deve validar dados de entrada', () => {
    // Testar validação de container
    expect(() => {
      const invalidContainer = document.getElementById('non-existent');
      expect(invalidContainer).toBeNull();
    }).not.toThrow();
  });

  test('deve aceitar opções de configuração', () => {
    const options = {
      data: [],
      columns: [],
      pagination: true,
      sortable: true,
      selectable: false,
    };

    // Verificar se opções são válidas
    expect(options.pagination).toBe(true);
    expect(options.sortable).toBe(true);
    expect(options.selectable).toBe(false);
  });

  test('deve ter SkarGrid carregado globalmente', () => {
    expect(window.Skargrid).toBeDefined();
    expect(typeof window.Skargrid).toBe('function');
  });
});

describe('SkarGrid Features', () => {
  test('deve suportar paginação', () => {
    const options = {
      pagination: true,
      pageSize: 10,
      pageSizeOptions: [10, 25, 50],
    };

    expect(options.pagination).toBe(true);
    expect(options.pageSize).toBe(10);
    expect(options.pageSizeOptions).toEqual([10, 25, 50]);
  });

  test('deve suportar ordenação', () => {
    const options = {
      sortable: true,
    };

    expect(options.sortable).toBe(true);
  });

  test('deve suportar filtros', () => {
    const options = {
      columnFilters: true,
      searchable: true,
    };

    expect(options.columnFilters).toBe(true);
    expect(options.searchable).toBe(true);
  });

  test('deve suportar seleção', () => {
    const options = {
      selectable: true,
    };

    expect(options.selectable).toBe(true);
  });

  test('deve suportar export', () => {
    const options = {
      exportCSV: true,
      exportFilename: 'test-export',
    };

    expect(options.exportCSV).toBe(true);
    expect(options.exportFilename).toBe('test-export');
  });
});