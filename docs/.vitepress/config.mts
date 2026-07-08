import { defineConfig } from 'vitepress';

// skargrid.com (Hostinger) serve na raiz; o mirror no GitHub Pages
// (scarpellinigilmar.github.io/Skargrid/) precisa do path como base.
// DOCS_BASE é setado apenas no workflow de deploy do GitHub Pages.
const base = process.env.DOCS_BASE || '/';

export default defineConfig({
  title: 'SkarGrid Community',
  description: 'Data grid completo, sem dependências em runtime, para Vanilla JavaScript e agentes de IA.',
  lang: 'pt-BR',
  base,
  cleanUrls: true,
  lastUpdated: true,

  head: [
    // entradas em `head` não são reescritas com `base` automaticamente,
    // ao contrário de themeConfig.logo e links markdown — por isso o
    // prefixo manual aqui.
    ['link', { rel: 'icon', href: `${base}img/logos/favicon.ico` }],
  ],

  themeConfig: {
    // Os arquivos são nomeados pelo fundo em que ficam legíveis, o inverso
    // da chave que o VitePress espera aqui: skargrid-logo-dark.svg é colorido
    // (visível em fundo claro) e skargrid-logo-light.svg é branco (visível
    // em fundo escuro).
    logo: {
      light: '/img/logos/skargrid-logo-dark.svg',
      dark: '/img/logos/skargrid-logo-light.svg',
    },

    nav: [
      { text: 'Guia', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' },
      { text: 'Exemplos', link: '/examples/' },
      { text: 'Migração', link: '/migration/' },
      { text: 'IA', link: '/ai/' },
      {
        text: 'v2.0.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/ScarpelliniGilmar/Skargrid/blob/community-v2/CHANGELOG.md' },
          { text: 'Playground local (docs/playground.html)', link: 'https://github.com/ScarpelliniGilmar/Skargrid/blob/community-v2/docs/playground.html' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guia',
          items: [
            { text: 'Introdução', link: '/guide/getting-started' },
            { text: 'Instalação', link: '/guide/installation' },
            { text: 'Configuração de colunas', link: '/guide/columns' },
            { text: 'Recursos', link: '/guide/features' },
            { text: 'Acessibilidade e segurança', link: '/guide/accessibility-security' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'Referência da API',
          items: [
            { text: 'Visão geral', link: '/api/' },
            { text: 'Opções (options)', link: '/api/options' },
            { text: 'Métodos', link: '/api/methods' },
            { text: 'Eventos', link: '/api/events' },
            { text: 'Estado (getState/setState)', link: '/api/state' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Exemplos',
          items: [
            { text: 'Visão geral', link: '/examples/' },
          ],
        },
      ],
      '/migration/': [
        {
          text: 'Migração',
          items: [
            { text: 'Visão geral', link: '/migration/' },
            { text: '1.x → Community 2.x', link: '/migration/1x-to-community' },
          ],
        },
      ],
      '/ai/': [
        {
          text: 'IA e agentes',
          items: [
            { text: 'Visão geral', link: '/ai/' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ScarpelliniGilmar/Skargrid' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/skargrid' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Publicado sob licença MIT.',
      copyright: 'SkarGrid Community',
    },

    editLink: {
      pattern: 'https://github.com/ScarpelliniGilmar/Skargrid/edit/community-v2/docs/:path',
      text: 'Editar esta página no GitHub',
    },
  },
});
