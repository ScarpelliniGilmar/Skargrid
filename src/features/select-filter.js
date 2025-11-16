/**
 * Skargrid - Módulo de Filtros Select
 * Gerencia dropdowns de filtros select com busca inteligente
 */

const SelectFilterFeature = {
  /**
   * Cria dropdown de filtro com checkboxes para tipo 'select'
   */
  createCheckboxFilter(grid, dropdown, column) {
    // Pega valores DISPONÍVEIS considerando outros filtros ativos
    const availableValues = grid.getAvailableColumnValues(column.field);

    // Inicializa selected se não existir (com todos os valores disponíveis)
    if (!grid.columnFilterSelected[column.field]) {
      grid.columnFilterSelected[column.field] = [...availableValues];
    }

    // Header do dropdown
    const header = document.createElement('div');
    header.className = 'filter-dropdown-header';
    header.innerHTML = `<strong>${grid.labels.filterTitle.replace('{title}', column.title || column.field)}</strong>`;
    dropdown.appendChild(header);

    // Campo de busca interno
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'filter-search-wrapper';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'filter-search-input';
    searchInput.placeholder = grid.labels.filterSearchPlaceholder;

    searchWrapper.appendChild(searchInput);
    dropdown.appendChild(searchWrapper);

    // Select All / Deselect All
    const selectAllWrapper = document.createElement('div');
    selectAllWrapper.className = 'filter-select-all';

    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.className = 'skargrid-checkbox';
    selectAllCheckbox.id = `select-all-${column.field}`;
    selectAllCheckbox.checked = grid.columnFilterSelected[column.field].length === availableValues.length && availableValues.length > 0;

    const selectAllLabel = document.createElement('label');
    selectAllLabel.htmlFor = `select-all-${column.field}`;
    selectAllLabel.textContent = grid.labels.selectAll;

    selectAllWrapper.appendChild(selectAllCheckbox);
    selectAllWrapper.appendChild(selectAllLabel);
    dropdown.appendChild(selectAllWrapper);

    // Lista de checkboxes com scroll
    const listWrapper = document.createElement('div');
    listWrapper.className = 'filter-list-wrapper';

    const list = document.createElement('div');
    list.className = 'filter-list';

    // Valores atualmente exibidos no dropdown (após busca interna)
    let displayedValues = [...availableValues];
    let hasSearchFilter = false; // Flag para saber se uma busca foi feita
    let searchSelections = new Set(); // Seleções feitas durante a busca atual

    const renderList = (filteredValues = availableValues, isSearchResult = false) => {
      // Atualiza quais valores estão sendo exibidos
      displayedValues = Array.isArray(filteredValues) ? filteredValues.slice() : [...availableValues];

      // Se é resultado de busca, atualiza seleções da busca preservando apenas as disponíveis
      if (isSearchResult) {
        if (!hasSearchFilter) {
          hasSearchFilter = true;
          // Primeira busca: inicializa com seleções globais que estão nos resultados
          searchSelections = new Set(grid.columnFilterSelected[column.field].filter(v => displayedValues.includes(v)));
        } else {
          // Busca subsequente: preserva apenas seleções que ainda estão nos novos resultados
          searchSelections = new Set([...searchSelections].filter(v => displayedValues.includes(v)));
        }
      }

      list.innerHTML = '';
      filteredValues.forEach(value => {
        const item = document.createElement('div');
        item.className = 'filter-list-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'skargrid-checkbox';
        checkbox.value = value;
        // sanitize id (remove spaces/specials)
        const safeVal = String(value).replace(/[^a-z0-9-_]/gi, '_');
        checkbox.id = `filter-${column.field}-${safeVal}`;

        // Lógica de seleção: se está em modo de busca, usa searchSelections, senão usa global
        const isSelected = hasSearchFilter
          ? searchSelections.has(value)
          : grid.columnFilterSelected[column.field].includes(value);
        checkbox.checked = isSelected;

        const label = document.createElement('label');
        label.htmlFor = `filter-${column.field}-${safeVal}`;
        // Mostra texto amigável para o token de vazio
        if (value === FilterFeature?.EMPTY_TOKEN || value === '__SG_EMPTY__') {
          label.textContent = '(Em branco)';
        } else {
          label.textContent = value;
        }

        item.appendChild(checkbox);
        item.appendChild(label);
        list.appendChild(item);

        // Toggle individual
        checkbox.onchange = () => {
          if (hasSearchFilter) {
            // Modo busca: atualiza searchSelections
            if (checkbox.checked) {
              searchSelections.add(value);
            } else {
              searchSelections.delete(value);
            }
          } else {
            // Modo normal: atualiza seleções globais
            if (checkbox.checked) {
              if (!grid.columnFilterSelected[column.field].includes(value)) {
                grid.columnFilterSelected[column.field].push(value);
              }
            } else {
              grid.columnFilterSelected[column.field] =
                grid.columnFilterSelected[column.field].filter(v => v !== value);
            }
          }

          // Atualiza o estado do Select All
          const currentSelections = hasSearchFilter ? searchSelections : new Set(grid.columnFilterSelected[column.field]);
          selectAllCheckbox.checked = displayedValues.length > 0 && displayedValues.every(v => currentSelections.has(v));
        };
      });
    };

    renderList();
    listWrapper.appendChild(list);
    dropdown.appendChild(listWrapper);

    // Busca interna (com normalização de acentos)
    searchInput.oninput = (e) => {
      const searchTerm = grid.normalizeString(e.target.value);
      if (searchTerm.trim() === '') {
        // Busca vazia: volta ao estado normal
        hasSearchFilter = false;
        searchSelections = new Set();
        displayedValues = [...availableValues];
        renderList(availableValues, false);
        selectAllCheckbox.checked = grid.columnFilterSelected[column.field].length === availableValues.length && availableValues.length > 0;
      } else {
        // Busca ativa: filtra e mostra apenas resultados
        const filtered = availableValues.filter(val => {
          const display = (val === FilterFeature?.EMPTY_TOKEN || val === '__SG_EMPTY__') ? '(Em branco)' : String(val);
          return grid.normalizeString(display).includes(searchTerm);
        });
        renderList(filtered, true);
      }
    };

    // Select/Deselect All - agora atua apenas sobre os valores atualmente exibidos
    selectAllCheckbox.onchange = () => {
      const toChange = displayedValues.slice();

      if (hasSearchFilter) {
        // Modo busca: atualiza searchSelections
        if (selectAllCheckbox.checked) {
          toChange.forEach(v => searchSelections.add(v));
        } else {
          toChange.forEach(v => searchSelections.delete(v));
        }
      } else {
        // Modo normal: atualiza seleções globais
        if (selectAllCheckbox.checked) {
          const current = new Set(grid.columnFilterSelected[column.field] || []);
          toChange.forEach(v => current.add(v));
          grid.columnFilterSelected[column.field] = [...current];
        } else {
          grid.columnFilterSelected[column.field] = (grid.columnFilterSelected[column.field] || []).filter(v => !toChange.includes(v));
        }
      }

      // Re-renderiza mantendo a lista filtrada atual
      renderList(displayedValues, hasSearchFilter);
    };

    // Footer com botões
    const footer = document.createElement('div');
    footer.className = 'filter-dropdown-footer';

    const clearBtn = document.createElement('button');
    clearBtn.textContent = grid.labels.clear;
    clearBtn.className = 'filter-btn-clear';
    clearBtn.onclick = () => {
      grid.columnFilterSelected[column.field] = [...availableValues];
      hasSearchFilter = false;
      searchSelections = new Set();
      grid.handleColumnFilterCheckbox(column.field);
      dropdown.remove();
      grid.removeScrollListeners();
      grid.openFilterDropdown = null;
    };

    const applyBtn = document.createElement('button');
    applyBtn.textContent = grid.labels.apply;
    applyBtn.className = 'filter-btn-apply';
    applyBtn.onclick = () => {
      if (hasSearchFilter) {
        // Se estava em modo busca, substitui completamente as seleções globais pelas da busca
        grid.columnFilterSelected[column.field] = [...searchSelections];
      }
      grid.handleColumnFilterCheckbox(column.field);
      dropdown.remove();
      grid.removeScrollListeners();
      grid.openFilterDropdown = null;
    };

    footer.appendChild(clearBtn);
    footer.appendChild(applyBtn);
    dropdown.appendChild(footer);
  },
};

// Torna a feature disponível globalmente
if (typeof window !== 'undefined') {
  window.SelectFilterFeature = SelectFilterFeature;
}

// Para compatibilidade com módulos CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SelectFilterFeature;
}