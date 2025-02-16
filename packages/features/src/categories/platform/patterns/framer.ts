import { Page } from 'playwright';

export const framer = [
  {
    name: 'isEditor' as const,
    score: 1,
    browser: async (page: Page) => {
      // Check if we're in the Framer editor environment
      const pathname = page.url();
      if (
        /^https:\/\/framer\.com\/projects\/(?!folder\/?$)[^\/]+/.test(pathname)
      ) {
        return true;
      }
      return page.evaluate(() => {
        const markers = {
          // Check for Framer editor environment
          framerProject: typeof window.framerProject !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'isPublished' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          framerEvents: typeof window.__framer_events !== 'undefined',
          framerImportFromPackage:
            typeof window.__framer_importFromPackage !== 'undefined',
          framerOnRewrite:
            typeof window.__framer_onRewriteBreakpoints !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'isDashboard' as const,
    score: 1,
    browser: async (page: Page) => {
      const pathname = page.url();
      return pathname.startsWith('https://framer.com/projects/folder');
    },
  },
  {
    name: 'siteStructure' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Framer-specific DOM structure
          hasFramerStructure:
            document.querySelector(
              '[data-framer-name], [data-framer-component-type], [data-framer-appear-id]'
            ) !== null,
          hasFramerComponents:
            document.querySelectorAll('[class*="framer-"]').length > 0,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'networking' as const,
    score: 0.7,
    filenames: [
      /\.framer\.com\//,
      /\.framercdn\.com\//,
      /framerusercontent\.com\//,
      /framer-design-system\./,
    ],
  },
];
