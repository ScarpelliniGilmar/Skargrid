# TableJS 📊

> Biblioteca JavaScript moderna, leve e gratuita para criação de tabelas interativas com recursos avançados de filtros, busca, ordenação e seleção múltipla.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.6.0-green.svg)](https://github.com/yourusername/tablejs)

## 🎯 Destaques

- 🚀 **Zero dependências** - Puro JavaScript ES6
- 💡 **Simples e intuitivo** - API fácil de usar
- 🎨 **Design moderno** - Interface profissional com animações suaves
- ⚡ **Performance otimizada** - Renderização parcial do DOM e debounce inteligente
- 📱 **Responsivo** - Funciona perfeitamente em qualquer dispositivo
- 🔧 **Altamente configurável** - Personalize cada aspecto da tabela

## 🚀 Funcionalidades

### ✅ Versão 0.6.0 - Filtros Avançados

#### Recursos Principais
- ✅ **Filtros por coluna** - Dropdown profissional com ícone no cabeçalho
- ✅ **Filtro com checkboxes** - Para colunas tipo "select" com múltipla seleção
- ✅ **Filtros de input** - Para text, number e date com validação
- ✅ **Busca interna** - Campo de busca dentro dos dropdowns de filtro
- ✅ **Select All/Deselect All** - Selecione ou desmarque todos os itens rapidamente
- ✅ **Scroll com estilo** - Lista de checkboxes com scroll personalizado
- ✅ **Contador de filtros ativos** - Badge mostra quantos itens estão filtrados
- ✅ **Botão "Limpar Filtros"** - Remove todos os filtros (busca + colunas) com um clique
- ✅ **Posicionamento inteligente** - Dropdown nunca sai da tela
- ✅ **Filtros combinados** - Busca global + filtros de coluna funcionam juntos

#### Recursos Anteriores
- ✅ **Busca global** - Campo de busca que filtra em tempo real em todas as colunas
- ✅ **Paginação completa** - Navegação entre páginas com controles inteligentes
- ✅ **Seletor de itens por página** - 10, 25, 50, 100 registros
- ✅ **Ordenação por colunas** - Clique nos cabeçalhos para ordenar (ASC/DESC)
- ✅ **Indicadores visuais** - Ícones SVG mostram direção da ordenação
- ✅ **Seleção múltipla** - Checkbox em cada linha para selecionar registros
- ✅ **Selecionar todos** - Checkbox no cabeçalho para selecionar/desselecionar tudo
- ✅ **Clique na linha** - Clique em qualquer lugar da linha para selecionar
- ✅ **Destaque visual** - Linhas selecionadas ficam destacadas
- ✅ **API de seleção** - Métodos para obter, selecionar e limpar seleções
- ✅ **Formatadores customizados** - Defina como exibir dados em cada célula
- ✅ **Comparadores customizados** - Lógica de ordenação personalizada
- ✅ **Renderização otimizada** - Updates parciais do DOM para máxima performance
- ✅ **Debounce inteligente** - 300ms para busca fluida sem travamentos

## 📋 Roadmap - Próximas Funcionalidades

### 🔄 Em Planejamento
- [ ] **Redimensionamento de colunas** - Arrastar para ajustar largura das colunas
- [ ] **Fixar colunas** - Manter colunas fixas durante scroll horizontal
- [ ] **Agrupamento** - Agrupar dados por valores de colunas
- [ ] **Exportação** - Exportar para CSV, Excel, PDF
- [ ] **Edição inline** - Editar células diretamente na tabela
- [ ] **Temas** - Múltiplos temas visuais pré-configurados
- [ ] **Drag & Drop** - Reordenar linhas arrastando
- [ ] **Virtualização** - Para tabelas com milhares de registros
- [ ] **Totalizadores** - Linha de totais com soma, média, etc.

---

## 📦 Instalação

### Download direto
1. Clone ou baixe os arquivos do projeto
2. Inclua os arquivos CSS e JS no seu HTML:

```html
<link rel="stylesheet" href="src/table.css">
<script src="src/table.js"></script>
```

### Via CDN (em breve)
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tablejs/dist/table.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/tablejs/dist/table.min.js"></script>
```

---

## 🎯 Uso Básico

```javascript
// 1. Defina seus dados
const data = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', idade: 28 },
  { id: 2, nome: 'Maria Santos', email: 'maria@email.com', idade: 34 },
  { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', idade: 25 }
];

// 2. Configure as colunas
const columns = [
  { 
    field: 'id', 
    title: 'ID' 
  },
  { 
    field: 'nome', 
    title: 'Nome Completo' 
  },
  { 
    field: 'email', 
    title: 'E-mail' 
  },
  { 
    field: 'idade', 
    title: 'Idade',
    formatter: (value) => `${value} anos` // Formatação customizada
  }
];

// 3. Inicialize a tabela
const table = new TableJS('myTable', {
  data: data,
  columns: columns,
  pagination: true,      // Ativa a paginação
  pageSize: 10,          // Itens por página
  pageSizeOptions: [10, 25, 50, 100],  // Opções de itens por página
  sortable: true,        // Ativa ordenação
  selectable: true,      // Ativa seleção múltipla
  searchable: true       // Ativa busca global
});
```

## 🎨 HTML Necessário

```html
<div id="myTable"></div>
```

## 📖 API

### Constructor

```javascript
new TableJS(containerId, options)
```

**Parâmetros:**
- `containerId` (string) - ID do elemento HTML container
- `options` (object) - Configurações da tabela
  - `data` (array) - Array de objetos com os dados
  - `columns` (array) - Array de objetos definindo as colunas
    - `field` (string) - Nome do campo nos dados
    - `title` (string) - Título da coluna
    - `formatter` (function) - Função para formatar o valor da célula
    - `sortable` (boolean) - Se a coluna pode ser ordenada (padrão: true)
    - `sortCompare` (function) - Função customizada para comparação na ordenação
  - `className` (string) - Classe CSS customizada (padrão: 'tablejs')
  - `pagination` (boolean) - Ativa/desativa paginação (padrão: false)
  - `pageSize` (number) - Número de itens por página (padrão: 10)
  - `pageSizeOptions` (array) - Opções para seletor de itens por página (padrão: [10, 25, 50, 100])
  - `sortable` (boolean) - Ativa/desativa ordenação globalmente (padrão: true)
  - `selectable` (boolean) - Ativa/desativa seleção múltipla (padrão: false)
  - `searchable` (boolean) - Ativa/desativa busca global (padrão: false)

### Métodos

#### `updateData(newData)`
Atualiza os dados da tabela, reseta para a página 1, limpa seleções e busca, depois re-renderiza.

```javascript
table.updateData([
  { id: 1, nome: 'Novo Nome', email: 'novo@email.com' }
]);
```

#### `getData()`
Retorna os dados atuais da tabela.

```javascript
const currentData = table.getData();
```

#### `goToPage(pageNumber)`
Navega para uma página específica.

```javascript
table.goToPage(3); // Vai para a página 3
```

#### `changePageSize(newSize)`
Altera o número de itens por página e volta para a página 1.

```javascript
table.changePageSize(25); // Mostra 25 itens por página
```

#### `clearSort()`
Remove a ordenação atual e restaura a ordem original dos dados.

```javascript
table.clearSort();
```

#### `getSelectedRows()`
Retorna um array com os dados das linhas selecionadas.

```javascript
const selected = table.getSelectedRows();
console.log(selected); // Array de objetos selecionados
```

#### `getSelectedIndices()`
Retorna um array com os índices das linhas selecionadas.

```javascript
const indices = table.getSelectedIndices();
console.log(indices); // [0, 5, 12]
```

#### `selectRows(indices)`
Seleciona linhas específicas por seus índices.

```javascript
table.selectRows([0, 1, 2]); // Seleciona as 3 primeiras linhas
```

#### `deselectRows(indices)`
Desseleciona linhas específicas por seus índices.

```javascript
table.deselectRows([0, 1]); // Desseleciona linhas 0 e 1
```

#### `clearSelection()`
Limpa todas as seleções.

```javascript
table.clearSelection();
```

#### `clearSearch()`
Limpa o texto de busca e mostra todos os registros.

```javascript
table.clearSearch();
```

#### `destroy()`
Remove a tabela do DOM.

```javascript
table.destroy();
```

## 🔍 Busca Global

### Uso Básico

Ative a busca global nas opções da tabela:

```javascript
const table = new TableJS('myTable', {
  data: data,
  columns: columns,
  searchable: true  // Ativa busca global
});
```

### Funcionalidades da Busca

- **Busca em todas as colunas**: Procura o texto em todos os campos configurados
- **Debounce de 300ms**: Performance otimizada sem travar a digitação
- **Case-insensitive**: Não diferencia maiúsculas de minúsculas
- **Ícones profissionais**: Interface moderna com SVG ao invés de emojis
- **Botão limpar**: Clique no "✕" para remover o filtro e restaurar o foco
- **Loading localizado**: Indicador aparece apenas na área dos dados da tabela
- **Renderização rápida**: Updates parciais do DOM para máxima performance
- **Integração completa**: Funciona junto com paginação, ordenação e seleção

### Como Funciona

1. Digite no campo de busca no topo da tabela
2. A tabela é filtrada automaticamente após 300ms
3. A paginação se ajusta aos resultados filtrados
4. O contador mostra: "Mostrando X até Y de Z registros (filtrados de N total)"

### Limpar Busca Programaticamente

```javascript
// Limpa a busca e mostra todos os registros
table.clearSearch();
```

### Exemplo Prático

```javascript
const table = new TableJS('myTable', {
  data: users,
  columns: [
    { field: 'nome', title: 'Nome' },
    { field: 'email', title: 'E-mail' },
    { field: 'cidade', title: 'Cidade' }
  ],
  searchable: true,
  pagination: true,
  pageSize: 10
});

// A busca procurará em nome, email e cidade simultaneamente
```

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
