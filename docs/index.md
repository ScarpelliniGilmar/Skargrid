---
layout: home

hero:
  name: SkarGrid Community
  text: Data grid completo para Vanilla JavaScript
  tagline: Sem dependências em runtime, sem framework acoplado, com estado serializável — pronto para gente e para agentes de IA.
  image:
    light: /img/logos/skargrid-logo-light.svg
    dark: /img/logos/skargrid-logo-dark.svg
  actions:
    - theme: brand
      text: Começar
      link: /guide/getting-started
    - theme: alt
      text: Referência da API
      link: /api/
    - theme: alt
      text: IA e agentes
      link: /ai/
    - theme: alt
      text: GitHub
      link: https://github.com/ScarpelliniGilmar/Skargrid

features:
  - title: Zero dependências
    details: Pure Vanilla JavaScript. Um <script>/<link>, ou import via npm — sem cadeia de dependências de runtime para auditar.
  - title: API pequena e coerente
    details: Construtor, opções e um punhado de métodos. Tipos TypeScript completos publicados junto do pacote.
  - title: Estado serializável
    details: getState()/setState() cobrem página, ordenação, filtros, busca, seleção e colunas — base para persistência e automação por IA.
  - title: Segurança por padrão
    details: render()/formatter() tratados como texto puro por padrão; HTML é opt-in explícito via allowUnsafeHtml.
  - title: Processamento server-side
    details: Delegue paginação, ordenação, filtro e busca ao seu backend com um único evento por operação.
  - title: Preparado para agentes de IA
    details: JSON Schema de opções e estado, além de llms.txt — veja a seção "IA e agentes".
---
