# <img src="docs/img/logos/skargrid-logo-full.svg" alt="Skargrid logo" style="height:120px;">
> Biblioteca JavaScript moderna para criação de tabelas interativas com filtros cascata, busca normalizada e recursos avançados

[![npm version](https://img.shields.io/npm/v/skargrid.svg)](https://www.npmjs.com/package/skargrid)
[![npm downloads](https://img.shields.io/npm/dw/skargrid.svg)](https://www.npmjs.com/package/skargrid)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Site: [https://skargrid.com](https://skargrid.com)

🇺🇸 [Read in English](README.md)

---

## 📸 Exemplo em Destaque

### 🏆 Exemplo Completo (Todas as Features)
![Exemplo Completo](docs/img/complete.png)
<div align="center"><sub>Todas as features: ordenação, filtros, seleção, exportação, tema escuro, config. de colunas, dataset grande</sub></div>

---

# 📚 Exemplos Visuais

Abaixo exemplos visuais dos recursos do Skargrid, em ordem recomendada:

#### Exemplo Minimalista
![Exemplo Minimalista](docs/img/minimal.png)
<div align="center"><sub>Configuração mínima: 4 colunas, sem extras</sub></div>

#### Exemplo Completo
![Exemplo Completo](docs/img/complete.png)
<div align="center"><sub>Todas as features: ordenação, filtros, seleção, exportação, tema escuro, config. de colunas, dataset grande</sub></div>

#### Ordenação
![Ordenação](docs/img/sort.png)
<div align="center"><sub>Colunas ordenáveis</sub></div>

#### Filtros
![Filtros](docs/img/filters.png)
<div align="center"><sub>Filtros por coluna (estilo Excel)</sub></div>

#### Paginação
![Paginação](docs/img/pagination.png)
<div align="center"><sub>Paginação habilitada</sub></div>

#### Seleção
![Seleção](docs/img/selection.png)
<div align="center"><sub>Seleção de linhas</sub></div>

#### Configuração de Colunas
![Configuração de Colunas](docs/img/columns.png)
<div align="center"><sub>Configuração de colunas (mostrar/ocultar, reordenar, persistir)</sub></div>

#### Exportação
![Exportação](docs/img/export.png)
<div align="center"><sub>Exportar para CSV</sub></div>

#### Tema Escuro
![Tema Escuro](docs/img/theme-dark.png)
<div align="center"><sub>Modo escuro ativado</sub></div>

#### Dataset Grande
![Dataset Grande](docs/img/complete.png)
<div align="center"><sub>20+ colunas, 50+ linhas, scroll horizontal</sub></div>

---


## ✨ Destaques

- 🎨 **Configuração de Colunas** - Drag & drop para reordenar, mostrar/ocultar colunas
- 🗄️ **Persistência** - Salva preferências do usuário no localStorage
- 🌓 **Suporte a Temas** - Light/Dark theme com transições suaves
- 🔄 **Filtros Cascata** - Estilo Excel com valores indisponíveis desabilitados
- 🌍 **Busca Normalizada** - Remove acentos automaticamente (José = jose)
- ↔️ **Scroll Horizontal** - Custom scrollbar para tabelas largas
- 📦 **Bundle Único** - Apenas 2 arquivos (JS + CSS) - ~83KB
- 🎯 **Zero Dependências** - Vanilla JavaScript puro
- ⚡ **Performance** - Otimizado para grandes datasets

---

## Release v1.0.1 — Resumo das correções

Esta versão introduz um conjunto de correções de bugs e melhorias comportamentais focadas em renderização, exportação e filtros. Principais mudanças:

- Renderização e exportação
	- As colunas agora aceitam tanto a propriedade `render` quanto a propriedade legada `formatter` para formatação de células.
	- A exportação para CSV usa o renderer da coluna quando presente e remove o HTML do conteúdo, exportando apenas valores textuais.

- Filtros
	- Filtros do tipo `select` agora "achatam"/flatten valores vindos de células que são arrays (por exemplo, colunas com múltiplos grupos) e os apresentam como opções separadas.
	- Introduzimos um token especial para valores vazios: `(Em branco)`, permitindo filtrar células nulas/vazias.
	- O botão "Selecionar Todos" no dropdown de filtro atua apenas sobre as opções atualmente visíveis (após busca) e respeita opções desabilitadas (indisponíveis).
	- Corrigido o cálculo de valores disponíveis para que filtros em cascata reflitam corretamente filtros do tipo `select` e células-Array.

---

## Notas da versão (v1.0.2)

O que há de novo em v1.0.2
- Cabeçalho com fundo explícito + variáveis para tema escuro: fundo do `thead` explícito e overrides de tema para que o cabeçalho fique sólido no modo escuro.
- Comportamento do dropdown de filtro: os dropdowns agora sempre abrem abaixo do controle; quando o espaço abaixo é limitado, o dropdown recebe rolagem interna ao invés de abrir para cima.
- Ajustes visuais: checkboxes/botões usam a cor de destaque da marca e hover com contraste melhor.
- Alteração de capitalização do cabeçalho: títulos de coluna são exibidos como você os fornece (sem uppercase forçado) — se quiser uppercase, adicione uma regra CSS na sua tema.

---

## Release v1.0.3 — Documentação & Exemplos

O que há de novo em v1.0.3
- Correção de rolagem e layout: corrigimos um problema em que mudanças de paginação ou filtros podiam alterar a altura da tabela e deslocar a página; o playground agora limita os painéis de exemplo com um max-height e ativa rolagem vertical interna para que o cabeçalho permaneça sticky e o layout da página fique estável.

## Release v1.0.4 — Exportação XLSX (sem dependências)

O que há de novo em v1.0.4
- Exportador XLSX puro em JS (sem dependências): adicionamos um exportador incorporado que gera um arquivo .xlsx (OpenXML) real e empacota em ZIP no navegador. Use `exportXLSX: true` nas opções para ativar o botão XLSX ao lado do botão CSV existente.
- A exportação CSV continua inalterada e disponível via `exportCSV: true`.

Exemplo rápido (habilitar CSV e XLSX):
```javascript
new Skargrid('myTable', {
	data, columns,
	searchable: true,
	pagination: true,
	exportCSV: true,
	exportXLSX: true // ativa download .xlsx real sem dependências
});
```

## �🚀 Início Rápido

### Instalação

**Opção 1: CDN (jsDelivr ou unpkg)**
Use diretamente do npm via CDN (sempre confira a versão mais recente):

**jsDelivr**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.css">
<script src="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.js"></script>
```

**unpkg**
```html
<link rel="stylesheet" href="https://unpkg.com/skargrid@latest/dist/skargrid.css">
<script src="https://unpkg.com/skargrid@latest/dist/skargrid.min.js"></script>
```

**Opção 2: Download**
```bash
# Clone o repositório
git clone https://github.com/ScarpelliniGilmar/skargrid.git

# Copie os arquivos dist/ para seu projeto
cp skargrid/dist/skargrid.min.js seu-projeto/
cp skargrid/dist/skargrid.css seu-projeto/
```

**Opção 3: NPM**
Instale diretamente do npm oficial:
```bash
npm i skargrid
```
[https://www.npmjs.com/package/skargrid](https://www.npmjs.com/package/skargrid)

---

## 💖 Apoie o Projeto

Se este projeto te ajudou ou você quer incentivar o desenvolvimento de novas funcionalidades, considere apoiar:

- **Liberapay:** [liberapay.com/skargrid](https://liberapay.com/skargrid)

Sua contribuição ajuda a manter o projeto ativo e evoluindo!

---


## 📚 Documentação Completa

### Configuração

```javascript
new Skargrid(containerId, options)
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
| `storageKey` | String | `'skargrid-config-{id}'` | Chave do localStorage (se persistColumnConfig=true) |
| `theme` | String | `'light'` | Tema visual: 'light' ou 'dark' |
| `className` | String | `'skargrid'` | Classe CSS da tabela |
| `exportCSV` | Boolean | `false` | Habilita botão de exportação CSV (mostra "Exportar CSV" nas ações). Usa renderers de coluna quando presentes e remove HTML para exportação. |
| `exportXLSX` | Boolean | `false` | Habilita exportador XLSX puro em JS (gera um arquivo .xlsx real no navegador). Adiciona um botão "XLSX" ao lado do CSV. |

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

#### 1. Filtro de Texto (`filterType: 'text'`)
```javascript
{ field: 'nome', title: 'Nome', filterType: 'text' }
```
- Busca parcial case-insensitive
- **Remove acentos automaticamente** (José = jose)
- Input simples

#### 2. Filtro Numérico (`filterType: 'number'`)
```javascript
{ field: 'idade', title: 'Idade', filterType: 'number' }
```
- Comparação exata de números
- Input numérico

#### 3. Filtro de Data (`filterType: 'date'`)
```javascript
{ field: 'dataNascimento', title: 'Nascimento', filterType: 'date' }
```
- Busca por data (formato ISO: YYYY-MM-DD)
- Input de data HTML5

#### 4. Filtro Select (`filterType: 'select'`)
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

// Exportação
// Exporta dados visíveis ou selecionados. Métodos disponíveis quando as
// opções de exportação correspondentes estão habilitadas (exportCSV / exportXLSX).
table.exportToCSV('arquivo.csv');
table.exportSelectedToCSV('selecionado.csv');
table.exportToExcel('arquivo.xls');          // .xls simples (HTML wrapper)
table.exportSelectedToExcel('sel.xls');
table.exportToXLSX('arquivo.xlsx');         // .xlsx real gerado no navegador (sem dependências)
table.exportSelectedToXLSX('sel.xlsx');
```

### Nota de segurança sobre exportação

Ao exportar dados, tenha cuidado com valores não confiáveis: planilhas podem interpretar células que comecem com "=", "+", "-" ou "@" como fórmulas, o que pode levar a injeção de fórmulas (CSV/Excel formula injection). Por padrão os valores são exportados como estão. Considere sanitizar valores antes da exportação (por exemplo prefixando com apóstrofo) ou habilitar uma opção de sanitização se você adicioná‑la.

### Recursos Avançados

#### 🎨 Suporte a Temas

```javascript
// Tema escuro
const table = new Skargrid('myTable', {
	data: data,
	columns: columns,
	theme: 'dark'
});

// Alternar tema dinamicamente
table.setTheme('dark');  // ou 'light'
```

#### 🎯 Configuração de Colunas

```javascript
const table = new Skargrid('myTable', {
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
const table = new Skargrid('myTable', {
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
skargrid/
├── build.ps1
├── dist/
│   ├── skargrid-features.js
│   ├── skargrid.css
│   ├── skargrid.min.js
│   └── themes/
│       ├── dark.css
│       └── light.css
├── docs/
│   ├── img/
│   │   ├── columns.png
│   │   ├── complete.png
│   │   ├── export.png
│   │   ├── filters.png
│   │   ├── minimal.png
│   │   ├── pagination.png
│   │   ├── selection.png
│   │   ├── sort.png
│   │   └── theme-dark.png
│   └── skargrid-examples.html
├── lang/
├── LICENSE
├── package.json
├── README.md
├── README.pt-br.md
├── src/
│   ├── core/
│   │   └── skargrid.js
│   ├── css/
│   │   ├── skargrid.css
│   │   └── themes/
│   │       ├── dark.css
│   │       └── light.css
│   └── features/
│       ├── columnConfig.js
│       ├── export.js
│       ├── filter.js
│       ├── pagination.js
│       ├── selection.js
│       └── sort.js
└── .gitignore
```

### Build Manual

```powershell
# PowerShell (Windows)
.\build.ps1

# Ou com PowerShell Core (multiplataforma)
pwsh -File build.ps1
```

**Saída:**
- `dist/skargrid.min.js` - Bundle completo (~56KB)
- `dist/skargrid.css` - Estilos
- `dist/themes/` - Temas opcionais

---

## 🎯 Exemplos

### Exemplo 1: Tabela Simples com Busca
```javascript
const table = new Skargrid('container', {
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
const table = new Skargrid('container', {
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
## 🎨 Temas

### Tema Padrão (Light)
```html
<link rel="stylesheet" href="dist/skargrid.css">
```

### Tema Escuro
```html
<link rel="stylesheet" href="dist/skargrid.css">
<link rel="stylesheet" href="dist/themes/dark.css">
```

### Customização
```css
/* Sobrescreva variáveis CSS */
.skargrid {
	--sg-primary-color: #007ACC;
	--sg-hover-bg: #f8f9fa;
	--sg-border-color: #dee2e6;
}
```

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

- [x] CDN público
- [x] Pacote NPM
- [x] Export para CSV
- [x] Export para XLSX
- [ ] Filtros avançados (range, múltiplos valores)
- [ ] Edição inline
- [ ] Colunas fixas (frozen columns)
- [ ] Agrupamento de linhas
- [ ] Temas adicionais
- [ ] TypeScript definitions
- [ ] React/Vue/Angular wrappers

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**