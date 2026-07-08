// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'imini.app — Tools & Resources',
  tagline: 'Discover useful tools, tutorials, games, and news — all from imini.app',
  url: 'https://www.imini.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon-16x16.png',
  organizationName: 'imini.app', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  scripts: [
    '/webp-to-png/webp.js',
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'imini.app',
        logo: {
          alt: 'Imini Logo',
          src: 'img/logo.png',
        },
        items: [],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'All Tutorials',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Demos',
            items: [
              {
                label: 'Scratch Games',
                href: 'https://scratch.imini.app',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
            ],
          },
          {
            title: 'News',
            items: [
              {
                label: 'Swim Ontario News',
                href: 'https://swim-ontario-news.imini.app',
              },
              {
                label: 'Flight Price History',
                href: 'https://flight-price-history.imini.app',
              },
            ],
          },
          {
            title: 'Tools',
            items: [
              {
                label: 'Webp to Png Converter',
                to: '/webp-to-png',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} imini.app.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
