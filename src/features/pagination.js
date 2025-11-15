/**
 * Skargrid - Módulo de Paginação
 * Gerencia navegação entre páginas e tamanho de página
 */

const PaginationFeature = {
  /**
   * Renderiza componente completo de paginação
   */
  renderPagination(grid) {
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'skargrid-pagination';

    // Info de registros
    const info = this.renderPaginationInfo(grid);
    paginationDiv.appendChild(info);

    // Controles de navegação
    const controls = this.renderPaginationControls(grid);
    paginationDiv.appendChild(controls);

    // Seletor de itens por página
    const sizeSelector = this.renderPageSizeSelector(grid);
    paginationDiv.appendChild(sizeSelector);

    return paginationDiv;
  },

  /**
   * Renderiza informação sobre registros exibidos
   */
  renderPaginationInfo(grid) {
    const info = document.createElement('div');
    info.className = 'skargrid-pagination-info';

    const totalRecords = grid.filteredData.length;
    const totalOriginal = grid.options.data.length;
    const startRecord = totalRecords === 0 ? 0 : (grid.currentPage - 1) * grid.options.pageSize + 1;
    const endRecord = Math.min(grid.currentPage * grid.options.pageSize, totalRecords);

    let text = grid.labels.showing
      .replace('{start}', startRecord)
      .replace('{end}', endRecord)
      .replace('{total}', totalRecords);
    
    // Adiciona info de filtro se houver busca ativa
    if (grid.searchText && totalRecords < totalOriginal) {
      text += ` (${grid.labels.filteredOfTotal.replace('{total}', totalOriginal)})`;
    }

    info.textContent = text;
    return info;
  },

  /**
   * Renderiza controles de navegação (anterior/próximo)
   */
  renderPaginationControls(grid) {
    const controls = document.createElement('div');
    controls.className = 'skargrid-pagination-controls';

    // Botão Primeira Página
    const firstBtn = document.createElement('button');
    firstBtn.textContent = '«';
    firstBtn.className = 'skargrid-pagination-btn';
    firstBtn.disabled = grid.currentPage === 1;
    firstBtn.onclick = () => this.goToPage(grid, 1);
    controls.appendChild(firstBtn);

    // Botão Anterior
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '‹';
    prevBtn.className = 'skargrid-pagination-btn';
    prevBtn.disabled = grid.currentPage === 1;
    prevBtn.onclick = () => this.goToPage(grid, grid.currentPage - 1);
    controls.appendChild(prevBtn);

    // Números de página
    const pageNumbers = this.getPageNumbers(grid);
    pageNumbers.forEach(pageNum => {
      if (pageNum === '...') {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.className = 'skargrid-pagination-ellipsis';
        controls.appendChild(ellipsis);
      } else {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = pageNum;
        pageBtn.className = 'skargrid-pagination-btn';
        if (pageNum === grid.currentPage) {
          pageBtn.classList.add('active');
        }
        pageBtn.onclick = () => this.goToPage(grid, pageNum);
        controls.appendChild(pageBtn);
      }
    });

    // Botão Próximo
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '›';
    nextBtn.className = 'skargrid-pagination-btn';
    nextBtn.disabled = grid.currentPage === grid.totalPages;
    nextBtn.onclick = () => this.goToPage(grid, grid.currentPage + 1);
    controls.appendChild(nextBtn);

    // Botão Última Página
    const lastBtn = document.createElement('button');
    lastBtn.textContent = '»';
    lastBtn.className = 'skargrid-pagination-btn';
    lastBtn.disabled = grid.currentPage === grid.totalPages;
    lastBtn.onclick = () => this.goToPage(grid, grid.totalPages);
    controls.appendChild(lastBtn);

    return controls;
  },

  /**
   * Calcula quais números de página devem ser exibidos
   */
  getPageNumbers(grid) {
    const pages = [];
    const maxVisible = 5;

    if (grid.totalPages <= maxVisible + 2) {
      // Mostra todas as páginas
      for (let i = 1; i <= grid.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostra primeira, última e páginas ao redor da atual
      pages.push(1);

      let start = Math.max(2, grid.currentPage - 1);
      let end = Math.min(grid.totalPages - 1, grid.currentPage + 1);

      if (grid.currentPage <= 3) {
        end = 4;
      } else if (grid.currentPage >= grid.totalPages - 2) {
        start = grid.totalPages - 3;
      }

      if (start > 2) {pages.push('...');}

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < grid.totalPages - 1) {pages.push('...');}

      pages.push(grid.totalPages);
    }

    return pages;
  },

  /**
   * Renderiza seletor de itens por página
   */
  renderPageSizeSelector(grid) {
    const selector = document.createElement('div');
    selector.className = 'skargrid-page-size';

    const label = document.createElement('span');
    label.textContent = grid.labels.itemsPerPage;
    selector.appendChild(label);

    const select = document.createElement('select');
    select.className = 'skargrid-page-size-select';

    grid.options.pageSizeOptions.forEach(size => {
      const option = document.createElement('option');
      option.value = size;
      option.textContent = size;
      if (size === grid.options.pageSize) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    select.onchange = (e) => {
      this.changePageSize(grid, parseInt(e.target.value));
    };

    selector.appendChild(select);
    return selector;
  },

  /**
   * Navega para uma página específica
   */
  goToPage(grid, pageNumber) {
    if (pageNumber < 1 || pageNumber > grid.totalPages) {
      return;
    }
    grid.currentPage = pageNumber;
    grid.render(false); // Update rápido
  },

  /**
   * Muda o número de itens por página
   */
  changePageSize(grid, newSize) {
    grid.options.pageSize = newSize;
    grid.currentPage = 1;
    grid.calculatePagination();
    grid.render(false); // Update rápido
  },

  /**
   * Calcula paginação
   */
  calculatePagination(grid) {
    const totalRecords = grid.filteredData.length;
    grid.totalPages = Math.ceil(totalRecords / grid.options.pageSize) || 1;
    
    // Ajusta página atual se estiver fora do range
    if (grid.currentPage > grid.totalPages) {
      grid.currentPage = grid.totalPages;
    }
  },

  /**
   * Retorna dados da página atual
   */
  getPageData(grid) {
    if (!grid.options.pagination) {
      return grid.filteredData;
    }

    const startIndex = (grid.currentPage - 1) * grid.options.pageSize;
    const endIndex = startIndex + grid.options.pageSize;
    return grid.filteredData.slice(startIndex, endIndex);
  },
};

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.PaginationFeature = PaginationFeature;
}

// Suporte para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PaginationFeature;
}
