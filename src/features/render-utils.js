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
