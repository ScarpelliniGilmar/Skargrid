/**
 * Testes para colunas congeladas (column.frozen).
 */

describe('SkarGrid - colunas congeladas', () => {
  let container;
  let data;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'frozen-test-container';
    document.body.appendChild(container);

    data = [
      { id: 1, nome: 'Ana', cidade: 'SP', idade: 30 },
      { id: 2, nome: 'Bruno', cidade: 'RJ', idade: 25 },
    ];
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  test('coluna com frozen: true recebe position sticky e left calculado a partir da largura das anteriores', () => {
    new window.Skargrid('frozen-test-container', {
      data,
      columns: [
        { field: 'id', title: 'ID', width: '60px', frozen: true },
        { field: 'nome', title: 'Nome', width: '100px', frozen: true },
        { field: 'cidade', title: 'Cidade' },
      ],
    });

    const idTh = container.querySelector('thead th[data-field="id"]');
    const nomeTh = container.querySelector('thead th[data-field="nome"]');
    const cidadeTh = container.querySelector('thead th[data-field="cidade"]');

    expect(idTh.style.position).toBe('sticky');
    expect(idTh.style.left).toBe('0px');
    expect(idTh.classList.contains('skargrid-frozen-cell')).toBe(true);

    expect(nomeTh.style.position).toBe('sticky');
    expect(nomeTh.style.left).toBe('60px'); // largura da coluna "id"
    expect(nomeTh.classList.contains('skargrid-frozen-cell-edge')).toBe(true);

    expect(cidadeTh.style.position).toBe('');
    expect(cidadeTh.classList.contains('skargrid-frozen-cell')).toBe(false);

    // mesmo comportamento no corpo da tabela
    const idTd = container.querySelector('tbody tr:first-child td[data-field="id"]');
    expect(idTd.style.left).toBe('0px');
  });

  test('coluna de seleção também fica sticky quando há colunas de dados congeladas', () => {
    new window.Skargrid('frozen-test-container', {
      data,
      selectable: true,
      columns: [
        { field: 'id', title: 'ID', width: '60px', frozen: true },
        { field: 'nome', title: 'Nome' },
      ],
    });

    const checkboxTh = container.querySelector('thead th.skargrid-select-header');
    const idTh = container.querySelector('thead th[data-field="id"]');

    expect(checkboxTh.style.position).toBe('sticky');
    expect(checkboxTh.style.left).toBe('0px');
    // offset da coluna "id" soma a largura fixa do checkbox (40px)
    expect(idTh.style.left).toBe('40px');
  });

  test('coluna frozen depois de uma não-frozen é ignorada (só um prefixo contíguo é aplicado)', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    new window.Skargrid('frozen-test-container', {
      data,
      columns: [
        { field: 'id', title: 'ID', frozen: true },
        { field: 'nome', title: 'Nome' }, // quebra o prefixo contíguo
        { field: 'cidade', title: 'Cidade', frozen: true }, // deveria ser ignorada
      ],
    });

    const cidadeTh = container.querySelector('thead th[data-field="cidade"]');
    expect(cidadeTh.style.position).toBe('');
    expect(cidadeTh.classList.contains('skargrid-frozen-cell')).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('cidade'));

    warnSpy.mockRestore();
  });

  test('sem nenhuma coluna frozen, nenhuma célula recebe as classes/estilos', () => {
    new window.Skargrid('frozen-test-container', {
      data,
      columns: [
        { field: 'id', title: 'ID' },
        { field: 'nome', title: 'Nome' },
      ],
    });

    expect(container.querySelectorAll('.skargrid-frozen-cell')).toHaveLength(0);
  });
});
