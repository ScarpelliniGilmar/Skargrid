/**
 * TopBarFeature - Renderização da barra superior da tabela
 * Contém busca global, botões de ação (limpar filtros, configurar colunas, exportar)
 */

const TopBarFeature = {
  /**
   * Renderiza a barra superior da tabela (busca + botões de ação)
   */
  renderTopBar(grid) {
    const hasSearch = grid.options.searchable;
    const hasColumnConfig = grid.options.columnConfig && typeof grid.renderColumnConfigButton === 'function';
    const hasFilterClear = grid.options.columnFilters;
    const hasExportCSV = grid.options.exportCSV && typeof grid.renderExportCSVButton === 'function';
    const hasExportXLSX = grid.options.exportXLSX && typeof grid.exportToXLSX === 'function' && typeof grid.renderExportCSVButton === 'function';

    // Se não tem nada para renderizar, retorna null
    if (!hasSearch && !hasColumnConfig && !hasFilterClear && !hasExportCSV && !hasExportXLSX) {
      return null;
    }

    const searchContainer = document.createElement('div');
    searchContainer.className = 'skargrid-search-container';

    // Renderiza input de busca (se habilitado)
    if (hasSearch) {
      const searchWrapper = grid.renderSearchInput();
      searchContainer.appendChild(searchWrapper);
    }

    // Renderiza botões de ação (sempre que houver algum botão)
    if (hasFilterClear || hasColumnConfig || hasExportCSV || hasExportXLSX) {
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'skargrid-search-actions';

      // Botão "Limpar Filtros" (apenas se columnFilters estiver ativo)
      if (hasFilterClear) {
        const clearFiltersButton = this.renderClearFiltersButton(grid);
        actionsContainer.appendChild(clearFiltersButton);
      }

      // Botão "Configurar Colunas" (se o módulo estiver carregado)
      if (hasColumnConfig) {
        const columnConfigBtn = grid.renderColumnConfigButton();
        actionsContainer.appendChild(columnConfigBtn);
      }

      // Botão "Exportar CSV" (se o módulo estiver carregado)
      if (hasExportCSV) {
        const exportButton = this.renderExportCSVButton(grid);
        actionsContainer.appendChild(exportButton);
      }

      // Botão "Exportar Excel" (simples, sem dependências)
      if (hasExportXLSX) {
        const xlsxBtn = this.renderExportXLSXButton(grid);
        actionsContainer.appendChild(xlsxBtn);
      }

      searchContainer.appendChild(actionsContainer);
    }

    return searchContainer;
  },

  /**
   * Renderiza botão "Limpar Filtros"
   */
  renderClearFiltersButton(grid) {
    const clearFiltersButton = document.createElement('button');
    clearFiltersButton.className = 'skargrid-clear-filters-btn';
    clearFiltersButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        <line x1="18" y1="6" x2="6" y2="18"></line>
      </svg>
      <span class="filter-count-badge" style="display: none;">0</span>
    `;
    clearFiltersButton.title = grid.labels.clearFilters;
    clearFiltersButton.onclick = () => grid.clearAllFilters();

    // Atualiza contador de filtros ativos
    this.updateClearFiltersButton(grid, clearFiltersButton);

    return clearFiltersButton;
  },

  /**
   * Renderiza botão "Exportar CSV"
   */
  renderExportCSVButton(grid) {
    const exportButton = document.createElement('button');
    exportButton.className = 'skargrid-clear-filters-btn';
    exportButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      <span style="margin-left:.35rem;font-size:12px">CSV</span>
    `;
    exportButton.title = grid.labels.exportCSV;
    exportButton.onclick = () => grid.exportToCSV();

    return exportButton;
  },

  /**
   * Renderiza botão "Exportar XLSX"
   */
  renderExportXLSXButton(grid) {
    const xlsxBtn = document.createElement('button');
    xlsxBtn.className = 'skargrid-clear-filters-btn';
    xlsxBtn.title = grid.labels.exportXLSX;
    xlsxBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      <span style="margin-left:.35rem;font-size:12px">XLSX</span>
    `;
    xlsxBtn.onclick = () => grid.exportToXLSX();

    return xlsxBtn;
  },

  /**
   * Atualiza o botão de limpar filtros com contador de filtros ativos
   */
  updateClearFiltersButton(grid, button = null) {
    if (!button) {
      button = grid.container.querySelector('.skargrid-clear-filters-btn');
    }

    if (!button) {return;}

    // Conta quantos filtros estão ativos
    let activeCount = 0;

    // Conta busca global
    if (grid.searchText) {activeCount++;}

    // Conta filtros de coluna
    grid.options.columns.forEach(column => {
      if (column.filterable !== false) {
        if (grid.hasActiveFilter(column.field)) {
          activeCount++;
        }
      }
    });

    // Atualiza badge do contador
    const badge = button.querySelector('.filter-count-badge');
    if (badge) {
      if (activeCount > 0) {
        badge.textContent = activeCount;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }
  },
};

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.TopBarFeature = TopBarFeature;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TopBarFeature;
}