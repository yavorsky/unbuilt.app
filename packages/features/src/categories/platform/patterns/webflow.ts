import { Page } from 'playwright';

export const webflow = [
  // Let's try to be more focused on browser detection and move scripts back if it won't work out
  // {
  //   name: 'scripts' as const,
  //   score: 0.8,
  //   scripts: [
  //     // Webflow core scripts
  //     // Webflow specific initialization patterns
  //     /Webflow\.push/,
  //     /Webflow\.require/,
  //     /webflow\.js/,
  //   ],
  //   documents: [
  //     // Webflow meta tags
  //     /<meta\s+content="Webflow"\s+name="generator"/,
  //     // Webflow specific markers
  //     /w-nav/,
  //     /w-container/,
  //     /wf-page/,
  //     /wf-site/,
  //   ],
  // },
  {
    name: 'isDesigner' as const,
    score: 2,
    browser: async (page: Page) => {
      const pathname = page.url();
      return /^https:\/\/[\w-]+\.design\.webflow\.com/.test(pathname);
    },
  },
  {
    name: 'isDashboard' as const,
    score: 2,
    browser: async (page: Page) => {
      const pathname = page.url();
      if (pathname.startsWith('https://webflow.com/dashboard')) {
        return true;
      }
      return page.evaluate(() => {
        const markers = {
          hasDashboardUI:
            typeof window.webpackChunkwebflow_dashboard !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'isWebsite' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasWebflowGlobals: typeof window.Webflow !== 'undefined',
          hasWebflowSite:
            document.documentElement.getAttribute('data-wf-site') !== null,
          hasWebflowPage:
            document.documentElement.getAttribute('data-wf-page') !== null,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'networking' as const,
    score: 0.6,
    filenames: [/\.webflow\.io\//, /\.website-files\.com\//, /webflow\.com\//],
  },
];
