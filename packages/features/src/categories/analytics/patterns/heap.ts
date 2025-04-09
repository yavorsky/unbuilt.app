import { Page } from 'playwright';

export const heap = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasHeapGlobal: Array.isArray(window.heap),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'script' as const,
    score: 1.2,
    scripts: [
      /sendRewriteAndHeapIgnoreTelemetry:/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.CsSideloadsHeap\s*=\s*["']cs_sideloads_heap["']/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.makeHeapIgnoreSelector/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/cdn\.heapanalytics\.com/],
  },
];
