/**
 * ScarGrid Bundle - Versão completa para uso no browser
 * @version 0.7.0
 * 
 * Este arquivo carrega automaticamente todas as dependências na ordem correta.
 * Basta incluir este único arquivo no HTML.
 * 
 * Uso:
 * <script src="scargrid-bundle.js"></script>
 * <script>
 *   const table = new ScarGrid('container', { ... });
 * </script>
 */

// Verifica se já foi carregado
if (typeof window.ScarGrid !== 'undefined') {
  console.warn('ScarGrid já foi carregado anteriormente');
} else {
  // Ordem de carregamento: Features -> Core -> Index
  
  // 1. Features (podem ser usadas independentemente)
  if (typeof window.PaginationFeature === 'undefined') {
    console.log('Carregando PaginationFeature...');
    // Feature será carregada via script tag
  }
  
  if (typeof window.SortFeature === 'undefined') {
    console.log('Carregando SortFeature...');
  }
  
  if (typeof window.SelectionFeature === 'undefined') {
    console.log('Carregando SelectionFeature...');
  }
  
  if (typeof window.FilterFeature === 'undefined') {
    console.log('Carregando FilterFeature...');
  }
  
  // 2. Core (implementação de renderização)
  if (typeof window.ScarGridCore === 'undefined') {
    console.log('Carregando ScarGridCore...');
  }
  
  // 3. API pública via index.js
  console.log('ScarGrid v0.7.0 carregado com sucesso!');
  console.log('Features disponíveis:', {
    pagination: typeof window.PaginationFeature !== 'undefined',
    sort: typeof window.SortFeature !== 'undefined',
    selection: typeof window.SelectionFeature !== 'undefined',
    filter: typeof window.FilterFeature !== 'undefined'
  });
}

/**
 * Helper para carregar ScarGrid via AMD ou CommonJS
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['exports'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    // CommonJS
    factory(exports);
  } else {
    // Browser globals
    factory((root.ScarGridBundle = {}));
  }
}(typeof self !== 'undefined' ? self : this, function (exports) {
  exports.version = '0.7.0';
  exports.loadAll = function() {
    // Função para carregar todos os scripts dinamicamente
    const scripts = [
      './features/pagination.js',
      './features/sort.js',
      './features/selection.js',
      './features/filter.js',
      './core/scargrid.js'
    ];
    
    return Promise.all(scripts.map(src => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }));
  };
}));
