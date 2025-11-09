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
      ...options
    };

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
        .map(col => col.field)
    );
    this.columnOrder = this.options.columns.map(col => col.field);

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
          <span>Carregando...</span>
        </div>
      `;
      tableContainer.appendChild(loadingOverlay);
    }

    // Cria o elemento da tabela
    const table = document.createElement('table');
    table.className = this.options.className;

    // Renderiza o cabeçalho
    const thead = this.renderHeader();
    table.appendChild(thead);

    // Renderiza o corpo da tabela
    const tbody = this.renderBody();
    table.appendChild(tbody);

    // Adiciona a tabela ao container
    tableContainer.appendChild(table);
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
    const table = this.container.querySelector('.skargrid');
    if (!table) return;

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
    const hasSearch = this.options.searchable;
    const hasColumnConfig = this.options.columnConfig && typeof this.renderColumnConfigButton === 'function';
    const hasFilterClear = this.options.columnFilters;
    const hasExportCSV = this.options.exportCSV && typeof this.renderExportCSVButton === 'function';

    // Se não tem nada para renderizar, retorna null
    if (!hasSearch && !hasColumnConfig && !hasFilterClear && !hasExportCSV) {
      return null;
    }

    const searchContainer = document.createElement('div');
    searchContainer.className = 'skargrid-search-container';

    // Renderiza input de busca (se habilitado)
    if (hasSearch) {
      const searchWrapper = this.renderSearchInput();
      searchContainer.appendChild(searchWrapper);
    }

    // Renderiza botões de ação (sempre que houver algum botão)
    if (hasFilterClear || hasColumnConfig || hasExportCSV) {
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'skargrid-search-actions';

      // Botão "Limpar Filtros" (apenas se columnFilters estiver ativo)
      if (hasFilterClear) {
        const clearFiltersButton = this.renderClearFiltersButton();
        actionsContainer.appendChild(clearFiltersButton);
      }

      // Botão "Configurar Colunas" (se o módulo estiver carregado)
      if (hasColumnConfig) {
        const columnConfigBtn = this.renderColumnConfigButton();
        actionsContainer.appendChild(columnConfigBtn);
      }

      // Botão "Exportar CSV" (se o módulo estiver carregado)
      if (hasExportCSV) {
        const exportButton = this.renderExportCSVButton();
        actionsContainer.appendChild(exportButton);
      }

      searchContainer.appendChild(actionsContainer);
    }

    return searchContainer;
  }

  /**
   * Renderiza apenas o input de busca
   */
  renderSearchInput() {
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'skargrid-search-wrapper';

    // Ícone de busca (SVG profissional)
    const searchIcon = document.createElement('span');
    searchIcon.className = 'skargrid-search-icon';
    searchIcon.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    `;

    // Input de busca
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'skargrid-search-input';
    searchInput.placeholder = 'Buscar em todas as colunas...';
    searchInput.value = this.searchText;
    
    // Evento de busca COM debounce (300ms) para performance
    searchInput.oninput = (e) => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.handleSearch(e.target.value);
      }, 300);
    };

    // Botão limpar (SVG profissional)
    const clearButton = document.createElement('button');
    clearButton.className = 'skargrid-search-clear';
    clearButton.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    clearButton.style.display = this.searchText ? 'flex' : 'none';
    clearButton.onclick = () => {
      searchInput.value = '';
      searchInput.focus();
      this.handleSearch('');
    };

    searchWrapper.appendChild(searchIcon);
    searchWrapper.appendChild(searchInput);
    searchWrapper.appendChild(clearButton);

    return searchWrapper;
  }

  /**
   * Renderiza botão "Limpar Filtros"
   */
  renderClearFiltersButton() {
    const clearFiltersButton = document.createElement('button');
    clearFiltersButton.className = 'skargrid-clear-filters-btn';
    clearFiltersButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        <line x1="18" y1="6" x2="6" y2="18"></line>
      </svg>
      <span class="filter-count-badge" style="display: none;">0</span>
    `;
    clearFiltersButton.title = 'Limpar Filtros';
    clearFiltersButton.onclick = () => this.clearAllFilters();
    
    // Atualiza contador de filtros ativos
    this.updateClearFiltersButton(clearFiltersButton);

    return clearFiltersButton;
  }

  /**
   * Renderiza botão "Exportar CSV"
   */
  renderExportCSVButton() {
    const exportButton = document.createElement('button');
    exportButton.className = 'skargrid-clear-filters-btn';
    exportButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    `;
    exportButton.title = 'Exportar CSV';
    exportButton.onclick = () => this.exportToCSV();
    
    return exportButton;
  }

  renderSearchBox() {
    // DEPRECATED: Mantido para compatibilidade com código antigo
    // Use renderTopBar() no lugar
    return this.renderTopBar();
  }

  /**
   * Renderiza o cabeçalho da tabela
   */
  renderHeader() {
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

      // Verifica se a coluna é ordenável
      const isSortable = this.options.sortable && column.sortable !== false;
      const isFilterable = this.options.columnFilters && column.filterable !== false;

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
        textSortContainer.onclick = () => this.handleSort(column.field);
        
        // Adiciona indicador de ordenação se esta coluna está ordenada
        if (this.sortColumn === column.field) {
          th.classList.add('sorted');
          th.classList.add(this.sortDirection);
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
        
        if (this.sortColumn === column.field) {
          sortIcon.textContent = this.sortDirection === 'asc' ? '▲' : '▼';
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
        const hasFilter = this.hasActiveFilter(column.field);
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
          this.toggleFilterDropdown(column, filterIconBtn);
        };
        
        content.appendChild(filterIconBtn);
      }

      th.appendChild(content);
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
    if (!str) return '';
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
      let top = rect.bottom + 2;
      let left = rect.left;
      
      // Ajusta se sair pela direita
      if (left + dropdownRect.width > viewportWidth - 20) {
        left = rect.right - dropdownRect.width;
      }
      
      // Ajusta se sair por baixo
      if (top + dropdownRect.height > viewportHeight - 20) {
        // Abre para cima
        top = rect.top - dropdownRect.height - 2;
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
      this.createInputFilter(dropdown, column, filterType);
    }

    return dropdown;
  }

  /**
   * Cria filtro com checkboxes e busca interna (valores disponíveis dinamicamente)
   */
  createCheckboxFilter(dropdown, column) {
    // Pega TODOS os valores que existem nos dados originais
    const allUniqueValues = this.getUniqueColumnValues(column.field);
    
    // Pega valores DISPONÍVEIS considerando outros filtros ativos
    const availableValues = this.getAvailableColumnValues(column.field);
    
    // Inicializa selected se não existir (com todos os valores originais)
    if (!this.columnFilterSelected[column.field]) {
      this.columnFilterSelected[column.field] = [...allUniqueValues];
    }

    // Header do dropdown
    const header = document.createElement('div');
    header.className = 'filter-dropdown-header';
    header.innerHTML = `<strong>Filtrar: ${column.title || column.field}</strong>`;
    dropdown.appendChild(header);

    // Campo de busca interno
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'filter-search-wrapper';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'filter-search-input';
    searchInput.placeholder = 'Buscar...';
    
    searchWrapper.appendChild(searchInput);
    dropdown.appendChild(searchWrapper);

    // Select All / Deselect All
    const selectAllWrapper = document.createElement('div');
    selectAllWrapper.className = 'filter-select-all';
    
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.id = `select-all-${column.field}`;
    selectAllCheckbox.checked = this.columnFilterSelected[column.field].length === allUniqueValues.length;
    
    const selectAllLabel = document.createElement('label');
    selectAllLabel.htmlFor = `select-all-${column.field}`;
    selectAllLabel.textContent = 'Selecionar Todos';
    
    selectAllWrapper.appendChild(selectAllCheckbox);
    selectAllWrapper.appendChild(selectAllLabel);
    dropdown.appendChild(selectAllWrapper);

    // Lista de checkboxes com scroll
    const listWrapper = document.createElement('div');
    listWrapper.className = 'filter-list-wrapper';
    
    const list = document.createElement('div');
    list.className = 'filter-list';

    const renderList = (filteredValues = allUniqueValues) => {
      list.innerHTML = '';
      filteredValues.forEach(value => {
        const item = document.createElement('div');
        item.className = 'filter-list-item';
        
        // Verifica se o valor está disponível nos dados filtrados
        const isAvailable = availableValues.includes(value);
        if (!isAvailable) {
          item.classList.add('filter-item-disabled');
          item.title = 'Não disponível com os filtros atuais';
        }
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = value;
        checkbox.id = `filter-${column.field}-${value}`;
        checkbox.checked = this.columnFilterSelected[column.field].includes(value);
        checkbox.disabled = !isAvailable; // Desabilita se não disponível
        
        const label = document.createElement('label');
        label.htmlFor = `filter-${column.field}-${value}`;
        label.textContent = value;
        
        item.appendChild(checkbox);
        item.appendChild(label);
        list.appendChild(item);

        // Toggle individual
        checkbox.onchange = () => {
          if (checkbox.checked) {
            if (!this.columnFilterSelected[column.field].includes(value)) {
              this.columnFilterSelected[column.field].push(value);
            }
          } else {
            this.columnFilterSelected[column.field] = 
              this.columnFilterSelected[column.field].filter(v => v !== value);
          }
          selectAllCheckbox.checked = 
            this.columnFilterSelected[column.field].length === allUniqueValues.length;
        };
      });
    };

    renderList();
    listWrapper.appendChild(list);
    dropdown.appendChild(listWrapper);

    // Busca interna (com normalização de acentos)
    searchInput.oninput = (e) => {
      const searchTerm = this.normalizeString(e.target.value);
      const filtered = allUniqueValues.filter(val => 
        this.normalizeString(val).includes(searchTerm)
      );
      renderList(filtered);
    };

    // Select/Deselect All
    selectAllCheckbox.onchange = () => {
      if (selectAllCheckbox.checked) {
        this.columnFilterSelected[column.field] = [...allUniqueValues];
      } else {
        this.columnFilterSelected[column.field] = [];
      }
      renderList();
    };

    // Footer com botões
    const footer = document.createElement('div');
    footer.className = 'filter-dropdown-footer';
    
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Limpar';
    clearBtn.className = 'filter-btn-clear';
    clearBtn.onclick = () => {
      this.columnFilterSelected[column.field] = [...allUniqueValues];
      this.handleColumnFilterCheckbox(column.field);
      dropdown.remove();
      this.removeScrollListeners();
      this.openFilterDropdown = null;
    };
    
    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Aplicar';
    applyBtn.className = 'filter-btn-apply';
    applyBtn.onclick = () => {
      this.handleColumnFilterCheckbox(column.field);
      dropdown.remove();
      this.removeScrollListeners();
      this.openFilterDropdown = null;
    };
    
    footer.appendChild(clearBtn);
    footer.appendChild(applyBtn);
    dropdown.appendChild(footer);
  }

  /**
   * Cria filtro com input simples
   */
  createInputFilter(dropdown, column, filterType) {
    const header = document.createElement('div');
    header.className = 'filter-dropdown-header';
    header.innerHTML = `<strong>Filtrar: ${column.title || column.field}</strong>`;
    dropdown.appendChild(header);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'filter-input-wrapper';
    
    const input = document.createElement('input');
    input.type = filterType === 'number' ? 'number' : filterType === 'date' ? 'date' : 'text';
    input.className = 'filter-dropdown-input';
    input.placeholder = `Digite para filtrar...`;
    input.value = this.columnFilterValues[column.field] || '';
    
    inputWrapper.appendChild(input);
    dropdown.appendChild(inputWrapper);

    const footer = document.createElement('div');
    footer.className = 'filter-dropdown-footer';
    
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Limpar';
    clearBtn.className = 'filter-btn-clear';
    clearBtn.onclick = () => {
      this.handleColumnFilter(column.field, '');
      dropdown.remove();
      this.openFilterDropdown = null;
    };
    
    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Aplicar';
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
    const pageData = this.getPageData();

    pageData.forEach((row, pageIndex) => {
      // Calcula o índice global do registro
      const globalIndex = this.options.pagination
        ? (this.currentPage - 1) * this.options.pageSize + pageIndex
        : pageIndex;

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
        if (column.formatter && typeof column.formatter === 'function') {
          td.innerHTML = column.formatter(value, row, globalIndex);
        } else {
          td.textContent = value !== undefined && value !== null ? value : '';
        }

        td.dataset.field = column.field;
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    return tbody;
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
  updateClearFiltersButton(button = null) {
    if (!button) {
      button = this.container.querySelector('.skargrid-clear-filters-btn');
    }
    
    if (!button) return;
    
    // Conta quantos filtros estão ativos
    let activeCount = 0;
    
    // Conta busca global
    if (this.searchText) activeCount++;
    
    // Conta filtros de coluna
    this.options.columns.forEach(column => {
      if (column.filterable !== false) {
        if (this.hasActiveFilter(column.field)) {
          activeCount++;
        }
      }
    });
    
    const badge = button.querySelector('.filter-count-badge');
    if (activeCount > 0) {
      badge.textContent = activeCount;
      badge.style.display = 'flex';
      button.classList.add('has-filters');
    } else {
      badge.style.display = 'none';
      button.classList.remove('has-filters');
    }
  }

  /**
   * Aplica filtros (busca + filtros de coluna) aos dados
   */
  applyFilters() {
    if (typeof FilterFeature !== 'undefined') {
      FilterFeature.applyFilters(this);
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
