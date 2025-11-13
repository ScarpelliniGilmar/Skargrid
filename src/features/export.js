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
    filename = filename || (this.options.exportFilename + '.csv');

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
   * Exporta dados visíveis para Excel (arquivo básico .xls com HTML table)
   * Implementação leve, sem dependências externas. Sem formatação avançada.
   */
  Skargrid.prototype.exportToExcel = function(filename) {
    filename = filename || (this.options.exportFilename + '.xls');

    // Obtém colunas visíveis na ordem atual
    const visibleColumns = this.columnOrder
      .filter(field => this.visibleColumns.has(field))
      .map(field => this.options.columns.find(col => col.field === field))
      .filter(col => col); // Remove undefined

    if (visibleColumns.length === 0) {
      visibleColumns.push(...this.options.columns);
    }

    // Dados a exportar: filteredData quando presente
    const dataToExport = this.filteredData.length > 0 ? this.filteredData : this.data;

    // Monta a tabela HTML
    let html = '<table border="1"><thead><tr>';
    visibleColumns.forEach(col => {
      html += '<th>' + (col.title || col.field) + '</th>';
    });
    html += '</tr></thead><tbody>';

    dataToExport.forEach(row => {
      html += '<tr>';
      visibleColumns.forEach(col => {
        let value = row[col.field];

        const exportRenderer = (col.render && typeof col.render === 'function')
          ? col.render
          : (col.formatter && typeof col.formatter === 'function')
            ? col.formatter
            : null;

        if (exportRenderer) {
          try {
            const rendered = exportRenderer(value, row);
            value = this.stripHTML(rendered);
          } catch (e) {
            if (console && console.warn) console.warn('Skargrid exportToExcel: renderer error for', col.field, e);
          }
        }

        if (value === null || value === undefined) value = '';
        // escape basic HTML entities
        const cell = String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        html += '<td>' + cell + '</td>';
      });
      html += '</tr>';
    });

    html += '</tbody></table>';

    // Wrap in basic HTML document expected by Excel
    const excelHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`;

    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel' });

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
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
   * Exporta linhas selecionadas para Excel
   */
  Skargrid.prototype.exportSelectedToExcel = function(filename) {
    filename = filename || (this.options.exportFilename + '-selected.xls');
    const selectedRows = this.getSelectedRows();
    if (selectedRows.length === 0) {
      alert('Nenhuma linha selecionada para exportar.');
      return;
    }

    const originalFiltered = this.filteredData;
    this.filteredData = selectedRows;
    this.exportToExcel(filename);
    this.filteredData = originalFiltered;
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
    filename = filename || (this.options.exportFilename + '-selected.csv');
    
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

  // -----------------------------
  // XLSX exporter (pure JS, no dependencies)
  // Produces a minimal .xlsx file (OpenXML) by generating XML parts and packing
  // them into an uncompressed ZIP archive. Fits simple data export needs.
  // -----------------------------

  // CRC32 implementation for ZIP central directory
  function crc32buf(buf) {
    const table = (function() {
      let c;
      const table = new Uint32Array(256);
      for (let n = 0; n < 256; n++) {
        c = n;
        for (let k = 0; k < 8; k++) {
          c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        table[n] = c >>> 0;
      }
      return table;
    })();

    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  // little-endian helpers
  function u32ToBytesLE(n) {
    return [n & 0xFF, (n >>> 8) & 0xFF, (n >>> 16) & 0xFF, (n >>> 24) & 0xFF];
  }
  function u16ToBytesLE(n) {
    return [n & 0xFF, (n >>> 8) & 0xFF];
  }

  // ZIP packer for uncompressed files (method 0)
  function buildZip(entries) {
    // entries: [{name: 'path', content: Uint8Array}]
    const fileRecords = [];
    const centralDirectory = [];
    let offset = 0;

    entries.forEach(entry => {
      const nameBuf = new TextEncoder().encode(entry.name);
      const content = entry.content;
      const crc = crc32buf(content);
      const compressedSize = content.length;
      const uncompressedSize = content.length;

      // local file header
      const localHeader = [];
      // signature
      localHeader.push(...[0x50,0x4b,0x03,0x04]);
      // version needed to extract
      localHeader.push(...u16ToBytesLE(20));
      // general purpose bit flag
      localHeader.push(...u16ToBytesLE(0));
      // compression method (0 = no compression)
      localHeader.push(...u16ToBytesLE(0));
      // file mod time/date (set to 0)
      localHeader.push(...u16ToBytesLE(0));
      localHeader.push(...u16ToBytesLE(0));
      // crc32
      localHeader.push(...u32ToBytesLE(crc));
      // compressed size
      localHeader.push(...u32ToBytesLE(compressedSize));
      // uncompressed size
      localHeader.push(...u32ToBytesLE(uncompressedSize));
      // file name length
      localHeader.push(...u16ToBytesLE(nameBuf.length));
      // extra field length
      localHeader.push(...u16ToBytesLE(0));

      const localHeaderBuf = new Uint8Array(localHeader);

      const record = new Uint8Array(localHeaderBuf.length + nameBuf.length + content.length);
      record.set(localHeaderBuf, 0);
      record.set(nameBuf, localHeaderBuf.length);
      record.set(content, localHeaderBuf.length + nameBuf.length);

      fileRecords.push(record);

      // central directory header
      const central = [];
      central.push(...[0x50,0x4b,0x01,0x02]); // signature
      central.push(...u16ToBytesLE(0x14)); // version made by
      central.push(...u16ToBytesLE(20)); // version needed
      central.push(...u16ToBytesLE(0)); // gp bit flag
      central.push(...u16ToBytesLE(0)); // compression method
      central.push(...u16ToBytesLE(0)); // mod time
      central.push(...u16ToBytesLE(0)); // mod date
      central.push(...u32ToBytesLE(crc));
      central.push(...u32ToBytesLE(compressedSize));
      central.push(...u32ToBytesLE(uncompressedSize));
      central.push(...u16ToBytesLE(nameBuf.length));
      central.push(...u16ToBytesLE(0)); // extra
      central.push(...u16ToBytesLE(0)); // file comment
      central.push(...u16ToBytesLE(0)); // disk number start
      central.push(...u16ToBytesLE(0)); // internal attrs
      central.push(...u32ToBytesLE(0)); // external attrs
      central.push(...u32ToBytesLE(offset));
      const centralBuf = new Uint8Array(central.length + nameBuf.length);
      centralBuf.set(new Uint8Array(central), 0);
      centralBuf.set(nameBuf, central.length);

      centralDirectory.push(centralBuf);

      offset += record.length;
    });

    // concatenate file records
    const sizeFiles = fileRecords.reduce((s, r) => s + r.length, 0);
    const sizeCentral = centralDirectory.reduce((s, r) => s + r.length, 0);

    const out = new Uint8Array(sizeFiles + sizeCentral + 22);
    let ptr = 0;
    fileRecords.forEach(r => { out.set(r, ptr); ptr += r.length; });
    const cdStart = ptr;
    centralDirectory.forEach(r => { out.set(r, ptr); ptr += r.length; });

    // end of central directory
    // signature
    out.set(new Uint8Array([0x50,0x4b,0x05,0x06]), ptr); ptr +=4;
    // disk numbers
    out.set(new Uint8Array([0,0,0,0]), ptr); ptr +=4;
    // entries on disk and total
    out.set(new Uint8Array(u16ToBytesLE(centralDirectory.length)), ptr); ptr +=2;
    out.set(new Uint8Array(u16ToBytesLE(centralDirectory.length)), ptr); ptr +=2;
    // size of central
    out.set(new Uint8Array(u32ToBytesLE(sizeCentral)), ptr); ptr +=4;
    // offset of start of central
    out.set(new Uint8Array(u32ToBytesLE(cdStart)), ptr); ptr +=4;
    // comment length
    out.set(new Uint8Array([0,0]), ptr); ptr +=2;

    return out.buffer;
  }

  // helper: convert column index to Excel column name (0->A)
  function colIndexToName(n) {
    let s = '';
    while (n >= 0) {
      s = String.fromCharCode((n % 26) + 65) + s;
      n = Math.floor(n / 26) - 1;
    }
    return s;
  }

  // build minimal XLSX from data rows and columns
  function buildXLSXFromTable(columns, rows, stripHTML) {
    // columns: [{title, field}], rows: array of objects
    // collect shared strings
    const shared = [];
    const sMap = new Map();

    function addString(str) {
      if (sMap.has(str)) return sMap.get(str);
      const idx = shared.length;
      shared.push(str);
      sMap.set(str, idx);
      return idx;
    }

    const rowsXml = [];
    // header row
    const headerCells = columns.map((c, ci) => {
      const idx = addString(String(c.title || c.field));
      return `<c r="${colIndexToName(ci)}1" t="s"><v>${idx}</v></c>`;
    }).join('');
    rowsXml.push(`<row r="1">${headerCells}</row>`);

    // data rows
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      const cells = columns.map((c, ci) => {
        let v = row[c.field];
        // if renderer exists, try to get text
        const renderer = (c.render && typeof c.render === 'function') ? c.render : (c.formatter && typeof c.formatter === 'function') ? c.formatter : null;
        if (renderer) {
          try { v = renderer(v, row); } catch (e) { /* ignore */ }
        }
        // strip HTML from rendered value
        if (stripHTML && typeof stripHTML === 'function') {
          v = stripHTML(v);
        }
        if (v === null || v === undefined) v = '';
        if (typeof v === 'number') {
          return `<c r="${colIndexToName(ci)}${r+2}"><v>${v}</v></c>`;
        }
        const idx = addString(String(v));
        return `<c r="${colIndexToName(ci)}${r+2}" t="s"><v>${idx}</v></c>`;
      }).join('');
      rowsXml.push(`<row r="${r+2}">${cells}</row>`);
    }

    const sheetData = `<sheetData>${rowsXml.join('')}</sheetData>`;

    const worksheet = `<?xml version="1.0" encoding="UTF-8"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${sheetData}</worksheet>`;

    // sharedStrings
    const sItems = shared.map(s => `<si><t>${escapeXml(String(s))}</t></si>`).join('');
    const sst = `<?xml version="1.0" encoding="UTF-8"?>\n<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${shared.length}" uniqueCount="${shared.length}">${sItems}</sst>`;

    // workbook
    const workbook = `<?xml version="1.0" encoding="UTF-8"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets></workbook>`;

    // minimal styles (required)
    const styles = `<?xml version="1.0" encoding="UTF-8"?>\n<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="1"><font><sz val="11"/><color theme="1"/><name val="Calibri"/></font></fonts><fills count="1"><fill><patternFill patternType="none"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" xfId="0"/></cellXfs></styleSheet>`;

    // relationships
    const relsRels = `<?xml version="1.0" encoding="UTF-8"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="/xl/workbook.xml"/></Relationships>`;

    const workbookRels = `<?xml version="1.0" encoding="UTF-8"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/></Relationships>`;

    const contentTypes = `<?xml version="1.0" encoding="UTF-8"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/></Types>`;

    // assemble entries
    const entries = [
      { name: '_rels/.rels', content: new TextEncoder().encode(relsRels) },
      { name: '[Content_Types].xml', content: new TextEncoder().encode(contentTypes) },
      { name: 'xl/workbook.xml', content: new TextEncoder().encode(workbook) },
      { name: 'xl/_rels/workbook.xml.rels', content: new TextEncoder().encode(workbookRels) },
      { name: 'xl/worksheets/sheet1.xml', content: new TextEncoder().encode(worksheet) },
      { name: 'xl/sharedStrings.xml', content: new TextEncoder().encode(sst) },
      { name: 'xl/styles.xml', content: new TextEncoder().encode(styles) }
    ];

    return buildZip(entries);
  }

  function escapeXml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // public API: exportToXLSX and exportSelectedToXLSX
  Skargrid.prototype.exportToXLSX = function(filename) {
    filename = filename || (this.options.exportFilename + '.xlsx');

    const visibleColumns = this.columnOrder
      .filter(field => this.visibleColumns.has(field))
      .map(field => this.options.columns.find(col => col.field === field))
      .filter(col => col);
    if (visibleColumns.length === 0) visibleColumns.push(...this.options.columns);

    const dataToExport = this.filteredData.length > 0 ? this.filteredData : this.data;

    const zipBuf = buildXLSXFromTable(visibleColumns, dataToExport, this.stripHTML.bind(this));

    const blob = new Blob([zipBuf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
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

  Skargrid.prototype.exportSelectedToXLSX = function(filename) {
    filename = filename || (this.options.exportFilename + '-selected.xlsx');
    const selectedRows = this.getSelectedRows();
    if (selectedRows.length === 0) { alert('Nenhuma linha selecionada para exportar.'); return; }
    const originalFiltered = this.filteredData;
    this.filteredData = selectedRows;
    this.exportToXLSX(filename);
    this.filteredData = originalFiltered;
  };

})();
