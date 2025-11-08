/**
 * ScarGrid - Módulo de Ordenação
 * Gerencia ordenação de colunas (ASC/DESC/None)
 */

const SortFeature = {
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
      let valueA = a[grid.sortColumn];
      let valueB = b[grid.sortColumn];

      // Aplica função de comparação customizada se existir
      if (column && column.sortCompare && typeof column.sortCompare === 'function') {
        return grid.sortDirection === 'asc' 
          ? column.sortCompare(valueA, valueB, a, b)
          : column.sortCompare(valueB, valueA, b, a);
      }

      // Tratamento de valores nulos/undefined
      if (valueA == null) valueA = '';
      if (valueB == null) valueB = '';

      // Detecta o tipo de dado e ordena apropriadamente
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        // Ordenação numérica
        return grid.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
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
   * Renderiza ícone de ordenação no header
   */
  renderSortIcon(grid, field) {
    const icon = document.createElement('span');
    icon.className = 'sort-icon';
    
    if (grid.sortColumn === field) {
      icon.textContent = grid.sortDirection === 'asc' ? '▲' : '▼';
    } else {
      icon.textContent = '⇅';
    }
    
    return icon;
  }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.SortFeature = SortFeature;
}

// Suporte para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SortFeature;
}
