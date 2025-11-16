/* eslint-disable no-unused-vars */
/**
 * Skargrid - Módulo de Busca Global
 * Gerencia a renderização e interação do campo de busca
 */

const SearchFeature = {
  /**
   * Renderiza o componente de busca global
   */
  renderSearchInput(grid) {
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'skargrid-search-wrapper';

    // Ícone de busca (SVG profissional)
    const searchIcon = document.createElement('span');
    searchIcon.className = 'skargrid-search-icon';
    searchIcon.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    `;

    // Input de busca
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'skargrid-search-input';
    searchInput.placeholder = grid.labels.searchPlaceholder;
    searchInput.value = grid.searchText;

    // Evento de busca COM debounce (300ms) para performance
    searchInput.oninput = (e) => {
      clearTimeout(grid.searchTimeout);
      grid.searchTimeout = setTimeout(() => {
        grid.handleSearch(e.target.value);
      }, 300);
    };

    // Botão limpar (SVG profissional)
    const clearButton = document.createElement('button');
    clearButton.className = 'skargrid-search-clear';
    clearButton.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    clearButton.style.display = grid.searchText ? 'flex' : 'none';
    clearButton.onclick = () => {
      searchInput.value = '';
      searchInput.focus();
      grid.handleSearch('');
    };

    searchWrapper.appendChild(searchIcon);
    searchWrapper.appendChild(searchInput);
    searchWrapper.appendChild(clearButton);

    return searchWrapper;
  },

};