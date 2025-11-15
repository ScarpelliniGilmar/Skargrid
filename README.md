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

- 🌐 **Internationalization (i18n)** - Default English labels, fully customizable for any language
- 🎨 **Column Configuration** - Drag & drop to reorder, show/hide columns with persistence
- 🗄️ **Smart Persistence** - Saves user preferences in localStorage automatically
- 🌓 **Theme Support** - Light/Dark theme with smooth transitions and custom variables
- 🔄 **Cascading Filters** - Excel-style filters with unavailable values disabled
- 🌍 **Accent-Insensitive Search** - Automatically handles accents (José = jose)
- ↔️ **Horizontal Scroll** - Custom scrollbar for wide tables with fixed columns
- 📦 **Single Bundle** - Only 2 files (JS + CSS) - **27.8KB compressed**
- 🎯 **Zero Dependencies** - Pure Vanilla JavaScript, framework agnostic
- ⚡ **High Performance** - Optimized for datasets up to 25,000+ records
- 🧪 **Automated Testing** - 21 comprehensive tests covering all features
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

---

## ⚡ Performance Benchmarks

### 📈 Test Results (v1.2.0)

| Dataset Size | Render Time | Status | Notes |
|-------------|-------------|--------|-------|
| 1.000 rows | ~26ms | ✅ Excellent | Instant rendering |
| 5.000 rows | ~35ms | ✅ Excellent | Smooth performance |
| 10.000 rows | ~31ms | ✅ Excellent | Handles large datasets |
| 15.000 rows | ~17ms | ✅ Excellent | Optimized for scale |
| 20.000 rows | ~36ms | ✅ Excellent | Production ready |

### 🎯 Performance Features

- **Lazy Rendering**: Only visible rows are rendered
- **Optimized Filters**: Efficient search algorithms
- **Memory Management**: Automatic cleanup
- **Debounced Search**: Prevents excessive filtering
- **Virtual Scrolling**: Ready for 100k+ rows (future feature)

### 💡 Performance Tips

```javascript
// For large datasets (>10k rows)
const table = new Skargrid('myTable', {
    data: largeDataset,
    pagination: true,        // Required for large datasets
    pageSize: 50,           // Smaller pages = better performance
    searchable: true,       // Efficient search
    columnFilters: false,   // Disable if not needed
    selectable: false       // Disable if not needed
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

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `data` | Array | `[]` | Array of data objects |
| `columns` | Array | `[]` | Column configuration |
| `pagination` | Boolean | `false` | Enable pagination |
| `pageSize` | Number | `10` | Items per page |
| `pageSizeOptions` | Array | `[10,25,50,100]` | Page size options |
| `sortable` | Boolean | `false` | Enable global sorting |
| `selectable` | Boolean | `false` | Enable multi-row selection |
| `searchable` | Boolean | `false` | Enable global search |
| `columnFilters` | Boolean | `false` | Enable column filters |
| `columnConfig` | Boolean | `false` | Enable column config button |
| `persistColumnConfig` | Boolean | `false` | Save column config in localStorage |
| `storageKey` | String | `'skargrid-config-{id}'` | localStorage key |
| `theme` | String | `'light'` | Visual theme: 'light' or 'dark' |
| `className` | String | `'skargrid'` | Table CSS class |
| `exportCSV` | Boolean | `false` | Enable CSV export button |
| `exportXLSX` | Boolean | `false` | Enable XLSX export button |
| `exportFilename` | String | `'skargrid-export'` | Base filename for exports |

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