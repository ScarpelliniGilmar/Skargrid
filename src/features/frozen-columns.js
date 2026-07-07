/**
 * Skargrid - Módulo de Colunas Congeladas (frozen)
 * Calcula os offsets `left` (px) para colunas marcadas com `column.frozen: true`,
 * fixando-as durante o scroll horizontal (via CSS position: sticky).
 */

const FrozenColumnsFeature = {
  DEFAULT_WIDTH: 120,
  CHECKBOX_WIDTH: 40,

  parseWidth(column) {
    if (!column.width) {
      return this.DEFAULT_WIDTH;
    }
    const parsed = parseInt(column.width, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : this.DEFAULT_WIDTH;
  },

  /**
   * Calcula os offsets das colunas congeladas, na ordem visível atual.
   * Só um prefixo contíguo de colunas `frozen: true` (a partir da primeira
   * coluna de dados, após a coluna de seleção, se houver) é considerado —
   * uma coluna congelada depois de uma não-congelada produziria uma posição
   * sticky inconsistente (o vizinho não-congelado rolaria por baixo dela em
   * um offset que não corresponde à sua largura real), então é ignorada com
   * um aviso em vez de aplicada incorretamente.
   *
   * Retorna { offsets: Map<field, pxOffset>, lastFrozenField, freezeCheckbox }.
   */
  getOffsets(grid) {
    const offsets = new Map();
    const freezeCheckbox = Boolean(grid.options.selectable) &&
      grid.getOrderedVisibleColumns().some(col => col.frozen);

    let runningOffset = freezeCheckbox ? this.CHECKBOX_WIDTH : 0;
    let stillContiguous = true;
    let lastFrozenField = null;

    grid.getOrderedVisibleColumns().forEach(column => {
      if (!stillContiguous) {
        if (column.frozen && console && console.warn) {
          console.warn(`Skargrid: coluna "${column.field}" marcada como frozen, mas não está no início — ignorada (colunas congeladas devem ser um prefixo contíguo).`);
        }
        return;
      }

      if (!column.frozen) {
        stillContiguous = false;
        return;
      }

      offsets.set(column.field, runningOffset);
      lastFrozenField = column.field;
      runningOffset += this.parseWidth(column);
    });

    return { offsets, lastFrozenField, freezeCheckbox };
  },

  hasFrozenColumns(grid) {
    return this.getOffsets(grid).offsets.size > 0;
  },

  /**
   * Aplica a posição sticky (offset + classes) a uma célula (th ou td) já criada.
   */
  applyToCell(cell, field, frozenInfo) {
    const { offsets, lastFrozenField } = frozenInfo;
    if (!offsets.has(field)) {
      return;
    }
    cell.style.position = 'sticky';
    cell.style.left = `${offsets.get(field)}px`;
    cell.classList.add('skargrid-frozen-cell');
    if (field === lastFrozenField) {
      cell.classList.add('skargrid-frozen-cell-edge');
    }
  },

  /**
   * Aplica a posição sticky à célula de seleção (checkbox), quando há pelo
   * menos uma coluna de dados congelada (mantém o checkbox visível junto).
   */
  applyToCheckboxCell(cell, frozenInfo) {
    if (!frozenInfo.freezeCheckbox) {
      return;
    }
    cell.style.position = 'sticky';
    cell.style.left = '0px';
    cell.classList.add('skargrid-frozen-cell');
  },
};

export default FrozenColumnsFeature;
