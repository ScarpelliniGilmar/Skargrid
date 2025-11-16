/**
 * Skargrid Core - Implementação de renderização e UI
 * @version 0.7.0
 * Este é o core de renderização, o ponto de entrada é index.js
 */

class Skargrid {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container com ID "${containerId}" não encontrado`);
    }

    this.options = {
      data: options.data || [],
      columns: options.columns || [],
      className: options.className || 'skargrid',
      theme: options.theme || 'light', // 'light' ou 'dark'
      pagination: options.pagination !== undefined ? options.pagination : false,
      pageSize: options.pageSize || 10,
      pageSizeOptions: options.pageSizeOptions || [10, 25, 50, 100],
      sortable: options.sortable !== undefined ? options.sortable : false, // Ordenação desabilitada por padrão
      selectable: options.selectable !== undefined ? options.selectable : false,
      searchable: options.searchable !== undefined ? options.searchable : false,
      columnFilters: options.columnFilters !== undefined ? options.columnFilters : false,
      columnConfig: options.columnConfig !== undefined ? options.columnConfig : false, // Botão de configuração desabilitado por padrão
      exportCSV: options.exportCSV !== undefined ? options.exportCSV : false, // Exportar CSV desabilitado por padrão
      exportFilename: options.exportFilename || 'skargrid-export', // Nome base para arquivos exportados
      virtualization: options.virtualization !== undefined ? options.virtualization : false, // Virtualização desabilitada por padrão
      ...options,
    };

    // Labels para internacionalização (padrão em inglês, sobrescrevível via options.labels)
    this.labels = {
      searchPlaceholder: 'Search all columns...',
      clearFilters: 'Clear Filters',
      exportCSV: 'Export CSV',
      exportXLSX: 'Export XLSX',
      filterTitle: 'Filter: {title}',
      selectAll: 'Select All',
      filterSearchPlaceholder: 'Search...',
      filterInputPlaceholder: 'Type to filter...',
      clear: 'Clear',
      apply: 'Apply',
      showing: 'Showing {start} to {end} of {total} entries',
      filteredOfTotal: 'filtered from {total} total',
      itemsPerPage: 'Items per page:',
      noRowsSelected: 'No rows selected to export.',
      columnConfigTitle: 'Configure Columns',
      columnConfigDescription: 'Check to display, drag or use arrows to reorder',
      restore: 'Restore',
      cancel: 'Cancel',
      noData: 'No data available',
      loading: 'Loading...',
      ...options.labels,
    };

    // Ensure current pageSize is present in pageSizeOptions. If the user set
    // `options.pageSize` but didn't include it in `options.pageSizeOptions`,
    // add it (at the front) so the selector and current value stay consistent.
    try {
      const explicitSize = Number(this.options.pageSize) || 0;
      if (explicitSize > 0) {
        let opts = Array.isArray(this.options.pageSizeOptions) ? this.options.pageSizeOptions.slice() : [];
        // normalize to numbers where possible
        opts = opts.map(v => Number(v)).filter(n => Number.isFinite(n) && n > 0);
        if (!opts.includes(explicitSize)) {
          // ensure the explicit size is included
          opts.push(explicitSize);
        }
        // remove duplicates then sort numerically ascending so dropdown is ordered
        const uniq = Array.from(new Set(opts));
        uniq.sort((a, b) => a - b);
        this.options.pageSizeOptions = uniq;
      }
    } catch (e) {
      // if anything weird happens, leave the provided options as-is
      // but avoid throwing during construction
      if (console && console.warn) {console.warn('Skargrid: error normalizing pageSizeOptions', e);}
    }
    // Estado da paginação
    this.currentPage = 1;
    this.totalPages = 1;

    // Estado da ordenação
    this.sortColumn = null;
    this.sortDirection = null; // 'asc' ou 'desc'

    // Dados originais (não ordenados)
    this.originalData = [...this.options.data];

    // Estado da seleção - armazena índices das linhas selecionadas
    this.selectedRows = new Set();

    // Estado da busca
    this.searchText = '';
    this.filteredData = [...this.options.data];
    this.searchTimeout = null;

    // Estado dos filtros por coluna
    this.columnFilterValues = {}; // { field: value }
    this.columnFilterSelected = {}; // { field: [selectedValues] } para checkboxes

    // Estado de loading
    this.isLoading = false;

    // Referência para dropdown aberto
    this.openFilterDropdown = null;

    // Estado de visibilidade e ordem das colunas
    // Respeita a propriedade visible (padrão: true)
    this.visibleColumns = new Set(
      this.options.columns
        .filter(col => col.visible !== false)
        .map(col => col.field),
    );
    this.columnOrder = this.options.columns.map(col => col.field);

    // Estado da virtualização (inicializado pela feature se disponível)
    if (typeof VirtualizationFeature !== 'undefined') {
      VirtualizationFeature.initVirtualization(this);
    } else {
      // Fallback básico se VirtualizationFeature não disponível
      this.virtualScrollTop = 0;
      this.virtualRowHeight = 40;
      this.virtualVisibleRows = 20;
      this.virtualBufferSize = 5;
    }

    // Inicializa features modulares
    if (typeof initColumnConfig === 'function') {
      initColumnConfig(this);
    }

    this.init();
  }

  /**
   * Obtém as colunas ordenadas e visíveis (método base, pode ser sobrescrito por features)
   */
  getOrderedVisibleColumns() {
    // Se não há controle de visibilidade, retorna todas as colunas
    if (!this.visibleColumns || !this.columnOrder) {
      return this.options.columns;
    }
    
    return this.columnOrder
      .filter(field => this.visibleColumns.has(field))
      .map(field => this.options.columns.find(col => col.field === field))
      .filter(col => col !== undefined);
  }

  /**
   * Inicializa a tabela
   */
  init() {
    this.applyFilters();
    this.calculatePagination();
    this.render();
  }

  /**
   * Calcula informações de paginação
   */
  calculatePagination() {
    if (typeof PaginationFeature !== 'undefined') {
      PaginationFeature.calculatePagination(this);
    }
  }

  /**
   * Obtém os dados da página atual
   */
  getPageData() {
    if (typeof PaginationFeature !== 'undefined') {
      return PaginationFeature.getPageData(this);
    }
    return this.filteredData;
  }

  /**
   * Renderiza a tabela completa
   */
  render(fullRender = true) {
    // Se já existe uma tabela e não precisa de render completo, faz update rápido
    if (!fullRender && this.container.querySelector('.skargrid-wrapper')) {
      this.updateTableContent();
      return;
    }

    // Limpa o container
    this.container.innerHTML = '';

    // Cria wrapper principal
    const wrapper = document.createElement('div');
    wrapper.className = 'skargrid-wrapper';
    
    // Aplica tema
    if (this.options.theme === 'dark') {
      wrapper.classList.add('skargrid-dark');
    }

    // Renderiza área superior (busca + botões de ação)
    const topBar = this.renderTopBar();
    if (topBar) {
      wrapper.appendChild(topBar);
    }

    // Container da tabela com loading
    const tableContainer = document.createElement('div');
    tableContainer.className = 'skargrid-table-container';

    // Configura virtualização se habilitada
    if (this.options.virtualization) {
      if (typeof VirtualizationFeature !== 'undefined') {
        VirtualizationFeature.setupVirtualContainer(this, tableContainer);
      } else {
        // Fallback básico se VirtualizationFeature não disponível
        tableContainer.classList.add('skargrid-virtual-container');
        tableContainer.style.overflowY = 'auto';
        tableContainer.style.overflowX = 'auto';
        tableContainer.style.position = 'relative';
        tableContainer.onscroll = (e) => this.handleVirtualScroll(e);
      }
    }
    
    // Adiciona indicador de loading APENAS na área da tabela
    if (this.isLoading) {
      const loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'skargrid-loading-overlay';
      loadingOverlay.innerHTML = `
        <div class="skargrid-spinner">
          <svg width="40" height="40" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="80, 200" stroke-linecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
            </circle>
          </svg>
          <span>${this.labels.loading}</span>
        </div>
      `;
      tableContainer.appendChild(loadingOverlay);
    }

    // Cria o elemento da tabela
    const table = document.createElement('table');
    table.className = this.options.className;

    if (this.options.virtualization) {
      if (typeof VirtualizationFeature !== 'undefined') {
        // Usa a feature de virtualização
        const virtualContainer = VirtualizationFeature.renderVirtualStructure(this);
        tableContainer.appendChild(virtualContainer);
      } else {
        // Fallback básico se VirtualizationFeature não disponível
        this.renderBasicVirtualStructure(tableContainer);
      }
    } else {
      // Renderização normal
      const thead = this.renderHeader();
      table.appendChild(thead);

      const tbody = this.renderBody();
      table.appendChild(tbody);

      tableContainer.appendChild(table);
    }
    wrapper.appendChild(tableContainer);

    // Adiciona paginação se habilitada
    if (this.options.pagination) {
      const pagination = this.renderPagination();
      wrapper.appendChild(pagination);
    }

    // Adiciona tudo ao container
    this.container.appendChild(wrapper);
  }

  /**
   * Atualiza apenas o conteúdo da tabela (tbody e paginação) - mais rápido
   */
  updateTableContent() {
    if (this.options.virtualization) {
      // Atualiza a altura do container virtual baseada nos dados filtrados
      const virtualContainer = this.container.querySelector('.skargrid-table-container > div');
      if (virtualContainer) {
        virtualContainer.style.height = `${this.filteredData.length * this.virtualRowHeight}px`;
      }

      // Para virtualização, atualiza o tbody
      const table = this.container.querySelector('.skargrid');
      if (!table) {
        return;
      }

      const oldTbody = table.querySelector('tbody');
      const newTbody = this.renderBody();
      if (oldTbody) {
        table.replaceChild(newTbody, oldTbody);
      }

      // Atualiza header (ícones de ordenação e checkbox)
      const oldThead = table.querySelector('thead');
      const newThead = this.renderHeader();
      newThead.style.position = 'sticky';
      newThead.style.top = '0';
      newThead.style.zIndex = '1';
      newThead.style.background = 'var(--sg-thead-bg, #f8f9fa)';
      newThead.style.width = '100%';
      if (oldThead) {
        table.replaceChild(newThead, oldThead);
      }
    } else {
      // Atualização normal
      const table = this.container.querySelector('.skargrid');
      if (!table) {return;}

      // Atualiza tbody
      const oldTbody = table.querySelector('tbody');
      const newTbody = this.renderBody();
      if (oldTbody) {
        table.replaceChild(newTbody, oldTbody);
      }

      // Atualiza header (ícones de ordenação e checkbox)
      const oldThead = table.querySelector('thead');
      const newThead = this.renderHeader();
      if (oldThead) {
        table.replaceChild(newThead, oldThead);
      }
    }

    // Atualiza paginação
    if (this.options.pagination) {
      const oldPagination = this.container.querySelector('.skargrid-pagination');
      const newPagination = this.renderPagination();
      if (oldPagination && oldPagination.parentNode) {
        oldPagination.parentNode.replaceChild(newPagination, oldPagination);
      }
    }
  }

  /**
   * Renderiza o campo de busca
   */
  /**
   * Renderiza barra superior com busca e botões de ação
   */
  renderTopBar() {
    if (typeof TopBarFeature !== 'undefined') {
      return TopBarFeature.renderTopBar(this);
    } else {
      // Fallback básico se TopBarFeature não disponível
      return this.createBasicTopBar();
    }
  }

  /**
   * Renderiza apenas o input de busca
   */
  /**
   * Renderiza o componente de busca global
   */
  renderSearchInput() {
    if (typeof SearchFeature !== 'undefined') {
      return SearchFeature.renderSearchInput(this);
    } else {
      // Fallback básico se SearchFeature não disponível
      console.warn('SearchFeature not available, using basic search input');
      return this.createBasicSearchInput();
    }
  }

  /**
   * Fallback básico para campo de busca quando SearchFeature não está disponível
   */
  createBasicSearchInput() {
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'skargrid-search-wrapper';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'skargrid-search-input';
    searchInput.placeholder = this.labels.searchPlaceholder;
    searchInput.value = this.searchText;

    searchInput.oninput = (e) => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.handleSearch(e.target.value);
      }, 300);
    };

    searchWrapper.appendChild(searchInput);
    return searchWrapper;
  }

  /**
   * Renderiza botão "Limpar Filtros"
   */
  renderClearFiltersButton() {
    if (typeof TopBarFeature !== 'undefined') {
      return TopBarFeature.renderClearFiltersButton(this);
    }
    return document.createElement('button');
  }

  /**
   * Renderiza botão "Exportar CSV"
   */
  renderExportCSVButton() {
    if (typeof TopBarFeature !== 'undefined') {
      return TopBarFeature.renderExportCSVButton(this);
    }
    return document.createElement('button');
  }

  /**
   * Fallback básico para renderização da barra superior quando TopBarFeature não está disponível
   */
  createBasicTopBar() {
    const hasSearch = this.options.searchable;

    // Se não tem busca, retorna null
    if (!hasSearch) {
      return null;
    }

    const searchContainer = document.createElement('div');
    searchContainer.className = 'skargrid-search-container';

    // Renderiza input de busca básico
    const searchWrapper = this.createBasicSearchInput();
    searchContainer.appendChild(searchWrapper);

    return searchContainer;
  }

  /**
   * Renderiza o cabeçalho da tabela
   */
  renderHeader() {
    if (typeof TableHeaderFeature !== 'undefined') {
      return TableHeaderFeature.renderHeader(this);
    } else {
      // Fallback básico se TableHeaderFeature não disponível
      console.warn('TableHeaderFeature not available, using basic header');
      return this.createBasicHeader();
    }
  }

  /**
   * Fallback básico para cabeçalho quando TableHeaderFeature não está disponível
   */
  createBasicHeader() {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    // Adiciona coluna de checkbox se seleção está habilitada
    if (this.options.selectable) {
      const th = document.createElement('th');
      th.className = 'skargrid-select-header';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'skargrid-checkbox';
      checkbox.checked = this.isAllSelected();
      checkbox.onchange = (e) => this.toggleSelectAll(e.target.checked);

      th.appendChild(checkbox);
      tr.appendChild(th);
    }

    this.getOrderedVisibleColumns().forEach(column => {
      const th = document.createElement('th');
      th.dataset.field = column.field;

      const text = document.createElement('span');
      text.className = 'th-text';
      text.textContent = column.title || column.field;
      th.appendChild(text);

      tr.appendChild(th);
    });

    thead.appendChild(tr);
    return thead;
  }

  /**
   * Verifica se uma coluna tem filtro ativo
   */
  hasActiveFilter(field) {
    if (typeof FilterFeature !== 'undefined') {
      return FilterFeature.hasActiveFilter(this, field);
    }
    return false;
  }

  /**
   * Normaliza string para busca (remove acentos)
   */
  normalizeString(str) {
    if (typeof FilterFeature !== 'undefined') {
      return FilterFeature.normalizeString(str);
    }
    // Fallback se FilterFeature não disponível
    if (!str) {return '';}
    return String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  /**
   * Obtém valores únicos de uma coluna (dados originais)
   */
  getUniqueColumnValues(field) {
    if (typeof FilterFeature !== 'undefined') {
      return FilterFeature.getUniqueColumnValues(this, field);
    }
    return [];
  }

  /**
   * Obtém valores disponíveis de uma coluna (dados filtrados, exceto a própria coluna)
   */
  getAvailableColumnValues(field) {
    if (typeof FilterFeature !== 'undefined') {
      return FilterFeature.getAvailableColumnValues(this, field);
    }
    return [];
  }

  /**
   * Abre/fecha dropdown de filtro
   */
  toggleFilterDropdown(column, buttonElement) {
    // Fecha dropdown aberto
    if (this.openFilterDropdown) {
      this.openFilterDropdown.remove();
      this.removeScrollListeners();
      if (this.openFilterDropdown.dataset.field === column.field) {
        this.openFilterDropdown = null;
        return;
      }
    }

    // Cria novo dropdown
    const dropdown = this.createFilterDropdown(column);
    dropdown.dataset.field = column.field;
    
    // Adiciona ao body para calcular tamanho e evitar ser cortado
    dropdown.style.visibility = 'hidden';
    dropdown.style.position = 'fixed';
    document.body.appendChild(dropdown);
    
    // Função para posicionar o dropdown
    const positionDropdown = () => {
      const rect = buttonElement.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Posição inicial (logo abaixo do botão, alinhado à esquerda)
      // Prefer always opening below the button. If there's not enough room
      // below, don't flip above; instead constrain the dropdown height so it
      // fits the available space and enable internal scrolling.
      const top = rect.bottom + 6;
      let left = rect.left;

      // Ajusta se sair pela direita
      if (left + dropdownRect.width > viewportWidth - 20) {
        left = Math.max(10, rect.right - dropdownRect.width);
      }

      // Calcular espaço disponível abaixo do botão
      const availableBelow = Math.max(0, viewportHeight - top - 12);
      const MIN_DROPDOWN_HEIGHT = 120; // mínimo aceitável
      if (availableBelow < MIN_DROPDOWN_HEIGHT) {
        // limita a altura do dropdown para caber abaixo e permite scroll interno
        const maxH = Math.max(64, availableBelow);
        dropdown.style.maxHeight = maxH + 'px';
        dropdown.style.overflowY = 'auto';
      } else {
        dropdown.style.maxHeight = '';
        dropdown.style.overflowY = '';
      }
      
      // Garante que não saia pela esquerda
      if (left < 10) {
        left = 10;
      }
      
      dropdown.style.top = `${top}px`;
      dropdown.style.left = `${left}px`;
    };
    
    // Posiciona inicialmente
    positionDropdown();
    dropdown.style.visibility = 'visible';
    
    this.openFilterDropdown = dropdown;

    // Handler para reposicionar no scroll
    const scrollHandler = () => {
      positionDropdown();
    };
    
    // Adiciona listeners de scroll
    window.addEventListener('scroll', scrollHandler, true); // true = capture phase para pegar todos scrolls
    this.scrollHandler = scrollHandler;

    // Fecha ao clicar fora
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== buttonElement) {
          dropdown.remove();
          this.removeScrollListeners();
          this.openFilterDropdown = null;
        }
      }, { once: true });
    }, 100);
  }

  /**
   * Remove listeners de scroll
   */
  removeScrollListeners() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler, true);
      this.scrollHandler = null;
    }
  }

  /**
   * Cria dropdown de filtro profissional
   */
  createFilterDropdown(column) {
    const dropdown = document.createElement('div');
    dropdown.className = 'skargrid-filter-dropdown';

    const filterType = column.filterType || 'text';

    if (filterType === 'select') {
      // Dropdown com checkboxes
      this.createCheckboxFilter(dropdown, column);
    } else {
      // Input simples para text, number, date
      if (typeof InputFilterFeature !== 'undefined') {
        InputFilterFeature.createInputFilter(this, dropdown, column, filterType);
      } else {
        // Fallback se InputFilterFeature não disponível
        this.createBasicInputFilter(dropdown, column, filterType);
      }
    }

    return dropdown;
  }

  /**
   * Cria filtro com checkboxes e busca interna (valores disponíveis dinamicamente)
   */
  createCheckboxFilter(dropdown, column) {
    if (typeof SelectFilterFeature !== 'undefined') {
      SelectFilterFeature.createCheckboxFilter(this, dropdown, column);
    } else {
      // Fallback se SelectFilterFeature não disponível
      console.warn('SelectFilterFeature not available, using basic filter');
      this.createBasicCheckboxFilter(dropdown, column);
    }
  }

  /**
   * Fallback básico para filtro checkbox quando SelectFilterFeature não está disponível
   */
  createBasicCheckboxFilter(dropdown, column) {
    const allValues = this.getUniqueColumnValues(column.field);
    const availableValues = this.getAvailableColumnValues(column.field);

    // Header do dropdown
    const header = document.createElement('div');
    header.className = 'filter-dropdown-header';
    header.innerHTML = `<strong>${this.labels.filterTitle.replace('{title}', column.title || column.field)}</strong>`;
    dropdown.appendChild(header);

    // Lista básica de checkboxes
    const listWrapper = document.createElement('div');
    listWrapper.className = 'filter-list-wrapper';

    const list = document.createElement('div');
    list.className = 'filter-list';

    availableValues.forEach(value => {
      const item = document.createElement('div');
      item.className = 'filter-list-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'skargrid-checkbox';
      checkbox.value = value;
      const safeVal = String(value).replace(/[^a-z0-9-_]/gi, '_');
      checkbox.id = `filter-${column.field}-${safeVal}`;

      const isSelected = (this.columnFilterSelected[column.field] || allValues).includes(value);
      checkbox.checked = isSelected;

      const label = document.createElement('label');
      label.htmlFor = `filter-${column.field}-${safeVal}`;
      label.textContent = value;

      item.appendChild(checkbox);
      item.appendChild(label);
      list.appendChild(item);

      checkbox.onchange = () => {
        if (!this.columnFilterSelected[column.field]) {
          this.columnFilterSelected[column.field] = [...allValues];
        }
        if (checkbox.checked) {
          if (!this.columnFilterSelected[column.field].includes(value)) {
            this.columnFilterSelected[column.field].push(value);
          }
        } else {
          this.columnFilterSelected[column.field] = this.columnFilterSelected[column.field].filter(v => v !== value);
        }
      };
    });

    listWrapper.appendChild(list);
    dropdown.appendChild(listWrapper);

    // Footer básico
    const footer = document.createElement('div');
    footer.className = 'filter-dropdown-footer';

    const applyBtn = document.createElement('button');
    applyBtn.textContent = this.labels.apply;
    applyBtn.className = 'filter-btn-apply';
    applyBtn.onclick = () => {
      this.handleColumnFilterCheckbox(column.field);
      dropdown.remove();
      this.openFilterDropdown = null;
    };

    footer.appendChild(applyBtn);
    dropdown.appendChild(footer);
  }

  /**
   * Cria filtro com input simples
   */
  createInputFilter(dropdown, column, filterType) {
    if (typeof InputFilterFeature !== 'undefined') {
      InputFilterFeature.createInputFilter(this, dropdown, column, filterType);
    } else {
      // Fallback se InputFilterFeature não disponível
      this.createBasicInputFilter(dropdown, column, filterType);
    }
  }

  /**
   * Fallback básico para filtro input quando InputFilterFeature não está disponível
   */
  createBasicInputFilter(dropdown, column, filterType) {
    const header = document.createElement('div');
    header.className = 'filter-dropdown-header';
    header.innerHTML = `<strong>${this.labels.filterTitle.replace('{title}', column.title || column.field)}</strong>`;
    dropdown.appendChild(header);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'filter-input-wrapper';

    const input = document.createElement('input');
    input.type = filterType === 'number' ? 'number' : filterType === 'date' ? 'date' : 'text';
    input.className = 'filter-dropdown-input';
    input.placeholder = this.labels.filterInputPlaceholder;
    input.value = this.columnFilterValues[column.field] || '';

    inputWrapper.appendChild(input);
    dropdown.appendChild(inputWrapper);

    const footer = document.createElement('div');
    footer.className = 'filter-dropdown-footer';

    const clearBtn = document.createElement('button');
    clearBtn.textContent = this.labels.clear;
    clearBtn.className = 'filter-btn-clear';
    clearBtn.onclick = () => {
      this.handleColumnFilter(column.field, '');
      dropdown.remove();
      this.openFilterDropdown = null;
    };

    const applyBtn = document.createElement('button');
    applyBtn.textContent = this.labels.apply;
    applyBtn.className = 'filter-btn-apply';
    applyBtn.onclick = () => {
      this.handleColumnFilter(column.field, input.value);
      dropdown.remove();
      this.openFilterDropdown = null;
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
  }

  /**
   * Manipula filtro de checkbox (select)
   */
  handleColumnFilterCheckbox(field) {
    const allValues = this.getUniqueColumnValues(field);
    const selected = this.columnFilterSelected[field] || [];
    
    // Se todos estão selecionados, não filtra
    if (selected.length === allValues.length) {
      delete this.columnFilterValues[field];
    } else {
      this.columnFilterValues[field] = selected;
    }
    
    this.currentPage = 1;
    this.applyFilters();
    this.calculatePagination();
    this.render(false);
    this.updateClearFiltersButton();
  }

  /**
   * Renderiza o corpo da tabela
   */
  renderBody() {
    const tbody = document.createElement('tbody');
    
    if (this.options.virtualization) {
      // Virtualização: renderiza apenas linhas visíveis
      const totalRows = this.filteredData.length;
      const startIndex = Math.max(0, Math.floor(this.virtualScrollTop / this.virtualRowHeight) - this.virtualBufferSize);
      const endIndex = Math.min(totalRows, startIndex + this.virtualVisibleRows + (this.virtualBufferSize * 2));

      // Renderiza apenas as linhas visíveis
      for (let i = startIndex; i < endIndex; i++) {
        const row = this.filteredData[i];
        const tr = this.createTableRow(row, i);
        tbody.appendChild(tr);
      }
    } else {
      // Renderização normal (com paginação)
      const pageData = this.getPageData();
      
      pageData.forEach((row, pageIndex) => {
        // Calcula o índice global do registro
        const globalIndex = this.options.pagination
          ? (this.currentPage - 1) * this.options.pageSize + pageIndex
          : pageIndex;
        
        const tr = this.createTableRow(row, globalIndex);
        tbody.appendChild(tr);
      });
    }

    return tbody;
  }

  /**
   * Cria uma linha da tabela (usado tanto para virtualização quanto paginação normal)
   */
  createTableRow(row, globalIndex) {
    const tr = document.createElement('tr');
    tr.dataset.index = globalIndex;

    // Adiciona classe se a linha está selecionada
    if (this.selectedRows.has(globalIndex)) {
      tr.classList.add('selected');
    }

    // Adiciona coluna de checkbox se seleção está habilitada
    if (this.options.selectable) {
      const td = document.createElement('td');
      td.className = 'skargrid-select-cell';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'skargrid-checkbox';
      checkbox.checked = this.selectedRows.has(globalIndex);
      checkbox.onchange = (e) => {
        e.stopPropagation();
        this.toggleSelectRow(globalIndex, e.target.checked);
      };
      
      td.appendChild(checkbox);
      tr.appendChild(td);

      // Adiciona clique na linha para selecionar
      tr.style.cursor = 'pointer';
      tr.onclick = (e) => {
        // Ignora clique no checkbox
        if (e.target.type !== 'checkbox') {
          checkbox.checked = !checkbox.checked;
          this.toggleSelectRow(globalIndex, checkbox.checked);
        }
      };
    }

    this.getOrderedVisibleColumns().forEach(column => {
      const td = document.createElement('td');
      const value = row[column.field];
      
      // Permite formatação customizada
      // Suporta ambas as propriedades `formatter` (antiga) e `render` (exemplo/docs)
      const cellRenderer = (column.formatter && typeof column.formatter === 'function')
        ? column.formatter
        : (column.render && typeof column.render === 'function')
          ? column.render
          : null;

      if (cellRenderer) {
        // renderer pode retornar HTML ou texto
        try {
          td.innerHTML = cellRenderer(value, row, globalIndex);
        } catch (e) {
          // Falha ao executar renderer — fallback para texto simples
          td.textContent = value !== undefined && value !== null ? String(value) : '';
          // Log para debug em consoles do dev
          if (console && console.warn) {console.warn('Skargrid: erro ao executar renderer para coluna', column.field, e);}
        }
      } else {
        td.textContent = value !== undefined && value !== null ? value : '';
      }

      td.dataset.field = column.field;
      tr.appendChild(td);
    });

    return tr;
  }

  /**
   * Manipula o scroll virtual
   */
  handleVirtualScroll(e) {
    if (typeof VirtualizationFeature !== 'undefined') {
      VirtualizationFeature.handleVirtualScroll(this, e);
    } else {
      // Fallback básico se VirtualizationFeature não disponível
      this.handleBasicVirtualScroll(e);
    }
  }

  /**
   * Fallback básico para scroll virtual quando VirtualizationFeature não está disponível
   */
  handleBasicVirtualScroll(e) {
    const scrollTop = e.target.scrollTop;
    this.virtualScrollTop = scrollTop;

    // Atualiza a posição da tabela dentro do container virtual
    const virtualContainer = this.container.querySelector('.skargrid-table-container > div');
    const table = virtualContainer.querySelector('.skargrid');
    if (table) {
      // Calcula qual deve ser a posição da tabela baseada no scroll
      const startIndex = Math.max(0, Math.floor(scrollTop / this.virtualRowHeight) - this.virtualBufferSize);
      const topOffset = startIndex * this.virtualRowHeight;
      table.style.top = `${topOffset}px`;

      // Calcula a nova altura da tabela baseada nas linhas que serão renderizadas
      const endIndex = Math.min(this.filteredData.length, startIndex + this.virtualVisibleRows + (this.virtualBufferSize * 2));
      const renderedRows = endIndex - startIndex;
      const tableHeight = renderedRows * this.virtualRowHeight;
      table.style.height = `${tableHeight}px`;

      // Re-renderiza apenas o corpo da tabela com as linhas corretas
      const oldTbody = table.querySelector('tbody');
      if (oldTbody) {
        const newTbody = this.renderBody();
        table.replaceChild(newTbody, oldTbody);
      }
    }
  }

  /**
   * Renderiza os controles de paginação
   */
  renderPagination() {
    if (typeof PaginationFeature !== 'undefined') {
      return PaginationFeature.renderPagination(this);
    }
    return document.createElement('div');
  }

  /**
   * Fallback básico para renderização virtual quando VirtualizationFeature não está disponível
   */
  renderBasicVirtualStructure(tableContainer) {
    const virtualContainer = document.createElement('div');
    virtualContainer.style.position = 'relative';
    virtualContainer.style.height = `${this.filteredData.length * this.virtualRowHeight}px`;

    // Calcula quantas linhas serão realmente renderizadas
    const startIndex = Math.max(0, Math.floor(this.virtualScrollTop / this.virtualRowHeight) - this.virtualBufferSize);
    const endIndex = Math.min(this.filteredData.length, startIndex + this.virtualVisibleRows + (this.virtualBufferSize * 2));
    const renderedRows = endIndex - startIndex;

    // Cria a tabela posicionada absolutamente
    const table = document.createElement('table');
    table.className = this.options.className;
    table.style.position = 'absolute';
    table.style.top = '0';
    table.style.left = '0';
    table.style.width = '100%';
    // Define altura baseada no número real de linhas renderizadas
    const tableHeight = renderedRows * this.virtualRowHeight;
    table.style.height = `${tableHeight}px`;

    const thead = this.renderHeader();
    thead.style.position = 'sticky';
    thead.style.top = '0';
    thead.style.zIndex = '1';
    thead.style.background = 'var(--sg-thead-bg, #f8f9fa)';
    thead.style.width = '100%';
    table.appendChild(thead);

    const tbody = this.renderBody();
    table.appendChild(tbody);

    virtualContainer.appendChild(table);
    tableContainer.appendChild(virtualContainer);
  }

  /**
   * Navega para uma página específica
   */
  goToPage(pageNumber) {
    if (typeof PaginationFeature !== 'undefined') {
      PaginationFeature.goToPage(this, pageNumber);
    }
  }

  /**
   * Muda o número de itens por página
   */
  changePageSize(newSize) {
    if (typeof PaginationFeature !== 'undefined') {
      PaginationFeature.changePageSize(this, newSize);
    }
  }

  /**
   * Atualiza os dados da tabela
   */
  updateData(newData) {
    this.options.data = newData;
    this.originalData = [...newData];
    this.currentPage = 1;
    this.sortColumn = null;
    this.sortDirection = null;
    this.selectedRows.clear();  // Limpa seleções ao atualizar dados
    this.searchText = '';
    
    // Reseta scroll virtual
    this.virtualScrollTop = 0;
    
    this.applyFilters();
    this.calculatePagination();
    this.render();
  }

  /**
   * Manipula a busca de texto
   */
  handleSearch(searchText) {
    if (typeof FilterFeature !== 'undefined') {
      FilterFeature.handleSearch(this, searchText);
    }
  }

  /**
   * Manipula filtro por coluna
   */
  handleColumnFilter(field, value) {
    if (typeof FilterFeature !== 'undefined') {
      FilterFeature.handleColumnFilter(this, field, value);
    }
  }

  /**
   * Limpa todos os filtros de coluna
   */
  clearColumnFilters() {
    if (typeof FilterFeature !== 'undefined') {
      FilterFeature.clearColumnFilters(this);
    }
  }

  /**
   * Limpa TODOS os filtros (busca + filtros de coluna)
   */
  clearAllFilters() {
    if (typeof FilterFeature !== 'undefined') {
      FilterFeature.clearAllFilters(this);
    }
  }

  /**
   * Atualiza o botão de limpar filtros com contador de filtros ativos
   */
  /**
   * Atualiza o botão de limpar filtros com contador de filtros ativos
   */
  updateClearFiltersButton(button = null) {
    if (typeof TopBarFeature !== 'undefined') {
      TopBarFeature.updateClearFiltersButton(this, button);
    }
  }

  /**
   * Aplica filtros (busca + filtros de coluna) aos dados
   */
  applyFilters() {
    const previousFilteredCount = this.filteredData ? this.filteredData.length : this.options.data.length;

    if (typeof FilterFeature !== 'undefined') {
      FilterFeature.applyFilters(this);
    }

    // Ajusta scroll virtual se necessário após aplicação de filtros
    if (this.options.virtualization && this.filteredData) {
      const newFilteredCount = this.filteredData.length;
      const maxScrollTop = Math.max(0, (newFilteredCount * this.virtualRowHeight) - 400); // 400px é altura aproximada do container

      // Se o scroll atual está além do novo tamanho máximo, ajusta para o topo ou final
      if (this.virtualScrollTop > maxScrollTop) {
        this.virtualScrollTop = Math.max(0, maxScrollTop);

        // Atualiza o scroll do container no DOM
        const tableContainer = this.container.querySelector('.skargrid-table-container');
        if (tableContainer) {
          tableContainer.scrollTop = this.virtualScrollTop;
        }
      }

      // Se a quantidade de dados mudou drasticamente, volta ao topo para melhor UX
      if (previousFilteredCount > newFilteredCount * 2) {
        this.virtualScrollTop = 0;

        // Atualiza o scroll do container no DOM
        const tableContainer = this.container.querySelector('.skargrid-table-container');
        if (tableContainer) {
          tableContainer.scrollTop = 0;
        }
      }
    }
  }

  /**
   * Limpa a busca
   */
  clearSearch() {
    if (typeof FilterFeature !== 'undefined') {
      FilterFeature.clearSearch(this);
    }
  }

  /**
   * Manipula o clique em uma coluna para ordenação
   */
  handleSort(field) {
    if (typeof SortFeature !== 'undefined') {
      SortFeature.handleSort(this, field);
    }
  }

  /**
   * Ordena os dados pela coluna e direção atuais
   */
  sortData() {
    if (typeof SortFeature !== 'undefined') {
      SortFeature.sortData(this);
    }
  }

  /**
   * Remove a ordenação e restaura a ordem original
   */
  clearSort() {
    this.sortColumn = null;
    this.sortDirection = null;
    this.options.data = [...this.originalData];
    this.currentPage = 1;
    this.applyFilters();
    this.calculatePagination();
    this.render();
  }

  /**
   * Obtém os dados atuais
   */
  getData() {
    return this.options.data;
  }

  /**
   * Alterna a seleção de uma linha específica
   */
  toggleSelectRow(index, selected) {
    if (typeof SelectionFeature !== 'undefined') {
      SelectionFeature.toggleSelectRow(this, index, selected);
    }
  }

  /**
   * Seleciona ou desseleciona todas as linhas
   */
  toggleSelectAll(selected) {
    if (typeof SelectionFeature !== 'undefined') {
      SelectionFeature.toggleSelectAll(this, selected);
    }
  }

  /**
   * Verifica se todas as linhas estão selecionadas
   */
  isAllSelected() {
    if (typeof SelectionFeature !== 'undefined') {
      return SelectionFeature.isAllSelected(this);
    }
    return false;
  }

  /**
   * Seleciona linhas específicas por índices
   */
  selectRows(indices) {
    if (typeof SelectionFeature !== 'undefined') {
      SelectionFeature.selectRows(this, indices);
    }
  }

  /**
   * Desseleciona linhas específicas por índices
   */
  deselectRows(indices) {
    if (typeof SelectionFeature !== 'undefined') {
      SelectionFeature.deselectRows(this, indices);
    }
  }

  /**
   * Limpa todas as seleções
   */
  clearSelection() {
    if (typeof SelectionFeature !== 'undefined') {
      SelectionFeature.clearSelection(this);
    }
  }

  /**
   * Obtém os dados das linhas selecionadas
   */
  getSelectedRows() {
    if (typeof SelectionFeature !== 'undefined') {
      return SelectionFeature.getSelectedRows(this);
    }
    return [];
  }

  /**
   * Obtém os índices das linhas selecionadas
   */
  getSelectedIndices() {
    if (typeof SelectionFeature !== 'undefined') {
      return SelectionFeature.getSelectedIndices(this);
    }
    return [];
  }

  /**
   * Mostra indicador de loading
   */
  showLoading() {
    this.isLoading = true;
  }

  /**
   * Esconde indicador de loading
   */
  hideLoading() {
    this.isLoading = false;
  }

  /**
   * Destroi a instância da tabela
   */
  destroy() {
    this.container.innerHTML = '';
  }

  /**
   * Altera o tema da tabela dinamicamente
   * @param {string} theme - 'light' ou 'dark'
   */
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      console.warn(`Tema inválido: ${theme}. Use 'light' ou 'dark'.`);
      return;
    }

    this.options.theme = theme;
    
    const wrapper = this.container.querySelector('.skargrid-wrapper');
    if (!wrapper) {
      console.warn('Wrapper não encontrado. A tabela foi renderizada?');
      return;
    }

    if (theme === 'dark') {
      wrapper.classList.add('skargrid-dark');
    } else {
      wrapper.classList.remove('skargrid-dark');
    }
  }
}

// Exporta para uso global como Skargrid (implementação)


// UMD/Global export para browser
if (typeof window !== 'undefined') {
  window.Skargrid = Skargrid;
}

// Suporte para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Skargrid;
}
