# <img src="docs/img/logos/skargrid-logo-full.svg" alt="Skargrid logo" style="height:120px;">

> Biblioteca JavaScript moderna para criação de tabelas interativas com filtros cascata, busca normalizada e recursos avançados

[![npm version](https://img.shields.io/npm/v/skargrid.svg)](https://www.npmjs.com/package/skargrid)
[![npm downloads](https://img.shields.io/npm/dw/skargrid.svg)](https://www.npmjs.com/package/skargrid)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/skargrid)](https://bundlephobia.com/package/skargrid)

**Site:** [https://skargrid.com](https://skargrid.com) •
**🇺🇸 [Read in English](README.md)**

---

## 📋 Sumário

- [✨ Principais Recursos](#-principais-recursos)
- [📸 Exemplos Visuais](#-exemplos-visuais)
- [🚀 Início Rápido](#-início-rápido)
- [📖 Exemplos Completos](#-exemplos-completos)
- [⚡ Benchmarks de Performance](#-benchmarks-de-performance)
- [🎯 Referência da API](#-referência-da-api)
- [🎨 Temas e Estilização](#-temas-e-estilização)
- [🔧 Build e Desenvolvimento](#-build-e-desenvolvimento)
- [📋 Changelog](#-changelog)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

---

## ✨ Principais Recursos

- 🌐 **Internacionalização (i18n)** - Labels padrão em inglês, totalmente personalizáveis para qualquer idioma
- 🎨 **Configuração de Colunas** - Arrastar e soltar para reordenar, mostrar/ocultar colunas com persistência
- 🗄️ **Persistência Inteligente** - Salva preferências do usuário no localStorage automaticamente
- 🌓 **Suporte a Temas** - Tema claro/escuro com transições suaves e variáveis customizáveis
- 🔄 **Filtros Cascata** - Filtros estilo Excel com valores indisponíveis desabilitados
- 🌍 **Busca Sem Acentos** - Trata acentos automaticamente (José = jose)
- ↔️ **Rolagem Horizontal** - Barra de rolagem customizada para tabelas largas
- 📦 **Bundle Único** - Apenas 2 arquivos (JS + CSS) - **27.8KB comprimido**
- 🎯 **Zero Dependências** - JavaScript puro Vanilla, agnóstico a frameworks
- ⚡ **Alta Performance** - Otimizado para datasets de até 25.000+ registros
- 🧪 **Testes Automatizados** - 21 testes abrangentes cobrindo todas as funcionalidades
- 📊 **Suporte a Exportação** - Exportação CSV e XLSX nativa sem dependências externas

---

## 📸 Exemplos Visuais

Abaixo exemplos visuais dos recursos do SkarGrid, em ordem de aprendizado recomendada:

#### Configuração Básica
![Exemplo Básico](docs/img/minimal.png)
<div align="center"><sub>Tabela básica: 4 colunas, ordenação, paginação</sub></div>

#### Recursos Completos
![Exemplo Completo](docs/img/complete.png)
<div align="center"><sub>Todos os recursos: ordenação, filtros, seleção, exportação, tema escuro, config. de colunas</sub></div>

#### Filtragem Avançada
![Filtros](docs/img/filters.png)
<div align="center"><sub>Filtros cascata estilo Excel com busca</sub></div>

#### Gerenciamento de Colunas
![Config. Colunas](docs/img/columns.png)
<div align="center"><sub>Reordenamento arrastar/soltar e alternância de visibilidade</sub></div>

#### Exportação de Dados
![Exportação](docs/img/export.png)
<div align="center"><sub>Exportação para formatos CSV e XLSX</sub></div>

#### Tema Escuro
![Tema Escuro](docs/img/theme-dark.png)
<div align="center"><sub>Tema escuro integrado com transições suaves</sub></div>

---

## 🚀 Início Rápido

### Instalação

**Opção 1: CDN (Recomendado)**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.css">
<script src="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.js"></script>
```

**Opção 2: NPM**
```bash
npm install skargrid
```

**Opção 3: Download**
```bash
git clone https://github.com/ScarpelliniGilmar/skargrid.git
cp skargrid/dist/* seu-projeto/
```

### Uso Básico

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.css">
</head>
<body>
    <div id="minhaTabela"></div>

    <script src="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.js"></script>
    <script>
        const dados = [
            { id: 1, nome: 'João Silva', idade: 28, cidade: 'São Paulo' },
            { id: 2, nome: 'Maria Santos', idade: 32, cidade: 'Rio de Janeiro' }
        ];

        const colunas = [
            { field: 'id', title: 'ID', width: '60px' },
            { field: 'nome', title: 'Nome', sortable: true },
            { field: 'idade', title: 'Idade', sortable: true },
            { field: 'cidade', title: 'Cidade' }
        ];

        const tabela = new Skargrid('minhaTabela', {
            data: dados,
            columns: colunas,
            pagination: true,
            sortable: true,
            searchable: true
        });
    </script>
</body>
</html>
```

---

## 📖 Exemplos Completos

### 🏆 Tabela Completa com Todos os Recursos

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demonstração SkarGrid</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.css">
</head>
<body>
    <div id="myTable"></div>

    <script src="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.js"></script>
    <script>
        // Dados de exemplo
        const funcionarios = [
            { id: 1, name: 'João Silva', age: 28, city: 'São Paulo', salary: 3500, department: 'TI', active: true },
            { id: 2, name: 'Maria Santos', age: 32, city: 'Rio de Janeiro', salary: 4200, department: 'RH', active: true },
            { id: 3, name: 'Pedro Costa', age: 25, city: 'Belo Horizonte', salary: 2800, department: 'Vendas', active: false },
            { id: 4, name: 'Ana Oliveira', age: 29, city: 'Porto Alegre', salary: 3800, department: 'Marketing', active: true },
            { id: 5, name: 'Carlos Mendes', age: 35, city: 'Curitiba', salary: 5500, department: 'TI', active: true }
        ];

        // Configuração das colunas
        const columns = [
            { field: 'id', title: 'ID', width: '60px', sortable: true, filterType: 'number' },
            { field: 'name', title: 'Nome', sortable: true, filterType: 'text' },
            { field: 'age', title: 'Idade', width: '80px', sortable: true, filterType: 'number' },
            { field: 'city', title: 'Cidade', sortable: true, filterType: 'select' },
            {
                field: 'salary',
                title: 'Salário',
                sortable: true,
                filterType: 'number',
                render: (value) => `R$ ${value.toLocaleString('pt-BR')}`
            },
            { field: 'department', title: 'Departamento', filterType: 'select' },
            {
                field: 'active',
                title: 'Status',
                render: (value) => value ? '✅ Ativo' : '❌ Inativo'
            }
        ];

        // Inicializar SkarGrid com todas as features
        const table = new Skargrid('myTable', {
            data: funcionarios,
            columns: columns,
            pagination: true,
            pageSize: 10,
            sortable: true,
            searchable: true,
            columnFilters: true,
            selectable: true,
            columnConfig: true,
            persistColumnConfig: true,
            exportCSV: true,
            exportXLSX: true,
            exportFilename: 'funcionarios',
            theme: 'light'
        });
    </script>
</body>
</html>
```

### 📊 Exemplo de Gerenciamento de Dados

```javascript
// Inicializar tabela
const table = new Skargrid('myTable', {
    data: dadosIniciais,
    columns: columns,
    pagination: true,
    searchable: true
});

// Atualizar dados dinamicamente
function atualizarTabela(novosDados) {
    table.updateData(novosDados);
}

// Manipular mudanças de seleção
function aoMudarSelecao() {
    const linhasSelecionadas = table.getSelectedRows();
    console.log('Itens selecionados:', linhasSelecionadas);

    // Exportar apenas linhas selecionadas
    if (linhasSelecionadas.length > 0) {
        table.exportSelectedToCSV('itens-selecionados.csv');
    }
}

// Limpar todos os filtros
function resetarFiltros() {
    table.clearAllFilters();
}

// Alterar tema
function alternarTema() {
    const temaAtual = table.options.theme;
    table.setTheme(temaAtual === 'light' ? 'dark' : 'light');
}
```

### 🎨 Estilização Avançada

```css
/* Variáveis de tema customizado */
:root {
    --sg-primary: #2563eb;
    --sg-accent: #1d4ed8;
    --sg-gray: #6b7280;
    --sg-white: #ffffff;
}

/* Estilização customizada da tabela */
.skargrid {
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.skargrid thead th {
    background: linear-gradient(135deg, var(--sg-primary), var(--sg-accent));
    color: white;
    font-weight: 600;
}

/* Design responsivo */
@media (max-width: 768px) {
    .skargrid {
        font-size: 14px;
    }

    .skargrid-search-container {
        flex-direction: column;
    }
}
```

---

## ⚡ Benchmarks de Performance

### 📈 Resultados dos Testes (v1.2.0)

| Tamanho do Dataset | Tempo de Renderização | Status | Observações |
|-------------------|----------------------|--------|-------------|
| 1.000 registros | ~26ms | ✅ Excelente | Renderização instantânea |
| 5.000 registros | ~35ms | ✅ Excelente | Performance suave |
| 10.000 registros | ~31ms | ✅ Excelente | Lida com datasets grandes |
| 15.000 registros | ~17ms | ✅ Excelente | Otimizado para escala |
| 20.000 registros | ~36ms | ✅ Excelente | Pronto para produção |

### 🎯 Recursos de Performance

- **Renderização Lazy**: Apenas linhas visíveis são renderizadas
- **Filtros Otimizados**: Algoritmos de busca eficientes
- **Gerenciamento de Memória**: Limpeza automática
- **Busca com Debounce**: Evita filtragem excessiva
- **Virtual Scrolling**: Pronto para 100k+ linhas (futuro)

### 💡 Dicas de Performance

```javascript
// Para datasets grandes (>10k linhas)
const table = new Skargrid('myTable', {
    data: datasetGrande,
    pagination: true,        // Obrigatório para datasets grandes
    pageSize: 50,           // Páginas menores = melhor performance
    searchable: true,       // Busca eficiente
    columnFilters: false,   // Desabilitar se não necessário
    selectable: false       // Desabilitar se não necessário
});
```

---

## 🌐 Internacionalização (i18n)

O SkarGrid vem com labels padrão em inglês, mas suporta personalização completa para qualquer idioma. Sobrescreva os labels passando um objeto `labels` nas opções:

```javascript
const grid = new Skargrid('myGrid', {
  // ... outras opções
  labels: {
    searchPlaceholder: 'Buscar em todas as colunas...',
    clearFilters: 'Limpar Filtros',
    exportCSV: 'Exportar CSV',
    filterTitle: 'Filtrar: {title}',
    selectAll: 'Selecionar Todos',
    clear: 'Limpar',
    apply: 'Aplicar',
    showing: 'Mostrando {start} até {end} de {total} registros',
    itemsPerPage: 'Itens por página:'
  }
});
```

Chaves de labels disponíveis:
- `searchPlaceholder` - Placeholder do campo de busca
- `clearFilters` - Botão limpar filtros
- `exportCSV` / `exportXLSX` - Botões de exportação
- `filterTitle` - Título do dropdown de filtro (suporta placeholder `{title}`)
- `selectAll` - Checkbox "selecionar todos" nos filtros
- `filterSearchPlaceholder` - Busca dentro do dropdown de filtro
- `filterInputPlaceholder` - Placeholder do filtro de input
- `clear` / `apply` - Botões do filtro
- `showing` - Info de paginação (suporta `{start}`, `{end}`, `{total}`)
- `filteredOfTotal` - Sufixo da contagem filtrada
- `itemsPerPage` - Label do seletor de tamanho da página
- `columnConfigTitle` - Título do modal de configuração de colunas
- `columnConfigDescription` - Descrição da configuração de colunas
- `restore` / `cancel` - Botões da configuração de colunas
- `noRowsSelected` - Mensagem de erro de exportação
- `noData` - Mensagem de estado vazio
- `loading` - Mensagem de carregamento

---

## 🎯 Referência da API

### Construtor

```javascript
new Skargrid(containerId, options)
```

### Opções

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `data` | Array | `[]` | Array de objetos de dados |
| `columns` | Array | `[]` | Configuração das colunas |
| `pagination` | Boolean | `false` | Habilita paginação |
| `pageSize` | Number | `10` | Itens por página |
| `pageSizeOptions` | Array | `[10,25,50,100]` | Opções de tamanho de página |
| `sortable` | Boolean | `false` | Habilita ordenação global |
| `selectable` | Boolean | `false` | Habilita seleção múltipla de linhas |
| `searchable` | Boolean | `false` | Habilita busca global |
| `columnFilters` | Boolean | `false` | Habilita filtros por coluna |
| `columnConfig` | Boolean | `false` | Habilita botão de configuração de colunas |
| `persistColumnConfig` | Boolean | `false` | Salva configuração de colunas no localStorage |
| `storageKey` | String | `'skargrid-config-{id}'` | Chave do localStorage |
| `theme` | String | `'light'` | Tema visual: 'light' ou 'dark' |
| `className` | String | `'skargrid'` | Classe CSS da tabela |
| `exportCSV` | Boolean | `false` | Habilita botão de exportação CSV |
| `exportXLSX` | Boolean | `false` | Habilita botão de exportação XLSX |
| `exportFilename` | String | `'skargrid-export'` | Nome base para arquivos exportados |

### Configuração de Colunas

```javascript
{
    field: 'nome',           // Campo do objeto de dados (obrigatório)
    title: 'Nome Completo',  // Título do cabeçalho
    width: '200px',          // Largura da coluna (opcional)
    visible: true,           // Visibilidade inicial (padrão: true)
    sortable: true,          // Permitir ordenação (padrão: false)
    sortType: 'string',      // Tipo de ordenação: 'string', 'number', 'date'
    filterable: true,        // Mostrar ícone de filtro (padrão: false)
    filterType: 'text',      // Tipo: 'text', 'number', 'date', 'select'
    render: (value, row) => { // Formatação customizada
        return `<span style="color: blue;">${value}</span>`;
    }
}
```

### Métodos

```javascript
// Gerenciamento de dados
table.updateData(novosDados);
const dados = table.getData();

// Seleção
const selecionados = table.getSelectedRows();
const indices = table.getSelectedIndices();
table.selectRows([0, 1, 2]);
table.clearSelection();

// Filtros
table.clearAllFilters();
table.clearSearch();

// Navegação
table.goToPage(3);
table.changePageSize(25);

// Tema
table.setTheme('dark');

// Configuração de colunas
table.saveColumnConfig();
table.loadColumnConfig();
table.clearSavedColumnConfig();

// Exportação
table.exportToCSV('dados.csv');
table.exportSelectedToCSV('selecionados.csv');
table.exportToXLSX('dados.xlsx');
table.exportSelectedToXLSX('selecionados.xlsx');

// Limpeza
table.destroy();
```

### Eventos

```javascript
// Escutar eventos
table.on('selectionChange', (linhasSelecionadas) => {
    console.log('Seleção alterada:', linhasSelecionadas);
});

table.on('filterChange', (dadosFiltrados) => {
    console.log('Dados filtrados:', dadosFiltrados.length, 'linhas');
});

table.on('pageChange', (infoPagina) => {
    console.log('Página alterada:', infoPagina);
});
```

---

## 🎨 Temas e Estilização

### Temas Integrados

```javascript
// Tema claro (padrão)
const table = new Skargrid('myTable', {
    data, columns,
    theme: 'light'
});

// Tema escuro
const table = new Skargrid('myTable', {
    data, columns,
    theme: 'dark'
});

// Alternar tema dinamicamente
table.setTheme('dark');
```

### Variáveis CSS Customizáveis

```css
:root {
    /* Cores primárias */
    --sg-primary: #2563eb;
    --sg-primary-hover: #1d4ed8;

    /* Cores de fundo */
    --sg-bg: #ffffff;
    --sg-bg-secondary: #f8fafc;
    --sg-bg-hover: #f1f5f9;

    /* Cores de texto */
    --sg-text: #1e293b;
    --sg-text-secondary: #64748b;

    /* Cores de borda */
    --sg-border: #e2e8f0;
    --sg-border-hover: #cbd5e1;

    /* Cores de destaque */
    --sg-accent: #06b6d4;
    --sg-success: #10b981;
    --sg-warning: #f59e0b;
    --sg-error: #ef4444;
}
```

### Exemplos de Estilização Customizada

```css
/* Aparência customizada da tabela */
.skargrid {
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    font-family: 'Inter', system-ui, sans-serif;
}

/* Estilização customizada do cabeçalho */
.skargrid thead th {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Efeitos de hover customizados nas linhas */
.skargrid tbody tr:hover {
    background: linear-gradient(90deg, #f8fafc 0%, #e2e8f0 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
```

---

## 🔧 Build e Desenvolvimento

### Pré-requisitos
- Node.js 16+
- PowerShell (Windows) ou Bash (Linux/Mac)

### Configuração de Desenvolvimento
```bash
# Clonar repositório
git clone https://github.com/ScarpelliniGilmar/skargrid.git
cd skargrid

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Executar testes
npm test

# Build para produção
npm run build
```

### Estrutura do Projeto
```
skargrid/
├── dist/                 # Arquivos compilados
│   ├── skargrid.min.js   # JavaScript minificado (27.8KB)
│   ├── skargrid.min.css  # CSS minificado
│   └── themes/           # Arquivos de tema
├── src/                  # Código fonte
│   ├── core/            # Biblioteca principal
│   ├── features/        # Módulos de funcionalidades
│   └── css/             # Folhas de estilo
├── tests/               # Arquivos de teste
├── docs/                # Documentação e exemplos
└── package.json         # Configuração do projeto
```

### Comandos de Build
```bash
# Build de desenvolvimento
npm run build:dev

# Build de produção
npm run build

# Modo watch
npm run watch

# Lint do código
npm run lint

# Executar testes
npm run test

# Gerar documentação
npm run docs
```

---

## 📋 Changelog

### [v1.2.0] - 2025-01-13
- **📚 Documentação Aprimorada**: Reescrita completa do README com exemplos práticos
- **🎯 Exemplos ao Vivo**: Quatro exemplos HTML prontos para uso (básico, completo, integração React, teste de performance)
- **📊 Benchmarks de Performance**: Testes abrangentes com 25k+ registros
- **🧪 Testes Automatizados**: Suite de testes Jest com 21 testes cobrindo todas as funcionalidades
- **🔧 Qualidade de Código**: Implementação ESLint com 169 correções aplicadas
- **📦 Otimização de Pacote**: Redução de 66% no tamanho (27.8KB comprimido)

### [v1.1.0] - Correções abrangentes e melhorias
- **Filtros e Exportação**: Filtros e exportação agora usam valores renderizados
- **Ordenação**: Adicionada opção `sortType` para ordenação correta por tipo de dados
- **Exportação XLSX**: Corrigida para remover HTML dos valores renderizados adequadamente
- **Nomes de arquivo customizados**: Adicionada opção `exportFilename`
- **Correções de tema**: Corrigidas cores de ordenação do tema verde
- **Tabelas de altura fixa**: Paginação permanece no fundo em containers de altura fixa

### [v1.0.4] - Exportação XLSX
- Exportação XLSX puro em JS sem dependências externas
- Exportação CSV permanece inalterada
- Suporte a nomes de arquivo de exportação customizados

### [v1.0.3] - Documentação e Exemplos
- Correções de rolagem e layout
- Melhorias de estabilidade das demonstrações

### [v1.0.2] - Melhorias UI/UX
- Fundo do cabeçalho sticky + variáveis de tema para modo escuro
- Comportamento do dropdown de filtros melhorado
- Correções de contraste de acento em checkboxes/botões
- Consistência na capitalização do texto do cabeçalho

### [v1.0.1] - Correções de Bugs
- Colunas aceitam ambas propriedades `render` e legado `formatter`
- Exportação CSV usa renderizador de coluna quando presente
- Filtros select achatam células com valor array
- Suporte a filtragem de valores vazios
- "Selecionar Tudo" respeita opções visíveis e disponíveis

---

## 🤝 Contribuição

Aceitamos contribuições! Consulte nosso [Guia de Contribuição](CONTRIBUTING.md) para detalhes.

### Fluxo de Desenvolvimento
1. Faça fork do repositório
2. Crie uma branch de feature: `git checkout -b feature/recurso-incrivel`
3. Faça suas alterações e adicione testes
4. Execute a suite de testes: `npm test`
5. Faça commit das suas alterações: `git commit -m 'Adiciona recurso incrível'`
6. Faça push para a branch: `git push origin feature/recurso-incrivel`
7. Abra um Pull Request

### Padrões de Código
- Seguir configuração ESLint
- Escrever testes abrangentes
- Atualizar documentação
- Manter compatibilidade retroativa

---

## 📄 Licença

**Licença MIT** - consulte arquivo [LICENSE](LICENSE) para detalhes.

Copyright (c) 2025 Gilmar A S Trindade

---

## 💝 Apoie o Projeto

Se o SkarGrid foi útil para você, considere apoiar o projeto:

- **⭐ Dê uma estrela** neste repositório no GitHub
- **🐛 Reporte bugs** e solicite funcionalidades
- **📢 Compartilhe** com sua rede
- **💻 Contribua** com melhorias no código

Seu apoio ajuda a manter o projeto ativo e evoluindo!

---