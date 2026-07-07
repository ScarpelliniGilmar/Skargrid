export type SkargridTheme = 'light' | 'dark';
export type SkargridSortType = 'string' | 'number' | 'date';
export type SkargridFilterType = 'text' | 'number' | 'date' | 'select';

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
