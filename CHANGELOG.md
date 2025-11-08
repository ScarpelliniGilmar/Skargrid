# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.8.3] - 2025-11-08

### Adicionado
- **Configuração de Colunas**: Modal completo para reordenar e mostrar/ocultar colunas
  - Drag & drop nativo para reordenar colunas
  - Checkboxes para mostrar/ocultar colunas
  - Botões de setas (↑↓) para mover colunas
  - Botão "Restaurar Padrão" para resetar configuração
- **Persistência no localStorage**: Salva preferências do usuário automaticamente
  - Opção `persistColumnConfig: true` para habilitar
  - Opção `storageKey` para customizar chave do localStorage
  - API pública: `saveColumnConfig()`, `loadColumnConfig()`, `clearSavedColumnConfig()`
- **Suporte a `visible: false`**: Colunas podem iniciar ocultas por padrão
- **Suporte a Temas**: Light/Dark theme com método `setTheme()`
- **Parâmetro `columnConfig`**: Controla exibição do botão de configuração de colunas
- **UI Melhorada**: Botões com ícones apenas (tooltips para texto)
- **Independência de renderização**: Top bar renderiza mesmo sem `searchable: true`

### Modificado
- **Defaults minimalistas**: `sortable: false` e `columnConfig: false` por padrão
- **Refatoração da top bar**: Separado em `renderTopBar()`, `renderSearchInput()`, `renderClearFiltersButton()`
- **Tamanho do bundle**: ~83KB (aumento devido às novas features)

### Corrigido
- Botão de configuração de colunas não aparecendo quando `searchable: false`
- Botão "Limpar Filtros" aparecendo mesmo com `columnFilters: false`
- Estados dos botões de setas não atualizando após drag & drop
- Layout cortando última coluna devido ao scrollbar

## [0.8.2] - 2024-XX-XX

### Adicionado
- Filtros cascata estilo Excel com valores desabilitados
- Busca interna nos dropdowns de filtro
- Botão "Limpar Todos os Filtros" com contador de filtros ativos

### Modificado
- Melhorias na performance de filtros com grandes datasets
- Ícones SVG profissionais para busca e filtros

## [0.8.1] - 2024-XX-XX

### Adicionado
- Scroll horizontal customizado com track visible
- Badge de contagem de filtros ativos
- Suporte a filtros de data (HTML5 date input)

### Corrigido
- Problema de performance com muitos filtros ativos
- Scroll horizontal em dispositivos móveis

## [0.8.0] - 2024-XX-XX

### Adicionado
- Sistema de filtros por coluna (`columnFilters: true`)
- Tipos de filtro: text, number, date, select
- Busca normalizada (remove acentos automaticamente)
- Paginação com seletor de tamanho de página
- Seleção múltipla de linhas com checkboxes
- API pública completa (`updateData`, `getSelectedRows`, etc)

### Modificado
- Arquitetura modular (core + features)
- Build script em PowerShell
- CSS organizado com variáveis CSS

## [0.7.0] - 2024-XX-XX

### Adicionado
- Versão inicial pública
- Ordenação por colunas
- Busca global em todas as colunas
- Paginação básica
- Renderização customizada de células

---

## Tipos de Mudanças
- **Adicionado**: para novas funcionalidades
- **Modificado**: para mudanças em funcionalidades existentes
- **Descontinuado**: para funcionalidades que serão removidas
- **Removido**: para funcionalidades removidas
- **Corrigido**: para correção de bugs
- **Segurança**: para vulnerabilidades de segurança

## Links das Versões
- [0.8.3]: https://github.com/ScarpelliniGilmar/scargrid/releases/tag/v0.8.3
- [0.8.2]: https://github.com/ScarpelliniGilmar/scargrid/releases/tag/v0.8.2
- [0.8.1]: https://github.com/ScarpelliniGilmar/scargrid/releases/tag/v0.8.1
- [0.8.0]: https://github.com/ScarpelliniGilmar/scargrid/releases/tag/v0.8.0
- [0.7.0]: https://github.com/ScarpelliniGilmar/scargrid/releases/tag/v0.7.0
