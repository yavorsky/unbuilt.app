import { Page } from 'playwright';

// Verified against: cdn.jsdelivr.net/npm/@tanstack/virtual-core@3.11.2/dist/cjs/index.cjs
// CJS exports: Virtualizer, observeElementRect, observeElementOffset, observeWindowRect,
//   observeWindowOffset, elementScroll, windowScroll, measureElement, defaultRangeExtractor
// String properties: "getVirtualItems", "getMeasurements", "calculateRange", "scrollend"
// React-virtual exports: useVirtualizer, useWindowVirtualizer
export const tanstackVirtual = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [
      /@tanstack\/virtual-core[.\-@/]/,
      /@tanstack\/react-virtual[.\-@/]/,
      /@tanstack\/vue-virtual[.\-@/]/,
      /@tanstack\/solid-virtual[.\-@/]/,
    ],
  },
  {
    name: 'namedExports' as const,
    score: 0.9,
    scripts: [
      // CJS exports verified in bundle
      /exports\.Virtualizer\b/,
      /exports\.useVirtualizer\b/,
      /exports\.useWindowVirtualizer\b/,
      /exports\.observeElementRect\b/,
      /exports\.observeElementOffset\b/,
      /exports\.elementScroll\b/,
      /exports\.windowScroll\b/,
      /exports\.measureElement\b/,
      /exports\.defaultRangeExtractor\b/,
    ],
  },
  {
    name: 'apiPropertyNames' as const,
    score: 0.8,
    scripts: [
      // String property keys verified in the Virtualizer class
      /"getVirtualItems"/,
      /"getMeasurements"/,
      /"calculateRange"/,
      /"maybeNotify"/,
      /"getIndexes"/,
    ],
  },
  {
    name: 'browser-check' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // TanStack Virtual adds data-index attributes to virtualized items
        return document.querySelector('[data-index]') !== null &&
          document.querySelectorAll('[data-index]').length > 5;
      });
    },
  },
];
