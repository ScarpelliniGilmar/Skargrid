/* eslint-disable no-unused-vars */
/**
 * Skargrid - Módulo de Cabeçalho da Tabela
 * Gerencia a renderização do cabeçalho com sort e filtros por coluna
 */

const TableHeaderFeature = {
  /**
   * Renderiza o cabeçalho da tabela
   */
  renderHeader(grid) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    // Adiciona coluna de checkbox se seleção está habilitada
    if (grid.options.selectable) {
      const th = document.createElement('th');
      th.className = 'skargrid-select-header';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'skargrid-checkbox';
      checkbox.checked = grid.isAllSelected();
      checkbox.onchange = (e) => grid.toggleSelectAll(e.target.checked);

      th.appendChild(checkbox);
      tr.appendChild(th);
    }

    grid.getOrderedVisibleColumns().forEach(column => {
      const th = document.createElement('th');
      th.dataset.field = column.field;

      // Verifica se a coluna é ordenável
      const isSortable = grid.options.sortable && column.sortable !== false;
      const isFilterable = grid.options.columnFilters && column.filterable !== false;

      if (isSortable) {
        th.classList.add('sortable');
      }

      // Container para texto e ícones
      const content = document.createElement('div');
      content.className = 'th-content';

      // Container de texto + sort (clicável para ordenar)
      const textSortContainer = document.createElement('div');
      textSortContainer.className = 'th-text-sort';
      if (isSortable) {
        textSortContainer.style.cursor = 'pointer';
        textSortContainer.onclick = () => grid.handleSort(column.field);

        // Adiciona indicador de ordenação se esta coluna está ordenada
        if (grid.sortColumn === column.field) {
          th.classList.add('sorted');
          th.classList.add(grid.sortDirection);
        }
      }

      const text = document.createElement('span');
      text.className = 'th-text';
      text.textContent = column.title || column.field;
      textSortContainer.appendChild(text);

      // Adiciona ícone de ordenação se ordenável
      if (isSortable) {
        const sortIcon = document.createElement('span');
        sortIcon.className = 'sort-icon';

        if (grid.sortColumn === column.field) {
          sortIcon.textContent = grid.sortDirection === 'asc' ? '▲' : '▼';
        } else {
          sortIcon.textContent = '⇅';
        }

        textSortContainer.appendChild(sortIcon);
      }

      content.appendChild(textSortContainer);

      // Adiciona ícone de filtro se filtrável
      if (isFilterable) {
        const filterIconBtn = document.createElement('button');
        filterIconBtn.className = 'th-filter-btn';
        filterIconBtn.type = 'button';

        // Verifica se há filtro ativo nesta coluna
        const hasFilter = grid.hasActiveFilter(column.field);
        if (hasFilter) {
          filterIconBtn.classList.add('has-filter');
        }

        filterIconBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        `;

        filterIconBtn.onclick = (e) => {
          e.stopPropagation();
          grid.toggleFilterDropdown(column, filterIconBtn);
        };

        content.appendChild(filterIconBtn);
      }

      th.appendChild(content);
      tr.appendChild(th);
    });

    thead.appendChild(tr);
    return thead;
  },
};