/**
 * Skargrid - Column Configuration Feature
 * Funcionalidade para mostrar/ocultar e reordenar colunas
 */

export function initColumnConfig(grid) {
  // Estado temporário para configuração
  grid.tempVisibleColumns = null;
  grid.tempColumnOrder = null;

  // Chave para localStorage (permite múltiplas tabelas na mesma página)
  grid.storageKey = grid.options.storageKey || `skargrid-config-${grid.container.id || 'default'}`;

  /**
   * Salva configuração de colunas no localStorage
   */
  grid.saveColumnConfig = function() {
    if (!grid.options.persistColumnConfig) return;
    
    try {
      const config = {
        visibleColumns: Array.from(this.visibleColumns),
        columnOrder: this.columnOrder,
        timestamp: Date.now()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(config));
    } catch (e) {
      console.warn('Não foi possível salvar configuração de colunas:', e);
    }
  };

  /**
   * Carrega configuração de colunas do localStorage
   */
  grid.loadColumnConfig = function() {
    if (!grid.options.persistColumnConfig) return false;
    
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return false;

      const config = JSON.parse(saved);
      
      // Valida se todas as colunas ainda existem
      const currentFields = this.options.columns.map(col => col.field);
      const validVisible = config.visibleColumns.filter(field => currentFields.includes(field));
      const validOrder = config.columnOrder.filter(field => currentFields.includes(field));
      
      // Adiciona novas colunas que não estavam na config salva
      currentFields.forEach(field => {
        if (!validOrder.includes(field)) {
          validOrder.push(field);
        }
      });

      this.visibleColumns = new Set(validVisible);
      this.columnOrder = validOrder;
      
      return true;
    } catch (e) {
      console.warn('Não foi possível carregar configuração de colunas:', e);
      return false;
    }
  };

  /**
   * Limpa configuração salva
   */
  grid.clearSavedColumnConfig = function() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.warn('Não foi possível limpar configuração:', e);
    }
  };

  // Carrega configuração salva (se existir)
  grid.loadColumnConfig();

  /**
   * Renderiza botão de configuração de colunas
   */
  grid.renderColumnConfigButton = function() {
    const btn = document.createElement('button');
    btn.className = 'skargrid-clear-filters-btn';
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    `;
    btn.title = 'Configurar Colunas';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleColumnConfigModal();
    });

    return btn;
  };

  /**
   * Abre/fecha modal de configuração de colunas
   */
  grid.toggleColumnConfigModal = function() {
    let modal = this.container.querySelector('.skargrid-column-config-modal');
    
    if (modal) {
      modal.remove();
      return;
    }

    // Guarda estado atual para permitir cancelamento
    this.tempVisibleColumns = new Set(this.visibleColumns);
    this.tempColumnOrder = [...this.columnOrder];

    modal = this.renderColumnConfigModal();
    const wrapper = this.container.querySelector('.skargrid-wrapper');
    wrapper.appendChild(modal);

    // Previne propagação de cliques dentro do modal
    modal.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Fecha ao clicar fora
    setTimeout(() => {
      const closeHandler = (e) => {
        if (!modal.contains(e.target)) {
          // Cancela mudanças ao fechar sem aplicar
          this.tempVisibleColumns = null;
          this.tempColumnOrder = null;
          modal.remove();
          document.removeEventListener('click', closeHandler);
        }
      };
      document.addEventListener('click', closeHandler);
    }, 10);
  };

  /**
   * Renderiza modal de configuração de colunas
   */
  grid.renderColumnConfigModal = function() {
    const modal = document.createElement('div');
    modal.className = 'skargrid-column-config-modal';

    const header = document.createElement('div');
    header.className = 'skargrid-config-header';
    header.innerHTML = `
      <h3>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        Configurar Colunas
      </h3>
      <p>Marque para exibir, arraste ou use as setas para reordenar</p>
    `;

    // Botões de ação NO TOPO (dentro do header)
    const headerActions = document.createElement('div');
    headerActions.className = 'skargrid-config-header-actions';

    const btnRestore = document.createElement('button');
    btnRestore.className = 'skargrid-config-action-btn';
    btnRestore.innerHTML = '↺ Restaurar';
    btnRestore.title = 'Restaurar configuração padrão';
    btnRestore.addEventListener('click', () => this.restoreDefaultColumns());

    const btnCancel = document.createElement('button');
    btnCancel.className = 'skargrid-config-action-btn';
    btnCancel.textContent = 'Cancelar';
    btnCancel.addEventListener('click', () => {
      this.tempVisibleColumns = null;
      this.tempColumnOrder = null;
      modal.remove();
    });

    const btnApply = document.createElement('button');
    btnApply.className = 'skargrid-config-action-btn skargrid-config-action-btn-primary';
    btnApply.textContent = '✓ Aplicar';
    btnApply.addEventListener('click', () => this.applyColumnConfig());

    headerActions.appendChild(btnRestore);
    headerActions.appendChild(btnCancel);
    headerActions.appendChild(btnApply);
    header.appendChild(headerActions);

    const list = document.createElement('div');
    list.className = 'skargrid-config-list';

    // Renderiza cada coluna na ordem temporária
    this.tempColumnOrder.forEach((field, index) => {
      const column = this.options.columns.find(col => col.field === field);
      if (!column) return;

      const item = document.createElement('div');
      item.className = 'skargrid-config-item';
      item.dataset.field = field;
      item.draggable = true;

      // Drag and drop eventos
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', field);
        item.classList.add('dragging');
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        
        // Atualiza estado dos botões ↑↓ após o drag
        setTimeout(() => {
          const items = Array.from(list.querySelectorAll('.skargrid-config-item'));
          items.forEach((item, idx) => {
            const btnUp = item.querySelector('.skargrid-config-move-btn:first-of-type');
            const btnDown = item.querySelector('.skargrid-config-move-btn:last-of-type');
            if (btnUp) btnUp.disabled = idx === 0;
            if (btnDown) btnDown.disabled = idx === items.length - 1;
          });
        }, 50);
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const draggingItem = list.querySelector('.dragging');
        if (draggingItem && draggingItem !== item) {
          const rect = item.getBoundingClientRect();
          const midY = rect.top + rect.height / 2;
          
          if (e.clientY < midY) {
            list.insertBefore(draggingItem, item);
          } else {
            list.insertBefore(draggingItem, item.nextSibling);
          }
        }
      });

      item.addEventListener('drop', (e) => {
        e.preventDefault();
        // Atualiza a ordem baseada na posição dos elementos no DOM
        const items = Array.from(list.querySelectorAll('.skargrid-config-item'));
        this.tempColumnOrder = items.map(el => el.dataset.field);
        
        // Atualiza estado dos botões ↑↓
        items.forEach((item, idx) => {
          const btnUp = item.querySelector('.skargrid-config-move-btn:first-of-type');
          const btnDown = item.querySelector('.skargrid-config-move-btn:last-of-type');
          if (btnUp) btnUp.disabled = idx === 0;
          if (btnDown) btnDown.disabled = idx === items.length - 1;
        });
      });

      // Checkbox para visibilidade (usa estado temporário)
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = this.tempVisibleColumns.has(field);
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.tempVisibleColumns.add(field);
        } else {
          this.tempVisibleColumns.delete(field);
        }
      });

      const label = document.createElement('label');
      label.textContent = column.title || field;
      label.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      });

      // Ícone de arrastar
      const dragHandle = document.createElement('span');
      dragHandle.className = 'skargrid-drag-handle';
      dragHandle.innerHTML = '⋮⋮';
      dragHandle.title = 'Arrastar para reordenar';

      // Botões de ordenação (mantidos como alternativa)
      const btnUp = document.createElement('button');
      btnUp.className = 'skargrid-config-move-btn';
      btnUp.innerHTML = '↑';
      btnUp.disabled = index === 0;
      btnUp.addEventListener('click', () => this.moveColumnTemp(field, 'up'));

      const btnDown = document.createElement('button');
      btnDown.className = 'skargrid-config-move-btn';
      btnDown.innerHTML = '↓';
      btnDown.disabled = index === this.tempColumnOrder.length - 1;
      btnDown.addEventListener('click', () => this.moveColumnTemp(field, 'down'));

      item.appendChild(dragHandle);
      item.appendChild(checkbox);
      item.appendChild(label);
      item.appendChild(btnUp);
      item.appendChild(btnDown);
      list.appendChild(item);
    });

    modal.appendChild(header);
    modal.appendChild(list);

    return modal;
  };

  /**
   * Move uma coluna no estado temporário
   */
  grid.moveColumnTemp = function(field, direction) {
    const currentIndex = this.tempColumnOrder.indexOf(field);
    if (currentIndex === -1) return;

    const newOrder = [...this.tempColumnOrder];
    
    if (direction === 'up' && currentIndex > 0) {
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = 
      [newOrder[currentIndex - 1], newOrder[currentIndex]];
    } else if (direction === 'down' && currentIndex < newOrder.length - 1) {
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = 
      [newOrder[currentIndex + 1], newOrder[currentIndex]];
    }

    this.tempColumnOrder = newOrder;
    
    // Atualiza apenas a lista dentro do modal (não recria tudo)
    const modal = this.container.querySelector('.skargrid-column-config-modal');
    if (modal) {
      const list = modal.querySelector('.skargrid-config-list');
      if (list) {
        // Re-renderiza a lista
        list.innerHTML = '';
        this.tempColumnOrder.forEach((field, index) => {
          const column = this.options.columns.find(col => col.field === field);
          if (!column) return;

          const item = document.createElement('div');
          item.className = 'skargrid-config-item';
          item.dataset.field = field;
          item.draggable = true;

          // Drag and drop eventos
          item.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', field);
            item.classList.add('dragging');
          });

          item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            
            // Atualiza estado dos botões ↑↓ após o drag
            setTimeout(() => {
              const items = Array.from(list.querySelectorAll('.skargrid-config-item'));
              items.forEach((item, idx) => {
                const btnUp = item.querySelector('.skargrid-config-move-btn:first-of-type');
                const btnDown = item.querySelector('.skargrid-config-move-btn:last-of-type');
                if (btnUp) btnUp.disabled = idx === 0;
                if (btnDown) btnDown.disabled = idx === items.length - 1;
              });
            }, 50);
          });

          item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const draggingItem = list.querySelector('.dragging');
            if (draggingItem && draggingItem !== item) {
              const rect = item.getBoundingClientRect();
              const midY = rect.top + rect.height / 2;
              
              if (e.clientY < midY) {
                list.insertBefore(draggingItem, item);
              } else {
                list.insertBefore(draggingItem, item.nextSibling);
              }
            }
          });

          item.addEventListener('drop', (e) => {
            e.preventDefault();
            const items = Array.from(list.querySelectorAll('.skargrid-config-item'));
            this.tempColumnOrder = items.map(el => el.dataset.field);
            
            // Atualiza estado dos botões ↑↓
            items.forEach((item, idx) => {
              const btnUp = item.querySelector('.skargrid-config-move-btn:first-of-type');
              const btnDown = item.querySelector('.skargrid-config-move-btn:last-of-type');
              if (btnUp) btnUp.disabled = idx === 0;
              if (btnDown) btnDown.disabled = idx === items.length - 1;
            });
          });

          // Checkbox para visibilidade
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = this.tempVisibleColumns.has(field);
          checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
              this.tempVisibleColumns.add(field);
            } else {
              this.tempVisibleColumns.delete(field);
            }
          });

          const label = document.createElement('label');
          label.textContent = column.title || field;
          label.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
          });

          // Ícone de arrastar
          const dragHandle = document.createElement('span');
          dragHandle.className = 'skargrid-drag-handle';
          dragHandle.innerHTML = '⋮⋮';
          dragHandle.title = 'Arrastar para reordenar';

          // Botões de ordenação
          const btnUp = document.createElement('button');
          btnUp.className = 'skargrid-config-move-btn';
          btnUp.innerHTML = '↑';
          btnUp.disabled = index === 0;
          btnUp.addEventListener('click', () => this.moveColumnTemp(field, 'up'));

          const btnDown = document.createElement('button');
          btnDown.className = 'skargrid-config-move-btn';
          btnDown.innerHTML = '↓';
          btnDown.disabled = index === this.tempColumnOrder.length - 1;
          btnDown.addEventListener('click', () => this.moveColumnTemp(field, 'down'));

          item.appendChild(dragHandle);
          item.appendChild(checkbox);
          item.appendChild(label);
          item.appendChild(btnUp);
          item.appendChild(btnDown);
          list.appendChild(item);
        });
      }
    }
  };

  /**
   * Aplica as configurações de colunas
   */
  grid.applyColumnConfig = function() {
    if (this.tempVisibleColumns) {
      this.visibleColumns = new Set(this.tempVisibleColumns);
    }
    if (this.tempColumnOrder) {
      this.columnOrder = [...this.tempColumnOrder];
    }

    this.tempVisibleColumns = null;
    this.tempColumnOrder = null;

    const modal = this.container.querySelector('.skargrid-column-config-modal');
    if (modal) modal.remove();

    // Salva configuração no localStorage
    this.saveColumnConfig();

    this.render();
  };

  /**
   * Restaura configuração padrão de colunas (apenas no modal)
   */
  grid.restoreDefaultColumns = function() {
    // Restaura para configuração original de fábrica (apenas temp)
    this.tempVisibleColumns = new Set(this.options.columns.map(col => col.field));
    this.tempColumnOrder = this.options.columns.map(col => col.field);

    // Atualiza a lista no modal
    const modal = this.container.querySelector('.skargrid-column-config-modal');
    if (modal) {
      const list = modal.querySelector('.skargrid-config-list');
      if (list) {
        list.innerHTML = '';
        this.tempColumnOrder.forEach((field, index) => {
          const column = this.options.columns.find(col => col.field === field);
          if (!column) return;

          const item = document.createElement('div');
          item.className = 'skargrid-config-item';
          item.dataset.field = field;
          item.draggable = true;

          // Drag and drop eventos
          item.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', field);
            item.classList.add('dragging');
          });

          item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            
            // Atualiza estado dos botões ↑↓ após o drag
            setTimeout(() => {
              const items = Array.from(list.querySelectorAll('.skargrid-config-item'));
              items.forEach((item, idx) => {
                const btnUp = item.querySelector('.skargrid-config-move-btn:first-of-type');
                const btnDown = item.querySelector('.skargrid-config-move-btn:last-of-type');
                if (btnUp) btnUp.disabled = idx === 0;
                if (btnDown) btnDown.disabled = idx === items.length - 1;
              });
            }, 50);
          });

          item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const draggingItem = list.querySelector('.dragging');
            if (draggingItem && draggingItem !== item) {
              const rect = item.getBoundingClientRect();
              const midY = rect.top + rect.height / 2;
              
              if (e.clientY < midY) {
                list.insertBefore(draggingItem, item);
              } else {
                list.insertBefore(draggingItem, item.nextSibling);
              }
            }
          });

          item.addEventListener('drop', (e) => {
            e.preventDefault();
            const items = Array.from(list.querySelectorAll('.skargrid-config-item'));
            this.tempColumnOrder = items.map(el => el.dataset.field);
            
            // Atualiza estado dos botões ↑↓
            items.forEach((item, idx) => {
              const btnUp = item.querySelector('.skargrid-config-move-btn:first-of-type');
              const btnDown = item.querySelector('.skargrid-config-move-btn:last-of-type');
              if (btnUp) btnUp.disabled = idx === 0;
              if (btnDown) btnDown.disabled = idx === items.length - 1;
            });
          });

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = this.tempVisibleColumns.has(field);
          checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
              this.tempVisibleColumns.add(field);
            } else {
              this.tempVisibleColumns.delete(field);
            }
          });

          const label = document.createElement('label');
          label.textContent = column.title || field;
          label.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
          });

          // Ícone de arrastar
          const dragHandle = document.createElement('span');
          dragHandle.className = 'skargrid-drag-handle';
          dragHandle.innerHTML = '⋮⋮';
          dragHandle.title = 'Arrastar para reordenar';

          const btnUp = document.createElement('button');
          btnUp.className = 'skargrid-config-move-btn';
          btnUp.innerHTML = '↑';
          btnUp.disabled = index === 0;
          btnUp.addEventListener('click', () => this.moveColumnTemp(field, 'up'));

          const btnDown = document.createElement('button');
          btnDown.className = 'skargrid-config-move-btn';
          btnDown.innerHTML = '↓';
          btnDown.disabled = index === this.tempColumnOrder.length - 1;
          btnDown.addEventListener('click', () => this.moveColumnTemp(field, 'down'));

          item.appendChild(dragHandle);
          item.appendChild(checkbox);
          item.appendChild(label);
          item.appendChild(btnUp);
          item.appendChild(btnDown);
          list.appendChild(item);
        });
      }
    }
  };

  /**
   * Define a visibilidade de uma coluna
   */
  grid.setColumnVisibility = function(field, visible) {
    if (visible) {
      this.visibleColumns.add(field);
    } else {
      this.visibleColumns.delete(field);
    }
    this.render();
  };

  /**
   * Reordena as colunas
   */
  grid.reorderColumns = function(newOrder) {
    // Valida se todos os fields existem
    const validFields = this.options.columns.map(col => col.field);
    const isValid = newOrder.every(field => validFields.includes(field));
    
    if (!isValid) {
      console.warn('Ordem inválida: alguns fields não existem');
      return;
    }

    this.columnOrder = newOrder;
    this.render();
  };

  /**
   * Obtém as colunas ordenadas e visíveis
   */
  grid.getOrderedVisibleColumns = function() {
    return this.columnOrder
      .filter(field => this.visibleColumns.has(field))
      .map(field => this.options.columns.find(col => col.field === field))
      .filter(col => col !== undefined);
  };
}
