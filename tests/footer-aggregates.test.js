/**
 * Testes para o rodapé de agregações (options.footerAggregates + column.aggregate).
 */

describe('SkarGrid - footer aggregates', () => {
  let container;
  let data;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'footer-test-container';
    document.body.appendChild(container);

    data = [
      { id: 1, produto: 'Caneca', preco: 10, estoque: 5 },
      { id: 2, produto: 'Camiseta', preco: 30, estoque: 2 },
      { id: 3, produto: 'Boné', preco: 20, estoque: null },
    ];
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  test('sem footerAggregates, nenhum tfoot é renderizado mesmo com column.aggregate definido', () => {
    new window.Skargrid('footer-test-container', {
      data,
      columns: [{ field: 'preco', title: 'Preço', aggregate: 'sum' }],
    });

    expect(container.querySelector('tfoot')).toBeNull();
  });

  test('sum, avg, count, min e max calculam sobre os dados filtrados', () => {
    new window.Skargrid('footer-test-container', {
      data,
      footerAggregates: true,
      columns: [
        { field: 'produto', title: 'Produto', aggregate: 'count' },
        { field: 'preco', title: 'Preço', aggregate: 'sum' },
        { field: 'estoque', title: 'Estoque', aggregate: 'avg' },
      ],
    });

    const footerCell = field => container.querySelector(`tfoot td[data-field="${field}"]`);

    expect(footerCell('produto').textContent).toBe('3');
    expect(footerCell('preco').textContent).toBe('60'); // 10+30+20
    expect(footerCell('estoque').textContent).toBe('3.5'); // (5+2)/2, ignora null
  });

  test('min e max ignoram valores não numéricos', () => {
    new window.Skargrid('footer-test-container', {
      data,
      footerAggregates: true,
      columns: [
        { field: 'preco', title: 'Preço', aggregate: 'min' },
        { field: 'estoque', title: 'Estoque', aggregate: 'max' },
      ],
    });

    expect(container.querySelector('tfoot td[data-field="preco"]').textContent).toBe('10');
    expect(container.querySelector('tfoot td[data-field="estoque"]').textContent).toBe('5');
  });

  test('reflete busca/filtros, não só a página atual', () => {
    const grid = new window.Skargrid('footer-test-container', {
      data,
      footerAggregates: true,
      searchable: true,
      pagination: true,
      pageSize: 1,
      columns: [
        { field: 'produto', title: 'Produto', filterable: true },
        { field: 'preco', title: 'Preço', aggregate: 'sum' },
      ],
    });

    expect(container.querySelector('tfoot td[data-field="preco"]').textContent).toBe('60');

    grid.handleSearch('Caneca');
    expect(container.querySelector('tfoot td[data-field="preco"]').textContent).toBe('10');
  });

  test('aggregate customizado (função) recebe as linhas e o field', () => {
    new window.Skargrid('footer-test-container', {
      data,
      footerAggregates: true,
      columns: [
        { field: 'preco', title: 'Preço', aggregate: (rows, field) => `${rows.length}x` + field },
      ],
    });

    expect(container.querySelector('tfoot td[data-field="preco"]').textContent).toBe('3xpreco');
  });

  test('aggregateFormatter formata o valor calculado antes de exibir', () => {
    new window.Skargrid('footer-test-container', {
      data,
      footerAggregates: true,
      columns: [
        {
          field: 'preco', title: 'Preço', aggregate: 'sum',
          aggregateFormatter: v => `R$ ${v.toFixed(2)}`,
        },
      ],
    });

    expect(container.querySelector('tfoot td[data-field="preco"]').textContent).toBe('R$ 60.00');
  });

  test('aggregate desconhecido não quebra e apenas avisa no console', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    new window.Skargrid('footer-test-container', {
      data,
      footerAggregates: true,
      columns: [{ field: 'preco', title: 'Preço', aggregate: 'mediana' }],
    });

    expect(container.querySelector('tfoot td[data-field="preco"]').textContent).toBe('');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('mediana'));

    warnSpy.mockRestore();
  });

  test('coluna sem aggregate fica com célula vazia no rodapé, mantendo o alinhamento', () => {
    new window.Skargrid('footer-test-container', {
      data,
      footerAggregates: true,
      columns: [
        { field: 'produto', title: 'Produto' },
        { field: 'preco', title: 'Preço', aggregate: 'sum' },
      ],
    });

    expect(container.querySelector('tfoot td[data-field="produto"]').textContent).toBe('');
    expect(container.querySelectorAll('tfoot td')).toHaveLength(2);
  });
});
