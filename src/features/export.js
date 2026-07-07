/**
 * Skargrid - Export Module
 * Módulo de exportação de dados (CSV, Excel legado e XLSX)
 */

import { stripHTMLText, extractRenderedText } from './render-utils.js';

function getVisibleColumnsInOrder(grid) {
  const visibleColumns = grid.columnOrder
    .filter(field => grid.visibleColumns.has(field))
    .map(field => grid.options.columns.find(col => col.field === field))
    .filter(col => col);

  if (visibleColumns.length === 0) {
    return [...grid.options.columns];
  }

  return visibleColumns;
}

function downloadBlob(blob, filename) {
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
    return;
  }

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

// -----------------------------
// CRC32/ZIP helpers para o exportador XLSX (puro JS, sem dependências)
// Produz um .xlsx mínimo (OpenXML) gerando as partes XML e empacotando
// tudo num ZIP sem compressão. Atende necessidades simples de exportação.
// -----------------------------

function crc32buf(buf) {
  const table = (function buildTable() {
    let c;
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      t[n] = c >>> 0;
    }
    return t;
  })();

  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function u32ToBytesLE(n) {
  return [n & 0xFF, (n >>> 8) & 0xFF, (n >>> 16) & 0xFF, (n >>> 24) & 0xFF];
}
function u16ToBytesLE(n) {
  return [n & 0xFF, (n >>> 8) & 0xFF];
}

function buildZip(entries) {
  const fileRecords = [];
  const centralDirectory = [];
  let offset = 0;

  entries.forEach(entry => {
    const nameBuf = new TextEncoder().encode(entry.name);
    const content = entry.content;
    const crc = crc32buf(content);
    const compressedSize = content.length;
    const uncompressedSize = content.length;

    const localHeader = [];
    localHeader.push(...[0x50, 0x4b, 0x03, 0x04]);
    localHeader.push(...u16ToBytesLE(20));
    localHeader.push(...u16ToBytesLE(0));
    localHeader.push(...u16ToBytesLE(0));
    localHeader.push(...u16ToBytesLE(0));
    localHeader.push(...u16ToBytesLE(0));
    localHeader.push(...u32ToBytesLE(crc));
    localHeader.push(...u32ToBytesLE(compressedSize));
    localHeader.push(...u32ToBytesLE(uncompressedSize));
    localHeader.push(...u16ToBytesLE(nameBuf.length));
    localHeader.push(...u16ToBytesLE(0));

    const localHeaderBuf = new Uint8Array(localHeader);

    const record = new Uint8Array(localHeaderBuf.length + nameBuf.length + content.length);
    record.set(localHeaderBuf, 0);
    record.set(nameBuf, localHeaderBuf.length);
    record.set(content, localHeaderBuf.length + nameBuf.length);

    fileRecords.push(record);

    const central = [];
    central.push(...[0x50, 0x4b, 0x01, 0x02]);
    central.push(...u16ToBytesLE(0x14));
    central.push(...u16ToBytesLE(20));
    central.push(...u16ToBytesLE(0));
    central.push(...u16ToBytesLE(0));
    central.push(...u16ToBytesLE(0));
    central.push(...u16ToBytesLE(0));
    central.push(...u32ToBytesLE(crc));
    central.push(...u32ToBytesLE(compressedSize));
    central.push(...u32ToBytesLE(uncompressedSize));
    central.push(...u16ToBytesLE(nameBuf.length));
    central.push(...u16ToBytesLE(0));
    central.push(...u16ToBytesLE(0));
    central.push(...u16ToBytesLE(0));
    central.push(...u16ToBytesLE(0));
    central.push(...u32ToBytesLE(0));
    central.push(...u32ToBytesLE(offset));
    const centralBuf = new Uint8Array(central.length + nameBuf.length);
    centralBuf.set(new Uint8Array(central), 0);
    centralBuf.set(nameBuf, central.length);

    centralDirectory.push(centralBuf);

    offset += record.length;
  });

  const sizeFiles = fileRecords.reduce((s, r) => s + r.length, 0);
  const sizeCentral = centralDirectory.reduce((s, r) => s + r.length, 0);

  const out = new Uint8Array(sizeFiles + sizeCentral + 22);
  let ptr = 0;
  fileRecords.forEach(r => { out.set(r, ptr); ptr += r.length; });
  const cdStart = ptr;
  centralDirectory.forEach(r => { out.set(r, ptr); ptr += r.length; });

  out.set(new Uint8Array([0x50, 0x4b, 0x05, 0x06]), ptr); ptr += 4;
  out.set(new Uint8Array([0, 0, 0, 0]), ptr); ptr += 4;
  out.set(new Uint8Array(u16ToBytesLE(centralDirectory.length)), ptr); ptr += 2;
  out.set(new Uint8Array(u16ToBytesLE(centralDirectory.length)), ptr); ptr += 2;
  out.set(new Uint8Array(u32ToBytesLE(sizeCentral)), ptr); ptr += 4;
  out.set(new Uint8Array(u32ToBytesLE(cdStart)), ptr); ptr += 4;
  out.set(new Uint8Array([0, 0]), ptr); ptr += 2;

  return out.buffer;
}

function colIndexToName(n) {
  let s = '';
  while (n >= 0) {
    s = String.fromCharCode((n % 26) + 65) + s;
    n = Math.floor(n / 26) - 1;
  }
  return s;
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildXLSXFromTable(columns, rows) {
  const shared = [];
  const sMap = new Map();

  function addString(str) {
    if (sMap.has(str)) { return sMap.get(str); }
    const idx = shared.length;
    shared.push(str);
    sMap.set(str, idx);
    return idx;
  }

  const rowsXml = [];
  const headerCells = columns.map((c, ci) => {
    const idx = addString(String(c.title || c.field));
    return `<c r="${colIndexToName(ci)}1" t="s"><v>${idx}</v></c>`;
  }).join('');
  rowsXml.push(`<row r="1">${headerCells}</row>`);

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const cells = columns.map((c, ci) => {
      let v = row[c.field];
      const renderer = (c.render && typeof c.render === 'function') ? c.render : (c.formatter && typeof c.formatter === 'function') ? c.formatter : null;
      if (renderer) {
        try { v = extractRenderedText(renderer(v, row)); } catch { /* ignore */ }
      }
      if (v === null || v === undefined) { v = ''; }
      if (typeof v === 'number') {
        return `<c r="${colIndexToName(ci)}${r + 2}"><v>${v}</v></c>`;
      }
      const idx = addString(String(v));
      return `<c r="${colIndexToName(ci)}${r + 2}" t="s"><v>${idx}</v></c>`;
    }).join('');
    rowsXml.push(`<row r="${r + 2}">${cells}</row>`);
  }

  const sheetData = `<sheetData>${rowsXml.join('')}</sheetData>`;
  const worksheet = `<?xml version="1.0" encoding="UTF-8"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${sheetData}</worksheet>`;

  const sItems = shared.map(s => `<si><t>${escapeXml(String(s))}</t></si>`).join('');
  const sst = `<?xml version="1.0" encoding="UTF-8"?>\n<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${shared.length}" uniqueCount="${shared.length}">${sItems}</sst>`;

  const workbook = '<?xml version="1.0" encoding="UTF-8"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets></workbook>';

  const styles = '<?xml version="1.0" encoding="UTF-8"?>\n<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="1"><font><sz val="11"/><color theme="1"/><name val="Calibri"/></font></fonts><fills count="1"><fill><patternFill patternType="none"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" xfId="0"/></cellXfs></styleSheet>';

  const relsRels = '<?xml version="1.0" encoding="UTF-8"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="/xl/workbook.xml"/></Relationships>';

  const workbookRels = '<?xml version="1.0" encoding="UTF-8"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/></Relationships>';

  const contentTypes = '<?xml version="1.0" encoding="UTF-8"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/></Types>';

  const entries = [
    { name: '_rels/.rels', content: new TextEncoder().encode(relsRels) },
    { name: '[Content_Types].xml', content: new TextEncoder().encode(contentTypes) },
    { name: 'xl/workbook.xml', content: new TextEncoder().encode(workbook) },
    { name: 'xl/_rels/workbook.xml.rels', content: new TextEncoder().encode(workbookRels) },
    { name: 'xl/worksheets/sheet1.xml', content: new TextEncoder().encode(worksheet) },
    { name: 'xl/sharedStrings.xml', content: new TextEncoder().encode(sst) },
    { name: 'xl/styles.xml', content: new TextEncoder().encode(styles) },
  ];

  return buildZip(entries);
}

const ExportFeature = {
  /**
   * Escapa valores para CSV (adiciona aspas e escapa aspas internas)
   */
  escapeCSV(value) {
    let str = typeof value === 'string' ? value : String(value);

    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    }

    return str;
  },

  /**
   * Remove tags HTML de uma string
   */
  stripHTML(html) {
    return stripHTMLText(html);
  },

  /**
   * Exporta dados visíveis (ou selecionados) para CSV
   */
  exportToCSV(grid, filename) {
    filename = filename || (grid.options.exportFilename + '.csv');

    const visibleColumns = getVisibleColumnsInOrder(grid);
    const headers = visibleColumns.map(col => this.escapeCSV(col.title));
    const csvRows = [headers.join(',')];

    grid.filteredData.forEach(row => {
      const values = visibleColumns.map(col => {
        let value = row[col.field];

        const exportRenderer = (col.render && typeof col.render === 'function')
          ? col.render
          : (col.formatter && typeof col.formatter === 'function')
            ? col.formatter
            : null;

        if (exportRenderer) {
          try {
            const rendered = exportRenderer(value, row);
            value = extractRenderedText(rendered);
          } catch (e) {
            if (console && console.warn) { console.warn('Skargrid export: erro ao executar renderer para coluna', col.field, e); }
          }
        }

        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'boolean') {
          value = value ? 'Sim' : 'Não';
        } else {
          value = value.toString();
        }

        return this.escapeCSV(value);
      });

      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');
    const BOM = '﻿';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
  },

  /**
   * Exporta dados visíveis para Excel (arquivo básico .xls com HTML table)
   * Implementação leve, sem dependências externas. Sem formatação avançada.
   */
  exportToExcel(grid, filename) {
    filename = filename || (grid.options.exportFilename + '.xls');

    const visibleColumns = getVisibleColumnsInOrder(grid);

    let html = '<table border="1"><thead><tr>';
    visibleColumns.forEach(col => {
      html += '<th>' + (col.title || col.field) + '</th>';
    });
    html += '</tr></thead><tbody>';

    grid.filteredData.forEach(row => {
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
            value = extractRenderedText(rendered);
          } catch (e) {
            if (console && console.warn) { console.warn('Skargrid exportToExcel: renderer error for', col.field, e); }
          }
        }

        if (value === null || value === undefined) { value = ''; }
        const cell = String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        html += '<td>' + cell + '</td>';
      });
      html += '</tr>';
    });

    html += '</tbody></table>';

    const excelHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`;
    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel' });
    downloadBlob(blob, filename);
  },

  /**
   * Exporta linhas selecionadas para Excel
   */
  exportSelectedToExcel(grid, filename) {
    filename = filename || (grid.options.exportFilename + '-selected.xls');
    const selectedRows = grid.getSelectedRows();
    if (selectedRows.length === 0) {
      alert(grid.labels.noRowsSelected);
      return;
    }

    const originalFiltered = grid.filteredData;
    grid.filteredData = selectedRows;
    this.exportToExcel(grid, filename);
    grid.filteredData = originalFiltered;
  },

  /**
   * Exporta dados selecionados para CSV
   */
  exportSelectedToCSV(grid, filename) {
    filename = filename || (grid.options.exportFilename + '-selected.csv');

    const selectedRows = grid.getSelectedRows();
    if (selectedRows.length === 0) {
      alert(grid.labels.noRowsSelected);
      return;
    }

    const originalFiltered = grid.filteredData;
    grid.filteredData = selectedRows;
    this.exportToCSV(grid, filename);
    grid.filteredData = originalFiltered;
  },

  /**
   * Exporta dados visíveis (ou selecionados) para XLSX real (OpenXML)
   */
  exportToXLSX(grid, filename) {
    filename = filename || (grid.options.exportFilename + '.xlsx');

    const visibleColumns = getVisibleColumnsInOrder(grid);
    const zipBuf = buildXLSXFromTable(visibleColumns, grid.filteredData);

    const blob = new Blob([zipBuf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    downloadBlob(blob, filename);
  },

  /**
   * Exporta linhas selecionadas para XLSX
   */
  exportSelectedToXLSX(grid, filename) {
    filename = filename || (grid.options.exportFilename + '-selected.xlsx');
    const selectedRows = grid.getSelectedRows();
    if (selectedRows.length === 0) { alert(grid.labels.noRowsSelected); return; }
    const originalFiltered = grid.filteredData;
    grid.filteredData = selectedRows;
    this.exportToXLSX(grid, filename);
    grid.filteredData = originalFiltered;
  },
};

export default ExportFeature;
