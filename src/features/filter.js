/**
 * Skargrid - Módulo de Filtros
 * Gerencia busca global e filtros por coluna
 */

const FilterFeature = {
  // Token interno para representar valores vazios (null/undefined/'')
  EMPTY_TOKEN: '__SG_EMPTY__',
  /**
   * Normaliza string removendo acentos para busca
   */
  normalizeString(str) {
    if (!str) return '';
    return String(str)
      .normalize('NFD') // Decompõe caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas
      .toLowerCase();
  },

  /**
   * Aplica todos os filtros (busca + filtros de coluna)
   */
  applyFilters(grid) {
    let filtered = [...grid.options.data];

    // Aplica busca global se houver texto
    if (grid.searchText) {
      const searchNormalized = this.normalizeString(grid.searchText);
      
      filtered = filtered.filter(row => {
        // Busca em todas as colunas
        return grid.options.columns.some(column => {
          const value = row[column.field];
          if (value == null) return false;
          
          // Normaliza valor e compara sem acentos
          const valueNormalized = this.normalizeString(value);
          return valueNormalized.includes(searchNormalized);
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
            // Valores selecionados (checkboxes) podem conter o token EMPTY_TOKEN
            // cellValue pode ser primitivo, nulo, ou array (ex: grupo múltiplo)
            if (Array.isArray(filterValue)) {
              // Caso cellValue seja array -> verifica interseção
              if (Array.isArray(cellValue)) {
                // Se houver pelo menos um elemento do cellValue presente em filterValue -> aceita
                return cellValue.some(cv => filterValue.includes(cv));
              }

              // Se cellValue é vazio/nulo -> aceita se EMPTY_TOKEN foi selecionado
              if (cellValue === null || cellValue === undefined || cellValue === '' ) {
                return filterValue.includes(this.EMPTY_TOKEN);
              }

              // Comparação direta para valores primitivos
              return filterValue.includes(cellValue);
            }

            // filterValue é um valor único
            if (cellValue === null || cellValue === undefined || cellValue === '') {
              return String(filterValue) === String(this.EMPTY_TOKEN);
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
            // text - busca parcial case-insensitive com normalização
            if (!filterValue) return true;
            if (cellValue == null) return false;
            const cellNormalized = this.normalizeString(cellValue);
            const filterNormalized = this.normalizeString(filterValue);
            return cellNormalized.includes(filterNormalized);
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
    
    // Fecha dropdown aberto (evita bug de posicionamento)
    if (grid.openFilterDropdown) {
      grid.openFilterDropdown.remove();
      grid.openFilterDropdown = null;
      if (grid.removeScrollListeners) {
        grid.removeScrollListeners();
      }
    }
    
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
    
    // Fecha dropdown aberto
    if (grid.openFilterDropdown) {
      grid.openFilterDropdown.remove();
      grid.openFilterDropdown = null;
      if (grid.removeScrollListeners) {
        grid.removeScrollListeners();
      }
    }
    
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
    const searchInput = grid.container.querySelector('.skargrid-search-input');
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
    
    // Remove listeners de scroll
    if (grid.removeScrollListeners) {
      grid.removeScrollListeners();
    }
    
    grid.currentPage = 1;
    this.applyFilters(grid);
    grid.calculatePagination();
    grid.render();
  },

  /**
   * Obtém valores únicos de uma coluna (dos dados originais)
   */
  getUniqueColumnValues(grid, field) {
    const values = grid.options.data.map(row => row[field]);

    const unique = new Set();
    let hasEmpty = false;

    values.forEach(v => {
      if (v === null || v === undefined || v === '') {
        hasEmpty = true;
      } else if (Array.isArray(v)) {
        v.forEach(elem => {
          if (elem !== null && elem !== undefined && elem !== '') unique.add(elem);
        });
      } else {
        unique.add(v);
      }
    });

    const result = [...unique].sort();
    // Se houver valores vazios, adiciona token especial no início
    if (hasEmpty) {
      result.unshift(this.EMPTY_TOKEN);
    }
    return result;
  },

  /**
   * Obtém valores disponíveis de uma coluna baseado nos dados filtrados
   * (exclui o filtro da própria coluna para mostrar o que está disponível)
   */
  getAvailableColumnValues(grid, field) {
    // Pega dados filtrados, mas IGNORANDO o filtro da coluna atual
    let data = [...grid.options.data];

    // Aplica busca global
    if (grid.searchText) {
      const searchNormalized = this.normalizeString(grid.searchText);
      data = data.filter(row => {
        return grid.options.columns.some(column => {
          const value = row[column.field];
          if (value == null) return false;
          const valueNormalized = this.normalizeString(value);
          return valueNormalized.includes(searchNormalized);
        });
      });
    }

    // Aplica filtros de OUTRAS colunas (não a atual)
    if (Object.keys(grid.columnFilterValues).length > 0) {
      data = data.filter(row => {
        return Object.entries(grid.columnFilterValues).every(([filterField, filterValue]) => {
          // Ignora o filtro da coluna atual
          if (filterField === field) return true;
          
          const cellValue = row[filterField];
          const column = grid.options.columns.find(col => col.field === filterField);
          const filterType = column?.filterType || 'text';

          if (filterType === 'select') {
            if (Array.isArray(filterValue)) {
              // Caso cellValue seja array -> verifica interseção
              if (Array.isArray(cellValue)) {
                return cellValue.some(cv => filterValue.includes(cv));
              }

              // Se cellValue é vazio/nulo -> aceita se EMPTY_TOKEN foi selecionado
              if (cellValue === null || cellValue === undefined || cellValue === '' ) {
                return filterValue.includes(this.EMPTY_TOKEN);
              }

              // Comparação direta para valores primitivos
              return filterValue.includes(cellValue);
            }

            // filterValue é um valor único
            if (cellValue === null || cellValue === undefined || cellValue === '') {
              return String(filterValue) === String(this.EMPTY_TOKEN);
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
            if (!filterValue) return true;
            if (cellValue == null) return false;
            const cellNormalized = this.normalizeString(cellValue);
            const filterNormalized = this.normalizeString(filterValue);
            return cellNormalized.includes(filterNormalized);
          }
        });
      });
    }

    // Extrai valores únicos da coluna nos dados filtrados
    const values = data.map(row => row[field]);

    const unique = new Set();
    let hasEmpty = false;

    values.forEach(v => {
      if (v === null || v === undefined || v === '') {
        hasEmpty = true;
      } else if (Array.isArray(v)) {
        v.forEach(elem => {
          if (elem !== null && elem !== undefined && elem !== '') unique.add(elem);
        });
      } else {
        unique.add(v);
      }
    });

    const result = [...unique].sort();
    if (hasEmpty) {
      result.unshift(this.EMPTY_TOKEN);
    }
    return result;
  },

  /**
   * Verifica se uma coluna tem filtro ativo
   * @returns {boolean} true se há filtro ativo (nem todos valores estão selecionados)
   */
  hasActiveFilter(grid, field) {
    const column = grid.options.columns.find(col => col.field === field);
    if (!column || column.filterable === false) return false;

    if (column.filterType === 'select') {
      const allValues = this.getUniqueColumnValues(grid, field);
      const selected = grid.columnFilterSelected[field];
      
      // Se não foi inicializado ainda, considera sem filtro
      if (!selected || selected.length === 0) return false;
      
      // Se todos estão selecionados, não há filtro
      // Se algum foi desmarcado, há filtro ativo
      return selected.length < allValues.length;
    } else {
      // Para text, number, date: há filtro se tem valor
      return !!grid.columnFilterValues[field];
    }
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
