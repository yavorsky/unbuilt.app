import { Page } from 'playwright';

export const webstudio = [
  {
    name: 'isBuilder' as const,
    score: 2,
    browser: async (page: Page) => {
      const url = page.url();
      return url.includes('.apps.webstudio.is')
    },
  },
  {
    name: 'isDashboard' as const,
    score: 2,
    browser: async (page: Page) => {
      const url = page.url();
      return url.startsWith('https://apps.webstudio.is/dashboard');
    },
  },
  {
    name: 'isPublished' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasWebstudioProject: document.documentElement.hasAttribute('data-ws-project'),
          // for older sites
          hasWebstudioIndex: document.querySelector('[data-ws-index]') != null,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'networking' as const,
    score: 0.6,
    filenames: [/\.wstd\.io\//],
  },
];
