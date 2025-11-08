# 🚀 ScarGrid v0.7.0 - Arquitetura Modular Inteligente

## O que mudou?

### ✨ Nova Arquitetura

A v0.7.0 introduz uma **arquitetura modular inteligente** onde o `index.js` se torna o **ponto de entrada principal** da biblioteca, coordenando todos os módulos de forma automática e flexível.

### 📁 Estrutura Anterior (v0.6.0)
```
src/
├── core/
│   └── scargrid.js        # Classe ScarGrid (935 linhas)
├── features/
│   ├── pagination.js
│   ├── sort.js
│   ├── selection.js
│   └── filter.js
└── index.js               # Simples re-export
```

### 📁 Nova Estrutura (v0.7.0)
```
src/
├── core/
│   └── scargrid.js        # ScarGridCore - implementação de renderização
├── features/
│   ├── pagination.js      # Módulo independente
│   ├── sort.js
│   ├── selection.js
│   └── filter.js
├── index.js               # 🎯 PONTO DE ENTRADA PRINCIPAL
└── bundle.js              # Helper para carregamento automático
```

## 🎯 Vantagens da Nova Arquitetura

### 1. **index.js como API Pública**
- ✅ Única classe exposta ao usuário: `ScarGrid`
- ✅ Detecção automática de features disponíveis
- ✅ Coordenação inteligente entre módulos
- ✅ API limpa e consistente

### 2. **Separação de Responsabilidades**
- `index.js` → Coordenação e API pública
- `scargrid.js` (ScarGridCore) → Renderização e UI
- `features/` → Funcionalidades específicas

### 3. **Carregamento Flexível**
```javascript
// Browser - carregar via script tags
<script src="features/pagination.js"></script>
<script src="features/sort.js"></script>
<script src="core/scargrid.js"></script>
<script>
  const table = new ScarGrid('container', { ... });
</script>

// ES Modules - import direto
import { ScarGrid } from './src/index.js';
const table = new ScarGrid('container', { ... });
```

### 4. **Detecção Automática**
O ScarGrid detecta automaticamente quais features estão disponíveis:

```javascript
// Se PaginationFeature não estiver carregado, paginação é desabilitada
const table = new ScarGrid('container', {
  pagination: true  // Só funciona se feature está carregada
});
```

## 🔄 Migrando de v0.6.0 para v0.7.0

### Sem Mudanças Necessárias! ✅

A v0.7.0 é **100% retrocompatível**. Seu código existente continua funcionando:

```javascript
// v0.6.0 e v0.7.0 - mesmo código
const table = new ScarGrid('myTable', {
  data: data,
  columns: columns,
  pagination: true,
  sortable: true,
  selectable: true
});
```

### Melhorias Opcionais

#### Antes (v0.6.0)
```html
<script src="src/features/pagination.js"></script>
<script src="src/features/sort.js"></script>
<script src="src/features/selection.js"></script>
<script src="src/features/filter.js"></script>
<script src="src/core/scargrid.js"></script>
```

#### Depois (v0.7.0) - Mesma coisa
A estrutura de carregamento permanece a mesma. A diferença está na implementação interna.

## 🆕 Novos Recursos

### 1. Funções Helper para Extensões

```javascript
import { 
  ScarGrid, 
  enableSort, 
  enableFilter, 
  enablePagination 
} from './src/index.js';

const table = new ScarGrid('container', { ... });

// Habilita features dinamicamente
enableSort(table);
enableFilter(table);
```

### 2. Bundle Helper

```javascript
import { loadAll } from './src/bundle.js';

// Carrega todas as features dinamicamente
await loadAll();
const table = new ScarGrid('container', { ... });
```

## 📊 Comparação

| Aspecto | v0.6.0 | v0.7.0 |
|---------|--------|--------|
| **Ponto de entrada** | scargrid.js | **index.js** ✨ |
| **Core** | ScarGrid (935 linhas) | ScarGridCore (935 linhas) |
| **API pública** | ScarGrid | **ScarGrid (index.js)** |
| **Detecção de features** | Manual | **Automática** ✨ |
| **Helpers** | Nenhum | **enableSort, enableFilter, etc** ✨ |
| **Compatibilidade** | ES5+ | ES6+ (com fallback) |
| **Bundle** | Não | **bundle.js disponível** ✨ |

## 🎨 Exemplo Completo

Veja `examples/architecture-v07.html` para um exemplo completo da nova arquitetura.

## 🛠️ Para Desenvolvedores

### Adicionando Nova Feature

1. Crie `src/features/minha-feature.js`:
```javascript
const MinhaFeature = {
  metodo(grid, params) {
    // sua lógica
  }
};

window.MinhaFeature = MinhaFeature;
module.exports = MinhaFeature;
```

2. Adicione helper em `src/index.js`:
```javascript
export function enableMinhaFeature(grid) {
  if (window.MinhaFeature) {
    grid.features.minhaFeature = window.MinhaFeature;
    return true;
  }
  return false;
}
```

3. Use:
```javascript
import { ScarGrid, enableMinhaFeature } from './src/index.js';
const table = new ScarGrid('container', { ... });
enableMinhaFeature(table);
```

## 📝 Notas Técnicas

### ScarGrid vs ScarGridCore

- **ScarGrid** (em `index.js`): API pública, coordenação
- **ScarGridCore** (em `scargrid.js`): Implementação de renderização

O usuário **sempre** interage com `ScarGrid`. O `ScarGridCore` é usado internamente.

### Compatibilidade

A v0.7.0 mantém `window.ScarGrid` apontando para `ScarGridCore` para compatibilidade total com código existente.

## 🚀 Próximos Passos

- [ ] Build system para gerar bundle único
- [ ] TypeScript definitions
- [ ] npm package
- [ ] CDN distribution

---

**Versão:** 0.7.0  
**Data:** Novembro 2025  
**Breaking Changes:** Nenhum  
**Status:** Estável ✅
