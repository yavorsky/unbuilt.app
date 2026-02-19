import { Page } from 'playwright';

// Apollo GraphQL — has very strong unique identifiers (__APOLLO_STATE__, __APOLLO_CLIENT__)
export const graphqlApollo = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/@apollo\/client[.\-@/]/, /apollo-client[.\-@/]/, /apollo-boost[.\-@/]/],
  },
  {
    name: 'runtimeMarkers' as const,
    score: 1,
    // These are unique string identifiers that survive minification
    scripts: [/__APOLLO_STATE__/, /__APOLLO_CLIENT__/],
    documents: [/__APOLLO_STATE__/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.8,
    scripts: [
      /"@apollo\/client"/, // Package self-reference
      /"ApolloProvider"/, // Component name preserved as string
      /"ApolloClient"/, // Class name as string
      /"InMemoryCache"/, // Apollo-specific cache class name
    ],
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
