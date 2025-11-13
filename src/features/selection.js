/**
 * Skargrid - Módulo de Seleção
 * Gerencia checkbox e seleção múltipla de linhas
 */

const SelectionFeature = {
  /**
   * Alterna seleção de uma linha específica
   */
  toggleSelectRow(grid, index, selected) {
    if (selected) {
      grid.selectedRows.add(index);
    } else {
      grid.selectedRows.delete(index);
    }
    grid.render(false); // Update rápido
  },

  /**
   * Seleciona ou desseleciona todas as linhas
   */
  toggleSelectAll(grid, selected) {
    if (selected) {
      // Seleciona todas as linhas
      grid.options.data.forEach((_, index) => {
        grid.selectedRows.add(index);
      });
    } else {
      // Desseleciona todas
      grid.selectedRows.clear();
    }
    grid.render(false); // Update rápido
  },

  /**
   * Verifica se todas as linhas estão selecionadas
   */
  isAllSelected(grid) {
    if (grid.options.data.length === 0) {return false;}
    return grid.selectedRows.size === grid.options.data.length;
  },

  /**
   * Seleciona linhas específicas por índices
   */
  selectRows(grid, indices) {
    indices.forEach(index => {
      if (index >= 0 && index < grid.options.data.length) {
        grid.selectedRows.add(index);
      }
    });
    grid.render();
  },

  /**
   * Desseleciona linhas específicas por índices
   */
  deselectRows(grid, indices) {
    indices.forEach(index => {
      grid.selectedRows.delete(index);
    });
    grid.render();
  },

  /**
   * Limpa todas as seleções
   */
  clearSelection(grid) {
    grid.selectedRows.clear();
    grid.render();
  },

  /**
   * Obtém os dados das linhas selecionadas
   */
  getSelectedRows(grid) {
    return Array.from(grid.selectedRows)
      .map(index => grid.options.data[index])
      .filter(row => row !== undefined);
  },

  /**
   * Obtém os índices das linhas selecionadas
   */
  getSelectedIndices(grid) {
    return Array.from(grid.selectedRows).sort((a, b) => a - b);
  },

  /**
   * Renderiza checkbox no header (selecionar todos)
   */
  renderSelectAllCheckbox(grid) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'skargrid-checkbox';
    checkbox.checked = this.isAllSelected(grid);
    checkbox.onchange = (e) => this.toggleSelectAll(grid, e.target.checked);
    return checkbox;
  },

  /**
   * Renderiza checkbox em uma célula de dados
   */
  renderRowCheckbox(grid, globalIndex) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'skargrid-checkbox';
    checkbox.checked = grid.selectedRows.has(globalIndex);
    checkbox.onchange = (e) => {
      e.stopPropagation();
      this.toggleSelectRow(grid, globalIndex, e.target.checked);
    };
    return checkbox;
  },
};

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.SelectionFeature = SelectionFeature;
}

// Suporte para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SelectionFeature;
}
