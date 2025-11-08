# 📊 ScarGrid# TableJS 📊



Biblioteca JavaScript para criação de tabelas interativas com paginação, ordenação, filtros e seleção múltipla.> Biblioteca JavaScript moderna, leve e gratuita para criação de tabelas interativas com recursos avançados de filtros, busca, ordenação e seleção múltipla.



## ✨ Características[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[![Version](https://img.shields.io/badge/version-0.6.0-green.svg)](https://github.com/yourusername/tablejs)

- 🎯 **Zero dependências** - Vanilla JavaScript puro

- 📦 **Modular** - Arquitetura em módulos separados## 🎯 Destaques

- 🎨 **Customizável** - CSS facilmente personalizável

- 📱 **Responsivo** - Adaptável a diferentes tamanhos de tela- 🚀 **Zero dependências** - Puro JavaScript ES6

- ⚡ **Performance** - Otimizado para grandes volumes de dados- 💡 **Simples e intuitivo** - API fácil de usar

- 🔍 **Busca Global** - Pesquisa em todas as colunas simultaneamente- 🎨 **Design moderno** - Interface profissional com animações suaves

- 🎛️ **Filtros por Coluna** - Filtros específicos (text, number, date, select)- ⚡ **Performance otimizada** - Renderização parcial do DOM e debounce inteligente

- 📄 **Paginação** - Navegação intuitiva entre páginas- 📱 **Responsivo** - Funciona perfeitamente em qualquer dispositivo

- ⬆️⬇️ **Ordenação** - Ordenação ascendente/descendente por coluna- 🔧 **Altamente configurável** - Personalize cada aspecto da tabela

- ☑️ **Seleção Múltipla** - Checkboxes para seleção de linhas

## 🚀 Funcionalidades

## 📁 Estrutura do Projeto

### ✅ Versão 0.6.0 - Filtros Avançados

```

biblio/#### Recursos Principais

├── src/- ✅ **Filtros por coluna** - Dropdown profissional com ícone no cabeçalho

│   ├── core/- ✅ **Filtro com checkboxes** - Para colunas tipo "select" com múltipla seleção

│   │   └── scargrid.js          # Classe principal (935 linhas)- ✅ **Filtros de input** - Para text, number e date com validação

│   ├── features/- ✅ **Busca interna** - Campo de busca dentro dos dropdowns de filtro

│   │   ├── pagination.js        # Módulo de paginação (245 linhas)- ✅ **Select All/Deselect All** - Selecione ou desmarque todos os itens rapidamente

│   │   ├── sort.js              # Módulo de ordenação (108 linhas)- ✅ **Scroll com estilo** - Lista de checkboxes com scroll personalizado

│   │   ├── selection.js         # Módulo de seleção (125 linhas)- ✅ **Contador de filtros ativos** - Badge mostra quantos itens estão filtrados

│   │   └── filter.js            # Módulo de filtros (199 linhas)- ✅ **Botão "Limpar Filtros"** - Remove todos os filtros (busca + colunas) com um clique

│   ├── css/- ✅ **Posicionamento inteligente** - Dropdown nunca sai da tela

│   │   ├── scargrid.css         # Estilos principais- ✅ **Filtros combinados** - Busca global + filtros de coluna funcionam juntos

│   │   └── themes/

│   │       ├── light.css        # Tema claro#### Recursos Anteriores

│   │       └── dark.css         # Tema escuro- ✅ **Busca global** - Campo de busca que filtra em tempo real em todas as colunas

│   └── index.js                 # Ponto de entrada- ✅ **Paginação completa** - Navegação entre páginas com controles inteligentes

├── examples/- ✅ **Seletor de itens por página** - 10, 25, 50, 100 registros

│   ├── basic.html               # Exemplo básico- ✅ **Ordenação por colunas** - Clique nos cabeçalhos para ordenar (ASC/DESC)

│   ├── pagination.html          # Exemplo com paginação- ✅ **Indicadores visuais** - Ícones SVG mostram direção da ordenação

│   ├── filters.html             # Exemplo com filtros- ✅ **Seleção múltipla** - Checkbox em cada linha para selecionar registros

│   ├── complete.html            # Exemplo completo- ✅ **Selecionar todos** - Checkbox no cabeçalho para selecionar/desselecionar tudo

│   └── test-modular.html        # Teste da arquitetura modular- ✅ **Clique na linha** - Clique em qualquer lugar da linha para selecionar

└── README.md- ✅ **Destaque visual** - Linhas selecionadas ficam destacadas

```- ✅ **API de seleção** - Métodos para obter, selecionar e limpar seleções

- ✅ **Formatadores customizados** - Defina como exibir dados em cada célula

## 🚀 Instalação- ✅ **Comparadores customizados** - Lógica de ordenação personalizada

- ✅ **Renderização otimizada** - Updates parciais do DOM para máxima performance

### Via HTML (carregamento direto)- ✅ **Debounce inteligente** - 300ms para busca fluida sem travamentos



```html## 📋 Roadmap - Próximas Funcionalidades

<!DOCTYPE html>

<html>### 🔄 Em Planejamento

<head>- [ ] **Redimensionamento de colunas** - Arrastar para ajustar largura das colunas

  <!-- CSS -->- [ ] **Fixar colunas** - Manter colunas fixas durante scroll horizontal

  <link rel="stylesheet" href="src/css/scargrid.css">- [ ] **Agrupamento** - Agrupar dados por valores de colunas

  - [ ] **Exportação** - Exportar para CSV, Excel, PDF

  <!-- Módulos de features -->- [ ] **Edição inline** - Editar células diretamente na tabela

  <script src="src/features/pagination.js"></script>- [ ] **Temas** - Múltiplos temas visuais pré-configurados

  <script src="src/features/sort.js"></script>- [ ] **Drag & Drop** - Reordenar linhas arrastando

  <script src="src/features/selection.js"></script>- [ ] **Virtualização** - Para tabelas com milhares de registros

  <script src="src/features/filter.js"></script>- [ ] **Totalizadores** - Linha de totais com soma, média, etc.

  

  <!-- Core -->---

  <script src="src/core/scargrid.js"></script>

</head>## 📦 Instalação

<body>

  <div id="myTable"></div>### Download direto

</body>1. Clone ou baixe os arquivos do projeto

</html>2. Inclua os arquivos CSS e JS no seu HTML:

```

```html

## 📖 Uso Básico<link rel="stylesheet" href="src/table.css">

<script src="src/table.js"></script>

```javascript```

// Dados

const data = [### Via CDN (em breve)

  { id: 1, nome: 'João Silva', idade: 28, cidade: 'São Paulo' },```html

  { id: 2, nome: 'Maria Santos', idade: 34, cidade: 'Rio de Janeiro' },<!-- CSS -->

  { id: 3, nome: 'Pedro Costa', idade: 25, cidade: 'Belo Horizonte' }<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tablejs/dist/table.min.css">

];

<!-- JavaScript -->

// Configuração das colunas<script src="https://cdn.jsdelivr.net/npm/tablejs/dist/table.min.js"></script>

const columns = [```

  { field: 'id', title: 'ID', width: '60px' },

  { field: 'nome', title: 'Nome', sortable: true },---

  { field: 'idade', title: 'Idade', sortable: true, filterable: true, filterType: 'number' },

  { field: 'cidade', title: 'Cidade', sortable: true, filterable: true, filterType: 'select' }## 🎯 Uso Básico

];

```javascript

// Inicializa a tabela// 1. Defina seus dados

const table = new ScarGrid('myTable', {const data = [

  data: data,  { id: 1, nome: 'João Silva', email: 'joao@email.com', idade: 28 },

  columns: columns,  { id: 2, nome: 'Maria Santos', email: 'maria@email.com', idade: 34 },

  pagination: true,  { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', idade: 25 }

  pageSize: 10,];

  sortable: true,

  selectable: true,// 2. Configure as colunas

  searchable: true,const columns = [

  columnFilters: true  { 

});    field: 'id', 

```    title: 'ID' 

  },

## ⚙️ Opções de Configuração  { 

    field: 'nome', 

| Opção | Tipo | Padrão | Descrição |    title: 'Nome Completo' 

|-------|------|--------|-----------|  },

| `data` | Array | `[]` | Array de objetos com os dados |  { 

| `columns` | Array | `[]` | Configuração das colunas |    field: 'email', 

| `pagination` | Boolean | `false` | Ativa/desativa paginação |    title: 'E-mail' 

| `pageSize` | Number | `10` | Itens por página |  },

| `pageSizeOptions` | Array | `[10, 25, 50, 100]` | Opções de tamanho de página |  { 

| `sortable` | Boolean | `true` | Habilita ordenação global |    field: 'idade', 

| `selectable` | Boolean | `false` | Habilita seleção com checkboxes |    title: 'Idade',

| `searchable` | Boolean | `false` | Mostra campo de busca global |    formatter: (value) => `${value} anos` // Formatação customizada

| `columnFilters` | Boolean | `false` | Habilita filtros por coluna |  }

];

## 🎨 Configuração de Colunas

// 3. Inicialize a tabela

```javascriptconst table = new TableJS('myTable', {

{  data: data,

  field: 'nome',              // Campo do objeto de dados  columns: columns,

  title: 'Nome Completo',     // Título exibido  pagination: true,      // Ativa a paginação

  width: '200px',             // Largura (opcional)  pageSize: 10,          // Itens por página

  sortable: true,             // Permite ordenação  pageSizeOptions: [10, 25, 50, 100],  // Opções de itens por página

  filterable: true,           // Permite filtro  sortable: true,        // Ativa ordenação

  filterType: 'text',         // Tipo: text, number, date, select  selectable: true,      // Ativa seleção múltipla

  render: (value, row) => {   // Formatação customizada  searchable: true       // Ativa busca global

    return `<strong>${value}</strong>`;});

  }```

}

```## 🎨 HTML Necessário



### Tipos de Filtro```html

<div id="myTable"></div>

- **text** - Busca parcial case-insensitive```

- **number** - Comparação exata de números

- **date** - Filtro por data (formato: YYYY-MM-DD)## 📖 API

- **select** - Lista de checkboxes com valores únicos

### Constructor

## 🔧 API Pública

```javascript

### Métodos de Dadosnew TableJS(containerId, options)

- `updateData(newData)` - Atualiza os dados da tabela```

- `getData()` - Retorna os dados atuais

**Parâmetros:**

### Métodos de Seleção- `containerId` (string) - ID do elemento HTML container

- `getSelectedRows()` - Retorna dados das linhas selecionadas- `options` (object) - Configurações da tabela

- `getSelectedIndices()` - Retorna índices das linhas selecionadas  - `data` (array) - Array de objetos com os dados

- `selectRows(indices)` - Seleciona linhas por índices  - `columns` (array) - Array de objetos definindo as colunas

- `deselectRows(indices)` - Desseleciona linhas por índices    - `field` (string) - Nome do campo nos dados

- `clearSelection()` - Limpa todas as seleções    - `title` (string) - Título da coluna

    - `formatter` (function) - Função para formatar o valor da célula

### Métodos de Filtros    - `sortable` (boolean) - Se a coluna pode ser ordenada (padrão: true)

- `clearSearch()` - Limpa a busca global    - `sortCompare` (function) - Função customizada para comparação na ordenação

- `clearAllFilters()` - Limpa busca + filtros de coluna  - `className` (string) - Classe CSS customizada (padrão: 'tablejs')

- `clearColumnFilters()` - Limpa apenas filtros de coluna  - `pagination` (boolean) - Ativa/desativa paginação (padrão: false)

  - `pageSize` (number) - Número de itens por página (padrão: 10)

### Métodos de Navegação  - `pageSizeOptions` (array) - Opções para seletor de itens por página (padrão: [10, 25, 50, 100])

- `goToPage(pageNumber)` - Vai para página específica  - `sortable` (boolean) - Ativa/desativa ordenação globalmente (padrão: true)

- `changePageSize(newSize)` - Altera itens por página  - `selectable` (boolean) - Ativa/desativa seleção múltipla (padrão: false)

  - `searchable` (boolean) - Ativa/desativa busca global (padrão: false)

### Métodos de Ordenação

- `clearSort()` - Remove ordenação e restaura ordem original### Métodos



### Outros#### `updateData(newData)`

- `render()` - Re-renderiza a tabelaAtualiza os dados da tabela, reseta para a página 1, limpa seleções e busca, depois re-renderiza.

- `destroy()` - Destroi a instância

```javascript

## 🏗️ Arquitetura Modulartable.updateData([

  { id: 1, nome: 'Novo Nome', email: 'novo@email.com' }

A biblioteca foi modularizada em 4 features independentes:]);

```

### 1️⃣ **pagination.js** (245 linhas)

Gerencia toda a lógica de paginação:#### `getData()`

- `renderPagination()` - UI completa de paginaçãoRetorna os dados atuais da tabela.

- `calculatePagination()` - Cálculo de páginas

- `goToPage()` - Navegação entre páginas```javascript

- `changePageSize()` - Alteração de itens por páginaconst currentData = table.getData();

```

### 2️⃣ **sort.js** (108 linhas)

Gerencia ordenação de colunas:#### `goToPage(pageNumber)`

- `handleSort()` - Ciclo ASC → DESC → NoneNavega para uma página específica.

- `sortData()` - Algoritmo de ordenação

- Suporte a comparadores customizados```javascript

- Ordenação numérica e alfabéticatable.goToPage(3); // Vai para a página 3

```

### 3️⃣ **selection.js** (125 linhas)

Gerencia seleção de linhas:#### `changePageSize(newSize)`

- `toggleSelectRow()` - Seleciona/desseleciona linhaAltera o número de itens por página e volta para a página 1.

- `toggleSelectAll()` - Seleciona/desseleciona todas

- `getSelectedRows()` - Retorna dados selecionados```javascript

- Usa `Set` para performancetable.changePageSize(25); // Mostra 25 itens por página

```

### 4️⃣ **filter.js** (199 linhas)

Gerencia busca e filtros:#### `clearSort()`

- `applyFilters()` - Aplica busca + filtros de colunaRemove a ordenação atual e restaura a ordem original dos dados.

- `handleSearch()` - Busca global em todas as colunas

- `handleColumnFilter()` - Filtro específico por coluna```javascript

- Suporte a 4 tipos: text, number, date, selecttable.clearSort();

```

### 🎯 **scargrid.js** (935 linhas)

Classe principal que:#### `getSelectedRows()`

- Coordena os módulosRetorna um array com os dados das linhas selecionadas.

- Gerencia estado da aplicação

- Renderiza UI (tabela, headers, body)```javascript

- Delega operações aos módulosconst selected = table.getSelectedRows();

console.log(selected); // Array de objetos selecionados

**Redução:** De 1395 para 935 linhas (33% de redução no core)```



## 🎨 Temas#### `getSelectedIndices()`

Retorna um array com os índices das linhas selecionadas.

### Tema Claro (Padrão)

```html```javascript

<link rel="stylesheet" href="src/css/scargrid.css">const indices = table.getSelectedIndices();

```console.log(indices); // [0, 5, 12]

```

### Tema Escuro

```html#### `selectRows(indices)`

<link rel="stylesheet" href="src/css/scargrid.css">Seleciona linhas específicas por seus índices.

<link rel="stylesheet" href="src/css/themes/dark.css">

``````javascript

table.selectRows([0, 1, 2]); // Seleciona as 3 primeiras linhas

## 📚 Exemplos```



Veja os exemplos na pasta `examples/`:#### `deselectRows(indices)`

Desseleciona linhas específicas por seus índices.

1. **basic.html** - Tabela simples sem features extras

2. **pagination.html** - Tabela com paginação de 50 registros```javascript

3. **filters.html** - Tabela com filtros avançados por colunatable.deselectRows([0, 1]); // Desseleciona linhas 0 e 1

4. **complete.html** - Exemplo com TODAS as features```

5. **test-modular.html** - Teste da arquitetura modular

#### `clearSelection()`

## 🛠️ DesenvolvimentoLimpa todas as seleções.



### Estrutura de Módulos```javascript

table.clearSelection();

Cada módulo segue o padrão:```



```javascript#### `clearSearch()`

const FeatureName = {Limpa o texto de busca e mostra todos os registros.

  method(grid, ...params) {

    // grid = instância do ScarGrid```javascript

    // Manipula grid.options, grid.currentPage, etctable.clearSearch();

  }```

};

#### `destroy()`

// Export para browserRemove a tabela do DOM.

if (typeof window !== 'undefined') {

  window.FeatureName = FeatureName;```javascript

}table.destroy();

```

// Export para ES6

if (typeof module !== 'undefined' && module.exports) {## 🔍 Busca Global

  module.exports = FeatureName;

}### Uso Básico

```

Ative a busca global nas opções da tabela:

### Adicionando Nova Feature

```javascript

1. Crie arquivo em `src/features/minha-feature.js`const table = new TableJS('myTable', {

2. Implemente métodos seguindo o padrão acima  data: data,

3. Adicione delegação no `scargrid.js`:  columns: columns,

```javascript  searchable: true  // Ativa busca global

minhaFuncao() {});

  if (typeof MinhaFeature !== 'undefined') {```

    MinhaFeature.minhaFuncao(this);

  }### Funcionalidades da Busca

}

```- **Busca em todas as colunas**: Procura o texto em todos os campos configurados

4. Carregue no HTML antes do core- **Debounce de 300ms**: Performance otimizada sem travar a digitação

- **Case-insensitive**: Não diferencia maiúsculas de minúsculas

## 📜 Versão- **Ícones profissionais**: Interface moderna com SVG ao invés de emojis

- **Botão limpar**: Clique no "✕" para remover o filtro e restaurar o foco

**v0.6.0** - Arquitetura modular- **Loading localizado**: Indicador aparece apenas na área dos dados da tabela

- **Renderização rápida**: Updates parciais do DOM para máxima performance

### Changelog- **Integração completa**: Funciona junto com paginação, ordenação e seleção

- ✅ Separação em módulos features

- ✅ Redução do core em 33%### Como Funciona

- ✅ Mantida 100% compatibilidade

- ✅ Todos os exemplos funcionando1. Digite no campo de busca no topo da tabela

2. A tabela é filtrada automaticamente após 300ms

## 📄 Licença3. A paginação se ajusta aos resultados filtrados

4. O contador mostra: "Mostrando X até Y de Z registros (filtrados de N total)"

MIT License

### Limpar Busca Programaticamente

## 👤 Autor

```javascript

Desenvolvido como biblioteca de tabelas interativas JavaScript.// Limpa a busca e mostra todos os registros

table.clearSearch();

## 🤝 Como Contribuir```



1. Fork o projeto### Exemplo Prático

2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)

3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)```javascript

4. Push para a branch (`git push origin feature/MinhaFeature`)const table = new TableJS('myTable', {

5. Abra um Pull Request  data: users,

  columns: [

## 🐛 Reportar Bugs    { field: 'nome', title: 'Nome' },

    { field: 'email', title: 'E-mail' },

Abra uma issue no GitHub com:    { field: 'cidade', title: 'Cidade' }

- Descrição do problema  ],

- Passos para reproduzir  searchable: true,

- Comportamento esperado vs atual  pagination: true,

- Screenshots (se aplicável)  pageSize: 10

});

---

// A busca procurará em nome, email e cidade simultaneamente

⭐ **Se você gostou, dê uma estrela no repositório!**```


## 🎯 Filtros por Coluna

### Uso Básico

Ative filtros por coluna nas opções da tabela:

```javascript
const table = new TableJS('myTable', {
  data: data,
  columns: columns,
  columnFilters: true  // Ativa filtros por coluna com ícone no header
});
```

### Tipos de Filtro

Configure o tipo de filtro para cada coluna:

```javascript
const columns = [
  {
    field: 'nome',
    title: 'Nome',
    filterType: 'text'  // Dropdown com input de texto
  },
  {
    field: 'idade',
    title: 'Idade',
    filterType: 'number'  // Dropdown com input numérico
  },
  {
    field: 'status',
    title: 'Status',
    filterType: 'select'  // Dropdown com checkboxes + busca interna
  },
  {
    field: 'dataNascimento',
    title: 'Data Nascimento',
    filterType: 'date'  // Dropdown com seletor de data
  },
  {
    title: 'E-mail',
    filterable: false  // Desabilita filtro nesta coluna
  }
];
```

### Funcionalidades dos Filtros

#### **Interface Profissional**
- **Ícone no cabeçalho**: Clique no ícone de filtro (🔻) no header da coluna
- **Contador visual**: Badge mostra quantos filtros estão ativos
- **Dropdown modal**: Abre painel profissional com animação

#### **Filtro Select (Checkboxes)**
- ✅ Lista com checkboxes para cada valor único
- ✅ "Selecionar Todos" / "Desmarcar Todos"
- ✅ Campo de busca interno para filtrar opções
- ✅ Scroll personalizado se muitas opções
- ✅ Botões "Limpar" e "Aplicar"

#### **Filtro Text/Number/Date**
- ✅ Input no dropdown
- ✅ Enter para aplicar
- ✅ Botões "Limpar" e "Aplicar"

#### **Comportamento**
- **Text**: Busca parcial case-insensitive
- **Number**: Busca exata por número
- **Date**: Busca por data (formato YYYY-MM-DD)
- **Select**: Filtra por valores selecionados (lógica OR entre checkboxes)
- **Filtros combinados**: Todos os filtros ativos funcionam juntos (lógica AND)
- **Com busca global**: Filtros de coluna + busca global funcionam simultaneamente

### Limpar Filtros Programaticamente

```javascript
// Limpa todos os filtros de coluna
table.clearColumnFilters();

// Limpa TUDO: busca global + filtros de coluna
table.clearAllFilters();
```

### Botão "Limpar Filtros"

Quando `columnFilters: true`, a tabela adiciona automaticamente um botão "Limpar Filtros" ao lado do campo de busca:

**Funcionalidades:**
- ✅ **Remove todos os filtros** - Busca global + filtros de coluna
- ✅ **Contador visual** - Badge mostra quantos filtros estão ativos
- ✅ **Destaque dinâmico** - Fica azul quando há filtros ativos
- ✅ **Um clique** - Restaura a tabela ao estado inicial

**Como funciona:**
1. Aplique filtros (busca ou colunas)
2. O botão ficará azul com um contador
3. Clique para limpar tudo instantaneamente

### Exemplo Completo

```javascript
const table = new TableJS('myTable', {
  data: employees,
  columns: [
    { 
      field: 'id', 
      title: 'ID', 
      filterType: 'number' 
    },
    { 
      field: 'nome', 
      title: 'Nome', 
      filterType: 'text' 
    },
    { 
      field: 'departamento', 
      title: 'Departamento', 
      filterType: 'select'  // Dropdown: Todos, TI, RH, Vendas, etc.
    },
    { 
      field: 'salario', 
      title: 'Salário', 
      filterType: 'number',
      formatter: (value) => `R$ ${value.toLocaleString('pt-BR')}`
    }
  ],
  columnFilters: true,
  searchable: true,
  pagination: true
});
```

## 🔄 Ordenação

### Uso Básico

Por padrão, todas as colunas são ordenáveis. Clique no cabeçalho para ordenar:
- **1º clique**: Ordena ascendente (A→Z, 0→9)
- **2º clique**: Ordena descendente (Z→A, 9→0)
- **3º clique**: Remove ordenação (volta à ordem original)

### Desabilitar Ordenação em Colunas

```javascript
const columns = [
  { 
    field: 'email', 
    title: 'E-mail',
    sortable: false  // Esta coluna não será ordenável
  }
];
```

### Comparador Customizado

Para ordenação customizada (ex: datas, valores monetários):

```javascript
const columns = [
  { 
    field: 'data',
    title: 'Data de Cadastro',
    sortCompare: (a, b, rowA, rowB) => {
      // a e b são os valores da coluna
      // rowA e rowB são os objetos completos
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    }
  }
];
```

### Desabilitar Ordenação Globalmente

```javascript
const table = new TableJS('myTable', {
  data: data,
  columns: columns,
  sortable: false  // Desabilita ordenação em todas as colunas
});
```

## ✅ Seleção Múltipla

### Uso Básico

Ative a seleção múltipla nas opções da tabela:

```javascript
const table = new TableJS('myTable', {
  data: data,
  columns: columns,
  selectable: true  // Ativa seleção múltipla
});
```

### Formas de Selecionar

- **Checkbox individual**: Clique no checkbox da linha
- **Clique na linha**: Clique em qualquer lugar da linha (exceto no checkbox)
- **Selecionar todos**: Use o checkbox no cabeçalho da tabela

### Obter Linhas Selecionadas

```javascript
// Obter dados completos das linhas selecionadas
const selectedData = table.getSelectedRows();
console.log(selectedData); // Array com os objetos selecionados

// Obter apenas os índices
const selectedIndices = table.getSelectedIndices();
console.log(selectedIndices); // [0, 5, 12]

// Exemplo prático
const names = table.getSelectedRows().map(row => row.nome);
console.log('Nomes selecionados:', names.join(', '));
```

### Manipular Seleções Programaticamente

```javascript
// Selecionar linhas específicas
table.selectRows([0, 1, 2, 5]);

// Desselecionar linhas específicas
table.deselectRows([1, 2]);

// Limpar todas as seleções
table.clearSelection();
```

### Estilo Visual

Linhas selecionadas são destacadas com:
- Fundo azul claro (`#e7f1ff`)
- Barra azul lateral esquerda
- Hover com cor mais escura

## 🎨 Formatadores de Células

Use a propriedade `formatter` para customizar como os dados são exibidos:

```javascript
const columns = [
  {
    field: 'preco',
    title: 'Preço',
    formatter: (value) => `R$ ${value.toFixed(2)}`
  },
  {
    field: 'status',
    title: 'Status',
    formatter: (value) => {
      const cor = value === 'ativo' ? 'green' : 'red';
      return `<span style="color: ${cor}">${value}</span>`;
    }
  }
];
```

## 🧪 Testando

Abra o arquivo `example/index.html` no seu navegador para ver a biblioteca em ação com paginação completa e 35 registros de exemplo.

## � Exemplo Completo com Paginação

```javascript
const table = new TableJS('myTable', {
  data: sampleData,        // Array com seus dados
  columns: columns,        // Configuração das colunas
  pagination: true,        // Ativa a paginação
  pageSize: 10,           // 10 registros por página
  pageSizeOptions: [5, 10, 25, 50]  // Opções disponíveis
});
```

## �🛠️ Estrutura do Projeto

```
biblio/
├── src/
│   ├── table.js      # Código principal da biblioteca
│   └── table.css     # Estilos da tabela
├── example/
│   └── index.html    # Exemplo de uso
├── package.json      # Informações do projeto
└── README.md         # Documentação
```

## 📝 Licença

MIT License - Livre para uso pessoal e comercial.

## 🤝 Contribuindo

Este é um projeto em desenvolvimento ativo. Novas funcionalidades serão adicionadas gradualmente.

---

**Versão Atual:** 0.6.0  
**Última Atualização:** Novembro 2025

### Changelog

#### v0.6.0 - Filtros por Coluna Profissionais
- ✨ Ícone de filtro no cabeçalho de cada coluna
- ✨ Dropdown modal profissional com animação
- ✨ **Select com checkboxes**: Lista completa de valores únicos
- ✨ Campo de busca interno no filtro
#### v0.6.0 - Filtros Avançados com Checkboxes
- ✨ Filtros por coluna com dropdown profissional
- ✨ Ícone de filtro no cabeçalho de cada coluna
- ✨ Filtro tipo "select" com checkboxes (múltipla seleção)
- ✨ Campo de busca interno nos dropdowns
- ✨ "Selecionar Todos" / "Desmarcar Todos"
- ✨ Scroll personalizado para muitas opções (max 300px)
- ✨ Contador visual de filtros ativos (badge)
- ✨ Inputs para text, number e date
- ✨ Botões "Limpar" e "Aplicar" em cada filtro
- ✨ **Botão "Limpar Filtros"** - Remove todos os filtros com um clique
- ✨ **Contador de filtros totais** - Badge mostra quantos filtros estão ativos
- ✨ **Posicionamento inteligente** - Dropdown nunca sai da tela (position: fixed)
- ✨ Fecha ao clicar fora (UX aprimorada)
- ✨ Suporte para 4 tipos: text, number, date, select
- ✨ Filtros combinados com lógica AND
- ✨ Integração com busca global
- ✨ Métodos clearColumnFilters() e clearAllFilters() na API
- 🎨 CSS moderno com animações e transições suaves
- ⚡ Performance mantida com renderização otimizada
- 🐛 Corrigido: Dropdown não é mais cortado pela tabela
- 🐛 Corrigido: Inputs não transbordam do modal
- 🐛 Corrigido: Posicionamento próximo ao ícone de filtro

#### v0.5.0 - Busca Global & Performance
- ✨ Campo de busca global em todas as colunas
- ✨ Debounce de 300ms otimizado
- ✨ Ícones SVG profissionais (busca e limpar)
- ✨ Botão limpar com foco automático
- ✨ Loading overlay APENAS na área da tabela
- ✨ Renderização otimizada com updates parciais do DOM
- ✨ Contador de resultados filtrados
- ✨ Integração com paginação, ordenação e seleção
- ✨ Busca case-insensitive
- ⚡ Performance: 5-10x mais rápido em buscas e interações
- 🎨 Interface moderna e profissional
- 🐛 Corrigido: Busca funciona corretamente com debounce
- 🐛 Corrigido: Sem travamentos durante digitação
- 🐛 Corrigido: Loading não cobre mais busca, cabeçalho e paginação

#### v0.4.0 - Seleção Múltipla
- ✨ Seleção múltipla com checkboxes
- ✨ Checkbox no cabeçalho para selecionar/desselecionar todos
- ✨ Clique na linha para selecionar
- ✨ Destaque visual para linhas selecionadas
- ✨ API completa: getSelectedRows(), getSelectedIndices(), selectRows(), clearSelection()
- ✨ Preservação de seleções durante navegação de páginas
- 🎨 Design moderno com feedback visual e animações suaves

#### v0.3.0 - Ordenação
- ✨ Ordenação por clique nos cabeçalhos das colunas
- ✨ Suporte para ordenação ascendente/descendente/sem ordenação
- ✨ Indicadores visuais com ícones de seta
- ✨ Detecção automática de tipo (número vs texto)
- ✨ Comparadores customizados para ordenação avançada
- ✨ Opção de desabilitar ordenação por coluna ou globalmente
- 🎨 Efeitos hover e estados visuais para colunas ordenáveis

#### v0.2.0 - Paginação
- ✨ Adicionada paginação completa com navegação
- ✨ Seletor de itens por página
- ✨ Informações de registros exibidos
- ✨ Botões de navegação (primeira, anterior, próxima, última)
- ✨ Números de página com ellipsis inteligente
- 🎨 Interface moderna e responsiva para controles de paginação

#### v0.1.0 - Versão Inicial
- ✨ Renderização básica de tabelas
- ✨ Configuração de colunas
- ✨ Formatadores customizados

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Gilmar A S Trindade**

---

## 🙏 Agradecimentos

- Inspirado nas melhores práticas de bibliotecas como DataTables, AG-Grid e Tabulator
- Ícones SVG seguindo padrões modernos de UI/UX
- Comunidade JavaScript por feedback e sugestões

---

## 📞 Suporte

- 🐛 [Reportar Bug](https://github.com/yourusername/tablejs/issues)
- 💡 [Solicitar Feature](https://github.com/yourusername/tablejs/issues)
- 📖 [Documentação](https://github.com/yourusername/tablejs)

---

<div align="center">
  
**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub! ⭐**

</div>

- ✨ Seletor de itens por página
- ✨ Informações de registros exibidos
- ✨ Botões de navegação (primeira, anterior, próxima, última)
- ✨ Números de página com ellipsis inteligente
- 🎨 Interface moderna e responsiva para controles de paginação

#### v0.1.0 - Versão Inicial
- ✨ Renderização básica de tabelas
- ✨ Configuração de colunas
- ✨ Formatadores customizados
