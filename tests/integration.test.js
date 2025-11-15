/**
 * Testes de Integração para SkarGrid
 */

describe('SkarGrid Integration Tests', () => {
  let container;
  let skargrid;

  beforeEach(() => {
    // Criar container para testes
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Limpar instância e container
    if (skargrid) {
      // Não há método destroy, então apenas removemos o container
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  test('deve renderizar tabela básica', () => {
    const data = [
      { id: 1, name: 'João', age: 25 },
      { id: 2, name: 'Maria', age: 30 },
    ];

    const columns = [
      { field: 'name', title: 'Nome' },
      { field: 'age', title: 'Idade' },
    ];

    // Criar instância do SkarGrid
    skargrid = new window.Skargrid('test-container', {
      data: data,
      columns: columns,
    });

    // Verificar se elementos foram criados
    expect(container.querySelector('.skargrid-wrapper')).not.toBeNull();
    expect(container.querySelector('.skargrid')).not.toBeNull();
    expect(container.querySelector('table')).not.toBeNull();
  });

  test('deve renderizar cabeçalhos corretamente', () => {
    const data = [{ name: 'Test', age: 20 }];
    const columns = [
      { field: 'name', title: 'Nome' },
      { field: 'age', title: 'Idade' },
    ];

    skargrid = new window.Skargrid('test-container', {
      data: data,
      columns: columns,
    });

    const headers = container.querySelectorAll('thead th');
    expect(headers).toHaveLength(2);
    expect(headers[0].textContent).toBe('Nome');
    expect(headers[1].textContent).toBe('Idade');
  });

  test('deve renderizar dados corretamente', () => {
    const data = [
      { name: 'João', age: 25 },
      { name: 'Maria', age: 30 },
    ];
    const columns = [
      { field: 'name', title: 'Nome' },
      { field: 'age', title: 'Idade' },
    ];

    skargrid = new window.Skargrid('test-container', {
      data: data,
      columns: columns,
    });

    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(2);

    // Verificar primeira linha
    const firstRowCells = rows[0].querySelectorAll('td');
    expect(firstRowCells[0].textContent).toBe('João');
    expect(firstRowCells[1].textContent).toBe('25');

    // Verificar segunda linha
    const secondRowCells = rows[1].querySelectorAll('td');
    expect(secondRowCells[0].textContent).toBe('Maria');
    expect(secondRowCells[1].textContent).toBe('30');
  });

  test('deve suportar paginação quando habilitada', () => {
    const data = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
    const columns = [
      { field: 'id', title: 'ID' },
      { field: 'name', title: 'Nome' },
    ];

    skargrid = new window.Skargrid('test-container', {
      data: data,
      columns: columns,
      pagination: true,
      pageSize: 10,
    });

    // Verificar se paginação foi renderizada
    const pagination = container.querySelector('.skargrid-pagination');
    expect(pagination).not.toBeNull();

    // Verificar se apenas 10 itens são mostrados
    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(10);
  });

  test('deve suportar busca quando habilitada', () => {
    const data = [
      { name: 'João Silva', age: 25 },
      { name: 'Maria Santos', age: 30 },
      { name: 'Pedro Costa', age: 35 },
    ];
    const columns = [
      { field: 'name', title: 'Nome' },
      { field: 'age', title: 'Idade' },
    ];

    skargrid = new window.Skargrid('test-container', {
      data: data,
      columns: columns,
      searchable: true,
    });

    // Verificar se campo de busca foi renderizado
    const searchInput = container.querySelector('input[type="text"]');
    expect(searchInput).not.toBeNull();
    expect(searchInput.placeholder).toBe('Search all columns...');
  });
});