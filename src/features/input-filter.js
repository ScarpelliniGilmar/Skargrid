/**
 * Skargrid - Módulo de Filtros de Input
 * Gerencia dropdowns de filtros de input (text, number, date)
 */

const InputFilterFeature = {
  /**
   * Cria dropdown de filtro com input para tipos 'text', 'number', 'date'
   */
  createInputFilter(grid, dropdown, column, filterType) {
    const header = document.createElement('div');
    header.className = 'filter-dropdown-header';
    header.innerHTML = `<strong>${grid.labels.filterTitle.replace('{title}', column.title || column.field)}</strong>`;
    dropdown.appendChild(header);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'filter-input-wrapper';

    const input = document.createElement('input');
    input.type = filterType === 'number' ? 'number' : filterType === 'date' ? 'date' : 'text';
    input.className = 'filter-dropdown-input';
    input.placeholder = grid.labels.filterInputPlaceholder;
    input.value = grid.columnFilterValues[column.field] || '';

    inputWrapper.appendChild(input);
    dropdown.appendChild(inputWrapper);

    const footer = document.createElement('div');
    footer.className = 'filter-dropdown-footer';

    const clearBtn = document.createElement('button');
    clearBtn.textContent = grid.labels.clear;
    clearBtn.className = 'filter-btn-clear';
    clearBtn.onclick = () => {
      grid.handleColumnFilter(column.field, '');
      dropdown.remove();
      grid.openFilterDropdown = null;
    };

    const applyBtn = document.createElement('button');
    applyBtn.textContent = grid.labels.apply;
    applyBtn.className = 'filter-btn-apply';
    applyBtn.onclick = () => {
      grid.handleColumnFilter(column.field, input.value);
      dropdown.remove();
      grid.openFilterDropdown = null;
    };

    footer.appendChild(clearBtn);
    footer.appendChild(applyBtn);
    dropdown.appendChild(footer);

    // Aplica ao pressionar Enter
    input.onkeypress = (e) => {
      if (e.key === 'Enter') {
        applyBtn.click();
      }
    };

    // Foco automático
    setTimeout(() => input.focus(), 100);
  },
};

// Torna a feature disponível globalmente
if (typeof window !== 'undefined') {
  window.InputFilterFeature = InputFilterFeature;
}

// Para compatibilidade com módulos CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InputFilterFeature;
}