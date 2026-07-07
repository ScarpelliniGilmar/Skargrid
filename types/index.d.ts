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
  render?: (value: unknown, row: Row, index: number) => string;
  formatter?: (value: unknown, row: Row, index: number) => string;
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
  refreshTable(): void;
  destroy(): void;
  setTheme(theme: SkargridTheme): void;
}

declare global {
  interface Window {
    Skargrid: typeof Skargrid;
  }
}
