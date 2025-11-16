# Changelog

Todas as mudanças notáveis neste projecto serão documentadas aqui.

## [1.4.0] - 2025-11-16
### Resumo
Refatoração completa da arquitetura para sistema modular com 13 features especializadas, melhorando manutenibilidade, testabilidade e flexibilidade de build.

### Alterações
- **🏗️ Arquitetura Modular Completa**
  - Refatoração sistemática do core para 13 módulos especializados
  - Redução de 25% no código do core (~450 linhas)
  - Separação clara de responsabilidades por feature

- **📦 Módulos de Features (13 módulos)**
  - **Busca e Filtros**: `search.js`, `input-filter.js`, `select-filter.js`, `filter.js`
  - **Apresentação de Dados**: `table-header.js`, `table-body.js`, `top-bar.js`, `virtualization.js`
  - **Funcionalidades**: `pagination.js`, `sort.js`, `selection.js`, `export.js`, `columnConfig.js`

- **🔧 Melhorias Técnicas**
  - Sistema de delegação com fallbacks para compatibilidade
  - Verificação `typeof FeatureName !== 'undefined'` para degradação graciosa
  - Build system atualizado para incluir todas as features
  - ESLint configurado para todos os novos módulos

- **⚡ Performance e Qualidade**
  - Todos os 21 testes passando
  - Performance mantida (63.85KB minificado)
  - Compatibilidade backward total
  - Testabilidade aprimorada com módulos isolados

- **🚀 Flexibilidade de Build**
  - Possibilidade de builds customizados excluindo features
  - Carregamento seletivo de funcionalidades
  - Extensibilidade para novas features

## [1.3.0] - 2025-11-15
### Resumo
Implementação completa do sistema de internacionalização (i18n) profissional com suporte a múltiplos idiomas e labels totalmente customizáveis.

### Alterações
- **Internacionalização (i18n) Completa** 🌐
  - Sistema profissional de labels customizáveis para qualquer idioma
  - Labels padrão em português brasileiro
  - Suporte completo via `options.labels` com todas as mensagens da interface
  - Compatibilidade total com todas as funcionalidades existentes
  - Fácil customização para qualquer idioma (inglês, espanhol, francês, etc.)

- **Labels Customizáveis** 📝
  - Busca: `searchPlaceholder`, `clearSearch`
  - Filtros: `filterTitle`, `selectAll`, `clear`, `apply`
  - Paginação: `showing`, `filteredOfTotal`, `itemsPerPage`
  - Configuração: `columnConfigTitle`, `columnConfigDescription`, `restore`, `cancel`
  - Estados: `noData`, `loading`
  - Exportação: `exportCSV`, `exportXLSX`

- **Compatibilidade e Extensibilidade** 🔧
  - Mantém retrocompatibilidade com versões anteriores
  - Sistema extensível para novos idiomas
  - Labels aplicados a todos os componentes (botões, tooltips, mensagens)
  - Suporte a contexto cultural (formatos de data, moeda, etc.)

---

## [1.2.0] - 2025-11-15
### Resumo
Implementação completa de virtual scrolling para datasets grandes, com performance excepcional e suporte a todas as funcionalidades.

### Alterações
- **Virtual Scrolling Completo** 🚀
  - Renderização otimizada para datasets grandes (10k+ registros)
  - Apenas linhas visíveis + buffer são renderizadas
  - Performance excepcional mantendo < 50MB de memória
  - Scroll suave e responsivo em todas as condições

- **Scroll Inteligente com Filtros** 🎯
  - Scroll se ajusta automaticamente quando filtros são aplicados
  - Altura do container recalculada dinamicamente
  - Transições suaves entre estados filtrados
  - Compatibilidade total com busca, ordenação e filtros

- **Cabeçalho Fixo Aprimorado** 📌
  - Cabeçalho sticky funciona perfeitamente com virtualização
  - Alinhamento correto entre header e corpo da tabela
  - Performance mantida mesmo com scroll longo

- **Filtros Avançados** 🔍
  - Filtros select em múltiplas colunas
  - Opções pré-definidas para melhor UX
  - Performance otimizada para datasets grandes
  - Interface intuitiva com dropdowns

- **Testes e Exemplos** 📊
  - Exemplo completo com 10K registros (virtual scrolling)
  - Teste extremo com 500K registros (validação de limites)
  - Exemplo realista com paginação server-side simulada
  - Guias de performance e limitações documentadas

- **Otimização de Performance** ⚡
  - Algoritmos otimizados para renderização condicional
  - Gerenciamento inteligente de memória
  - Scroll events otimizados
  - Re-renders minimizados

---

## [1.1.0] - 2025-11-12
### Resumo
Conjunto abrangente de correções e melhorias significativas em filtros, exportação, ordenação, temas e layout.

### Alterações
- **Filtros e Exportação**
  - Filtros e exportação agora usam valores renderizados (com HTML removido) ao invés de valores brutos das células
  - Correção da exportação XLSX para remover HTML dos valores renderizados
  - Adicionada opção `exportFilename` para personalizar nomes dos arquivos exportados

- **Ordenação**
  - Suporte a `sortType` ('string', 'number', 'date') para ordenação correta por tipo de dados
  - Ordenação usa valores originais para tipos corretos, mantendo compatibilidade

- **Temas e Aparência**
  - Correção das cores de ordenação no tema verde (agora usa verde ao invés de azul)
  - Adicionadas variáveis CSS `--sg-sort-hover-bg` e `--sg-sort-active-bg` para temas customizáveis

- **Layout e Responsividade**
  - Correção da paginação em tabelas com altura fixa - agora permanece no fundo mesmo com poucos registros
  - Container da tabela usa `flex: 1` para layout flexível

- **Documentação**
  - Adicionado exemplo "Fixed Height" demonstrando tabela com altura definida
  - READMEs atualizados com nova funcionalidade

---

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

## [1.1.0] - 2025-11-12 (English)
### Summary
Comprehensive set of fixes and significant improvements to filters, export, sorting, themes and layout.

### Changes
- **Filters and Export**
  - Filters and export now use rendered values (HTML stripped) instead of raw cell values
  - Fixed XLSX export to strip HTML from rendered values
  - Added `exportFilename` option to customize exported file names

- **Sorting**
  - Support for `sortType` ('string', 'number', 'date') for correct data type sorting
  - Sorting uses original values for proper types while maintaining compatibility

- **Themes and Appearance**
  - Fixed sorting colors in green theme (now uses green instead of blue)
  - Added CSS variables `--sg-sort-hover-bg` and `--sg-sort-active-bg` for customizable themes

- **Layout and Responsiveness**
  - Fixed pagination in fixed-height tables - now stays at bottom even with few records
  - Table container uses `flex: 1` for flexible layout

- **Documentation**
  - Added "Fixed Height" example demonstrating table with defined height
  - READMEs updated with new functionality

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