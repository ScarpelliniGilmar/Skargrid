/**
 * Skargrid Core - Implementação de renderização e UI
 * @version 0.7.0
 * Este é o core de renderização, o ponto de entrada é index.js
 */

import PaginationFeature from '../features/pagination.js';
import SortFeature from '../features/sort.js';
import SelectionFeature from '../features/selection.js';
import FilterFeature from '../features/filter.js';
import SelectFilterFeature from '../features/select-filter.js';
import InputFilterFeature from '../features/input-filter.js';
import VirtualizationFeature from '../features/virtualization.js';
import { initColumnConfig } from '../features/columnConfig.js';
import ExportFeature from '../features/export.js';
import SearchFeature from '../features/search.js';
import TableHeaderFeature from '../features/table-header.js';
import TableBodyFeature from '../features/table-body.js';
import TopBarFeature from '../features/top-bar.js';
import PersistenceFeature from '../features/persistence.js';
import FooterAggregatesFeature from '../features/footer-aggregates.js';

// Mapeia as opções de callback (compatibilidade) para os eventos do event bus.
const OPTION_EVENT_MAP = {
  onSortChange: 'sortChange',
  onPageChange: 'pageChange',
  onSelectionChange: 'selectionChange',
  onFilterChange: 'filterChange',
  onRowClick: 'rowClick',
};

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
      allowUnsafeHtml: options.allowUnsafeHtml !== undefined ? options.allowUnsafeHtml : false, // render()/formatter() tratados como texto por padrão; HTML é opt-in
      persistState: options.persistState !== undefined ? options.persistState : false, // Persistência de estado via localStorage desabilitada por padrão
      stateStorageKey: options.stateStorageKey || null, // Se ausente, é derivada do id do container
      stateVersion: options.stateVersion !== undefined ? options.stateVersion : 1, // Estado salvo com versão diferente é descartado
      footerAggregates: options.footerAggregates !== undefined ? options.footerAggregates : false, // Rodapé com agregações (soma/média/contagem/mín/máx) desabilitado por padrão
      serverSide: options.serverSide !== undefined ? options.serverSide : false, // Paginação/ordenação/filtro/busca são responsabilidade do servidor; options.data é sempre exatamente a página atual
      totalRecords: options.totalRecords !== undefined ? options.totalRecords : 0, // Total de registros no servidor (para calcular totalPages); atualize com setTotalRecords()
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

    // Event bus: listeners registrados via on()/off(), disparados via emit().
    this._listeners = new Map();

    // Atalho de conveniência: options.onSortChange/onPageChange/etc. equivalem
    // a chamar this.on(<evento>, callback) uma vez na construção.
    Object.entries(OPTION_EVENT_MAP).forEach(([optionName, eventName]) => {
      if (typeof this.options[optionName] === 'function') {
        this.on(eventName, this.options[optionName]);
      }
    });

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
    // Fonte central de estado: toda propriedade mutável de runtime vive aqui.
    // As chaves ficam acessíveis como this.currentPage, this.sortColumn etc.
    // via os getters/setters definidos em Skargrid.prototype (ver STATE_KEYS
    // no fim deste arquivo) — mantém compatibilidade com o código existente
    // enquanto garante uma única fonte de verdade.
    this.state = {
      // Paginação
      currentPage: 1,
      totalPages: 1,

      // Ordenação
      sortColumn: null,
      sortDirection: null, // 'asc' ou 'desc'

      // Dados originais (não ordenados) e filtrados/pesquisados
      originalData: [...this.options.data],
      filteredData: [...this.options.data],

      // Seleção - índices das linhas selecionadas
      selectedRows: new Set(),

      // Busca
      searchText: '',
      searchTimeout: null,

      // Filtros por coluna
      columnFilterValues: {}, // { field: value }
      columnFilterSelected: {}, // { field: [selectedValues] } para checkboxes

      // Loading
      isLoading: false,

      // Dropdown de filtro aberto e seu listener de scroll
      openFilterDropdown: null,
      scrollHandler: null,

      // Visibilidade e ordem das colunas (respeita a propriedade `visible`, padrão true)
      visibleColumns: new Set(
        this.options.columns
          .filter(col => col.visible !== false)
          .map(col => col.field),
      ),
      columnOrder: this.options.columns.map(col => col.field),

      // Virtualização (preenchido por VirtualizationFeature.initVirtualization abaixo)
      virtualScrollTop: 0,
      virtualRowHeight: 40,
      virtualVisibleRows: 20,
      virtualBufferSize: 5,
    };

    // Estado da virtualização
    VirtualizationFeature.initVirtualization(this);

    // Inicializa features modulares
    initColumnConfig(this);

    this.init();

    // Restaura estado persistido (se habilitado e a versão salva bater).
    // Feito após o init() inicial para reaproveitar setState(), já testado.
    if (this.options.persistState) {
      const savedState = PersistenceFeature.load(this);
      if (savedState) {
        this.setState(savedState);
      }
    }
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
    PaginationFeature.calculatePagination(this);
  }

  /**
   * Obtém os dados da página atual
   */
  getPageData() {
    return PaginationFeature.getPageData(this);
  }

  /**
   * Renderiza a tabela completa
   */
  render(fullRender = true) {
    this._schedulePersist();

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
      VirtualizationFeature.setupVirtualContainer(this, tableContainer);
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
      // Usa a feature de virtualização
      const virtualContainer = VirtualizationFeature.renderVirtualStructure(this);
      tableContainer.appendChild(virtualContainer);
    } else {
      // Renderização normal
      const thead = this.renderHeader();
      table.appendChild(thead);

      const tbody = this.renderBody();
      table.appendChild(tbody);

      if (this.options.footerAggregates) {
        const tfoot = this.renderFooter();
        table.appendChild(tfoot);
      }

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

      // Atualiza rodapé de agregações
      if (this.options.footerAggregates) {
        const oldTfoot = table.querySelector('tfoot');
        const newTfoot = this.renderFooter();
        if (oldTfoot) {
          table.replaceChild(newTfoot, oldTfoot);
        } else {
          table.appendChild(newTfoot);
        }
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
   * Renderiza barra superior com busca e botões de ação
   */
  renderTopBar() {
    return TopBarFeature.renderTopBar(this);
  }

  /**
   * Renderiza o componente de busca global
   */
  renderSearchInput() {
    return SearchFeature.renderSearchInput(this);
  }

  /**
   * Renderiza botão "Limpar Filtros"
   */
  renderClearFiltersButton() {
    return TopBarFeature.renderClearFiltersButton(this);
  }

  /**
   * Renderiza botão "Exportar CSV"
   */
  renderExportCSVButton() {
    return TopBarFeature.renderExportCSVButton(this);
  }

  /**
   * Renderiza o cabeçalho da tabela
   */
  renderHeader() {
    return TableHeaderFeature.renderHeader(this);
  }

  /**
   * Verifica se uma coluna tem filtro ativo
   */
  hasActiveFilter(field) {
    return FilterFeature.hasActiveFilter(this, field);
  }

  /**
   * Normaliza string para busca (remove acentos)
   */
  normalizeString(str) {
    return FilterFeature.normalizeString(str);
  }

  /**
   * Obtém valores únicos de uma coluna (dados originais)
   */
  getUniqueColumnValues(field) {
    return FilterFeature.getUniqueColumnValues(this, field);
  }

  /**
   * Obtém valores disponíveis de uma coluna (dados filtrados, exceto a própria coluna)
   */
  getAvailableColumnValues(field) {
    return FilterFeature.getAvailableColumnValues(this, field);
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
      InputFilterFeature.createInputFilter(this, dropdown, column, filterType);
    }

    return dropdown;
  }

  /**
   * Cria filtro com checkboxes e busca interna (valores disponíveis dinamicamente)
   */
  createCheckboxFilter(dropdown, column) {
    SelectFilterFeature.createCheckboxFilter(this, dropdown, column);
  }

  /**
   * Cria filtro com input simples
   */
  createInputFilter(dropdown, column, filterType) {
    InputFilterFeature.createInputFilter(this, dropdown, column, filterType);
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
    this.emit('filterChange');
  }

  /**
   * Renderiza o corpo da tabela
   */
  renderBody() {
    return TableBodyFeature.renderBody(this);
  }

  /**
   * Cria uma linha da tabela (usado tanto para virtualização quanto paginação normal)
   */
  createTableRow(row, globalIndex) {
    return TableBodyFeature.createTableRow(this, row, globalIndex);
  }

  /**
   * Manipula o scroll virtual
   */
  handleVirtualScroll(e) {
    VirtualizationFeature.handleVirtualScroll(this, e);
  }

  /**
   * Renderiza os controles de paginação
   */
  renderPagination() {
    return PaginationFeature.renderPagination(this);
  }

  /**
   * Renderiza o rodapé de agregações (soma/média/contagem/mín/máx por coluna)
   */
  renderFooter() {
    return FooterAggregatesFeature.renderFooter(this);
  }

  /**
   * Navega para uma página específica
   */
  goToPage(pageNumber) {
    PaginationFeature.goToPage(this, pageNumber);
    this.emit('pageChange', this.currentPage);
  }

  /**
   * Muda o número de itens por página
   */
  changePageSize(newSize) {
    PaginationFeature.changePageSize(this, newSize);
    this.emit('pageChange', this.currentPage);
  }

  /**
   * Atualiza os dados da tabela
   */
  updateData(newData) {
    this.options.data = newData;
    this.originalData = [...newData];
    this.selectedRows.clear();  // Limpa seleções ao atualizar dados

    // Modo server-side: isto é "chegou a página pedida", não "novo dataset"
    // — currentPage/sort/busca continuam sendo a consulta que o consumidor
    // acabou de fazer ao servidor, resetá-los aqui desfaria a navegação
    // que originou a chamada.
    if (!this.options.serverSide) {
      this.currentPage = 1;
      this.sortColumn = null;
      this.sortDirection = null;
      this.searchText = '';
      this.virtualScrollTop = 0;
    }

    this.applyFilters();
    this.calculatePagination();
    this.render();
  }

  /**
   * Atualiza o total de registros no modo server-side (options.serverSide)
   * e recalcula a paginação. Chame após obter o total real do servidor.
   */
  setTotalRecords(total) {
    this.options.totalRecords = Number(total) || 0;
    this.calculatePagination();
    this.render(false);
  }

  /**
   * Manipula a busca de texto
   */
  handleSearch(searchText) {
    FilterFeature.handleSearch(this, searchText);
    this.emit('filterChange');
  }

  /**
   * Manipula filtro por coluna
   */
  handleColumnFilter(field, value) {
    FilterFeature.handleColumnFilter(this, field, value);
    this.emit('filterChange');
  }

  /**
   * Limpa todos os filtros de coluna
   */
  clearColumnFilters() {
    FilterFeature.clearColumnFilters(this);
    this.emit('filterChange');
  }

  /**
   * Limpa TODOS os filtros (busca + filtros de coluna)
   */
  clearAllFilters() {
    FilterFeature.clearAllFilters(this);
    this.emit('filterChange');
  }

  /**
   * Atualiza o botão de limpar filtros com contador de filtros ativos
   */
  updateClearFiltersButton(button = null) {
    TopBarFeature.updateClearFiltersButton(this, button);
  }

  /**
   * Aplica filtros (busca + filtros de coluna) aos dados
   */
  applyFilters() {
    const previousFilteredCount = this.filteredData ? this.filteredData.length : this.options.data.length;

    FilterFeature.applyFilters(this);

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
    FilterFeature.clearSearch(this);
    this.emit('filterChange');
  }

  /**
   * Manipula o clique em uma coluna para ordenação
   */
  handleSort(field) {
    SortFeature.handleSort(this, field);
    this.emit('sortChange', this.sortColumn, this.sortDirection);
  }

  /**
   * Ordena os dados pela coluna e direção atuais
   */
  sortData() {
    SortFeature.sortData(this);
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
    this.emit('sortChange', this.sortColumn, this.sortDirection);
  }

  /**
   * Obtém os dados atuais. Retorna uma cópia rasa — mutar o array retornado
   * não afeta o grid; use updateData() para trocar os dados de fato.
   */
  getData() {
    return [...this.options.data];
  }

  /**
   * Alterna a seleção de uma linha específica
   */
  toggleSelectRow(index, selected) {
    SelectionFeature.toggleSelectRow(this, index, selected);
    this.emit('selectionChange', this.getSelectedRows());
  }

  /**
   * Seleciona ou desseleciona todas as linhas
   */
  toggleSelectAll(selected) {
    SelectionFeature.toggleSelectAll(this, selected);
    this.emit('selectionChange', this.getSelectedRows());
  }

  /**
   * Verifica se todas as linhas estão selecionadas
   */
  isAllSelected() {
    return SelectionFeature.isAllSelected(this);
  }

  /**
   * Seleciona linhas específicas por índices
   */
  selectRows(indices) {
    SelectionFeature.selectRows(this, indices);
    this.emit('selectionChange', this.getSelectedRows());
  }

  /**
   * Desseleciona linhas específicas por índices
   */
  deselectRows(indices) {
    SelectionFeature.deselectRows(this, indices);
    this.emit('selectionChange', this.getSelectedRows());
  }

  /**
   * Limpa todas as seleções
   */
  clearSelection() {
    SelectionFeature.clearSelection(this);
    this.emit('selectionChange', this.getSelectedRows());
  }

  /**
   * Obtém os dados das linhas selecionadas
   */
  getSelectedRows() {
    return SelectionFeature.getSelectedRows(this);
  }

  /**
   * Obtém os índices das linhas selecionadas
   */
  getSelectedIndices() {
    return SelectionFeature.getSelectedIndices(this);
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
   * Exporta dados visíveis (ou filtrados) para CSV
   */
  exportToCSV(filename) {
    ExportFeature.exportToCSV(this, filename);
  }

  /**
   * Exporta dados selecionados para CSV
   */
  exportSelectedToCSV(filename) {
    ExportFeature.exportSelectedToCSV(this, filename);
  }

  /**
   * Exporta dados visíveis (ou filtrados) para Excel legado (.xls)
   */
  exportToExcel(filename) {
    ExportFeature.exportToExcel(this, filename);
  }

  /**
   * Exporta dados selecionados para Excel legado (.xls)
   */
  exportSelectedToExcel(filename) {
    ExportFeature.exportSelectedToExcel(this, filename);
  }

  /**
   * Exporta dados visíveis (ou filtrados) para XLSX real (OpenXML)
   */
  exportToXLSX(filename) {
    ExportFeature.exportToXLSX(this, filename);
  }

  /**
   * Exporta dados selecionados para XLSX
   */
  exportSelectedToXLSX(filename) {
    ExportFeature.exportSelectedToXLSX(this, filename);
  }

  /**
   * Escapa valores para CSV
   */
  escapeCSV(value) {
    return ExportFeature.escapeCSV(value);
  }

  /**
   * Remove tags HTML de uma string
   */
  stripHTML(html) {
    return ExportFeature.stripHTML(html);
  }

  /**
   * Registra um listener para um evento ('sortChange', 'pageChange', 'selectionChange',
   * 'filterChange' ou 'rowClick'). Retorna a própria instância (encadeável).
   */
  on(event, handler) {
    if (typeof handler !== 'function') {
      return this;
    }
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(handler);
    return this;
  }

  /**
   * Remove um listener previamente registrado com on(). Sem `handler`,
   * remove todos os listeners do evento.
   */
  off(event, handler) {
    const handlers = this._listeners.get(event);
    if (!handlers) {
      return this;
    }
    if (handler) {
      handlers.delete(handler);
    } else {
      handlers.clear();
    }
    return this;
  }

  /**
   * Dispara um evento, chamando cada listener registrado com os argumentos
   * fornecidos. Um listener que lança erro não interrompe os demais.
   */
  emit(event, ...args) {
    const handlers = this._listeners.get(event);
    if (!handlers) {
      return;
    }
    handlers.forEach(handler => {
      try {
        handler(...args);
      } catch (e) {
        if (console && console.warn) {console.warn(`Skargrid: erro no listener do evento "${event}"`, e);}
      }
    });
  }

  /**
   * Agenda a persistência do estado atual (debounced), se `persistState`
   * estiver habilitado. Chamado a cada render() para cobrir qualquer
   * mudança de estado, sem precisar instrumentar cada feature individualmente.
   */
  _schedulePersist() {
    if (!this.options.persistState) {
      return;
    }
    clearTimeout(this._persistTimeout);
    this._persistTimeout = setTimeout(() => {
      this._persistTimeout = null;
      PersistenceFeature.save(this);
    }, 150);
  }

  /**
   * Remove o estado persistido desta instância do localStorage.
   */
  clearPersistedState() {
    PersistenceFeature.clear(this);
  }

  /**
   * Obtém o estado serializável da tabela (paginação, ordenação, filtros,
   * busca, seleção, visibilidade e ordem de colunas, tema).
   * Útil para persistência e para automação por agentes.
   */
  getState() {
    return {
      currentPage: this.currentPage,
      pageSize: this.options.pageSize,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      searchText: this.searchText,
      columnFilterValues: { ...this.columnFilterValues },
      columnFilterSelected: Object.fromEntries(
        Object.entries(this.columnFilterSelected).map(([field, values]) => [field, [...values]]),
      ),
      selectedIndices: this.getSelectedIndices(),
      visibleColumns: Array.from(this.visibleColumns),
      columnOrder: [...this.columnOrder],
      theme: this.options.theme,
    };
  }

  /**
   * Restaura um estado previamente obtido via getState().
   * Campos ausentes no objeto de estado são preservados como estão.
   */
  setState(state = {}) {
    if (!state || typeof state !== 'object') {
      return;
    }

    if (Array.isArray(state.columnOrder)) {
      this.columnOrder = [...state.columnOrder];
    }
    if (Array.isArray(state.visibleColumns)) {
      this.visibleColumns = new Set(state.visibleColumns);
    }
    if (state.columnFilterValues && typeof state.columnFilterValues === 'object') {
      this.columnFilterValues = { ...state.columnFilterValues };
    }
    if (state.columnFilterSelected && typeof state.columnFilterSelected === 'object') {
      this.columnFilterSelected = Object.fromEntries(
        Object.entries(state.columnFilterSelected).map(([field, values]) => [field, [...values]]),
      );
    }
    if (typeof state.searchText === 'string') {
      this.searchText = state.searchText;
    }
    if (state.sortColumn !== undefined) {
      this.sortColumn = state.sortColumn;
    }
    if (state.sortDirection !== undefined) {
      this.sortDirection = state.sortDirection;
    }
    if (state.pageSize) {
      this.options.pageSize = state.pageSize;
    }
    if (state.theme === 'light' || state.theme === 'dark') {
      this.options.theme = state.theme;
    }

    if (this.sortColumn) {
      this.sortData();
    }
    this.applyFilters();
    this.calculatePagination();

    if (state.currentPage) {
      const maxPage = Math.max(1, this.totalPages || 1);
      this.currentPage = Math.min(Math.max(1, state.currentPage), maxPage);
    }
    if (Array.isArray(state.selectedIndices)) {
      this.selectedRows = new Set(state.selectedIndices);
    }

    this.render();
  }

  /**
   * Destroi a instância da tabela, removendo listeners e timers residuais.
   */
  destroy() {
    this.removeScrollListeners();

    if (this.openFilterDropdown) {
      this.openFilterDropdown.remove();
      this.openFilterDropdown = null;
    }

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }

    // Se havia um salvamento agendado (debounced), finaliza agora em vez de
    // simplesmente descartar a última mudança de estado.
    if (this._persistTimeout) {
      clearTimeout(this._persistTimeout);
      this._persistTimeout = null;
      if (this.options.persistState) {
        PersistenceFeature.save(this);
      }
    }

    this._listeners.clear();
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

// Cada chave abaixo vive de fato em `this.state` (ver constructor). Os
// getters/setters expõem `grid.currentPage`, `grid.sortColumn` etc. como
// atalhos, para que core e features continuem lendo/escrevendo dessa forma
// sem apontar para 20 propriedades soltas na instância.
const STATE_KEYS = [
  'currentPage', 'totalPages',
  'sortColumn', 'sortDirection',
  'originalData', 'filteredData',
  'selectedRows',
  'searchText', 'searchTimeout',
  'columnFilterValues', 'columnFilterSelected',
  'isLoading',
  'openFilterDropdown', 'scrollHandler',
  'visibleColumns', 'columnOrder',
  'virtualScrollTop', 'virtualRowHeight', 'virtualVisibleRows', 'virtualBufferSize',
];

STATE_KEYS.forEach(key => {
  Object.defineProperty(Skargrid.prototype, key, {
    get() {
      return this.state[key];
    },
    set(value) {
      this.state[key] = value;
    },
    enumerable: true,
    configurable: true,
  });
});

export default Skargrid;
