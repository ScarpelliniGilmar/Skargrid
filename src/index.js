/**
 * ScarGrid - Biblioteca JavaScript para tabelas interativas
 * @version 0.7.0
 * @author Gilmar A S Trindade
 * @license MIT
 * 
 * Ponto de entrada principal da biblioteca
 * Este arquivo importa e coordena todos os módulos
 */

// Importa features (quando disponíveis via ES modules)
let PaginationFeature, SortFeature, SelectionFeature, FilterFeature;

// Tenta importar se estivermos em ambiente de módulos
if (typeof window === 'undefined') {
  // Node.js / Build environment
  try {
    PaginationFeature = require('./features/pagination.js');
    SortFeature = require('./features/sort.js');
    SelectionFeature = require('./features/selection.js');
    FilterFeature = require('./features/filter.js');
  } catch (e) {
    // Features não disponíveis, continuaremos sem elas
  }
} else {
  // Browser - features são carregadas via <script> tags
  PaginationFeature = window.PaginationFeature;
  SortFeature = window.SortFeature;
  SelectionFeature = window.SelectionFeature;
  FilterFeature = window.FilterFeature;
}

/**
 * Classe principal do ScarGrid
 * Importa a implementação do core e adiciona coordenação de features
 */
export class ScarGrid {
  constructor(containerId, options = {}) {
    // Se ScarGridCore existir (core carregado via script), usa-o
    if (typeof window !== 'undefined' && window.ScarGridCore) {
      // Usa a classe do core diretamente
      const CoreClass = window.ScarGridCore;
      const instance = new CoreClass(containerId, options);
      
      // Copia todas as propriedades e métodos para esta instância
      Object.setPrototypeOf(this, instance);
      Object.assign(this, instance);
      
      return this;
    }

    // Caso contrário, implementação básica standalone
    this.container = typeof containerId === 'string' 
      ? document.getElementById(containerId)
      : containerId;
    
    if (!this.container) {
      throw new Error(`Container "${containerId}" não encontrado`);
    }

    // Configurações
    this.options = {
      data: options.data || [],
      columns: options.columns || [],
      className: options.className || 'tablejs',
      pagination: options.pagination !== undefined ? options.pagination : false,
      pageSize: options.pageSize || 10,
      pageSizeOptions: options.pageSizeOptions || [10, 25, 50, 100],
      sortable: options.sortable !== undefined ? options.sortable : true,
      selectable: options.selectable !== undefined ? options.selectable : false,
      searchable: options.searchable !== undefined ? options.searchable : false,
      columnFilters: options.columnFilters !== undefined ? options.columnFilters : false,
      ...options
    };

    // Estado
    this.currentPage = 1;
    this.totalPages = 1;
    this.sortColumn = null;
    this.sortDirection = null;
    this.originalData = [...this.options.data];
    this.selectedRows = new Set();
    this.searchText = '';
    this.filteredData = [...this.options.data];
    this.columnFilterValues = {};
    this.columnFilterSelected = {};
    this.isLoading = false;
    this.openFilterDropdown = null;

    // Carrega features
    this._initFeatures();

    // Inicializa
    this.applyFilters();
    this.calculatePagination();
    this.render();
  }

  /**
   * Inicializa features disponíveis
   * @private
   */
  _initFeatures() {
    this.features = {
      pagination: PaginationFeature || (typeof window !== 'undefined' && window.PaginationFeature),
      sort: SortFeature || (typeof window !== 'undefined' && window.SortFeature),
      selection: SelectionFeature || (typeof window !== 'undefined' && window.SelectionFeature),
      filter: FilterFeature || (typeof window !== 'undefined' && window.FilterFeature)
    };

    // Inicializa filtros select
    this.options.columns.forEach(column => {
      if (column.filterable !== false && column.filterType === 'select') {
        const uniqueValues = this.getUniqueColumnValues(column.field);
        this.columnFilterSelected[column.field] = [...uniqueValues];
      }
    });
  }

  // ==========================================
  // MÉTODOS DELEGADOS (stubs - implementação no core)
  // ==========================================

  render(fullRender = true) {
    console.warn('ScarGrid: método render() precisa do core scargrid.js carregado');
  }

  calculatePagination() {
    if (this.features.pagination) {
      this.features.pagination.calculatePagination(this);
    }
  }

  getPageData() {
    if (this.features.pagination) {
      return this.features.pagination.getPageData(this);
    }
    return this.filteredData;
  }

  applyFilters() {
    if (this.features.filter) {
      this.features.filter.applyFilters(this);
    }
  }

  handleSort(field) {
    if (this.features.sort) {
      this.features.sort.handleSort(this, field);
    }
  }

  getUniqueColumnValues(field) {
    if (this.features.filter) {
      return this.features.filter.getUniqueColumnValues(this, field);
    }
    return [...new Set(
      this.options.data
        .map(row => row[field])
        .filter(val => val != null && val !== '')
    )].sort();
  }

  // API pública
  updateData(newData) {
    this.options.data = newData;
    this.originalData = [...newData];
    this.currentPage = 1;
    this.sortColumn = null;
    this.sortDirection = null;
    this.selectedRows.clear();
    this.searchText = '';
    this.applyFilters();
    this.calculatePagination();
    this.render();
  }

  getData() {
    return this.options.data;
  }

  getSelectedRows() {
    if (this.features.selection) {
      return this.features.selection.getSelectedRows(this);
    }
    return [];
  }

  clearSelection() {
    if (this.features.selection) {
      this.features.selection.clearSelection(this);
    }
  }

  clearAllFilters() {
    if (this.features.filter) {
      this.features.filter.clearAllFilters(this);
    }
  }

  destroy() {
    this.container.innerHTML = '';
  }
}

// Exporta como default
export default ScarGrid;

// Para uso direto no browser via <script type="module">
if (typeof window !== 'undefined') {
  window.ScarGrid = ScarGrid;
}

// Exporta helpers para criação de extensões
export function enableSort(grid) {
  if (SortFeature || window.SortFeature) {
    grid.features.sort = SortFeature || window.SortFeature;
    return true;
  }
  return false;
}

export function enableFilter(grid) {
  if (FilterFeature || window.FilterFeature) {
    grid.features.filter = FilterFeature || window.FilterFeature;
    return true;
  }
  return false;
}

export function enablePagination(grid) {
  if (PaginationFeature || window.PaginationFeature) {
    grid.features.pagination = PaginationFeature || window.PaginationFeature;
    return true;
  }
  return false;
}

export function enableSelection(grid) {
  if (SelectionFeature || window.SelectionFeature) {
    grid.features.selection = SelectionFeature || window.SelectionFeature;
    return true;
  }
  return false;
}
