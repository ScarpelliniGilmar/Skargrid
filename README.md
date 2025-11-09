# 📊 ScarGrid

> Biblioteca JavaScript moderna para criação de tabelas interativas com filtros cascata, busca normalizada e recursos avançados

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](package.json)

## ✨ Destaques v1.0.0

- 🎨 **Configuração de Colunas** - Drag & drop para reordenar, mostrar/ocultar colunas
- 💾 **Persistência** - Salva preferências do usuário no localStorage
- 🌓 **Suporte a Temas** - Light/Dark theme com transições suaves
- 🔄 **Filtros Cascata** - Estilo Excel com valores indisponíveis desabilitados
- 🌍 **Busca Normalizada** - Remove acentos automaticamente (José = jose)
- ↔️ **Scroll Horizontal** - Custom scrollbar para tabelas largas
- 📦 **Bundle Único** - Apenas 2 arquivos (JS + CSS) - ~83KB
- 🎯 **Zero Dependências** - Vanilla JavaScript puro
- ⚡ **Performance** - Otimizado para grandes datasets

---

## 🚀 Início Rápido

### Instalação

**Opção 1: CDN (em breve)**
```html
<link rel="stylesheet" href="https://cdn.../scargrid.css">
<script src="https://cdn.../scargrid.min.js"></script>
```

**Opção 2: Download**
```bash
# Clone o repositório
git clone https://github.com/ScarpelliniGilmar/scargrid.git

# Copie os arquivos dist/ para seu projeto
cp scargrid/dist/scargrid.min.js seu-projeto/
cp scargrid/dist/scargrid.css seu-projeto/
```

**Opção 3: NPM (em breve)**
```bash
npm install scargrid
```


### Uso Básico

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="dist/scargrid.css">
  <script src="dist/scargrid.min.js"></script>
</head>
<body>
  <div id="myTable"></div>
  <script>
    // Exemplo real usando ScarGrid
    const data = [
      { id: 1, nome: 'João Silva', idade: 28, cidade: 'São Paulo' },
      { id: 2, nome: 'Maria Santos', idade: 34, cidade: 'Rio de Janeiro' }
    ];
    const columns = [
      { field: 'id', title: 'ID', sortable: true },
      { field: 'nome', title: 'Nome', sortable: true, filterable: true },
      { field: 'idade', title: 'Idade', sortable: true, filterable: true, filterType: 'number' },
      { field: 'cidade', title: 'Cidade', sortable: true, filterable: true, filterType: 'select' }
    ];
    // Inicializa a tabela ScarGrid
    const table = new ScarGrid('myTable', {
      data: data,
      columns: columns,
      pagination: true,
      pageSize: 10,
      sortable: true,
      searchable: true,
      selectable: true,
      columnFilters: true,
      columnConfig: true,          // Habilita configuração de colunas
      persistColumnConfig: true    // Salva preferências do usuário
    });
  </script>
</body>
</html>
```

---

### Exemplo Prático (ScarGrid em ação)

Veja abaixo um exemplo real de uso da biblioteca ScarGrid:

```html
<div id="exemploScarGrid"></div>
<script>
  const dados = [
    { id: 1, nome: 'Ana', idade: 22, cidade: 'Curitiba' },
    { id: 2, nome: 'Bruno', idade: 31, cidade: 'Belo Horizonte' },
    { id: 3, nome: 'Carla', idade: 27, cidade: 'Fortaleza' }
  ];
  const colunas = [
    { field: 'id', title: 'ID', sortable: true },
    { field: 'nome', title: 'Nome', filterable: true },
    { field: 'idade', title: 'Idade', filterType: 'number' },
    { field: 'cidade', title: 'Cidade', filterType: 'select' }
  ];
  new ScarGrid('exemploScarGrid', {
    data: dados,
    columns: colunas,
    pagination: false,
    sortable: true,
    searchable: true,
    columnFilters: true
  });
</script>
```

---

## 📚 Documentação Completa

### Configuração

```javascript
new ScarGrid(containerId, options)
```

#### Opções Disponíveis

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `data` | Array | `[]` | Array de objetos com os dados |
| `columns` | Array | `[]` | Configuração das colunas |
| `pagination` | Boolean | `false` | Habilita paginação |
| `pageSize` | Number | `10` | Itens por página |
| `pageSizeOptions` | Array | `[10,25,50,100]` | Opções de tamanho de página |
| `sortable` | Boolean | `false` | Habilita ordenação global |
| `selectable` | Boolean | `false` | Habilita seleção múltipla |
| `searchable` | Boolean | `false` | Habilita busca global |
| `columnFilters` | Boolean | `false` | Habilita filtros por coluna |
| `columnConfig` | Boolean | `false` | Habilita botão de configuração de colunas |
| `persistColumnConfig` | Boolean | `false` | Salva configuração de colunas no localStorage |
| `storageKey` | String | `'scargrid-config-{id}'` | Chave do localStorage (se persistColumnConfig=true) |
| `theme` | String | `'light'` | Tema visual: 'light' ou 'dark' |
| `className` | String | `'scargrid'` | Classe CSS da tabela |

#### Configuração de Colunas

```javascript
{
  field: 'nome',           // Campo do objeto de dados (obrigatório)
  title: 'Nome Completo',  // Título exibido no header
  width: '200px',          // Largura da coluna (opcional)
  visible: true,           // Visibilidade inicial (padrão: true)
  sortable: true,          // Permite ordenação (padrão: false)
  filterable: true,        // Mostra ícone de filtro (padrão: false)
  filterType: 'text',      // Tipo: 'text', 'number', 'date', 'select'
  
  // Formatação customizada
  render: (value, row) => {
    return `<span style="color: blue;">${value}</span>`;
  }
}
```

### Tipos de Filtro

#### 1. Text Filter (`filterType: 'text'`)
```javascript
{ field: 'nome', title: 'Nome', filterType: 'text' }
```
- Busca parcial case-insensitive
- **Remove acentos automaticamente** (José = jose)
- Input simples

#### 2. Number Filter (`filterType: 'number'`)
```javascript
{ field: 'idade', title: 'Idade', filterType: 'number' }
```
- Comparação exata de números
- Input numérico

#### 3. Date Filter (`filterType: 'date'`)
```javascript
{ field: 'dataNascimento', title: 'Nascimento', filterType: 'date' }
```
- Busca por data (formato ISO: YYYY-MM-DD)
- Input de data HTML5

#### 4. Select Filter (`filterType: 'select'`)
```javascript
{ field: 'cidade', title: 'Cidade', filterType: 'select' }
```
- **Filtro cascata estilo Excel**
- Checkboxes com valores únicos
- Valores indisponíveis ficam desabilitados
- Busca interna no dropdown
- "Selecionar Todos" / "Desmarcar Todos"

---

## 🎨 API Pública

### Métodos

```javascript
// Atualizar dados
table.updateData(newData);

// Obter dados atuais
const data = table.getData();

// Seleção
const selected = table.getSelectedRows();      // Retorna objetos
const indices = table.getSelectedIndices();     // Retorna índices
table.selectRows([0, 1, 2]);                   // Seleciona por índice
table.clearSelection();                         // Limpa seleção

// Filtros
table.clearAllFilters();                        // Limpa busca + filtros de coluna
table.clearSearch();                            // Limpa apenas busca global

// Navegação
table.goToPage(3);                             // Vai para página específica
table.changePageSize(25);                       // Muda itens por página

// Temas
table.setTheme('dark');                         // Alterna entre 'light' e 'dark'

// Configuração de Colunas (se columnConfig=true)
table.saveColumnConfig();                       // Salva manualmente no localStorage
table.loadColumnConfig();                       // Carrega configuração salva
table.clearSavedColumnConfig();                 // Remove configuração salva

// Destruir instância
table.destroy();
```

### Recursos Avançados

#### 🎨 Suporte a Temas

```javascript
// Tema escuro
const table = new ScarGrid('myTable', {
  data: data,
  columns: columns,
  theme: 'dark'
});

// Alternar tema dinamicamente
table.setTheme('dark');  // ou 'light'
```

#### 🎯 Configuração de Colunas

```javascript
const table = new ScarGrid('myTable', {
  data: data,
  columns: columns,
  columnConfig: true,              // Habilita botão de configuração
  persistColumnConfig: true,       // Salva preferências do usuário
  storageKey: 'minha-tabela-key'  // Chave customizada (opcional)
});

// Usuário pode:
// - Reordenar colunas (drag & drop)
// - Mostrar/ocultar colunas (checkboxes)
// - Usar setas para mover colunas
// - Restaurar configuração padrão
// - Configuração salva automaticamente no localStorage
```

#### 👁️ Colunas Ocultas por Padrão

```javascript
const columns = [
  { field: 'id', title: 'ID' },
  { field: 'nome', title: 'Nome' },
  { 
    field: 'telefone', 
    title: 'Telefone',
    visible: false  // Oculta por padrão
  },
  { 
    field: 'email', 
    title: 'E-mail',
    visible: false  // Oculta por padrão
  }
];

// Usuário pode mostrar via botão de configuração
```

### Eventos e Callbacks

```javascript
const table = new ScarGrid('myTable', {
  data: data,
  columns: columns,
  
  // Callback após renderização (futuro)
  onRender: (grid) => {
    console.log('Tabela renderizada!', grid);
  }
});
```

---

## 🔧 Build e Desenvolvimento

### Estrutura do Projeto

```
scargrid/
├── src/
│   ├── core/
│   │   └── scargrid.js          # Classe principal
│   ├── features/
│   │   ├── pagination.js         # Módulo de paginação
│   │   ├── sort.js               # Módulo de ordenação
│   │   ├── selection.js          # Módulo de seleção
│   │   └── filter.js             # Módulo de filtros
│   └── css/
│       ├── scargrid.css          # Estilos principais
│       └── themes/
│           ├── light.css         # Tema claro
│           └── dark.css          # Tema escuro
├── dist/                         # Build de produção
│   ├── scargrid.min.js           # Bundle único (~83KB)
│   └── scargrid.css              # Estilos compilados
├── examples/
│   ├── single-file.html          # Exemplo básico
│   └── large-dataset.html        # Teste com 25 colunas
├── build.ps1                     # Script de build (PowerShell)
├── package.json
├── LICENSE (MIT)
└── README.md
```

### Build Manual

```powershell
# PowerShell (Windows)
.\build.ps1

# Ou com PowerShell Core (multiplataforma)
pwsh -File build.ps1
```

**Saída:**
- `dist/scargrid.min.js` - Bundle completo (~56KB)
- `dist/scargrid.css` - Estilos
- `dist/themes/` - Temas opcionais

---

## 🎯 Exemplos

### Exemplo 1: Tabela Simples com Busca
```javascript
const table = new ScarGrid('container', {
  data: myData,
  columns: [
    { field: 'id', title: 'ID' },
    { field: 'nome', title: 'Nome' }
  ],
  searchable: true
});
```

### Exemplo 2: Tabela Completa
```javascript
const table = new ScarGrid('container', {
  data: myData,
  columns: [
    { 
      field: 'id', 
      title: 'ID', 
      width: '60px',
      sortable: true 
    },
    { 
      field: 'nome', 
      title: 'Nome',
      sortable: true,
      filterable: true,
      filterType: 'text'
    },
    { 
      field: 'status', 
      title: 'Status',
      filterType: 'select',
      render: (value) => {
        const color = value === 'Ativo' ? 'green' : 'red';
        return `<span style="color: ${color}">● ${value}</span>`;
      }
    }
  ],
  pagination: true,
  pageSize: 10,
  sortable: true,
  selectable: true,
  searchable: true,
  columnFilters: true
});
```

### Exemplo 3: Dataset Grande (25 colunas)
Veja `examples/large-dataset.html` para um exemplo completo com:
- 25 colunas variadas
- 100 registros
- Todos os tipos de filtro
- Formatação customizada
- Scroll horizontal

---

## 🎨 Temas

### Tema Padrão (Light)
```html
<link rel="stylesheet" href="dist/scargrid.css">
```

### Tema Escuro
```html
<link rel="stylesheet" href="dist/scargrid.css">
<link rel="stylesheet" href="dist/themes/dark.css">
```

### Customização
```css
/* Sobrescreva variáveis CSS */
.scargrid {
  --sg-primary-color: #007bff;
  --sg-hover-bg: #f8f9fa;
  --sg-border-color: #dee2e6;
}
```

---

## 📋 Changelog

### v0.8.1 (2025-01-08) - Nomenclatura Profissional
- ✅ Renomeado classes CSS de `.tablejs-*` para `.scargrid-*`
- ✅ Atualizada className padrão de `'tablejs'` para `'scargrid'`
- ✅ Rebuild completo do bundle
- 📄 Adicionado LICENSE (MIT)
- 📄 Adicionado .gitignore profissional
- 📚 README.md completamente reescrito

### v0.8.0 (2025-01-07) - Filtros Cascata
- ✨ Filtros cascata estilo Excel (valores indisponíveis desabilitados)
- ✨ Busca normalizada (remove acentos automaticamente)
- ✨ Scroll horizontal com custom scrollbar
- ✨ Dropdown reposiciona durante scroll
- 🐛 Corrigida lógica de contagem de filtros ativos
- 📦 Build system com PowerShell (55.96 KB)
- 🧹 Removidos arquivos v0.6.0 e v0.7.0
- 📝 Novos exemplos: single-file.html, large-dataset.html

### v0.7.0 (2024) - Arquitetura Modular
- 📦 Arquitetura modular com features independentes
- ⚡ Performance otimizada (-33% linhas no core)
- 🔧 Sistema de carregamento inteligente

### v0.6.0 (2024) - Versão Inicial
- 🎉 Primeira versão pública
- 🔍 Busca global
- 🎛️ Filtros por coluna
- 📄 Paginação
- ↕️ Ordenação
- ☑️ Seleção múltipla

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📜 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

Copyright (c) 2024-2025 GILMAR A S TRINDADE

---

## 👨‍💻 Autor


**GILMAR A S TRINDADE**

- GitHub: [@ScarpelliniGilmar](https://github.com/ScarpelliniGilmar)
- Email: gilmar.trindade@hotmail.com

---

## 🌟 Roadmap

- [ ] CDN público
- [ ] Pacote NPM
- [ ] Export para CSV/Excel
- [ ] Filtros avançados (range, múltiplos valores)
- [ ] Edição inline
- [ ] Colunas fixas (frozen columns)
- [ ] Agrupamento de linhas
- [ ] Temas adicionais
- [ ] TypeScript definitions
- [ ] React/Vue/Angular wrappers

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**
