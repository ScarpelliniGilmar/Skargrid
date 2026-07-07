# IA e agentes

A biblioteca é pensada para ser usada tanto por pessoas quanto por agentes que geram/validam configuração de grid programaticamente.

## `llms.txt`

Publicado em [`/llms.txt`](/llms.txt) — um resumo em texto simples com os links canônicos da documentação, as regras importantes de comportamento (ex.: `render()` seguro por padrão, `virtualization`/`pagination` mutuamente exclusivos) e a lista explícita do que **ainda não** existe na biblioteca, para evitar que um agente assuma um recurso inexistente.

## Schemas {#schemas}

Dois JSON Schemas (draft 2020-12), gerados a partir dos tipos TypeScript publicados (`types/index.d.ts`):

- [`/schemas/options.schema.json`](/schemas/options.schema.json) — valida um objeto `options` do construtor, incluindo `columns`.
- [`/schemas/state.schema.json`](/schemas/state.schema.json) — valida o formato de `getState()`/`setState()`.

Funções (`render`, `formatter`, `aggregateFormatter`) não são representáveis em JSON Schema — um agente que gera configuração deve validar o restante das opções contra o schema e adicionar essas funções depois, em código.

## Tipos TypeScript

O pacote publica `types/index.d.ts` com `SkargridOptions`, `SkargridColumn`, `SkargridState` e `SkargridEventMap`. Para geração de código em TypeScript (ou JavaScript com checagem via JSDoc/IDE), isso dá autocomplete e validação de tipos sem infraestrutura adicional.

## Operações determinísticas relevantes para automação

Estas operações da [API pública](/api/) são as mais relevantes para um agente automatizar leitura/escrita de configuração e estado:

```text
getState()
setState(state)
clearAllFilters()
clearSearch()
clearSort()
goToPage(page)
changePageSize(size)
getData()
getSelectedRows() / selectRows(indices) / clearSelection()
```

Todas operam sobre dados já validados no construtor — não há necessidade de tratamento de erro adicional para entradas que a biblioteca já garante (ex.: `field` inexistente na coluna é responsabilidade de quem monta a configuração).

## O que evitar

- Não assuma que `render`/`formatter` retornando uma string vira HTML — por padrão não vira (veja [Acessibilidade e segurança](/guide/accessibility-security)).
- Não gere `frozen: true` em colunas fora de um prefixo contíguo — a biblioteca ignora essa configuração com um aviso, silenciosamente do ponto de vista do resultado visual.
- Não gere `virtualization: true` junto com `pagination: true` — são mutuamente exclusivos.
- Não assuma recursos ainda não implementados (inline editing, computed columns, row grouping, undo/redo, charts, adapters de framework, MCP Server) — veja a lista completa em [`/llms.txt`](/llms.txt).
