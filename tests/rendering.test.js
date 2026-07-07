/**
 * Testes para a política de renderização segura de célula (render/formatter).
 * Ver seção 8.5 do plano estratégico: textContent por padrão, HTML é opt-in
 * via allowUnsafeHtml (grid ou coluna), Node é sempre tratado como seguro.
 */

describe('SkarGrid - renderização segura de células', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'render-test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  function firstCell(grid, field) {
    return container.querySelector(`tbody td[data-field="${field}"]`);
  }

  test('por padrão, string retornada por render() vira texto puro (não executa HTML)', () => {
    new window.Skargrid('render-test-container', {
      data: [{ id: 1, nome: 'Ana' }],
      columns: [
        { field: 'id', title: 'ID' },
        {
          field: 'nome',
          title: 'Nome',
          render: v => `<img src="x" onerror="window.__xss = true">${v}`,
        },
      ],
    });

    const cell = firstCell(null, 'nome');
    expect(cell.querySelector('img')).toBeNull();
    expect(cell.textContent).toBe('<img src="x" onerror="window.__xss = true">Ana');
    expect(window.__xss).toBeUndefined();
  });

  test('allowUnsafeHtml no grid habilita HTML para todas as colunas', () => {
    new window.Skargrid('render-test-container', {
      data: [{ id: 1, nome: 'Ana' }],
      columns: [
        { field: 'id', title: 'ID' },
        { field: 'nome', title: 'Nome', render: v => `<b>${v}</b>` },
      ],
      allowUnsafeHtml: true,
    });

    const cell = firstCell(null, 'nome');
    expect(cell.querySelector('b')).not.toBeNull();
    expect(cell.querySelector('b').textContent).toBe('Ana');
  });

  test('allowUnsafeHtml na coluna habilita HTML só para aquela coluna', () => {
    new window.Skargrid('render-test-container', {
      data: [{ id: 1, nome: 'Ana', bio: '<script>alert(1)</script>ok' }],
      columns: [
        { field: 'id', title: 'ID' },
        { field: 'nome', title: 'Nome', render: v => `<b>${v}</b>`, allowUnsafeHtml: true },
        { field: 'bio', title: 'Bio', render: v => v },
      ],
    });

    expect(firstCell(null, 'nome').querySelector('b')).not.toBeNull();
    // coluna sem allowUnsafeHtml continua segura mesmo com allowUnsafeHtml em outra coluna
    expect(firstCell(null, 'bio').querySelector('script')).toBeNull();
    expect(firstCell(null, 'bio').textContent).toBe('<script>alert(1)</script>ok');
  });

  test('coluna pode desabilitar HTML mesmo com allowUnsafeHtml global (override explícito)', () => {
    new window.Skargrid('render-test-container', {
      data: [{ id: 1, nome: '<i>Ana</i>' }],
      columns: [
        { field: 'id', title: 'ID' },
        { field: 'nome', title: 'Nome', render: v => v, allowUnsafeHtml: false },
      ],
      allowUnsafeHtml: true,
    });

    expect(firstCell(null, 'nome').querySelector('i')).toBeNull();
    expect(firstCell(null, 'nome').textContent).toBe('<i>Ana</i>');
  });

  test('renderer que retorna um Node é sempre anexado com segurança, independente de allowUnsafeHtml', () => {
    new window.Skargrid('render-test-container', {
      data: [{ id: 1, status: true }],
      columns: [
        { field: 'id', title: 'ID' },
        {
          field: 'status',
          title: 'Status',
          render: v => {
            const span = document.createElement('span');
            span.className = 'badge';
            span.textContent = v ? 'Ativo' : 'Inativo';
            return span;
          },
        },
      ],
    });

    const badge = firstCell(null, 'status').querySelector('span.badge');
    expect(badge).not.toBeNull();
    expect(badge.textContent).toBe('Ativo');
  });

  test('erro no renderer cai para texto simples do valor original, sem quebrar a tabela', () => {
    new window.Skargrid('render-test-container', {
      data: [{ id: 1, nome: 'Ana' }],
      columns: [
        { field: 'id', title: 'ID' },
        { field: 'nome', title: 'Nome', render: () => { throw new Error('boom'); } },
      ],
    });

    expect(firstCell(null, 'nome').textContent).toBe('Ana');
  });
});
