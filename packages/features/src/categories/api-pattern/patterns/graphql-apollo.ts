import { Page } from 'playwright';

// Apollo Client — __APOLLO_STATE__ is injected into HTML by SSR (not in the JS bundle itself).
// The JS bundle exports survive as CJS named exports.
export const graphqlApollo = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/@apollo\/client[.\-@/]/, /apollo-client[.\-@/]/, /apollo-boost[.\-@/]/],
  },
  {
    name: 'ssrState' as const,
    score: 1,
    // __APOLLO_STATE__ and __APOLLO_CLIENT__ are injected into the HTML during SSR
    documents: [/__APOLLO_STATE__/, /__APOLLO_CLIENT__/],
  },
  {
    name: 'browser-check' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return typeof (window as Record<string, unknown>).__APOLLO_STATE__ !== 'undefined' ||
          typeof (window as Record<string, unknown>).__APOLLO_CLIENT__ !== 'undefined';
      });
    },
  },
];
