/**
 * TableJS - Biblioteca para criação de tabelas interativas
 * @version 0.6.0
 */

class TableJS {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container com ID "${containerId}" não encontrado`);
    }

    this.options = {
      data: options.data || [],
      columns: options.columns || [],
      className: options.className || 'tablejs',
      pagination: options.pagination !== undefined ? options.pagination : false,
      pageSize: options.pageSize || 10,
      pageSizeOptions: options.pageSizeOptions || [10, 25, 50, 100],
      sortable: options.sortable !== undefined ? options.sortable : true,
      selectable: options.selectable !== undefined ? options.selectable : false,
      searchable: options.searchable !== undefined ? options.searchable : false,
      columnFilters: options.columnFilters !== undefined ? options.columnFilters : false,
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

    this.init();
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
    if (this.options.pagination) {
      const totalRecords = this.filteredData.length;
      this.totalPages = Math.ceil(totalRecords / this.options.pageSize);
      
      // Garante que a página atual é válida
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages || 1;
      }
    }
  }

  /**
   * Obtém os dados da página atual
   */
  getPageData() {
    if (!this.options.pagination) {
      return this.filteredData;
    }

    const startIndex = (this.currentPage - 1) * this.options.pageSize;
    const endIndex = startIndex + this.options.pageSize;
    return this.filteredData.slice(startIndex, endIndex);
  }

  /**
   * Renderiza a tabela completa
   */
  render(fullRender = true) {
    // Se já existe uma tabela e não precisa de render completo, faz update rápido
    if (!fullRender && this.container.querySelector('.tablejs-wrapper')) {
      this.updateTableContent();
      return;
    }

    // Limpa o container
    this.container.innerHTML = '';

    // Cria wrapper principal
    const wrapper = document.createElement('div');
    wrapper.className = 'tablejs-wrapper';

    // Adiciona campo de busca se habilitado
    if (this.options.searchable) {
      const searchBox = this.renderSearchBox();
      wrapper.appendChild(searchBox);
    }

    // Container da tabela com loading
    const tableContainer = document.createElement('div');
    tableContainer.className = 'tablejs-table-container';
    
    // Adiciona indicador de loading APENAS na área da tabela
    if (this.isLoading) {
      const loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'tablejs-loading-overlay';
      loadingOverlay.innerHTML = `
        <div class="tablejs-spinner">
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
    const table = this.container.querySelector('.tablejs');
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
      const oldPagination = this.container.querySelector('.tablejs-pagination');
      const newPagination = this.renderPagination();
      if (oldPagination && oldPagination.parentNode) {
        oldPagination.parentNode.replaceChild(newPagination, oldPagination);
      }
    }
  }

  /**
   * Renderiza o campo de busca
   */
  renderSearchBox() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'tablejs-search-container';

    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'tablejs-search-wrapper';

    // Ícone de busca (SVG profissional)
    const searchIcon = document.createElement('span');
    searchIcon.className = 'tablejs-search-icon';
    searchIcon.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    `;

    // Input de busca
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'tablejs-search-input';
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
    clearButton.className = 'tablejs-search-clear';
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

    // Botão "Limpar Todos os Filtros" à direita
    const clearFiltersButton = document.createElement('button');
    clearFiltersButton.className = 'tablejs-clear-filters-btn';
    clearFiltersButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        <line x1="18" y1="6" x2="6" y2="18"></line>
      </svg>
      <span>Limpar Filtros</span>
      <span class="filter-count-badge" style="display: none;">0</span>
    `;
    clearFiltersButton.onclick = () => this.clearAllFilters();
    
    // Atualiza contador de filtros ativos
    this.updateClearFiltersButton(clearFiltersButton);

    searchContainer.appendChild(searchWrapper);
    searchContainer.appendChild(clearFiltersButton);

    return searchContainer;
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
      th.className = 'tablejs-select-header';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'tablejs-checkbox';
      checkbox.checked = this.isAllSelected();
      checkbox.onchange = (e) => this.toggleSelectAll(e.target.checked);
      
      th.appendChild(checkbox);
      tr.appendChild(th);
    }

    this.options.columns.forEach(column => {
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
        
        // Conta filtros ativos nesta coluna
        const activeFilters = this.getActiveFilterCount(column.field);
        if (activeFilters > 0) {
          filterIconBtn.classList.add('has-filter');
        }
        
        filterIconBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          ${activeFilters > 0 ? `<span class="filter-count">${activeFilters}</span>` : ''}
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
   * Conta quantos filtros estão ativos para uma coluna
   */
  getActiveFilterCount(field) {
    const selected = this.columnFilterSelected[field];
    if (selected && selected.length > 0) {
      // Para select com checkboxes, conta quantos foram desmarcados
      const allValues = this.getUniqueColumnValues(field);
      return allValues.length - selected.length;
    }
    if (this.columnFilterValues[field]) {
      return 1;
    }
    return 0;
  }

  /**
   * Obtém valores únicos de uma coluna
   */
  getUniqueColumnValues(field) {
    return [...new Set(
      this.options.data
        .map(row => row[field])
        .filter(val => val !== null && val !== undefined && val !== '')
    )].sort();
  }

  /**
   * Abre/fecha dropdown de filtro
   */
  toggleFilterDropdown(column, buttonElement) {
    // Fecha dropdown aberto
    if (this.openFilterDropdown) {
      this.openFilterDropdown.remove();
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
    
    // Calcula posicionamento
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
    dropdown.style.visibility = 'visible';
    
    this.openFilterDropdown = dropdown;

    // Fecha ao clicar fora
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== buttonElement) {
          dropdown.remove();
          this.openFilterDropdown = null;
        }
      }, { once: true });
    }, 100);
  }

  /**
   * Cria dropdown de filtro profissional
   */
  createFilterDropdown(column) {
    const dropdown = document.createElement('div');
    dropdown.className = 'tablejs-filter-dropdown';

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
   * Cria filtro com checkboxes e busca interna
   */
  createCheckboxFilter(dropdown, column) {
    const uniqueValues = this.getUniqueColumnValues(column.field);
    
    // Inicializa selected se não existir
    if (!this.columnFilterSelected[column.field]) {
      this.columnFilterSelected[column.field] = [...uniqueValues];
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
    selectAllCheckbox.checked = this.columnFilterSelected[column.field].length === uniqueValues.length;
    
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

    const renderList = (filteredValues = uniqueValues) => {
      list.innerHTML = '';
      filteredValues.forEach(value => {
        const item = document.createElement('div');
        item.className = 'filter-list-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = value;
        checkbox.id = `filter-${column.field}-${value}`;
        checkbox.checked = this.columnFilterSelected[column.field].includes(value);
        
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
            this.columnFilterSelected[column.field].length === uniqueValues.length;
        };
      });
    };

    renderList();
    listWrapper.appendChild(list);
    dropdown.appendChild(listWrapper);

    // Busca interna
    searchInput.oninput = (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filtered = uniqueValues.filter(val => 
        String(val).toLowerCase().includes(searchTerm)
      );
      renderList(filtered);
    };

    // Select/Deselect All
    selectAllCheckbox.onchange = () => {
      if (selectAllCheckbox.checked) {
        this.columnFilterSelected[column.field] = [...uniqueValues];
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
      this.columnFilterSelected[column.field] = [...uniqueValues];
      this.handleColumnFilterCheckbox(column.field);
      dropdown.remove();
      this.openFilterDropdown = null;
    };
    
    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Aplicar';
    applyBtn.className = 'filter-btn-apply';
    applyBtn.onclick = () => {
      this.handleColumnFilterCheckbox(column.field);
      dropdown.remove();
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
        td.className = 'tablejs-select-cell';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'tablejs-checkbox';
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

      this.options.columns.forEach(column => {
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
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'tablejs-pagination';

    // Info de registros
    const info = this.renderPaginationInfo();
    paginationDiv.appendChild(info);

    // Controles de navegação
    const controls = this.renderPaginationControls();
    paginationDiv.appendChild(controls);

    // Seletor de itens por página
    const sizeSelector = this.renderPageSizeSelector();
    paginationDiv.appendChild(sizeSelector);

    return paginationDiv;
  }

  /**
   * Renderiza informação sobre registros exibidos
   */
  renderPaginationInfo() {
    const info = document.createElement('div');
    info.className = 'tablejs-pagination-info';

    const totalRecords = this.filteredData.length;
    const totalOriginal = this.options.data.length;
    const startRecord = totalRecords === 0 ? 0 : (this.currentPage - 1) * this.options.pageSize + 1;
    const endRecord = Math.min(this.currentPage * this.options.pageSize, totalRecords);

    let text = `Mostrando ${startRecord} até ${endRecord} de ${totalRecords} registros`;
    
    // Adiciona info de filtro se houver busca ativa
    if (this.searchText && totalRecords < totalOriginal) {
      text += ` (filtrados de ${totalOriginal} total)`;
    }

    info.textContent = text;

    return info;
  }

  /**
   * Renderiza controles de navegação (anterior/próximo)
   */
  renderPaginationControls() {
    const controls = document.createElement('div');
    controls.className = 'tablejs-pagination-controls';

    // Botão Primeira Página
    const firstBtn = document.createElement('button');
    firstBtn.textContent = '«';
    firstBtn.className = 'tablejs-pagination-btn';
    firstBtn.disabled = this.currentPage === 1;
    firstBtn.onclick = () => this.goToPage(1);
    controls.appendChild(firstBtn);

    // Botão Anterior
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '‹';
    prevBtn.className = 'tablejs-pagination-btn';
    prevBtn.disabled = this.currentPage === 1;
    prevBtn.onclick = () => this.goToPage(this.currentPage - 1);
    controls.appendChild(prevBtn);

    // Números de página
    const pageNumbers = this.getPageNumbers();
    pageNumbers.forEach(pageNum => {
      if (pageNum === '...') {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.className = 'tablejs-pagination-ellipsis';
        controls.appendChild(ellipsis);
      } else {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = pageNum;
        pageBtn.className = 'tablejs-pagination-btn';
        if (pageNum === this.currentPage) {
          pageBtn.classList.add('active');
        }
        pageBtn.onclick = () => this.goToPage(pageNum);
        controls.appendChild(pageBtn);
      }
    });

    // Botão Próximo
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '›';
    nextBtn.className = 'tablejs-pagination-btn';
    nextBtn.disabled = this.currentPage === this.totalPages;
    nextBtn.onclick = () => this.goToPage(this.currentPage + 1);
    controls.appendChild(nextBtn);

    // Botão Última Página
    const lastBtn = document.createElement('button');
    lastBtn.textContent = '»';
    lastBtn.className = 'tablejs-pagination-btn';
    lastBtn.disabled = this.currentPage === this.totalPages;
    lastBtn.onclick = () => this.goToPage(this.totalPages);
    controls.appendChild(lastBtn);

    return controls;
  }

  /**
   * Calcula quais números de página devem ser exibidos
   */
  getPageNumbers() {
    const pages = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible + 2) {
      // Mostra todas as páginas
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostra primeira, última e páginas ao redor da atual
      pages.push(1);

      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.totalPages - 1, this.currentPage + 1);

      if (this.currentPage <= 3) {
        end = 4;
      } else if (this.currentPage >= this.totalPages - 2) {
        start = this.totalPages - 3;
      }

      if (start > 2) pages.push('...');

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < this.totalPages - 1) pages.push('...');

      pages.push(this.totalPages);
    }

    return pages;
  }

  /**
   * Renderiza seletor de itens por página
   */
  renderPageSizeSelector() {
    const selector = document.createElement('div');
    selector.className = 'tablejs-page-size';

    const label = document.createElement('span');
    label.textContent = 'Itens por página: ';
    selector.appendChild(label);

    const select = document.createElement('select');
    select.className = 'tablejs-page-size-select';

    this.options.pageSizeOptions.forEach(size => {
      const option = document.createElement('option');
      option.value = size;
      option.textContent = size;
      if (size === this.options.pageSize) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    select.onchange = (e) => {
      this.changePageSize(parseInt(e.target.value));
    };

    selector.appendChild(select);

    return selector;
  }

  /**
   * Navega para uma página específica
   */
  goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      return;
    }

    this.currentPage = pageNumber;
    this.render(false); // Update rápido
  }

  /**
   * Muda o número de itens por página
   */
  changePageSize(newSize) {
    this.options.pageSize = newSize;
    this.currentPage = 1;
    this.calculatePagination();
    this.render(false); // Update rápido
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
    this.searchText = searchText.trim();
    this.currentPage = 1;
    
    // Aplica filtros e renderiza de forma otimizada
    this.applyFilters();
    this.calculatePagination();
    this.render(false); // false = update rápido, não recria tudo
    this.updateClearFiltersButton();
  }

  /**
   * Manipula filtro por coluna
   */
  handleColumnFilter(field, value) {
    if (value) {
      this.columnFilterValues[field] = value;
    } else {
      delete this.columnFilterValues[field];
    }
    
    this.currentPage = 1;
    this.applyFilters();
    this.calculatePagination();
    this.render(false);
    this.updateClearFiltersButton();
  }

  /**
   * Limpa todos os filtros de coluna
   */
  clearColumnFilters() {
    this.columnFilterValues = {};
    this.currentPage = 1;
    this.applyFilters();
    this.calculatePagination();
    this.render(false);
  }

  /**
   * Limpa TODOS os filtros (busca + filtros de coluna)
   */
  clearAllFilters() {
    // Limpa busca global
    this.searchText = '';
    const searchInput = this.container.querySelector('.tablejs-search-input');
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Limpa filtros de coluna
    this.columnFilterValues = {};
    this.columnFilterSelected = {};
    
    // Reseta valores padrão para select types
    this.options.columns.forEach(column => {
      if (column.filterable !== false && column.filterType === 'select') {
        const uniqueValues = this.getUniqueColumnValues(column.field);
        this.columnFilterSelected[column.field] = [...uniqueValues];
      }
    });
    
    // Fecha dropdown aberto
    if (this.openFilterDropdown) {
      this.openFilterDropdown.remove();
      this.openFilterDropdown = null;
    }
    
    this.currentPage = 1;
    this.applyFilters();
    this.calculatePagination();
    this.render();
  }

  /**
   * Atualiza o botão de limpar filtros com contador
   */
  updateClearFiltersButton(button = null) {
    if (!button) {
      button = this.container.querySelector('.tablejs-clear-filters-btn');
    }
    
    if (!button) return;
    
    // Conta filtros ativos
    let activeCount = 0;
    
    // Conta busca global
    if (this.searchText) activeCount++;
    
    // Conta filtros de coluna
    this.options.columns.forEach(column => {
      if (column.filterable !== false) {
        if (column.filterType === 'select') {
          // Para select, conta se tem algum item desmarcado
          const count = this.getActiveFilterCount(column.field);
          if (count > 0) activeCount++;
        } else {
          // Para text/number/date, conta se tem valor
          if (this.columnFilterValues[column.field]) activeCount++;
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
    let filtered = [...this.options.data];

    // Aplica busca global se houver texto
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      
      filtered = filtered.filter(row => {
        // Busca em todas as colunas
        return this.options.columns.some(column => {
          const value = row[column.field];
          if (value == null) return false;
          
          // Converte para string e compara
          return String(value).toLowerCase().includes(searchLower);
        });
      });
    }

    // Aplica filtros por coluna
    if (Object.keys(this.columnFilterValues).length > 0) {
      filtered = filtered.filter(row => {
        // Todas as condições de filtro devem ser atendidas (AND)
        return Object.entries(this.columnFilterValues).every(([field, filterValue]) => {
          const cellValue = row[field];
          
          const column = this.options.columns.find(col => col.field === field);
          const filterType = column?.filterType || 'text';

          // Filtro por tipo
          if (filterType === 'select') {
            // Array de valores selecionados (checkboxes)
            if (Array.isArray(filterValue)) {
              return filterValue.includes(cellValue);
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
            // text - busca parcial case-insensitive
            if (!filterValue) return true;
            if (cellValue == null) return false;
            return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
          }
        });
      });
    }

    this.filteredData = filtered;
  }

  /**
   * Limpa a busca
   */
  clearSearch() {
    this.searchText = '';
    this.currentPage = 1;
    this.applyFilters();
    this.calculatePagination();
    this.render();
  }

  /**
   * Manipula o clique em uma coluna para ordenação
   */
  handleSort(field) {
    // Se já está ordenando por esta coluna, inverte a direção
    if (this.sortColumn === field) {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        // Terceiro clique remove a ordenação
        this.sortColumn = null;
        this.sortDirection = null;
        this.options.data = [...this.originalData];
      }
    } else {
      // Nova coluna, começa com ascendente
      this.sortColumn = field;
      this.sortDirection = 'asc';
    }

    // Aplica a ordenação se houver coluna selecionada
    if (this.sortColumn) {
      this.sortData();
    }

    // Volta para a primeira página após ordenar
    this.currentPage = 1;
    this.calculatePagination();
    this.render(false); // Update rápido
  }

  /**
   * Ordena os dados pela coluna e direção atuais
   */
  sortData() {
    const column = this.options.columns.find(col => col.field === this.sortColumn);
    
    this.options.data.sort((a, b) => {
      let valueA = a[this.sortColumn];
      let valueB = b[this.sortColumn];

      // Aplica função de comparação customizada se existir
      if (column && column.sortCompare && typeof column.sortCompare === 'function') {
        return this.sortDirection === 'asc' 
          ? column.sortCompare(valueA, valueB, a, b)
          : column.sortCompare(valueB, valueA, b, a);
      }

      // Tratamento de valores nulos/undefined
      if (valueA == null) valueA = '';
      if (valueB == null) valueB = '';

      // Detecta o tipo de dado e ordena apropriadamente
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        // Ordenação numérica
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        // Ordenação de string (case-insensitive)
        const strA = String(valueA).toLowerCase();
        const strB = String(valueB).toLowerCase();
        
        if (this.sortDirection === 'asc') {
          return strA.localeCompare(strB);
        } else {
          return strB.localeCompare(strA);
        }
      }
    });

    // Reaplica filtros após ordenar
    this.applyFilters();
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
    if (selected) {
      this.selectedRows.add(index);
    } else {
      this.selectedRows.delete(index);
    }
    this.render(false); // Update rápido
  }

  /**
   * Seleciona ou desseleciona todas as linhas
   */
  toggleSelectAll(selected) {
    if (selected) {
      // Seleciona todas as linhas
      this.options.data.forEach((_, index) => {
        this.selectedRows.add(index);
      });
    } else {
      // Desseleciona todas
      this.selectedRows.clear();
    }
    this.render(false); // Update rápido
  }

  /**
   * Verifica se todas as linhas estão selecionadas
   */
  isAllSelected() {
    if (this.options.data.length === 0) return false;
    return this.selectedRows.size === this.options.data.length;
  }

  /**
   * Seleciona linhas específicas por índices
   */
  selectRows(indices) {
    indices.forEach(index => {
      if (index >= 0 && index < this.options.data.length) {
        this.selectedRows.add(index);
      }
    });
    this.render();
  }

  /**
   * Desseleciona linhas específicas por índices
   */
  deselectRows(indices) {
    indices.forEach(index => {
      this.selectedRows.delete(index);
    });
    this.render();
  }

  /**
   * Limpa todas as seleções
   */
  clearSelection() {
    this.selectedRows.clear();
    this.render();
  }

  /**
   * Obtém os dados das linhas selecionadas
   */
  getSelectedRows() {
    return Array.from(this.selectedRows)
      .map(index => this.options.data[index])
      .filter(row => row !== undefined);
  }

  /**
   * Obtém os índices das linhas selecionadas
   */
  getSelectedIndices() {
    return Array.from(this.selectedRows).sort((a, b) => a - b);
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
}

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.TableJS = TableJS;
}

// Suporte para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TableJS;
}
