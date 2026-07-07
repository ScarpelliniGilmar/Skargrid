/**
 * Skargrid - Módulo de Corpo da Tabela
 * Gerencia a renderização do corpo da tabela com células e seleção
 */

import FrozenColumnsFeature from './frozen-columns.js';
import { applySafeContent } from './render-utils.js';

/**
 * Renderiza o conteúdo de uma célula com política segura por padrão:
 * - Um Node retornado pelo renderer é anexado diretamente (forma preferida).
 * - Uma string só vira HTML se `allowUnsafeHtml` estiver habilitado (na coluna
 *   ou no grid); caso contrário é tratada como texto puro via `textContent`.
 * - Sem renderer, o valor bruto também vai por `textContent`.
 */
function renderCellContent(td, grid, column, value, row, globalIndex) {
  const cellRenderer = (column.formatter && typeof column.formatter === 'function')
    ? column.formatter
    : (column.render && typeof column.render === 'function')
      ? column.render
      : null;

  if (!cellRenderer) {
    td.textContent = value !== undefined && value !== null ? value : '';
    return;
  }

  let result;
  try {
    result = cellRenderer(value, row, globalIndex);
  } catch (e) {
    td.textContent = value !== undefined && value !== null ? String(value) : '';
    if (console && console.warn) {console.warn('Skargrid: erro ao executar renderer para coluna', column.field, e);}
    return;
  }

  const allowUnsafeHtml = column.allowUnsafeHtml !== undefined
    ? column.allowUnsafeHtml
    : grid.options.allowUnsafeHtml;

  applySafeContent(td, result, allowUnsafeHtml);
}

const TableBodyFeature = {
  /**
   * Renderiza o corpo da tabela
   */
  renderBody(grid) {
    const tbody = document.createElement('tbody');
    const frozenInfo = FrozenColumnsFeature.getOffsets(grid);
    const columns = grid.getOrderedVisibleColumns();

    if (grid.options.virtualization) {
      // Virtualização: renderiza apenas linhas visíveis
      const totalRows = grid.filteredData.length;
      const startIndex = Math.max(0, Math.floor(grid.virtualScrollTop / grid.virtualRowHeight) - grid.virtualBufferSize);
      const endIndex = Math.min(totalRows, startIndex + grid.virtualVisibleRows + (grid.virtualBufferSize * 2));

      // Renderiza apenas as linhas visíveis
      for (let i = startIndex; i < endIndex; i++) {
        const row = grid.filteredData[i];
        const tr = this.createTableRow(grid, row, i, frozenInfo, columns);
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

        const tr = this.createTableRow(grid, row, globalIndex, frozenInfo, columns);
        tbody.appendChild(tr);
      });
    }

    return tbody;
  },

  /**
   * Cria uma linha da tabela (usado tanto para virtualização quanto paginação normal).
   * `frozenInfo` e `columns` são opcionais — se ausentes, são calculados; uma
   * renderBody() já os calcula uma vez e repassa para todas as linhas,
   * evitando recalcular a lista de colunas visíveis a cada linha renderizada.
   */
  createTableRow(
    grid, row, globalIndex,
    frozenInfo = FrozenColumnsFeature.getOffsets(grid),
    columns = grid.getOrderedVisibleColumns(),
  ) {
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
      FrozenColumnsFeature.applyToCheckboxCell(td, frozenInfo);

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

    columns.forEach(column => {
      const td = document.createElement('td');
      const value = row[column.field];

      renderCellContent(td, grid, column, value, row, globalIndex);
      FrozenColumnsFeature.applyToCell(td, column.field, frozenInfo);

      td.dataset.field = column.field;
      tr.appendChild(td);
    });

    tr.addEventListener('click', () => {
      grid.emit('rowClick', row, globalIndex);
    });

    return tr;
  },
};

export default TableBodyFeature;