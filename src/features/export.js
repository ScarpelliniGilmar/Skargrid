/**
 * Skargrid - Export Module
 * Módulo de exportação de dados (CSV)
 */

(function() {
  'use strict';

  /**
   * Renderiza botão "Exportar CSV"
   */
  Skargrid.prototype.renderExportCSVButton = function() {
    const exportButton = document.createElement('button');
    exportButton.className = 'skargrid-clear-filters-btn';
    exportButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    `;
    exportButton.title = 'Exportar CSV';
    exportButton.onclick = () => this.exportToCSV();
    
    return exportButton;
  };

  /**
   * Exporta dados visíveis para CSV
   */
  Skargrid.prototype.exportToCSV = function(filename) {
    filename = filename || 'skargrid-export.csv';

    // Obtém colunas visíveis na ordem atual
    const visibleColumns = this.columnOrder
      .filter(field => this.visibleColumns.has(field))
      .map(field => this.options.columns.find(col => col.field === field))
      .filter(col => col); // Remove undefined

    // Se não houver colunas visíveis, usa todas
    if (visibleColumns.length === 0) {
      visibleColumns.push(...this.options.columns);
    }

    // Cabeçalho CSV
    const headers = visibleColumns.map(col => this.escapeCSV(col.title));
    const csvRows = [headers.join(',')];

    // Dados (usa dados filtrados/pesquisados se houver)
    const dataToExport = this.filteredData.length > 0 ? this.filteredData : this.data;

    // Adiciona linhas de dados
    dataToExport.forEach(row => {
      const values = visibleColumns.map(col => {
        let value = row[col.field];
        
        // Se a coluna tem render customizado, extrai o texto puro
        // Suporta tanto `render` (docs/exemplos) quanto `formatter` (core antigo)
        const exportRenderer = (col.render && typeof col.render === 'function')
          ? col.render
          : (col.formatter && typeof col.formatter === 'function')
            ? col.formatter
            : null;

        if (exportRenderer) {
          // Renderiza e remove HTML tags
          try {
            const rendered = exportRenderer(value, row);
            value = this.stripHTML(rendered);
          } catch (e) {
            if (console && console.warn) console.warn('Skargrid export: erro ao executar renderer para coluna', col.field, e);
            // Mantém o valor original como fallback
          }
        }
        
        // Formata valores
        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'boolean') {
          value = value ? 'Sim' : 'Não';
        } else if (typeof value === 'number') {
          value = value.toString();
        } else {
          value = value.toString();
        }
        
        return this.escapeCSV(value);
      });
      
      csvRows.push(values.join(','));
    });

    // Cria CSV completo
    const csvContent = csvRows.join('\n');

    // Adiciona BOM para UTF-8 (suporte a acentos no Excel)
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // Download do arquivo
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Navegadores modernos
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }
  };

  /**
   * Escapa valores para CSV (adiciona aspas e escapa aspas internas)
   */
  Skargrid.prototype.escapeCSV = function(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    
    // Se contém vírgula, quebra de linha ou aspas, envolve em aspas
    if (value.includes(',') || value.includes('\n') || value.includes('"')) {
      // Escapa aspas duplicando-as
      value = value.replace(/"/g, '""');
      return `"${value}"`;
    }
    
    return value;
  };

  /**
   * Remove tags HTML de uma string
   */
  Skargrid.prototype.stripHTML = function(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  /**
   * Exporta dados selecionados para CSV
   */
  Skargrid.prototype.exportSelectedToCSV = function(filename) {
    filename = filename || 'skargrid-selected.csv';
    
    const selectedRows = this.getSelectedRows();
    if (selectedRows.length === 0) {
      alert('Nenhuma linha selecionada para exportar.');
      return;
    }

    // Temporariamente substitui filteredData com selecionados
    const originalFiltered = this.filteredData;
    this.filteredData = selectedRows;
    
    // Exporta
    this.exportToCSV(filename);
    
    // Restaura
    this.filteredData = originalFiltered;
  };

})();
