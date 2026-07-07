export type SkargridTheme = 'light' | 'dark';
export type SkargridSortType = 'string' | 'number' | 'date';
export type SkargridFilterType = 'text' | 'number' | 'date' | 'select';
export type SkargridAggregate = 'sum' | 'avg' | 'count' | 'min' | 'max' | ((rows: unknown[], field: string) => unknown);

export interface SkargridColumn<Row extends Record<string, unknown> = Record<string, unknown>> {
  field: keyof Row & string;
  title?: string;
  width?: string;
  visible?: boolean;
  sortable?: boolean;
  sortType?: SkargridSortType;
  filterable?: boolean;
  filterType?: SkargridFilterType;
  render?: (value: unknown, row: Row, index: number) => string | Node;
  formatter?: (value: unknown, row: Row, index: number) => string | Node;
  /**
   * Se `render`/`formatter` retornar uma string, ela só é tratada como HTML
   * quando esta opção (ou a equivalente no grid) estiver habilitada. Um Node
   * retornado é sempre anexado com segurança, independente desta flag.
   */
  allowUnsafeHtml?: boolean;
  /**
   * Fixa a coluna à esquerda durante o scroll horizontal (position: sticky).
   * Precisa formar um prefixo contíguo a partir da primeira coluna de dados
   * (após a coluna de seleção, se houver) — uma coluna frozen depois de uma
   * não-frozen é ignorada com um aviso em vez de aplicada incorretamente.
   */
  frozen?: boolean;
  /**
   * Calcula um valor agregado exibido no rodapé (requer `options.footerAggregates: true`).
   * Aceita as chaves embutidas ('sum', 'avg', 'count', 'min', 'max') ou uma
   * função `(rows, field) => valor` para agregações customizadas.
   */
  aggregate?: SkargridAggregate;
  /** Formata o valor calculado por `aggregate` antes de exibi-lo no rodapé. */
  aggregateFormatter?: (value: unknown, rows: Row[]) => string | Node;
}

export interface SkargridLabels {
  [key: string]: string;
}

export interface SkargridOptions<Row extends Record<string, unknown> = Record<string, unknown>> {
  data?: Row[];
  columns?: SkargridColumn<Row>[];
  className?: string;
  theme?: SkargridTheme;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  sortable?: boolean;
  selectable?: boolean;
  searchable?: boolean;
  columnFilters?: boolean;
  columnConfig?: boolean;
  persistColumnConfig?: boolean;
  storageKey?: string;
  exportCSV?: boolean;
  exportXLSX?: boolean;
  exportFilename?: string;
  virtualization?: boolean;
  height?: string;
  /** Padrão global para colunas sem `allowUnsafeHtml` próprio (padrão: false). */
  allowUnsafeHtml?: boolean;
  /** Persiste e restaura getState()/setState() via localStorage (padrão: false). */
  persistState?: boolean;
  /** Chave do localStorage. Se ausente, é derivada do id do container. */
  stateStorageKey?: string;
  /** Estado salvo com versão diferente da atual é descartado (padrão: 1). */
  stateVersion?: number | string;
  /** Exibe um rodapé (`<tfoot>`) com os valores de `column.aggregate` (padrão: false). */
  footerAggregates?: boolean;
  labels?: Partial<SkargridLabels>;
  onRowClick?: (row: Row, index: number) => void;
  onSelectionChange?: (rows: Row[]) => void;
  onFilterChange?: () => void;
  onPageChange?: (page: number) => void;
  onSortChange?: () => void;
  [key: string]: unknown;
}

export interface SkargridState {
  currentPage: number;
  pageSize: number;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  searchText: string;
  columnFilterValues: Record<string, unknown>;
  columnFilterSelected: Record<string, unknown[]>;
  selectedIndices: number[];
  visibleColumns: string[];
  columnOrder: string[];
  theme: SkargridTheme;
}

export interface SkargridEventMap<Row extends Record<string, unknown> = Record<string, unknown>> {
  sort: (column: string | null, direction: 'asc' | 'desc' | null) => void;
  pageChange: (page: number) => void;
  selectionChange: (rows: Row[]) => void;
  filterChange: () => void;
  rowClick: (row: Row, index: number) => void;
}

export default class Skargrid<Row extends Record<string, unknown> = Record<string, unknown>> {
  constructor(containerId: string, options?: SkargridOptions<Row>);
  options: SkargridOptions<Row>;
  labels: SkargridLabels;
  updateData(data: Row[]): void;
  getData(): Row[];
  getSelectedRows(): Row[];
  getSelectedIndices(): number[];
  selectRows(indices: number[]): void;
  deselectRows(indices: number[]): void;
  clearSelection(): void;
  clearAllFilters(): void;
  clearSearch(): void;
  clearSort(): void;
  goToPage(page: number): void;
  changePageSize(size: number): void;
  getState(): SkargridState;
  setState(state: Partial<SkargridState>): void;
  clearPersistedState(): void;
  on<E extends keyof SkargridEventMap<Row>>(event: E, handler: SkargridEventMap<Row>[E]): this;
  off<E extends keyof SkargridEventMap<Row>>(event: E, handler?: SkargridEventMap<Row>[E]): this;
  emit<E extends keyof SkargridEventMap<Row>>(event: E, ...args: Parameters<SkargridEventMap<Row>[E]>): void;
  refreshTable(): void;
  destroy(): void;
  setTheme(theme: SkargridTheme): void;
}

declare global {
  interface Window {
    Skargrid: typeof Skargrid;
  }
}
