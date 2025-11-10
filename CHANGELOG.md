# Changelog

Todas as mudanças notáveis neste projecto serão documentadas aqui.

## [1.0.1] - 2025-11-10
### Resumo
Pequeno conjunto de correções e melhorias na renderização, exportação e filtros.

### Alterações
- Renderização e exportação
  - As colunas agora aceitam tanto a propriedade `render` quanto a propriedade legada `formatter` para formatação de células.
  - A exportação para CSV utiliza o renderer da coluna quando presente e remove o HTML do conteúdo, exportando apenas valores textuais.

- Filtros
  - Filtros do tipo `select` agora "achatam" (flatten) valores vindos de células que são arrays (ex.: colunas com múltiplos grupos) e os apresentam como opções separadas.
  - Adicionado token especial para valores vazios: `(Em branco)`, permitindo filtrar células nulas/vazias.
  - O botão "Selecionar Todos" no dropdown de filtro atua apenas sobre as opções atualmente visíveis (após busca) e respeita opções desabilitadas (indisponíveis).
  - Corrigido o cálculo de valores disponíveis para que filtros em cascata reflitam corretamente filtros do tipo `select` e células-Array.
  
---

## [1.0.1] - 2025-11-10 (English)
### Summary
Small focused set of bug fixes and behavioral improvements around rendering, export and filters.

### Changes
- Renderer and export
  - Columns now accept both the `render` property and the legacy `formatter` property for cell formatting.
  - CSV export uses the column renderer when present and strips HTML to export textual values.

- Filters
  - `select`-type filters now flatten array-valued cells (e.g. multi-group columns) into separate options.
  - Introduced a special empty-value token: `(Em branco)` to allow filtering null/empty cells.
  - "Select All" in the filter dropdown acts only on currently visible (searched) options and respects disabled (unavailable) options.
  - Fixed available-values calculation so cascading filters reflect `select`-type filters and array cells correctly.