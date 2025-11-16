/* eslint-disable no-unused-vars */
/**
 * Skargrid - Módulo de Corpo da Tabela
 * Gerencia a renderização do corpo da tabela com células e seleção
 */

const TableBodyFeature = {
  /**
   * Renderiza o corpo da tabela
   */
  renderBody(grid) {
    const tbody = document.createElement('tbody');

    if (grid.options.virtualization) {
      // Virtualização: renderiza apenas linhas visíveis
      const totalRows = grid.filteredData.length;
      const startIndex = Math.max(0, Math.floor(grid.virtualScrollTop / grid.virtualRowHeight) - grid.virtualBufferSize);
      const endIndex = Math.min(totalRows, startIndex + grid.virtualVisibleRows + (grid.virtualBufferSize * 2));

      // Renderiza apenas as linhas visíveis
      for (let i = startIndex; i < endIndex; i++) {
        const row = grid.filteredData[i];
        const tr = this.createTableRow(grid, row, i);
        tbody.appendChild(tr);
      }
    } else {
      // Renderização normal (com paginação)
      const pageData = grid.getPageData();

      pageData.forEach((row, pageIndex) => {
        // Calcula o índice global do registro
        const globalIndex = grid.options.pagination
          ? (grid.currentPage - 1) * grid.options.pageSize + pageIndex
          : pageIndex;

        const tr = this.createTableRow(grid, row, globalIndex);
        tbody.appendChild(tr);
      });
    }

    return tbody;
  },

  /**
   * Cria uma linha da tabela (usado tanto para virtualização quanto paginação normal)
   */
  createTableRow(grid, row, globalIndex) {
    const tr = document.createElement('tr');
    tr.dataset.index = globalIndex;

    // Adiciona classe se a linha está selecionada
    if (grid.selectedRows.has(globalIndex)) {
      tr.classList.add('selected');
    }

    // Adiciona coluna de checkbox se seleção está habilitada
    if (grid.options.selectable) {
      const td = document.createElement('td');
      td.className = 'skargrid-select-cell';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'skargrid-checkbox';
      checkbox.checked = grid.selectedRows.has(globalIndex);
      checkbox.onchange = (e) => {
        e.stopPropagation();
        grid.toggleSelectRow(globalIndex, e.target.checked);
      };

      td.appendChild(checkbox);
      tr.appendChild(td);

      // Adiciona clique na linha para selecionar
      tr.style.cursor = 'pointer';
      tr.onclick = (e) => {
        // Ignora clique no checkbox
        if (e.target.type !== 'checkbox') {
          checkbox.checked = !checkbox.checked;
          grid.toggleSelectRow(globalIndex, checkbox.checked);
        }
      };
    }

    grid.getOrderedVisibleColumns().forEach(column => {
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
  },
};