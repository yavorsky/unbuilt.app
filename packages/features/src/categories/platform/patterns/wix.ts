import { Page } from 'playwright';

export const wix = [
  // Let's try to be more focused on browser detection and move scripts back if it won't work out
  // {
  //   name: 'scripts' as const,
  //   score: 0.8,
  //   scripts: [
  //     // Wix platform specific scripts
  //     /wix-code-sdk/,
  //     /_api\/wix-public-html/,
  //     /static\.parastorage\.com\/services\/wix-thunderbolt/,
  //     /static\.wixstatic\.com\//,
  //     // Wix editor and viewer specific patterns
  //     /wix-dom-ready/,
  //   ],
  //   documents: [
  //     // Wix meta tags
  //     /<meta\s+name="generator"\s+content="Wix\.com/,
  //     // Wix viewer specific markers
  //     /data-wix-flag/,
  //   ],
  // },
  {
    name: 'isEditor' as const,
    score: 1,
    browser: async (page: Page) => {
      // Get pathname of the current page
      const pathname = page.url();
      if (pathname.startsWith('https://editor.wix.com')) {
        return true;
      }
      return page.evaluate(() => {
        const markers = {
          // Check for Wix editor environment
          hasWixEditorEnv: typeof window.editorModel !== 'undefined',
          clientSdk: typeof window.__clientSdk__ !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'isWebsite' as const, // or isViewer
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          wixEmbedsAPI: typeof window.wixEmbedsAPI !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'isDashboard' as const,
    score: 1,
    browser: async (page: Page) => {
      // Get pathname of the current page
      const pathname = page.url();
      if (pathname.startsWith('https://manage.wix.com')) {
        return true;
      }
      return page.evaluate(() => {
        const markers = {
          hasWixGizaEssentials: typeof window.WixGizaEssentials !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'siteStructure' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Wix Custom Elements
          hasWixCustomElements: typeof window.wixCustomElements !== 'undefined',

          // Check for Wix specific DOM structure
          hasWixStructure:
            document.querySelector(
              '#SITE_CONTAINER, #SITE_ROOT, #PAGES_CONTAINER'
            ) !== null,
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'networking' as const,
    score: 0.6,
    headers: {
      'x-wix-request-id': /.+/,
      'x-wix-server-artifact-id': /.+/,
    },
    filenames: [
      /\.wix\.com\//,
      /\.wixsite\.com\//,
      /\.wixstatic\.com\//,
      /static\.parastorage\.com\//,
    ],
  },
];
