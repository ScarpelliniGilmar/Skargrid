# ADR 0001 — Consolidar as edições na SkarGrid Community

- Status: aceito
- Data: 07/07/2026
- Responsável: mantenedor do SkarGrid

## Contexto

O SkarGrid era mantido em três projetos: edição Free, edição Pro e site Laravel com documentação, vendas e licenciamento. As edições da biblioteca duplicavam módulos, divergiam em partes do core e exigiam manutenção paralela. O produto Pro não possui clientes em produção e sua proteção dependia de validação executada no navegador.

## Decisão

O repositório `Skargrid` passa a ser a fonte canônica de uma única edição chamada SkarGrid Community.

- O núcleo será distribuído sob licença MIT.
- Funcionalidades da antiga Pro serão avaliadas e migradas individualmente.
- Nenhuma funcionalidade será migrada sem testes, documentação e adequação à nova arquitetura.
- O repositório `skargrid-pro` será preservado por tag e arquivado após a migração.
- O site deixará de oferecer checkout, licenciamento e downloads proprietários.
- A documentação será gradualmente movida para arquivos versionados junto ao código.

## Consequências positivas

- Uma única fonte de verdade.
- Menor custo de manutenção e operação.
- Correções e releases mais previsíveis.
- Maior facilidade de contribuição.
- API e documentação mais adequadas a ferramentas e agentes de IA.

## Consequências negativas

- A versão 2.0 poderá exigir migração de integrações 1.x.
- Algumas funcionalidades Pro permanecerão indisponíveis até cumprirem os critérios de qualidade.
- O encerramento do site comercial exige remoção coordenada de rotas, dados e conteúdo antigo.

## Alternativas rejeitadas

### Manter Free e Pro separadas

Rejeitada devido à duplicação, à baixa tração e ao custo de sustentar licenciamento client-side.

### Encerrar todo o projeto

Rejeitada porque a edição Free ainda possui valor como biblioteca Community e ativo técnico.

### Publicar imediatamente todo o código Pro

Rejeitada porque módulos Pro possuem acoplamento, cobertura insuficiente e problemas conhecidos que não devem ser incorporados ao núcleo estável sem revisão.

## Critérios de revisão

Esta decisão poderá ser revisada somente após a validação de 90 dias da Community 2.0 e mediante evidência de adoção e demanda comercial.
