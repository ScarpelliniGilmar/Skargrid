/**
 * Skargrid - Utilitários de renderização compartilhados
 * Usado por qualquer feature que precise do texto puro produzido por um
 * render()/formatter() de coluna (filtros, exportação), independentemente
 * de o retorno ser uma string HTML ou um Node (ver src/features/table-body.js).
 */

export function stripHTMLText(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/**
 * Extrai texto puro do retorno de um render()/formatter(): um Node usa seu
 * textContent diretamente; uma string HTML é convertida via stripHTMLText.
 */
export function extractRenderedText(rendered) {
  if (rendered instanceof Node) {
    return rendered.textContent || '';
  }
  if (rendered === null || rendered === undefined) {
    return '';
  }
  return stripHTMLText(String(rendered));
}

/**
 * Aplica com segurança o retorno de um render()/formatter() a uma célula
 * (td/th/etc.): um Node é sempre anexado diretamente (forma preferida,
 * sempre segura); uma string só vira HTML se `allowUnsafeHtml` estiver
 * habilitado, caso contrário é tratada como texto puro via `textContent`.
 * Usada tanto pelo corpo da tabela (table-body.js) quanto pelo rodapé de
 * agregações (footer-aggregates.js) — mesma política em um só lugar.
 */
export function applySafeContent(cell, result, allowUnsafeHtml) {
  if (result instanceof Node) {
    cell.appendChild(result);
    return;
  }
  if (allowUnsafeHtml) {
    cell.innerHTML = result;
  } else {
    cell.textContent = result !== undefined && result !== null ? result : '';
  }
}
