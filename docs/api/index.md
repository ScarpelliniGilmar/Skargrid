# Referência da API

## Construtor

```ts
new Skargrid(containerId: string, options?: SkargridOptions)
```

- `containerId` — o `id` de um elemento existente no DOM (sem o `#`), onde o grid será montado.
- `options` — veja [Opções](/api/options).

```js
const grid = new Skargrid('minha-tabela', {
  data: [...],
  columns: [...],
  pagination: true,
});
```

## Nesta seção

- [Opções (options)](/api/options) — todas as opções do construtor.
- [Métodos](/api/methods) — API pública da instância.
- [Eventos](/api/events) — `on()` / `off()` / `emit()`.
- [Estado](/api/state) — `getState()`/`setState()`, `persistState` e `serverSide`.

## Tipos TypeScript

O pacote publica declarações completas (`types/index.d.ts`), incluindo `SkargridOptions`, `SkargridColumn`, `SkargridState` e `SkargridEventMap`. Um agente ou IDE com suporte a TypeScript tem autocomplete e checagem de tipos sem configuração adicional.

## Para agentes de IA

Se você está gerando configuração de grid programaticamente (não lendo esta página como humano), veja [IA e agentes](/ai/) para o `llms.txt` e os JSON Schemas de `options`/`state`.
