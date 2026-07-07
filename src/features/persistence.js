/**
 * Skargrid - Módulo de Persistência de Estado
 * Salva e restaura o estado da tabela (getState()/setState()) via localStorage,
 * versionado para não aplicar um formato de estado incompatível após updates.
 */

const PersistenceFeature = {
  getStorageKey(grid) {
    return grid.options.stateStorageKey || `skargrid-state-${grid.container.id || 'default'}`;
  },

  /**
   * Carrega o estado salvo, se existir e a versão bater com options.stateVersion.
   * Retorna null em qualquer outro caso (nada salvo, versão divergente, erro de parsing).
   */
  load(grid) {
    if (!grid.options.persistState) {
      return null;
    }
    try {
      const raw = localStorage.getItem(this.getStorageKey(grid));
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      const expectedVersion = grid.options.stateVersion !== undefined ? grid.options.stateVersion : 1;
      if (!parsed || parsed.version !== expectedVersion) {
        return null;
      }
      return parsed.state;
    } catch (e) {
      if (console && console.warn) {console.warn('Skargrid: falha ao carregar estado persistido', e);}
      return null;
    }
  },

  /**
   * Salva o estado atual (getState()) junto com a versão configurada.
   */
  save(grid) {
    if (!grid.options.persistState) {
      return;
    }
    try {
      const payload = {
        version: grid.options.stateVersion !== undefined ? grid.options.stateVersion : 1,
        state: grid.getState(),
      };
      localStorage.setItem(this.getStorageKey(grid), JSON.stringify(payload));
    } catch (e) {
      if (console && console.warn) {console.warn('Skargrid: falha ao salvar estado persistido', e);}
    }
  },

  /**
   * Remove o estado persistido desta instância.
   */
  clear(grid) {
    try {
      localStorage.removeItem(this.getStorageKey(grid));
    } catch (e) {
      if (console && console.warn) {console.warn('Skargrid: falha ao limpar estado persistido', e);}
    }
  },
};

export default PersistenceFeature;
