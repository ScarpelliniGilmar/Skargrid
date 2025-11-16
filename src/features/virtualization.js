/**
 * Skargrid - Módulo de Virtualização
 * Implementa scroll virtual para grandes datasets
 */

const VirtualizationFeature = {
  /**
   * Inicializa o estado da virtualização
   */
  initVirtualization(grid) {
    // Estado da virtualização
    grid.virtualScrollTop = 0;
    grid.virtualRowHeight = 40; // Altura estimada por linha (px)
    grid.virtualVisibleRows = 20; // Número de linhas visíveis estimadas
    grid.virtualBufferSize = 5; // Buffer de linhas extras para scroll suave
  },

  /**
   * Configura o container para virtualização
   */
  setupVirtualContainer(grid, tableContainer) {
    tableContainer.classList.add('skargrid-virtual-container');

    // Calcula quantas linhas são visíveis baseado na altura do container
    const containerHeight = tableContainer.clientHeight || 400; // fallback
    grid.virtualVisibleRows = Math.ceil(containerHeight / grid.virtualRowHeight);

    // Adiciona listener de scroll
    tableContainer.onscroll = (e) => this.handleVirtualScroll(grid, e);
  },

  /**
   * Renderiza a estrutura virtual com container de altura total
   */
  renderVirtualStructure(grid) {
    const virtualContainer = document.createElement('div');
    virtualContainer.style.position = 'relative';
    virtualContainer.style.height = `${grid.filteredData.length * grid.virtualRowHeight}px`;

    // Cria a tabela posicionada absolutamente
    const table = document.createElement('table');
    table.className = grid.options.className;
    table.style.position = 'absolute';
    table.style.top = '0px';
    table.style.width = '100%';

    // Adiciona cabeçalho
    const thead = grid.renderHeader();
    table.appendChild(thead);

    // Adiciona corpo (será atualizado pelo scroll)
    const tbody = grid.renderBody();
    table.appendChild(tbody);

    virtualContainer.appendChild(table);

    return virtualContainer;
  },

  /**
   * Manipula o evento de scroll virtual
   */
  handleVirtualScroll(grid, e) {
    const scrollTop = e.target.scrollTop;
    grid.virtualScrollTop = scrollTop;

    // Atualiza a posição da tabela dentro do container virtual
    const virtualContainer = grid.container.querySelector('.skargrid-table-container > div');
    const table = virtualContainer.querySelector('.skargrid');
    if (table) {
      // Calcula qual deve ser a posição da tabela baseada no scroll
      const startIndex = Math.max(0, Math.floor(scrollTop / grid.virtualRowHeight) - grid.virtualBufferSize);
      const topOffset = startIndex * grid.virtualRowHeight;
      table.style.top = `${topOffset}px`;

      // Calcula a nova altura da tabela baseada nas linhas que serão renderizadas
      const endIndex = Math.min(grid.filteredData.length, startIndex + grid.virtualVisibleRows + (grid.virtualBufferSize * 2));
      const renderedRows = endIndex - startIndex;
      const tableHeight = renderedRows * grid.virtualRowHeight;
      table.style.height = `${tableHeight}px`;

      // Re-renderiza apenas o corpo da tabela com as linhas corretas
      const oldTbody = table.querySelector('tbody');
      if (oldTbody) {
        const newTbody = grid.renderBody();
        table.replaceChild(newTbody, oldTbody);
      }
    }
  },

  /**
   * Atualiza a renderização virtual após mudanças nos dados
   */
  updateVirtualContainer(grid) {
    const virtualContainer = grid.container.querySelector('.skargrid-table-container > div');
    if (virtualContainer) {
      // Atualiza altura total do container
      virtualContainer.style.height = `${grid.filteredData.length * grid.virtualRowHeight}px`;

      // Re-renderiza o corpo da tabela
      const table = virtualContainer.querySelector('.skargrid');
      if (table) {
        const oldTbody = table.querySelector('tbody');
        if (oldTbody) {
          const newTbody = grid.renderBody();
          table.replaceChild(newTbody, oldTbody);
        }
      }
    }
  },
};

// Torna a feature disponível globalmente
if (typeof window !== 'undefined') {
  window.VirtualizationFeature = VirtualizationFeature;
}

// Para compatibilidade com módulos CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VirtualizationFeature;
}