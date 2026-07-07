/**
 * Skargrid - Módulo de Agregações de Rodapé
 * Renderiza um <tfoot> com soma/média/contagem/mín/máx (ou uma função
 * customizada) por coluna, calculado sobre os dados filtrados atuais
 * (grid.filteredData) — reflete busca e filtros, não só a página atual.
 */

import { applySafeContent } from './render-utils.js';
import FrozenColumnsFeature from './frozen-columns.js';

function toNumber(value) {
  // null/undefined/'' viram 0 com Number(), o que distorceria sum/avg/min/max
  // (uma célula vazia não deveria contar como zero) — por isso são excluídos
  // explicitamente, e não apenas via Number.isFinite().
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

const BUILT_IN_AGGREGATORS = {
  sum(rows, field) {
    return rows.reduce((total, row) => {
      const n = toNumber(row[field]);
      return n === null ? total : total + n;
    }, 0);
  },
  avg(rows, field) {
    const numbers = rows.map(row => toNumber(row[field])).filter(n => n !== null);
    if (numbers.length === 0) {return 0;}
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  },
  count(rows) {
    return rows.length;
  },
  min(rows, field) {
    const numbers = rows.map(row => toNumber(row[field])).filter(n => n !== null);
    return numbers.length ? Math.min(...numbers) : null;
  },
  max(rows, field) {
    const numbers = rows.map(row => toNumber(row[field])).filter(n => n !== null);
    return numbers.length ? Math.max(...numbers) : null;
  },
};

const FooterAggregatesFeature = {
  /**
   * Calcula o valor agregado de uma coluna sobre as linhas informadas.
   * `column.aggregate` pode ser uma das chaves embutidas ('sum', 'avg',
   * 'count', 'min', 'max') ou uma função `(rows, field) => valor`.
   */
  computeValue(column, rows) {
    const aggregate = column.aggregate;
    if (!aggregate) {
      return undefined;
    }
    if (typeof aggregate === 'function') {
      try {
        return aggregate(rows, column.field);
      } catch (e) {
        if (console && console.warn) {console.warn('Skargrid: erro ao executar aggregate customizado para coluna', column.field, e);}
        return undefined;
      }
    }
    const builtIn = BUILT_IN_AGGREGATORS[aggregate];
    if (!builtIn) {
      if (console && console.warn) {console.warn(`Skargrid: aggregate "${aggregate}" desconhecido para a coluna "${column.field}". Use 'sum', 'avg', 'count', 'min', 'max' ou uma função.`);}
      return undefined;
    }
    return builtIn(rows, column.field);
  },

  /**
   * Renderiza o <tfoot> com uma célula por coluna visível: o valor agregado
   * (quando `column.aggregate` está definido) ou vazia, na mesma ordem/
   * largura das colunas do corpo da tabela.
   */
  renderFooter(grid) {
    const tfoot = document.createElement('tfoot');
    const tr = document.createElement('tr');
    tr.className = 'skargrid-footer-row';
    const frozenInfo = FrozenColumnsFeature.getOffsets(grid);

    if (grid.options.selectable) {
      const checkboxTd = document.createElement('td');
      FrozenColumnsFeature.applyToCheckboxCell(checkboxTd, frozenInfo);
      tr.appendChild(checkboxTd);
    }

    grid.getOrderedVisibleColumns().forEach(column => {
      const td = document.createElement('td');
      td.dataset.field = column.field;
      td.className = 'skargrid-footer-cell';
      FrozenColumnsFeature.applyToCell(td, column.field, frozenInfo);

      if (column.aggregate) {
        const value = this.computeValue(column, grid.filteredData);
        if (value !== undefined) {
          const formatter = typeof column.aggregateFormatter === 'function' ? column.aggregateFormatter : null;
          let result = value;
          if (formatter) {
            try {
              result = formatter(value, grid.filteredData);
            } catch (e) {
              if (console && console.warn) {console.warn('Skargrid: erro ao executar aggregateFormatter para coluna', column.field, e);}
              result = value;
            }
          }
          const allowUnsafeHtml = column.allowUnsafeHtml !== undefined
            ? column.allowUnsafeHtml
            : grid.options.allowUnsafeHtml;
          applySafeContent(td, result, allowUnsafeHtml);
        }
      }

      tr.appendChild(td);
    });

    tfoot.appendChild(tr);
    return tfoot;
  },
};

export default FooterAggregatesFeature;
