# Migração: Pro → Community

O SkarGrid Pro foi **descontinuado** como produto separado — não há mais novas vendas, licenciamento ou validação de domínio. Se você tinha uma licença Pro ativa, ela continua honrada pelo período contratado (correções críticas de segurança e compatibilidade); para todo o resto, o caminho é migrar para a Community, que é gratuita, MIT, e recebe as funcionalidades da Pro que já passaram por revisão de qualidade.

## O que já foi migrado para a Community

Estas quatro funcionalidades da Pro já estão na Community, revisadas, testadas e documentadas — sem necessidade de licença:

| Funcionalidade | Onde usar |
| --- | --- |
| **Server-side processing** | `options.serverSide` + `options.totalRecords` — veja [Estado § Server-Side Processing](/api/state#server-side-processing) |
| **Persistência de estado** | `options.persistState` — veja [Estado § Persistência automática](/api/state#persistência-automática-persiststate) |
| **Colunas congeladas** | `column.frozen` — veja [Configuração de colunas § frozen](/guide/columns#frozen) |
| **Agregações no rodapé** | `options.footerAggregates` + `column.aggregate` — veja [Configuração de colunas § aggregate](/guide/columns#aggregate-aggregateformatter) |

Se seu código Pro usava alguma dessas opções, a API foi desenhada para ficar próxima do que a Pro expunha — mas **confira as opções desta versão** em vez de assumir compatibilidade 1:1, já que a implementação foi reescrita do zero durante a migração.

## O que ainda não foi migrado

Estas funcionalidades existiam na Pro mas **ainda não têm equivalente na Community** — não foram omitidas por engano, estão priorizadas no roadmap público:

- **Inline editing** — planejada, pendente de revisão de segurança/acessibilidade/teclado antes de entrar.
- **Computed columns** — planejada, pendente de cache e testes de performance.
- **Row grouping** — o estado e a renderização da versão Pro eram complexos demais para migrar diretamente; será refeito antes de entrar na Community.
- **Undo/redo** — depende de inline editing estar estável primeiro.
- **Charts** — será um plugin opcional, não parte do core (evita inflar o bundle de quem não usa).
- **MCP Server** — só será iniciado com API 2.x estável e demanda real de integração com agentes.

Se algum desses recursos é bloqueador para sua migração, acompanhe o roadmap público no repositório — priorização pode mudar com base em demanda real.

## O que foi removido de propósito

- **Licenciamento e validação de domínio.** Não existe mais checagem de licença no cliente, chave interna, ou bloqueio por domínio. Se seu código Pro fazia qualquer tipo de tratamento em torno disso (feature flags condicionadas à licença, fallback para versão free, etc.), pode remover esse código.
- **Bundle Pro separado.** Há um único pacote (`skargrid`), uma única distribuição, um único conjunto de tipos.

## Passo a passo

1. Remova o bundle Pro e qualquer lógica de licenciamento/validação do seu projeto.
2. Instale a Community (`npm install skargrid` ou aponte o CDN — veja [Instalação](/guide/installation)).
3. Reveja suas opções contra a [Referência da API](/api/) — não assuma que uma opção da Pro tem exatamente o mesmo nome/comportamento na Community.
4. Se você depende de uma funcionalidade ainda não migrada (lista acima), mantenha a versão Pro final apenas para esse recurso enquanto acompanha o roadmap, ou avalie uma solução alternativa.
5. Rode sua suíte de QA — a Community teve o core reescrito (estado central, event bus, renderer seguro por padrão); veja também o guia [1.x → Community 2.x](/migration/1x-to-community) para o comportamento de segurança em `render()`/`formatter()`, que se aplica igualmente a quem vem da Pro.
