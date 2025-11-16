# <img src="docs/img/logos/skargrid-logo-full.svg" alt="Skargrid logo" style="height:120px;">

> Modern JavaScript library for interactive tables with cascading filters, accent-insensitive search, and advanced features

[![npm version](https://img.shields.io/npm/v/skargrid.svg)](https://www.npmjs.com/package/skargrid)
[![npm downloads](https://img.shields.io/npm/dw/skargrid.svg)](https://www.npmjs.com/package/skargrid)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/skargrid)](https://bundlephobia.com/package/skargrid)

**Website:** [https://skargrid.com](https://skargrid.com) •
**🇧🇷 [Leia em Português](README.pt-br.md)**

---

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [📸 Visual Examples](#-visual-examples)
- [🚀 Quick Start](#-quick-start)
- [📖 Complete Examples](#-complete-examples)
- [⚡ Performance Benchmarks](#-performance-benchmarks)
- [🎯 API Reference](#-api-reference)
- [🎨 Theming & Styling](#-theming--styling)
- [🔧 Build & Development](#-build--development)
- [📋 Changelog](#-changelog)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Key Features

- 🌐 **Internationalization (i18n)** ⭐ - Professional labels system, fully customizable for any language (Portuguese, Spanish, French, etc.)
- ⚡ **Virtual Scrolling** ⭐ - High-performance rendering for large datasets (10k-500k+ rows) with smooth scrolling
- 🎨 **Column Configuration** - Drag & drop to reorder, show/hide columns with persistence
- 🗄️ **Smart Persistence** - Saves user preferences in localStorage automatically
- 🌓 **Theme Support** - Light/Dark theme with smooth transitions and custom variables
- 🔄 **Smart Select Filters**: Improved select filters to show only available options when other columns are filtered, with intelligent search behavior that isolates selections during search
- 🌍 **Accent-Insensitive Search** - Automatically handles accents (José = jose)
- ↔️ **Horizontal Scroll** - Custom scrollbar for wide tables with fixed columns
- 📦 **Single Bundle** - Only 2 files (JS + CSS) - **27.8KB compressed**
- 🎯 **Zero Dependencies** - Pure Vanilla JavaScript, framework agnostic
- 🧪 **High Performance** - Optimized for datasets up to 25,000+ records
- 📊 **Export Support** - CSV and native XLSX export without external dependencies

---

## 📸 Visual Examples

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

## ⚠️ Performance Guidelines & Limitations

### 🟢 Recommended Usage (Optimal Performance)
- **✅ Datasets**: 100 - 25,000 records
- **✅ Virtual Scrolling**: 10,000+ records with `virtualization: true`
- **✅ Client-side Filtering**: Up to 50,000 records
- **✅ All Features**: Search, sort, filters, export work perfectly

### 🟡 Large Datasets (50K - 500K records)
- **⚠️ Virtual Scrolling Required**: Essential for smooth performance
- **⚠️ Filtering Performance**: 200-1000ms for 500K records (acceptable for demos)
- **⚠️ Memory Usage**: 50-200MB depending on browser
- **❌ Not Recommended**: For production with 500K+ records

### 🔴 Enterprise Datasets (1M+ records)
- **❌ Client-side Only**: Not suitable for million+ records
- **✅ Recommended**: Server-side pagination + SkarGrid
- **📋 Implementation**: See `docs/realistic-server-pagination.html`
- **🚀 Performance**: < 50ms responses, < 10MB memory usage

### 💡 Best Practices

**For Large Datasets:**
```javascript
// ✅ Recommended: Server-side approach
const grid = new Skargrid('grid', {
  data: pageData, // Only current page (100 records)
  pagination: true,
  // Server handles: filtering, sorting, pagination
});
```

**For Small Datasets:**
```javascript
// ✅ Perfect: Client-side everything
const grid = new Skargrid('grid', {
  data: fullDataset, // Up to 25K records
  searchable: true,
  sortable: true,
  columnFilters: true,
  // All features work instantly
});
```

**See Real Examples:**
- `docs/realistic-server-pagination.html` - 50K records, server-side
- `docs/massive-dataset-test.html` - 500K records, client-side limits

---

## 🚀 Quick Start

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

## 📖 Complete Examples

### 🏆 Full-Featured Table

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
                render: (value) => value ? '✅ Ativo' : '❌ Inativo'
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

### 📊 Data Management Example

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

### 🎨 Advanced Styling

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

### 🚀 Virtual Scrolling Example

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

### 🌐 Internationalization Example

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

### 📊 Massive Dataset Example (500K Rows)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Massive Dataset Demo</title>
    <link rel="stylesheet" href="dist/skargrid.min.css">
</head>
<body>
    <div id="massiveTable"></div>

    <script src="dist/skargrid.min.js"></script>
    <script>
        // Generate 500,000 rows for extreme testing
        function generateMassiveDataset() {
            const data = [];
            const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
            const companies = ['TechCorp', 'DataSys', 'InfoTech', 'WebSolutions', 'CloudNet'];
            const ageGroups = ['18-25', '26-35', '36-45', '46-55', '55+'];

            for (let i = 1; i <= 500000; i++) {
                data.push({
                    id: i,
                    name: `Person ${i}`,
                    age: Math.floor(Math.random() * 50) + 18,
                    ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
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
            { field: 'ageGroup', title: 'Age Group', filterType: 'select' },
            { field: 'city', title: 'City', filterType: 'select' },
            { field: 'company', title: 'Company', filterType: 'select' },
            { field: 'salary', title: 'Salary', sortable: true, render: v => `$${v.toLocaleString()}` }
        ];

        // Initialize with advanced filters
        const table = new Skargrid('massiveTable', {
            data: generateMassiveDataset(),
            columns: columns,
            virtualization: true,
            searchable: true,
            sortable: true,
            columnFilters: true,
            height: '600px',
            pageSize: 50
        });
    </script>
</body>
</html>
```

### 🖥️ Server-Side Pagination Example

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

## ⚡ Performance Benchmarks

### 📈 Test Results (v1.3.0)

| Dataset Size     | Render Time | Memory Usage | Status      | Notes                    |
| ---------------- | ----------- | ------------ | ----------- | ------------------------ |
| 1.000 rows       | ~26ms       | < 5MB        | ✅ Excellent | Instant rendering        |
| 5.000 rows       | ~35ms       | < 8MB        | ✅ Excellent | Smooth performance       |
| 10.000 rows      | ~31ms       | < 12MB       | ✅ Excellent | Virtual scrolling active |
| 15.000 rows      | ~17ms       | < 15MB       | ✅ Excellent | Optimized for scale      |
| 20.000 rows      | ~36ms       | < 18MB       | ✅ Excellent | Production ready         |
| **50.000 rows**  | ~45ms       | < 25MB       | ✅ Excellent | Server-side recommended  |
| **500.000 rows** | ~200ms      | < 50MB       | ⚠️ Extreme   | Browser limits test      |

### 🎯 Performance Features

- **Virtual Scrolling**: Only visible rows rendered (10k+ rows support)
- **Lazy Rendering**: On-demand row rendering with buffer
- **Optimized Filters**: Efficient search algorithms with debouncing
- **Memory Management**: Automatic cleanup and garbage collection
- **Smart Scroll**: Auto-adjusts when filters are applied
- **Debounced Search**: Prevents excessive filtering operations

### 💡 Performance Guidelines

#### ✅ Recommended Usage (Optimal Performance)
```javascript
// Best for: 100 - 25,000 records
const grid = new Skargrid('myTable', {
    data: dataset,
    searchable: true,
    sortable: true,
    columnFilters: true,
    // All features work instantly
});
```

#### 🚀 Large Datasets (25K - 100K records)
```javascript
// Best for: 10,000 - 100,000 records
const grid = new Skargrid('myTable', {
    data: largeDataset,
    virtualization: true,    // Essential for performance
    searchable: true,
    sortable: true,
    columnFilters: true,
    // Virtual scrolling maintains smooth performance
});
```

#### 🏢 Enterprise Datasets (100K+ records)
```javascript
// Recommended for: 1M+ records
// Use server-side pagination (see realistic-server-pagination.html)
const grid = new Skargrid('myTable', {
    data: pageData,          // Only current page (100 records)
    pagination: true,
    // Server handles: filtering, sorting, pagination
});
```

---

## 🌐 Internationalization (i18n)

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

## 🎯 API Reference

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
    render: (value, row) => { // Custom formatting
        return `<span style="color: blue;">${value}</span>`;
    }
}
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

// Cleanup
table.destroy();
```

### Events

```javascript
// Listen to events
table.on('selectionChange', (selectedRows) => {
    console.log('Selection changed:', selectedRows);
});

table.on('filterChange', (filteredData) => {
    console.log('Data filtered:', filteredData.length, 'rows');
});

table.on('pageChange', (pageInfo) => {
    console.log('Page changed:', pageInfo);
});
```

---

## 🎨 Theming & Styling

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

## 🔧 Build & Development

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
├── dist/                 # Built files
│   ├── skargrid.min.js   # Minified JavaScript (27.8KB)
│   ├── skargrid.min.css  # Minified CSS
│   └── themes/           # Theme files
├── src/                  # Source code
│   ├── core/            # Main library
│   ├── features/        # Feature modules
│   └── css/             # Stylesheets
├── tests/               # Test files
├── docs/                # Documentation & examples
└── package.json         # Project configuration
```

### Architecture

Skargrid uses a modular architecture where features are separated into individual modules for better maintainability and extensibility:

#### Core Module (`src/core/skargrid.js`)
- Main table rendering and UI logic
- Feature integration and initialization
- Base functionality (sorting, pagination, etc.)

#### Feature Modules (`src/features/`)
- **`filter.js`** - Core filtering logic and utilities
- **`select-filter.js`** - Advanced select dropdown filters with search
- **`pagination.js`** - Pagination controls and logic
- **`sort.js`** - Column sorting functionality
- **`selection.js`** - Row selection and management
- **`export.js`** - CSV and XLSX export capabilities
- **`columnConfig.js`** - Column visibility and reordering

#### Feature Integration
Features are loaded globally and checked with `typeof FeatureName !== 'undefined'` for graceful degradation. Each feature can be:
- **Included** in the build for full functionality
- **Excluded** for custom lightweight builds
- **Extended** by developers for custom features

### Build Commands
```bash
# Development build
npm run build:dev

# Production build
npm run build

# Watch mode
npm run watch

# Lint code
npm run lint

# Run tests
npm run test

# Generate documentation
npm run docs
```

---

## 📋 Changelog

### [v1.3.0] - 2025-11-15
- **🌐 Website Launch**: Official website skargrid.com with comprehensive documentation, live examples, and performance benchmarks
- **📊 Updated Performance Benchmarks**: Comprehensive testing results for v1.3.0 with optimizations for large datasets
- **🔄 Smart Select Filters**: Improved select filters to show only available options when other columns are filtered, with intelligent search behavior that isolates selections during search, enhancing user experience
- **🔧 Minor Fixes and Improvements**: Various bug fixes and code quality enhancements

### [v1.2.0] - 2025-01-13
- **📚 Enhanced Documentation**: Complete README rewrite with practical examples
- **🎯 Live Examples**: Four ready-to-use HTML examples (basic, complete, React integration, performance test)
- **📊 Performance Benchmarks**: Comprehensive testing with 25k+ records
- **🧪 Automated Testing**: Jest test suite with 21 tests covering all features
- **🔧 Code Quality**: ESLint implementation with 169 fixes applied
- **📦 Package Optimization**: 66% size reduction (27.8KB compressed)

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

## 🤝 Contributing

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

## 📄 License

**MIT License** - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Gilmar A S Trindade

---

## 💝 Support the Project

If SkarGrid has been helpful to you, consider supporting the project:

- **⭐ Star this repository** on GitHub
- **🐛 Report bugs** and request features
- **📢 Share** with your network
- **💻 Contribute** code improvements

Your support helps keep the project active and evolving!

---