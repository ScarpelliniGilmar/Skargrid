/**
 * Skargrid - Módulo de Ordenação
 * Gerencia ordenação de colunas (ASC/DESC/None)
 */

const SortFeature = {
  /**
   * Obtém o valor para ordenação (usa valor original, não renderizado)
   */
  getSortValue(grid, row, column) {
    const value = row[column.field];
    
    // Para ordenação, usa o valor original do campo
    // (não aplica render/formatters para evitar ordenação por strings formatadas)
    
    return value;
  },
  /**
   * Manipula clique em coluna para ordenar
   */
  handleSort(grid, field) {
    // Se já está ordenando por esta coluna, inverte a direção
    if (grid.sortColumn === field) {
      if (grid.sortDirection === 'asc') {
        grid.sortDirection = 'desc';
      } else if (grid.sortDirection === 'desc') {
        // Terceiro clique remove a ordenação
        grid.sortColumn = null;
        grid.sortDirection = null;
        grid.options.data = [...grid.originalData];
      }
    } else {
      // Nova coluna, começa com ascendente
      grid.sortColumn = field;
      grid.sortDirection = 'asc';
    }

    // Aplica a ordenação se houver coluna selecionada
    if (grid.sortColumn) {
      this.sortData(grid);
    }

    // Volta para a primeira página após ordenar
    grid.currentPage = 1;
    grid.calculatePagination();
    grid.render(false); // Update rápido
  },

  /**
   * Ordena os dados pela coluna e direção atuais
   */
  sortData(grid) {
    const column = grid.options.columns.find(col => col.field === grid.sortColumn);
    
    grid.options.data.sort((a, b) => {
      let valueA = this.getSortValue(grid, a, column);
      let valueB = this.getSortValue(grid, b, column);

      // Aplica função de comparação customizada se existir
      if (column && column.sortCompare && typeof column.sortCompare === 'function') {
        return grid.sortDirection === 'asc' 
          ? column.sortCompare(valueA, valueB, a, b)
          : column.sortCompare(valueB, valueA, b, a);
      }

      // Tratamento de valores nulos/undefined
      if (valueA === null) {valueA = '';}
      if (valueB === null) {valueB = '';}

      // Determina o tipo de ordenação
      const sortType = column?.sortType || this.inferSortType(valueA, valueB);

      if (sortType === 'number') {
        const numA = parseFloat(valueA) || 0;
        const numB = parseFloat(valueB) || 0;
        return grid.sortDirection === 'asc' ? numA - numB : numB - numA;
      } else if (sortType === 'date') {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
        const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
        return grid.sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
      } else {
        // Ordenação de string (case-insensitive)
        const strA = String(valueA).toLowerCase();
        const strB = String(valueB).toLowerCase();
        
        if (grid.sortDirection === 'asc') {
          return strA.localeCompare(strB);
        } else {
          return strB.localeCompare(strA);
        }
      }
    });

    // Reaplica filtros após ordenar
    grid.applyFilters();
  },

  /**
   * Infere o tipo de ordenação baseado nos valores
   */
  inferSortType(valueA, valueB) {
    // Tenta detectar números
    if (!isNaN(valueA) && !isNaN(valueB) && valueA !== '' && valueB !== '') {
      return 'number';
    }
    
    // Tenta detectar datas (formato ISO ou comum)
    const dateRegex = /^\d{4}-\d{2}-\d{2}/;
    if (dateRegex.test(String(valueA)) && dateRegex.test(String(valueB))) {
      return 'date';
    }
    
    // Default para string
    return 'string';
  },
  renderSortIcon(grid, field) {
    const icon = document.createElement('span');
    icon.className = 'sort-icon';
    
    if (grid.sortColumn === field) {
      icon.textContent = grid.sortDirection === 'asc' ? '▲' : '▼';
    } else {
      icon.textContent = '⇅';
    }
    
    return icon;
  },
};

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.SortFeature = SortFeature;
}

// Suporte para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SortFeature;
}
