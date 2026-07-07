# Introdução

SkarGrid Community é um data grid completo para Vanilla JavaScript: sem dependências em runtime, sem acoplamento a framework, com API pequena e um estado serializável — pensado tanto para pessoas desenvolvedoras quanto para agentes de IA que precisam gerar e validar configuração de grid.

## Por que SkarGrid

- **Zero dependências em runtime.** Um `<script>` e um `<link>`, ou um `import` — sem cadeia de dependências para auditar.
- **API pequena e coerente.** Construtor + opções + um punhado de métodos (veja [Referência da API](/api/)).
- **Estado serializável.** `getState()`/`setState()` cobrem página, ordenação, filtros, busca, seleção e colunas — a base tanto para persistência em `localStorage` quanto para automação por IA.
- **Segurança por padrão.** `render()`/`formatter()` são tratados como texto puro a menos que você opte explicitamente por HTML (veja [Acessibilidade e segurança](/guide/accessibility-security)).

## Exemplo mínimo

```html
<div id="tabela"></div>

<script src="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.css">

<script>
  const data = [
    { id: 1, nome: 'João Silva', idade: 28, cidade: 'São Paulo' },
    { id: 2, nome: 'Maria Santos', idade: 32, cidade: 'Rio de Janeiro' },
  ];

  const columns = [
    { field: 'id', title: 'ID', width: '60px', sortable: true },
    { field: 'nome', title: 'Nome', sortable: true },
    { field: 'idade', title: 'Idade', sortable: true },
    { field: 'cidade', title: 'Cidade' },
  ];

  const grid = new Skargrid('tabela', {
    data,
    columns,
    pagination: true,
    sortable: true,
    searchable: true,
  });
</script>
```

## Próximos passos

- [Instalação](/guide/installation) — npm, CDN ou download direto.
- [Configuração de colunas](/guide/columns) — todas as opções por coluna.
- [Recursos](/guide/features) — paginação, filtros, seleção, export, colunas congeladas, agregações no rodapé, persistência de estado e processamento server-side.
- [Referência da API](/api/) — opções do construtor, métodos, eventos e estado.
