/**
 * ScarGrid - Módulo de Filtros
 * Gerencia busca global e filtros por coluna
 */

const FilterFeature = {
  /**
   * Aplica todos os filtros (busca + filtros de coluna)
   */
  applyFilters(grid) {
    let filtered = [...grid.options.data];

    // Aplica busca global se houver texto
    if (grid.searchText) {
      const searchLower = grid.searchText.toLowerCase();
      
      filtered = filtered.filter(row => {
        // Busca em todas as colunas
        return grid.options.columns.some(column => {
          const value = row[column.field];
          if (value == null) return false;
          
          // Converte para string e compara
          return String(value).toLowerCase().includes(searchLower);
        });
      });
    }

    // Aplica filtros por coluna
    if (Object.keys(grid.columnFilterValues).length > 0) {
      filtered = filtered.filter(row => {
        // Todas as condições de filtro devem ser atendidas (AND)
        return Object.entries(grid.columnFilterValues).every(([field, filterValue]) => {
          const cellValue = row[field];
          
          const column = grid.options.columns.find(col => col.field === field);
          const filterType = column?.filterType || 'text';

          // Filtro por tipo
          if (filterType === 'select') {
            // Array de valores selecionados (checkboxes)
            if (Array.isArray(filterValue)) {
              return filterValue.includes(cellValue);
            }
            return String(cellValue) === String(filterValue);
          } else if (filterType === 'number') {
            if (!filterValue) return true;
            if (cellValue == null) return false;
            return Number(cellValue) === Number(filterValue);
          } else if (filterType === 'date') {
            if (!filterValue) return true;
            if (cellValue == null) return false;
            return String(cellValue).startsWith(filterValue);
          } else {
            // text - busca parcial case-insensitive
            if (!filterValue) return true;
            if (cellValue == null) return false;
            return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
          }
        });
      });
    }

    grid.filteredData = filtered;
  },

  /**
   * Manipula a busca de texto
   */
  handleSearch(grid, searchText) {
    grid.searchText = searchText.trim();
    grid.currentPage = 1;
    
    // Aplica filtros e renderiza de forma otimizada
    this.applyFilters(grid);
    grid.calculatePagination();
    grid.render(false); // false = update rápido
    grid.updateClearFiltersButton();
  },

  /**
   * Limpa a busca
   */
  clearSearch(grid) {
    grid.searchText = '';
    grid.currentPage = 1;
    this.applyFilters(grid);
    grid.calculatePagination();
    grid.render();
  },

  /**
   * Manipula filtro por coluna (text/number/date)
   */
  handleColumnFilter(grid, field, value) {
    if (value) {
      grid.columnFilterValues[field] = value;
    } else {
      delete grid.columnFilterValues[field];
    }
    
    grid.currentPage = 1;
    this.applyFilters(grid);
    grid.calculatePagination();
    grid.render(false);
    grid.updateClearFiltersButton();
  },

  /**
   * Manipula filtro de checkbox (select)
   */
  handleColumnFilterCheckbox(grid, field) {
    const allValues = this.getUniqueColumnValues(grid, field);
    const selected = grid.columnFilterSelected[field] || [];
    
    // Se todos estão selecionados, não filtra
    if (selected.length === allValues.length) {
      delete grid.columnFilterValues[field];
    } else {
      grid.columnFilterValues[field] = selected;
    }
    
    grid.currentPage = 1;
    this.applyFilters(grid);
    grid.calculatePagination();
    grid.render(false);
    grid.updateClearFiltersButton();
  },

  /**
   * Limpa todos os filtros de coluna
   */
  clearColumnFilters(grid) {
    grid.columnFilterValues = {};
    grid.currentPage = 1;
    this.applyFilters(grid);
    grid.calculatePagination();
    grid.render(false);
  },

  /**
   * Limpa TODOS os filtros (busca + filtros de coluna)
   */
  clearAllFilters(grid) {
    // Limpa busca global
    grid.searchText = '';
    const searchInput = grid.container.querySelector('.tablejs-search-input');
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Limpa filtros de coluna
    grid.columnFilterValues = {};
    grid.columnFilterSelected = {};
    
    // Reseta valores padrão para select types
    grid.options.columns.forEach(column => {
      if (column.filterable !== false && column.filterType === 'select') {
        const uniqueValues = this.getUniqueColumnValues(grid, column.field);
        grid.columnFilterSelected[column.field] = [...uniqueValues];
      }
    });
    
    // Fecha dropdown aberto
    if (grid.openFilterDropdown) {
      grid.openFilterDropdown.remove();
      grid.openFilterDropdown = null;
    }
    
    grid.currentPage = 1;
    this.applyFilters(grid);
    grid.calculatePagination();
    grid.render();
  },

  /**
   * Obtém valores únicos de uma coluna
   */
  getUniqueColumnValues(grid, field) {
    const values = grid.options.data
      .map(row => row[field])
      .filter(value => value != null);
    
    return [...new Set(values)].sort();
  },

  /**
   * Conta filtros ativos para um campo
   */
  getActiveFilterCount(grid, field) {
    const allValues = this.getUniqueColumnValues(grid, field);
    const selected = grid.columnFilterSelected[field] || [];
    
    // Retorna quantos estão desmarcados
    return allValues.length - selected.length;
  }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.FilterFeature = FilterFeature;
}

// Suporte para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FilterFeature;
}
