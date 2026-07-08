# <img src="docs/img/logos/skargrid-logo-full.svg" alt="Skargrid logo" style="height:120px;">

> Modern JavaScript library for interactive tables with cascading filters, accent-insensitive search, and advanced features

[![npm version](https://img.shields.io/npm/v/skargrid.svg)](https://www.npmjs.com/package/skargrid)
[![npm downloads](https://img.shields.io/npm/dw/skargrid.svg)](https://www.npmjs.com/package/skargrid)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/skargrid)](https://bundlephobia.com/package/skargrid)

**Website:** [https://skargrid.com](https://skargrid.com) •
**[Leia em Português](README.pt-br.md)**

---

## Table of Contents

- [Key Features](#key-features)
- [Visual Examples](#visual-examples)
- [Quick Start](#quick-start)
- [Complete Examples](#complete-examples)
- [Performance Benchmarks](#performance-benchmarks)
- [API Reference](#api-reference)
- [Theming & Styling](#theming--styling)
- [Build & Development](#build--development)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

---

## Key Features

- **Internationalization (i18n)** - Professional labels system, fully customizable for any language (Portuguese, Spanish, French, etc.)
- **Virtual Scrolling** - High-performance rendering for large datasets, validated with 50k rows in Chromium, Firefox and WebKit
- **Column Configuration** - Drag & drop to reorder, show/hide columns with persistence
- **Smart Persistence** - Saves user preferences in localStorage automatically
- **Theme Support** - Light/Dark theme with smooth transitions and custom variables
- **Smart Select Filters**: Improved select filters to show only available options when other columns are filtered, with intelligent search behavior that isolates selections during search
- **Accent-Insensitive Search** - Automatically handles accents (José = jose)
- **Horizontal Scroll** - Custom scrollbar for wide tables with fixed columns
- **Server-Side Processing** *New in 2.0* - Delegate pagination, sorting, filtering and search to your backend via events (see [Server-Side Processing](#server-side-processing))
- **State Persistence** *New in 2.0* - Serializable `getState()`/`setState()`, with optional automatic `localStorage` persistence via `persistState`
- **Frozen Columns** *New in 2.0* - Pin columns to the left during horizontal scroll with `column.frozen`
- **Footer Aggregates** *New in 2.0* - `sum`/`avg`/`count`/`min`/`max` or custom functions, computed over filtered data
- **Event Bus** *New in 2.0* - `on()`/`off()`/`emit()` for `sortChange`, `pageChange`, `selectionChange`, `filterChange`, `rowClick`
- **Safe Rendering by Default** *New in 2.0* - `render()`/`formatter()` return plain text unless you opt in to HTML (XSS protection, see [Security](#security))
- **Single Bundle** - Only 2 files (JS + CSS) - **~15.5KB gzipped** (65.6KB minified)
- **Zero Dependencies** - Pure Vanilla JavaScript, framework agnostic
- **High Performance** - Optimized for datasets up to 25,000+ records
- **Export Support** - CSV and native XLSX export without external dependencies

---

## Visual Examples

Below are visual examples of Skargrid features, in recommended learning order:

#### Minimal Setup
![Minimal Example](docs/img/minimal.png)
<div align="center"><sub>Basic table: 4 columns, sorting, pagination</sub></div>

#### Complete Features
![Complete Example](docs/img/complete.png)
<div align="center"><sub>All features: sorting, filters, selection, export, dark theme, column config</sub></div>

#### Advanced Filtering
![Filters](docs/img/filters.png)
<div align="center"><sub>Excel-style cascading filters with search</sub></div>

#### Column Management
![Column Config](docs/img/columns.png)
<div align="center"><sub>Drag & drop column reordering and visibility toggle</sub></div>

#### Data Export
![Export](docs/img/export.png)
<div align="center"><sub>Export to CSV and XLSX formats</sub></div>

#### Dark Theme
![Dark Theme](docs/img/theme-dark.png)
<div align="center"><sub>Built-in dark theme with smooth transitions</sub></div>

---

## Performance Guidelines & Limitations

### Recommended Usage
- **Client-side (all features)**: up to ~25,000 records — search, sort, filters and export stay responsive
- **Virtual scrolling**: recommended above ~10,000 records with `virtualization: true`; validated with 50,000 rows in real browsers (Chromium, Firefox, WebKit) via the project's Playwright suite
- **Beyond that**: use [server-side processing](#server-side-processing) — the grid receives one page at a time and delegates pagination, sorting, filtering and search to your backend, so dataset size is bounded by your server, not the browser

### Best Practices

**For large datasets:**
```javascript
// Recommended: server-side approach
const grid = new Skargrid('grid', {
  data: pageData, // Only current page
  pagination: true,
  serverSide: true,
  // Server handles: filtering, sorting, pagination
});
```

**For small datasets:**
```javascript
// Client-side everything
const grid = new Skargrid('grid', {
  data: fullDataset, // Up to ~25K records
  searchable: true,
  sortable: true,
  columnFilters: true,
});
```

**See Real Examples:**
- [Server-side processing guide](https://skargrid.com/api/state#server-side-processing) — complete fetch-on-event pattern
- `docs/playground.html` (run locally with `npm run dev`) — includes a 50K-row virtualization section and a fake-server server-side section

---

## Quick Start

### Installation

**Option 1: CDN (Recommended)**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.css">
<script src="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.js"></script>
```

**Option 2: NPM**
```bash
npm install skargrid
```

**Option 3: Download**
```bash
git clone https://github.com/ScarpelliniGilmar/skargrid.git
cp skargrid/dist/* your-project/
```

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.css">
</head>
<body>
    <div id="myTable"></div>

    <script src="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.js"></script>
    <script>
        const data = [
            { id: 1, name: 'John Doe', age: 28, city: 'New York' },
            { id: 2, name: 'Jane Smith', age: 32, city: 'London' }
        ];

        const columns = [
            { field: 'id', title: 'ID', width: '60px' },
            { field: 'name', title: 'Name', sortable: true },
            { field: 'age', title: 'Age', sortable: true },
            { field: 'city', title: 'City' }
        ];

        const table = new Skargrid('myTable', {
            data: data,
            columns: columns,
            pagination: true,
            sortable: true,
            searchable: true
        });
    </script>
</body>
</html>
```

---

## Complete Examples

### Full-Featured Table

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkarGrid Demo</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.css">
</head>
<body>
    <div id="myTable"></div>

    <script src="https://cdn.jsdelivr.net/npm/skargrid@latest/dist/skargrid.min.js"></script>
    <script>
        // Sample data
        const employees = [
            { id: 1, name: 'João Silva', age: 28, city: 'São Paulo', salary: 3500, department: 'TI', active: true },
            { id: 2, name: 'Maria Santos', age: 32, city: 'Rio de Janeiro', salary: 4200, department: 'RH', active: true },
            { id: 3, name: 'Pedro Costa', age: 25, city: 'Belo Horizonte', salary: 2800, department: 'Vendas', active: false },
            { id: 4, name: 'Ana Oliveira', age: 29, city: 'Porto Alegre', salary: 3800, department: 'Marketing', active: true },
            { id: 5, name: 'Carlos Mendes', age: 35, city: 'Curitiba', salary: 5500, department: 'TI', active: true }
        ];

        // Column configuration
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
                render: (value) => value ? ' Ativo' : ' Inativo'
            }
        ];

        // Initialize SkarGrid with all features
        const table = new Skargrid('myTable', {
            data: employees,
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

### Data Management Example

```javascript
// Initialize table
const table = new Skargrid('myTable', {
    data: initialData,
    columns: columns,
    pagination: true,
    searchable: true
});

// Update data dynamically
function updateTable(newData) {
    table.updateData(newData);
}

// Handle selection changes
function onSelectionChange() {
    const selectedRows = table.getSelectedRows();
    console.log('Selected items:', selectedRows);

    // Export only selected rows
    if (selectedRows.length > 0) {
        table.exportSelectedToCSV('selected-items.csv');
    }
}

// Clear all filters
function resetFilters() {
    table.clearAllFilters();
}

// Change theme
function toggleTheme() {
    const currentTheme = table.options.theme;
    table.setTheme(currentTheme === 'light' ? 'dark' : 'light');
}
```

### Advanced Styling

```css
/* Custom theme variables */
:root {
    --sg-primary: #2563eb;
    --sg-accent: #1d4ed8;
    --sg-gray: #6b7280;
    --sg-white: #ffffff;
}

/* Custom table styling */
.skargrid {
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.skargrid thead th {
    background: linear-gradient(135deg, var(--sg-primary), var(--sg-accent));
    color: white;
    font-weight: 600;
}

/* Responsive design */
@media (max-width: 768px) {
    .skargrid {
        font-size: 14px;
    }

    .skargrid-search-container {
        flex-direction: column;
    }
}
```

### Virtual Scrolling Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Virtual Scrolling Demo</title>
    <link rel="stylesheet" href="dist/skargrid.min.css">
</head>
<body>
    <div id="virtualTable"></div>

    <script src="dist/skargrid.min.js"></script>
    <script>
        // Generate 10,000 rows for demonstration
        function generateLargeDataset() {
            const data = [];
            const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre', 'Curitiba'];
            const departments = ['TI', 'RH', 'Vendas', 'Marketing', 'Financeiro'];

            for (let i = 1; i <= 10000; i++) {
                data.push({
                    id: i,
                    name: `Employee ${i}`,
                    age: Math.floor(Math.random() * 40) + 20,
                    city: cities[Math.floor(Math.random() * cities.length)],
                    salary: Math.floor(Math.random() * 5000) + 2500,
                    department: departments[Math.floor(Math.random() * departments.length)]
                });
            }
            return data;
        }

        const columns = [
            { field: 'id', title: 'ID', width: '60px', sortable: true },
            { field: 'name', title: 'Name', sortable: true },
            { field: 'age', title: 'Age', width: '80px', sortable: true },
            { field: 'city', title: 'City', sortable: true, filterType: 'select' },
            { field: 'salary', title: 'Salary', sortable: true, render: v => `$${v.toLocaleString()}` },
            { field: 'department', title: 'Department', filterType: 'select' }
        ];

        // Initialize with virtual scrolling
        const table = new Skargrid('virtualTable', {
            data: generateLargeDataset(),
            columns: columns,
            virtualization: true,  // Enable virtual scrolling
            searchable: true,
            sortable: true,
            columnFilters: true,
            height: '500px'        // Fixed height for virtual scrolling
        });
    </script>
</body>
</html>
```

### Internationalization Example

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>i18n Demo</title>
    <link rel="stylesheet" href="dist/skargrid.min.css">
</head>
<body>
    <div id="i18nTable"></div>

    <script src="dist/skargrid.min.js"></script>
    <script>
        const data = [
            { id: 1, nome: 'João Silva', idade: 28, cidade: 'São Paulo', salario: 3500 },
            { id: 2, nome: 'Maria Santos', idade: 32, cidade: 'Rio de Janeiro', salario: 4200 },
            { id: 3, nome: 'Pedro Costa', idade: 25, cidade: 'Belo Horizonte', salario: 2800 }
        ];

        const columns = [
            { field: 'id', title: 'ID', width: '60px', sortable: true },
            { field: 'nome', title: 'Nome', sortable: true },
            { field: 'idade', title: 'Idade', width: '80px', sortable: true },
            { field: 'cidade', title: 'Cidade', sortable: true },
            { field: 'salario', title: 'Salário', sortable: true, render: v => `R$ ${v.toLocaleString('pt-BR')}` }
        ];

        // Initialize with Portuguese labels
        const table = new Skargrid('i18nTable', {
            data: data,
            columns: columns,
            pagination: true,
            searchable: true,
            columnFilters: true,
            exportCSV: true,
            labels: {
                searchPlaceholder: 'Buscar em todas as colunas...',
                clearFilters: 'Limpar Filtros',
                exportCSV: 'Exportar CSV',
                exportXLSX: 'Exportar XLSX',
                filterTitle: 'Filtrar: {title}',
                selectAll: 'Selecionar Todos',
                filterSearchPlaceholder: 'Buscar...',
                filterInputPlaceholder: 'Digite para filtrar...',
                clear: 'Limpar',
                apply: 'Aplicar',
                showing: 'Mostrando {start} até {end} de {total} registros',
                filteredOfTotal: 'filtrados de {total} total',
                itemsPerPage: 'Itens por página:',
                noRowsSelected: 'Nenhuma linha selecionada para exportar.',
                columnConfigTitle: 'Configurar Colunas',
                columnConfigDescription: 'Marque para exibir, arraste ou use setas para reordenar',
                restore: 'Restaurar',
                cancel: 'Cancelar',
                noData: 'Nenhum dado disponível',
                loading: 'Carregando...'
            }
        });
    </script>
</body>
</html>
```

### Large Dataset Example (50K Rows, Virtualized)

This is the same scale exercised by the project's Playwright suite in Chromium, Firefox and WebKit:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Large Dataset Demo</title>
    <link rel="stylesheet" href="dist/skargrid.min.css">
</head>
<body>
    <div id="largeTable"></div>

    <script src="dist/skargrid.min.js"></script>
    <script>
        // Generate 50,000 rows
        function generateLargeDataset() {
            const data = [];
            const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
            const companies = ['TechCorp', 'DataSys', 'InfoTech', 'WebSolutions', 'CloudNet'];

            for (let i = 1; i <= 50000; i++) {
                data.push({
                    id: i,
                    name: `Person ${i}`,
                    age: Math.floor(Math.random() * 50) + 18,
                    city: cities[Math.floor(Math.random() * cities.length)],
                    company: companies[Math.floor(Math.random() * companies.length)],
                    salary: Math.floor(Math.random() * 100000) + 30000
                });
            }
            return data;
        }

        const columns = [
            { field: 'id', title: 'ID', width: '80px', sortable: true },
            { field: 'name', title: 'Name', sortable: true },
            { field: 'age', title: 'Age', width: '70px', sortable: true },
            { field: 'city', title: 'City', filterType: 'select' },
            { field: 'company', title: 'Company', filterType: 'select' },
            { field: 'salary', title: 'Salary', sortable: true, render: v => `$${v.toLocaleString()}` }
        ];

        // virtualization requires a fixed height and replaces pagination
        const table = new Skargrid('largeTable', {
            data: generateLargeDataset(),
            columns: columns,
            virtualization: true,
            searchable: true,
            sortable: true,
            columnFilters: true,
            height: '600px'
        });
    </script>
</body>
</html>
```

Need more than the browser can hold comfortably? Use [server-side processing](#server-side-processing) — the grid only ever receives one page.

### Server-Side Pagination Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Pagination Demo</title>
    <link rel="stylesheet" href="dist/skargrid.min.css">
</head>
<body>
    <div id="serverTable"></div>

    <script src="dist/skargrid.min.js"></script>
    <script>
        // Simulate server data (50,000 records total)
        let currentPage = 1;
        const pageSize = 100;
        const totalRecords = 50000;

        // Mock server API
        function fetchPageData(page, filters = {}, sort = {}) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const startIndex = (page - 1) * pageSize;
                    const data = [];

                    for (let i = 0; i < pageSize; i++) {
                        const id = startIndex + i + 1;
                        if (id > totalRecords) break;

                        data.push({
                            id: id,
                            name: `User ${id}`,
                            email: `user${id}@example.com`,
                            role: ['Admin', 'User', 'Manager'][Math.floor(Math.random() * 3)],
                            status: Math.random() > 0.5 ? 'Active' : 'Inactive',
                            lastLogin: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
                        });
                    }

                    resolve({
                        data: data,
                        total: totalRecords,
                        page: page,
                        pageSize: pageSize
                    });
                }, 200); // Simulate network delay
            });
        }

        const columns = [
            { field: 'id', title: 'ID', width: '80px', sortable: true },
            { field: 'name', title: 'Name', sortable: true },
            { field: 'email', title: 'Email', sortable: true },
            { field: 'role', title: 'Role', filterType: 'select' },
            { field: 'status', title: 'Status', filterType: 'select' },
            { field: 'lastLogin', title: 'Last Login', sortable: true }
        ];

        // Initialize table
        const table = new Skargrid('serverTable', {
            data: [],
            columns: columns,
            pagination: true,
            pageSize: pageSize,
            searchable: true,
            columnFilters: true,
            serverSide: true,
            totalRecords: totalRecords
        });

        // Load initial data
        fetchPageData(1).then(result => {
            table.updateData(result.data);
        });

        // Handle pagination changes
        table.on('pageChange', (page) => {
            fetchPageData(page).then(result => {
                table.updateData(result.data);
            });
        });

        // Handle filter changes
        table.on('filterChange', (filters) => {
            fetchPageData(1, filters).then(result => {
                table.updateData(result.data);
                table.setTotalRecords(result.total);
            });
        });
    </script>
</body>
</html>
```

---

## Performance

### What is actually verified

- The browser test suite (Playwright) exercises a **50,000-row virtualized grid** in Chromium, Firefox and WebKit on every CI run — scrolling, filtering and destroy/recreate cycles included.
- Older releases published synthetic benchmark tables measured in jsdom; those numbers were not reproducible in real browsers and are no longer advertised. Reproducible, real-browser benchmarks are on the roadmap.

### Performance Features

- **Virtual Scrolling**: Only visible rows (plus a buffer) are rendered
- **Debounced Search**: Prevents excessive filtering operations while typing
- **Server-Side Processing**: For datasets that shouldn't live in the browser at all — see [Server-Side Processing](#server-side-processing)

### Choosing an approach

| Dataset size | Approach |
| --- | --- |
| Up to ~25K records | Client-side, all features enabled |
| ~10K–50K records | Add `virtualization: true` (requires fixed `height`, replaces pagination) |
| Beyond that | `serverSide: true` — the grid holds one page at a time |

---

## Internationalization (i18n)

SkarGrid comes with default English labels but supports full customization for any language. Override labels by passing a `labels` object in the options:

```javascript
const grid = new Skargrid('myGrid', {
  // ... other options
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

Available label keys:
- `searchPlaceholder` - Search input placeholder
- `clearFilters` - Clear filters button
- `exportCSV` / `exportXLSX` - Export buttons
- `filterTitle` - Filter dropdown title (supports `{title}` placeholder)
- `selectAll` - Select all checkbox in filters
- `filterSearchPlaceholder` - Search within filter dropdown
- `filterInputPlaceholder` - Input filter placeholder
- `clear` / `apply` - Filter buttons
- `showing` - Pagination info (supports `{start}`, `{end}`, `{total}`)
- `filteredOfTotal` - Filtered count suffix
- `itemsPerPage` - Page size selector label
- `columnConfigTitle` - Column config modal title
- `columnConfigDescription` - Column config description
- `restore` / `cancel` - Column config buttons
- `noRowsSelected` - Export error message
- `noData` - Empty state message
- `loading` - Loading state message

---

## API Reference

### Constructor

```javascript
new Skargrid(containerId, options)
```

### Options

| Option                | Type    | Default                  | Description                        |
| --------------------- | ------- | ------------------------ | ---------------------------------- |
| `data`                | Array   | `[]`                     | Array of data objects              |
| `columns`             | Array   | `[]`                     | Column configuration               |
| `pagination`          | Boolean | `false`                  | Enable pagination                  |
| `pageSize`            | Number  | `10`                     | Items per page                     |
| `pageSizeOptions`     | Array   | `[10,25,50,100]`         | Page size options                  |
| `sortable`            | Boolean | `false`                  | Enable global sorting              |
| `selectable`          | Boolean | `false`                  | Enable multi-row selection         |
| `searchable`          | Boolean | `false`                  | Enable global search               |
| `columnFilters`       | Boolean | `false`                  | Enable column filters              |
| `columnConfig`        | Boolean | `false`                  | Enable column config button        |
| `persistColumnConfig` | Boolean | `false`                  | Save column config in localStorage |
| `storageKey`          | String  | `'skargrid-config-{id}'` | localStorage key                   |
| `theme`               | String  | `'light'`                | Visual theme: 'light' or 'dark'    |
| `className`           | String  | `'skargrid'`             | Table CSS class                    |
| `exportCSV`           | Boolean | `false`                  | Enable CSV export button           |
| `exportXLSX`          | Boolean | `false`                  | Enable XLSX export button          |
| `exportFilename`      | String  | `'skargrid-export'`      | Base filename for exports          |
| `allowUnsafeHtml`     | Boolean | `false`                  | Treat `render()`/`formatter()` string results as HTML instead of plain text (see [Security](#security)) |
| `persistState`        | Boolean | `false`                  | Persist/restore `getState()`/`setState()` via localStorage |
| `stateStorageKey`     | String  | `'skargrid-state-{id}'`  | localStorage key for `persistState` |
| `stateVersion`        | Number  | `1`                      | Saved state with a different version is discarded |
| `footerAggregates`    | Boolean | `false`                  | Show a `<tfoot>` row with each column's `aggregate` value |
| `serverSide`          | Boolean | `false`                  | Delegate pagination/sorting/filtering/search to the server (see [Server-Side Processing](#server-side-processing)) |
| `totalRecords`        | Number  | `0`                      | Total row count on the server; update it with `setTotalRecords()` |

### Column Configuration

```javascript
{
    field: 'name',           // Data object field (required)
    title: 'Full Name',      // Header title
    width: '200px',          // Column width (optional)
    visible: true,           // Initial visibility (default: true)
    sortable: true,          // Allow sorting (default: false)
    sortType: 'string',      // Sort type: 'string', 'number', 'date'
    filterable: true,        // Show filter icon (default: false)
    filterType: 'text',      // Type: 'text', 'number', 'date', 'select'
    frozen: true,            // Sticks the column to the left during horizontal scroll (default: false).
                              // Must form a contiguous prefix (from the first data column, after the
                              // selection checkbox, if any) — a frozen column after a non-frozen one is
                              // ignored with a console.warn instead of applied incorrectly.
    render: (value, row) => { // Custom formatting — returned text is safe by default (textContent)
        return value.toUpperCase();
    }
    // Need actual HTML/DOM (badges, icons)? Prefer returning a Node — always treated as safe:
    // render: (value) => {
    //     const span = document.createElement('span');
    //     span.style.color = 'blue';
    //     span.textContent = value;
    //     return span;
    // }
    // Returning an HTML string instead of a Node requires an explicit opt-in,
    // since it's your responsibility to keep it free of untrusted input:
    // allowUnsafeHtml: true
    aggregate: 'sum',         // Footer value (requires options.footerAggregates: true).
                              // Built-in: 'sum' | 'avg' | 'count' | 'min' | 'max', or a
                              // custom function (rows, field) => value. Computed over
                              // filteredData (respects search/filters, not just the current page).
    aggregateFormatter: (value, rows) => `$${value.toFixed(2)}`, // optional, formats the footer cell
}
```

### Security

`column.render()`/`column.formatter()` return values are treated as **plain text by default** (`textContent`) — HTML tags in the string are not interpreted, so untrusted data (user input, API responses) can't inject markup or scripts. There are two safe ways to render actual HTML/DOM:

1. **Preferred:** return a `Node` (e.g. `document.createElement(...)`) — always attached safely, regardless of any flag.
2. Return an HTML string and set `allowUnsafeHtml: true`, either globally (all columns) or on the specific column that needs it. Only do this for content you control — never for unescaped user input.

```javascript
columns: [
  // Safe: Node, no flag needed
  { field: 'status', render: v => { const s = document.createElement('span'); s.textContent = v; return s; } },
  // Opt-in: HTML string, this column only
  { field: 'note', render: v => `<b>${v}</b>`, allowUnsafeHtml: true },
]
```

### Methods

```javascript
// Data management
table.updateData(newData);
const data = table.getData();

// Selection
const selected = table.getSelectedRows();
const indices = table.getSelectedIndices();
table.selectRows([0, 1, 2]);
table.clearSelection();

// Filters
table.clearAllFilters();
table.clearSearch();

// Navigation
table.goToPage(3);
table.changePageSize(25);

// Theme
table.setTheme('dark');

// Column config
table.saveColumnConfig();
table.loadColumnConfig();
table.clearSavedColumnConfig();

// Export
table.exportToCSV('data.csv');
table.exportSelectedToCSV('selected.csv');
table.exportToXLSX('data.xlsx');
table.exportSelectedToXLSX('selected.xlsx');

// State (see options.persistState for automatic localStorage persistence)
const state = table.getState();
table.setState(state);
table.clearPersistedState(); // only relevant when persistState: true

// Cleanup
table.destroy();
```

### Events

```javascript
// Listen to events
table.on('sortChange', (column, direction) => {
    console.log('Sorted by', column, direction); // direction: 'asc' | 'desc' | null
});

table.on('pageChange', (page) => {
    console.log('Current page:', page);
});

table.on('selectionChange', (selectedRows) => {
    console.log('Selection changed:', selectedRows);
});

table.on('filterChange', () => {
    console.log('Filters changed. Current rows:', table.getData().length);
});

table.on('rowClick', (row, index) => {
    console.log('Row clicked:', row, index);
});

// Same events as `options.onSortChange` / `onPageChange` / `onSelectionChange` /
// `onFilterChange` / `onRowClick` (constructor-time shortcut for on()).

// off(event, handler?) removes a specific listener, or all listeners for that event
table.off('sortChange', myHandler);
```

### Server-Side Processing

With `serverSide: true`, the grid stops paginating/sorting/filtering/searching locally: `data` is always assumed to be exactly the current page, already sorted and filtered by your server. The grid doesn't own the fetch — you listen to the same `pageChange`/`sortChange`/`filterChange` events, make the request yourself (any HTTP client, any library), and hand the result back with `updateData()` + `setTotalRecords()`:

```javascript
const table = new Skargrid('myTable', {
    data: [],
    columns: [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Name', sortable: true },
        { field: 'city', title: 'City', filterable: true },
    ],
    pagination: true,
    pageSize: 20,
    sortable: true,
    searchable: true,
    columnFilters: true,
    serverSide: true,
});

async function fetchPage() {
    table.showLoading();
    table.render(false);

    const response = await fetch(`/api/users?page=${table.currentPage}&pageSize=${table.options.pageSize}` +
        `&sort=${table.sortColumn ?? ''}&dir=${table.sortDirection ?? ''}&q=${table.searchText}`);
    const { data, total } = await response.json();

    table.hideLoading();
    table.updateData(data);      // the current page's rows — does NOT reset page/sort/search in server mode
    table.setTotalRecords(total); // recalculates total pages
}

table.on('pageChange', fetchPage);
table.on('sortChange', fetchPage);
table.on('filterChange', fetchPage); // covers search and column filters
fetchPage(); // initial load
```

**Known limitations:**
- Select-type column filters (`filterType: 'select'`) compute their checkbox list from `data` — in server-side mode that's only the current page, not the full distinct set of values. Fetch distinct values from your own endpoint if you need the complete list.
- Row selection uses page-relative indices; selecting across multiple server pages isn't tracked automatically.

---

## Theming & Styling

### Built-in Themes

```javascript
// Light theme (default)
const table = new Skargrid('myTable', {
    data, columns,
    theme: 'light'
});

// Dark theme
const table = new Skargrid('myTable', {
    data, columns,
    theme: 'dark'
});

// Toggle theme dynamically
table.setTheme('dark');
```

### Custom CSS Variables

```css
:root {
    /* Primary colors */
    --sg-primary: #2563eb;
    --sg-primary-hover: #1d4ed8;

    /* Background colors */
    --sg-bg: #ffffff;
    --sg-bg-secondary: #f8fafc;
    --sg-bg-hover: #f1f5f9;

    /* Text colors */
    --sg-text: #1e293b;
    --sg-text-secondary: #64748b;

    /* Border colors */
    --sg-border: #e2e8f0;
    --sg-border-hover: #cbd5e1;

    /* Accent colors */
    --sg-accent: #06b6d4;
    --sg-success: #10b981;
    --sg-warning: #f59e0b;
    --sg-error: #ef4444;
}
```

### Custom Styling Examples

```css
/* Custom table appearance */
.skargrid {
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    font-family: 'Inter', system-ui, sans-serif;
}

/* Custom header styling */
.skargrid thead th {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Custom row hover effects */
.skargrid tbody tr:hover {
    background: linear-gradient(90deg, #f8fafc 0%, #e2e8f0 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
```

---

## Build & Development

### Prerequisites
- Node.js 16+
- PowerShell (Windows) or Bash (Linux/Mac)

### Development Setup
```bash
# Clone repository
git clone https://github.com/ScarpelliniGilmar/skargrid.git
cd skargrid

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Project Structure
```
skargrid/
├── dist/                 # Built files (ESM, CJS, IIFE/CDN, CSS, source maps)
├── src/
│   ├── index.js         # Public entry point (imports core + CSS)
│   ├── core/
│   │   └── skargrid.js  # Lifecycle, central state, event bus, feature coordination
│   ├── features/        # One ES module per feature (search, filters, pagination,
│   │                    #   sort, selection, export, virtualization, frozen columns,
│   │                    #   footer aggregates, persistence, column config, ...)
│   └── css/             # Stylesheets and themes
├── types/               # TypeScript declarations (published)
├── tests/               # Jest (unit/integration) + Playwright (browser)
├── docs/                # VitePress documentation site + local playground
└── package.json
```

### Architecture

- **Core** (`src/core/skargrid.js`) owns lifecycle, the central `state` object, the typed event bus (`on`/`off`/`emit`) and coordination between features.
- **Features** (`src/features/`) are real ES modules imported directly by the core — one module per capability, communicating through the grid instance rather than reaching into each other.
- **Rendering is safe by default**: cell content goes through `textContent` unless a renderer returns a `Node` or `allowUnsafeHtml` is explicitly enabled.
- Each feature has dedicated tests; browser behavior is verified with Playwright in Chromium, Firefox and WebKit.

### Build Commands
```bash
# Full build (lint + tests + typecheck + bundle)
npm run build

# Bundle only
npm run build:bundle

# Watch mode (rebuild on change) + local playground server
npm run dev

# Watch mode only
npm run watch

# Lint code
npm run lint

# Run tests
npm run test

# Browser tests (Playwright, 3 engines)
npm run test:browser

# Documentation site (VitePress)
npm run docs:dev      # live-reload dev server
npm run docs:build    # static build (fails on dead links)
```

---

## Changelog

### [v2.0.0] - 2026-07-07
- **Core Refactor**: centralized state, typed event bus, and a safe-by-default renderer
- **Breaking**: `render()`/`formatter()` string returns are now plain text by default (XSS protection). Return a `Node` or opt in with `allowUnsafeHtml: true` — see the [migration guide](https://skargrid.com/migration/1x-to-community)
- **New features**: server-side processing, state persistence, frozen columns, footer aggregates
- **API**: `getState()`/`setState()`, event bus (`on`/`off`/`emit`), reliable `destroy()`
- **New docs**: https://skargrid.com — with `llms.txt` and JSON Schemas for AI agents
- Full details in [CHANGELOG.md](CHANGELOG.md)

### [v1.4.0] - 2025-11-16
- **Complete Modular Architecture Refactoring**: Major architectural overhaul with 13 specialized feature modules
- **Core Reduction**: Core module reduced by 25% (~450 lines) through systematic feature extraction
- **Feature Modules**: Complete separation of concerns with dedicated modules for:
  - Search & Filtering: `search.js`, `input-filter.js`, `select-filter.js`, `filter.js`
  - Data Presentation: `table-header.js`, `table-body.js`, `top-bar.js`, `virtualization.js`
  - Functionality: `pagination.js`, `sort.js`, `selection.js`, `export.js`, `columnConfig.js`
- **Performance Maintained**: All 21 tests passing, no performance degradation
- **Backward Compatibility**: Graceful degradation with feature availability checks
- **Bundle Size**: Updated to 63.85KB compressed (includes all features)
- **Enhanced Testability**: Each feature module can be tested independently
- **Build Flexibility**: Selective feature inclusion for custom lightweight builds

### [v1.3.0] - 2025-11-15
- **Website Launch**: Official website skargrid.com with comprehensive documentation, live examples, and performance benchmarks
- **Updated Performance Benchmarks**: Comprehensive testing results for v1.3.0 with optimizations for large datasets
- **Smart Select Filters**: Improved select filters to show only available options when other columns are filtered, with intelligent search behavior that isolates selections during search, enhancing user experience
- **Minor Fixes and Improvements**: Various bug fixes and code quality enhancements

### [v1.2.0] - 2025-01-13
- **Enhanced Documentation**: Complete README rewrite with practical examples
- **Live Examples**: Four ready-to-use HTML examples (basic, complete, React integration, performance test)
- **Performance Benchmarks**: Comprehensive testing with 25k+ records
- **Automated Testing**: Jest test suite with 21 tests covering all features
- **Code Quality**: ESLint implementation with 169 fixes applied
- **Package Optimization**: 66% size reduction (27.8KB compressed)

### [v1.1.0] - Major fixes & improvements
- **Filters & Export**: Filters and export now use rendered values
- **Sorting**: Added `sortType` option for correct data type sorting
- **XLSX Export**: Fixed to properly strip HTML from rendered values
- **Custom filenames**: Added `exportFilename` option
- **Theme fixes**: Fixed green theme sorting colors
- **Fixed height tables**: Pagination stays at bottom in fixed-height containers

### [v1.0.4] - Export & XLSX
- Pure-JS XLSX export without external dependencies
- CSV export remains unchanged
- Custom export filenames support

### [v1.0.3] - Docs & Examples
- Scrolling & layout fixes
- Demo stability improvements

### [v1.0.2] - UI/UX Improvements
- Sticky header background + dark theme header vars
- Filter dropdown behavior improved
- Checkbox/button accent and hover contrast fixes
- Header text capitalization consistency

### [v1.0.1] - Bug Fixes
- Columns accept both `render` and legacy `formatter` properties
- CSV export uses column renderer when present
- Select filters flatten array-valued cells
- Empty value filtering support
- "Select All" respects visible and available options

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards
- Follow ESLint configuration
- Write comprehensive tests
- Update documentation
- Maintain backward compatibility

---

## License

**MIT License** - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Gilmar A S Trindade

---

## Support the Project

If SkarGrid has been helpful to you, consider supporting the project:

- **Star this repository** on GitHub
- **Report bugs** and request features
- **Share** with your network
- **Contribute** code improvements

Your support helps keep the project active and evolving!

---