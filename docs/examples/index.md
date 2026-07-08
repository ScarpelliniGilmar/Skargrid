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

## Exemplo por recurso

Cada recurso tem um snippet pronto para copiar na documentação:

| Recurso | Exemplo |
| --- | --- |
| Tabela básica (paginação, ordenação, busca) | [Introdução](/guide/getting-started#exemplo-mínimo) |
| Filtros por coluna (texto/número/data/select) | [Recursos § Filtros](/guide/features#filtros-por-coluna) |
| Seleção de linhas | [Recursos § Seleção](/guide/features#seleção-de-linhas) |
| Colunas congeladas (`frozen`) | [Colunas § frozen](/guide/columns#frozen) |
| Agregações no rodapé | [Colunas § aggregate](/guide/columns#aggregate-aggregateformatter) |
| Persistência de estado (`persistState`) | [Recursos § Persistência](/guide/features#persistência-de-estado-persiststate) |
| Server-side processing | [Estado § Server-Side](/api/state#server-side-processing) — exemplo completo com fetch por eventos |
| Exportação CSV/XLSX | [Recursos § Exportação](/guide/features#exportação-csv-xlsx) |
| Virtualização (50k linhas) | [Recursos § Virtualização](/guide/features#virtualização) |
| Render customizado seguro (badge com `Node`) | [Colunas § render](/guide/columns#render-formatter) |
| Eventos (`on`/`off`) | [Eventos](/api/events#uso) |
| Temas e variáveis CSS | [Recursos § Temas](/guide/features#temas) |
| i18n (labels) | [Opções § labels](/api/options#internacionalização-labels) |
