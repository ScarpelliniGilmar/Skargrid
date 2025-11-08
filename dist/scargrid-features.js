/**
 * ScarGrid - Biblioteca completa (Build único)
 * @version 0.7.0
 * 
 * Este arquivo contém TODA a biblioteca em um único arquivo para facilitar o uso.
 * Inclui: Pagination, Sort, Selection, Filter, Core e API pública
 */

(function(global) {
  'use strict';

  // ============================================
  // FEATURE: PAGINATION
  // ============================================
  const PaginationFeature = {
    renderPagination(grid) {
      const paginationDiv = document.createElement('div');
      paginationDiv.className = 'tablejs-pagination';

      const info = this.renderPaginationInfo(grid);
      paginationDiv.appendChild(info);

      const controls = this.renderPaginationControls(grid);
      paginationDiv.appendChild(controls);

      const sizeSelector = this.renderPageSizeSelector(grid);
      paginationDiv.appendChild(sizeSelector);

      return paginationDiv;
    },

    renderPaginationInfo(grid) {
      const info = document.createElement('div');
      info.className = 'tablejs-pagination-info';

      const totalRecords = grid.filteredData.length;
      const totalOriginal = grid.options.data.length;
      const startRecord = totalRecords === 0 ? 0 : (grid.currentPage - 1) * grid.options.pageSize + 1;
      const endRecord = Math.min(grid.currentPage * grid.options.pageSize, totalRecords);

      let text = `Mostrando ${startRecord} até ${endRecord} de ${totalRecords} registros`;
      
      if (grid.searchText && totalRecords < totalOriginal) {
        text += ` (filtrados de ${totalOriginal} total)`;
      }

      info.textContent = text;
      return info;
    },

    renderPaginationControls(grid) {
      const controls = document.createElement('div');
      controls.className = 'tablejs-pagination-controls';

      const firstBtn = document.createElement('button');
      firstBtn.textContent = '«';
      firstBtn.className = 'tablejs-pagination-btn';
      firstBtn.disabled = grid.currentPage === 1;
      firstBtn.onclick = () => this.goToPage(grid, 1);
      controls.appendChild(firstBtn);

      const prevBtn = document.createElement('button');
      prevBtn.textContent = '‹';
      prevBtn.className = 'tablejs-pagination-btn';
      prevBtn.disabled = grid.currentPage === 1;
      prevBtn.onclick = () => this.goToPage(grid, grid.currentPage - 1);
      controls.appendChild(prevBtn);

      const pageNumbers = this.getPageNumbers(grid);
      pageNumbers.forEach(pageNum => {
        if (pageNum === '...') {
          const ellipsis = document.createElement('span');
          ellipsis.textContent = '...';
          ellipsis.className = 'tablejs-pagination-ellipsis';
          controls.appendChild(ellipsis);
        } else {
          const pageBtn = document.createElement('button');
          pageBtn.textContent = pageNum;
          pageBtn.className = 'tablejs-pagination-btn';
          if (pageNum === grid.currentPage) {
            pageBtn.classList.add('active');
          }
          pageBtn.onclick = () => this.goToPage(grid, pageNum);
          controls.appendChild(pageBtn);
        }
      });

      const nextBtn = document.createElement('button');
      nextBtn.textContent = '›';
      nextBtn.className = 'tablejs-pagination-btn';
      nextBtn.disabled = grid.currentPage === grid.totalPages;
      nextBtn.onclick = () => this.goToPage(grid, grid.currentPage + 1);
      controls.appendChild(nextBtn);

      const lastBtn = document.createElement('button');
      lastBtn.textContent = '»';
      lastBtn.className = 'tablejs-pagination-btn';
      lastBtn.disabled = grid.currentPage === grid.totalPages;
      lastBtn.onclick = () => this.goToPage(grid, grid.totalPages);
      controls.appendChild(lastBtn);

      return controls;
    },

    getPageNumbers(grid) {
      const pages = [];
      const maxVisible = 5;

      if (grid.totalPages <= maxVisible + 2) {
        for (let i = 1; i <= grid.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);

        let start = Math.max(2, grid.currentPage - 1);
        let end = Math.min(grid.totalPages - 1, grid.currentPage + 1);

        if (grid.currentPage <= 3) {
          end = 4;
        } else if (grid.currentPage >= grid.totalPages - 2) {
          start = grid.totalPages - 3;
        }

        if (start > 2) pages.push('...');

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        if (end < grid.totalPages - 1) pages.push('...');
        pages.push(grid.totalPages);
      }

      return pages;
    },

    renderPageSizeSelector(grid) {
      const selector = document.createElement('div');
      selector.className = 'tablejs-page-size';

      const label = document.createElement('span');
      label.textContent = 'Itens por página: ';
      selector.appendChild(label);

      const select = document.createElement('select');
      select.className = 'tablejs-page-size-select';

      grid.options.pageSizeOptions.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        if (size === grid.options.pageSize) {
          option.selected = true;
        }
        select.appendChild(option);
      });

      select.onchange = (e) => {
        this.changePageSize(grid, parseInt(e.target.value));
      };

      selector.appendChild(select);
      return selector;
    },

    goToPage(grid, pageNumber) {
      if (pageNumber < 1 || pageNumber > grid.totalPages) {
        return;
      }
      grid.currentPage = pageNumber;
      grid.render(false);
    },

    changePageSize(grid, newSize) {
      grid.options.pageSize = newSize;
      grid.currentPage = 1;
      this.calculatePagination(grid);
      grid.render(false);
    },

    calculatePagination(grid) {
      if (grid.options.pagination) {
        const totalRecords = grid.filteredData.length;
        grid.totalPages = Math.ceil(totalRecords / grid.options.pageSize);
        
        if (grid.currentPage > grid.totalPages) {
          grid.currentPage = grid.totalPages || 1;
        }
      }
    },

    getPageData(grid) {
      if (!grid.options.pagination) {
        return grid.filteredData;
      }

      const startIndex = (grid.currentPage - 1) * grid.options.pageSize;
      const endIndex = startIndex + grid.options.pageSize;
      return grid.filteredData.slice(startIndex, endIndex);
    }
  };

  // ============================================
  // FEATURE: SORT
  // ============================================
  const SortFeature = {
    handleSort(grid, field) {
      if (grid.sortColumn === field) {
        if (grid.sortDirection === 'asc') {
          grid.sortDirection = 'desc';
        } else if (grid.sortDirection === 'desc') {
          grid.sortColumn = null;
          grid.sortDirection = null;
          grid.options.data = [...grid.originalData];
        }
      } else {
        grid.sortColumn = field;
        grid.sortDirection = 'asc';
      }

      if (grid.sortColumn) {
        this.sortData(grid);
      }

      grid.currentPage = 1;
      grid.calculatePagination();
      grid.render(false);
    },

    sortData(grid) {
      const column = grid.options.columns.find(col => col.field === grid.sortColumn);
      
      grid.options.data.sort((a, b) => {
        let valueA = a[grid.sortColumn];
        let valueB = b[grid.sortColumn];

        if (column && column.sortCompare && typeof column.sortCompare === 'function') {
          return grid.sortDirection === 'asc' 
            ? column.sortCompare(valueA, valueB, a, b)
            : column.sortCompare(valueB, valueA, b, a);
        }

        if (valueA == null) valueA = '';
        if (valueB == null) valueB = '';

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return grid.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        } else {
          const strA = String(valueA).toLowerCase();
          const strB = String(valueB).toLowerCase();
          
          if (grid.sortDirection === 'asc') {
            return strA.localeCompare(strB);
          } else {
            return strB.localeCompare(strA);
          }
        }
      });

      grid.applyFilters();
    }
  };

  // ============================================
  // FEATURE: SELECTION
  // ============================================
  const SelectionFeature = {
    toggleSelectRow(grid, index, selected) {
      if (selected) {
        grid.selectedRows.add(index);
      } else {
        grid.selectedRows.delete(index);
      }
      grid.render(false);
    },

    toggleSelectAll(grid, selected) {
      if (selected) {
        grid.options.data.forEach((_, index) => {
          grid.selectedRows.add(index);
        });
      } else {
        grid.selectedRows.clear();
      }
      grid.render(false);
    },

    isAllSelected(grid) {
      if (grid.options.data.length === 0) return false;
      return grid.selectedRows.size === grid.options.data.length;
    },

    selectRows(grid, indices) {
      indices.forEach(index => {
        if (index >= 0 && index < grid.options.data.length) {
          grid.selectedRows.add(index);
        }
      });
      grid.render();
    },

    deselectRows(grid, indices) {
      indices.forEach(index => {
        grid.selectedRows.delete(index);
      });
      grid.render();
    },

    clearSelection(grid) {
      grid.selectedRows.clear();
      grid.render();
    },

    getSelectedRows(grid) {
      return Array.from(grid.selectedRows)
        .map(index => grid.options.data[index])
        .filter(row => row !== undefined);
    },

    getSelectedIndices(grid) {
      return Array.from(grid.selectedRows).sort((a, b) => a - b);
    }
  };

  // ============================================
  // FEATURE: FILTER
  // ============================================
  const FilterFeature = {
    applyFilters(grid) {
      let filtered = [...grid.options.data];

      if (grid.searchText) {
        const searchLower = grid.searchText.toLowerCase();
        
        filtered = filtered.filter(row => {
          return grid.options.columns.some(column => {
            const value = row[column.field];
            if (value == null) return false;
            return String(value).toLowerCase().includes(searchLower);
          });
        });
      }

      if (Object.keys(grid.columnFilterValues).length > 0) {
        filtered = filtered.filter(row => {
          return Object.entries(grid.columnFilterValues).every(([field, filterValue]) => {
            const cellValue = row[field];
            
            const column = grid.options.columns.find(col => col.field === field);
            const filterType = column?.filterType || 'text';

            if (filterType === 'select') {
              if (Array.isArray(filterValue)) {
                return filterValue.includes(cellValue);
              }
              return String(cellValue) === String(filterValue);
            } else if (filterType === 'number') {
              if (!filterValue) return true;
              if (cellValue == null) return false;
              return Number(cellValue) === Number(filterValue);
            } else if (filterType === 'date') {
              if (!filterValue) return true;
              if (cellValue == null) return false;
              return String(cellValue).startsWith(filterValue);
            } else {
              if (!filterValue) return true;
              if (cellValue == null) return false;
              return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
            }
          });
        });
      }

      grid.filteredData = filtered;
    },

    handleSearch(grid, searchText) {
      grid.searchText = searchText.trim();
      grid.currentPage = 1;
      this.applyFilters(grid);
      grid.calculatePagination();
      grid.render(false);
      grid.updateClearFiltersButton();
    },

    clearSearch(grid) {
      grid.searchText = '';
      grid.currentPage = 1;
      this.applyFilters(grid);
      grid.calculatePagination();
      grid.render();
    },

    handleColumnFilter(grid, field, value) {
      if (value) {
        grid.columnFilterValues[field] = value;
      } else {
        delete grid.columnFilterValues[field];
      }
      
      grid.currentPage = 1;
      this.applyFilters(grid);
      grid.calculatePagination();
      grid.render(false);
      grid.updateClearFiltersButton();
    },

    clearColumnFilters(grid) {
      grid.columnFilterValues = {};
      grid.currentPage = 1;
      this.applyFilters(grid);
      grid.calculatePagination();
      grid.render(false);
    },

    clearAllFilters(grid) {
      grid.searchText = '';
      const searchInput = grid.container.querySelector('.tablejs-search-input');
      if (searchInput) {
        searchInput.value = '';
      }
      
      grid.columnFilterValues = {};
      grid.columnFilterSelected = {};
      
      grid.options.columns.forEach(column => {
        if (column.filterable !== false && column.filterType === 'select') {
          const uniqueValues = this.getUniqueColumnValues(grid, column.field);
          grid.columnFilterSelected[column.field] = [...uniqueValues];
        }
      });
      
      if (grid.openFilterDropdown) {
        grid.openFilterDropdown.remove();
        grid.openFilterDropdown = null;
      }
      
      grid.currentPage = 1;
      this.applyFilters(grid);
      grid.calculatePagination();
      grid.render();
    },

    getUniqueColumnValues(grid, field) {
      const values = grid.options.data
        .map(row => row[field])
        .filter(value => value != null);
      
      return [...new Set(values)].sort();
    },

    getActiveFilterCount(grid, field) {
      const allValues = this.getUniqueColumnValues(grid, field);
      const selected = grid.columnFilterSelected[field] || [];
      return allValues.length - selected.length;
    }
  };

  // Registra features no escopo global
  global.PaginationFeature = PaginationFeature;
  global.SortFeature = SortFeature;
  global.SelectionFeature = SelectionFeature;
  global.FilterFeature = FilterFeature;

  // Carrega o core (scargrid.js) que já está incluído neste build

})(typeof window !== 'undefined' ? window : global);
