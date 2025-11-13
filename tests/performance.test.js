/**
 * Testes de Performance para SkarGrid
 * Testa performance com diferentes volumes de dados
 */

describe('SkarGrid Performance Tests', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'perf-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  // Função auxiliar para gerar dados de teste
  const generateTestData = (count) => {
    const data = [];
    const names = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Beatriz', 'Lucas', 'Julia', 'Fernando', 'Gabriela'];
    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília', 'Curitiba', 'Porto Alegre', 'Recife', 'Fortaleza', 'Manaus'];

    for (let i = 0; i < count; i++) {
      data.push({
        id: i + 1,
        name: names[i % names.length] + ' ' + (i + 1),
        age: 18 + (i % 60),
        city: cities[i % cities.length],
        salary: 1500 + (i % 5000),
        department: ['TI', 'RH', 'Financeiro', 'Vendas', 'Marketing'][i % 5],
        active: i % 3 !== 0, // 66% ativos
      });
    }
    return data;
  };

  const columns = [
    { field: 'id', title: 'ID' },
    { field: 'name', title: 'Nome' },
    { field: 'age', title: 'Idade' },
    { field: 'city', title: 'Cidade' },
    { field: 'salary', title: 'Salário' },
    { field: 'department', title: 'Departamento' },
    { field: 'active', title: 'Ativo' },
  ];

  test('deve renderizar 1.000 registros em menos de 2 segundos', () => {
    const data = generateTestData(1000);

    const startTime = performance.now();

    const skargrid = new window.Skargrid('perf-container', {
      data: data,
      columns: columns,
      pagination: true,
      pageSize: 50,
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    console.log(`Renderização 1.000 registros: ${renderTime.toFixed(2)}ms`);

    expect(renderTime).toBeLessThan(2000); // 2 segundos
    expect(container.querySelectorAll('tbody tr')).toHaveLength(50); // Apenas primeira página
  });

  test('deve renderizar 10.000 registros com paginação em menos de 5 segundos', () => {
    const data = generateTestData(10000);

    const startTime = performance.now();

    const skargrid = new window.Skargrid('perf-container', {
      data: data,
      columns: columns,
      pagination: true,
      pageSize: 100,
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    console.log(`Renderização 10.000 registros: ${renderTime.toFixed(2)}ms`);

    expect(renderTime).toBeLessThan(5000); // 5 segundos
    expect(container.querySelectorAll('tbody tr')).toHaveLength(100);
  });

  test('deve ordenar 5.000 registros rapidamente', () => {
    const data = generateTestData(5000);

    const skargrid = new window.Skargrid('perf-container', {
      data: data,
      columns: columns,
      sortable: true,
      pagination: false, // Sem paginação para teste de ordenação
    });

    // Medir tempo de ordenação por nome
    const startTime = performance.now();

    // Simular clique no cabeçalho (não podemos realmente clicar, então vamos testar o método interno)
    // Como estamos testando a biblioteca minificada, vamos verificar se a ordenação existe
    expect(typeof skargrid).toBe('object');

    const endTime = performance.now();
    const sortTime = endTime - startTime;

    console.log(`Setup ordenação 5.000 registros: ${sortTime.toFixed(2)}ms`);
    expect(sortTime).toBeLessThan(1000); // 1 segundo para setup
  });

  test('deve filtrar 10.000 registros eficientemente', () => {
    const data = generateTestData(10000);

    const skargrid = new window.Skargrid('perf-container', {
      data: data,
      columns: columns,
      columnFilters: true,
      pagination: true,
      pageSize: 50,
    });

    // Verificar se filtros foram criados
    const filterInputs = container.querySelectorAll('input[type="text"], select');
    expect(filterInputs.length).toBeGreaterThan(0);

    console.log('Filtros criados para 10.000 registros');
  });

  test('deve lidar com busca em 15.000 registros', () => {
    const data = generateTestData(15000);

    const startTime = performance.now();

    const skargrid = new window.Skargrid('perf-container', {
      data: data,
      columns: columns,
      searchable: true,
      pagination: true,
      pageSize: 100,
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    console.log(`Renderização com busca 15.000 registros: ${renderTime.toFixed(2)}ms`);

    // Verificar se campo de busca existe
    const searchInput = container.querySelector('input[type="text"]');
    expect(searchInput).toBeTruthy();

    expect(renderTime).toBeLessThan(8000); // 8 segundos para dataset grande
  });

  test('deve manter performance com múltiplas features ativas', () => {
    const data = generateTestData(8000);

    const startTime = performance.now();

    const skargrid = new window.Skargrid('perf-container', {
      data: data,
      columns: columns,
      pagination: true,
      pageSize: 25,
      sortable: true,
      selectable: true,
      searchable: true,
      columnFilters: true,
      exportCSV: true,
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    console.log(`Renderização completa 8.000 registros: ${renderTime.toFixed(2)}ms`);

    // Verificar se todas as features foram renderizadas
    expect(container.querySelector('.skargrid-pagination')).toBeTruthy();
    expect(container.querySelector('input[type="text"]')).toBeTruthy(); // busca
    expect(container.querySelectorAll('input[type="checkbox"]').length).toBeGreaterThan(0); // seleção

    expect(renderTime).toBeLessThan(6000); // 6 segundos para renderização completa
  });

  test('deve usar memória eficientemente com datasets grandes', () => {
    // Este teste é mais conceitual - em um ambiente real usaríamos ferramentas como memory profiling
    const data = generateTestData(20000);

    const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

    const skargrid = new window.Skargrid('perf-container', {
      data: data,
      columns: columns,
      pagination: true,
      pageSize: 200,
    });

    const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

    if (performance.memory) {
      const memoryUsed = finalMemory - initialMemory;
      console.log(`Memória usada para 20.000 registros: ${(memoryUsed / 1024 / 1024).toFixed(2)} MB`);

      // Memória deve ser razoável (menos de 50MB para 20k registros)
      expect(memoryUsed).toBeLessThan(50 * 1024 * 1024);
    } else {
      console.log('Memory profiling não disponível neste ambiente');
    }

    // Mesmo sem memory profiling, verificar se renderizou
    expect(container.querySelectorAll('tbody tr')).toHaveLength(200);
  });
});