# Exemplos

## Playground interativo

A forma mais direta de explorar todos os recursos é o playground local (`docs/playground.html`), que roda direto do bundle desta versão — sem CDN, sem npm publicado. É uma ferramenta de desenvolvimento, não uma página publicada junto com este site; rode-a localmente (veja abaixo).

Ele cobre, em seções interativas:

1. **Grid completo** — ordenação, paginação, busca global, seleção, filtros por coluna (texto/select/número/data), configuração de colunas, exportação CSV/XLSX, colunas congeladas e agregações no rodapé.
2. **Virtualização** — 50.000 linhas sem paginação.
3. **Server-side processing** — um "servidor" fake simulando latência real.
4. **Persistência de estado** — sobrevive a um `destroy()` + recriação (simulando F5).
5. **Console da API pública** — executa os métodos expostos na instância.
6. **Log de eventos** — visualiza `sortChange`, `pageChange`, `selectionChange`, `filterChange` e `rowClick` em tempo real.

## Rodando localmente

```bash
git clone https://github.com/ScarpelliniGilmar/Skargrid.git
cd Skargrid
npm install
npm run dev       # build em modo watch + servidor local
# abra http://localhost:5500/docs/playground.html
```

## Snippets rápidos

Para exemplos mínimos e prontos para copiar, veja:

- [Introdução](/guide/getting-started) — tabela básica com paginação, ordenação e busca.
- [Recursos](/guide/features) — um snippet por recurso (filtros, seleção, export, virtualização, etc.).
- [Estado § Server-Side Processing](/api/state#server-side-processing) — exemplo completo de integração com uma API paginada.
