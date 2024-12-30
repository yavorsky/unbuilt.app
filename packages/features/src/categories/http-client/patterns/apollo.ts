import { Page } from 'playwright';

export const apollo = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    scripts: [
      // Core Apollo specific imports
      /["']@apollo\/client(?:\/|["']){0,100}/, // Matches both regular and minified imports

      // Client creation - specific to Apollo
      /new\s+ApolloClient\s*\({/, // Added { to avoid false positives
      /ApolloProvider[\s>]/, // Added > for JSX detection

      // Apollo-specific hooks
      /(?:^|\s|return\s)useQuery\s*<?(?:\{|$)/, // More specific pattern for useQuery
      /(?:^|\s|return\s+)useMutation\s*<?\s*(?:\{|$)/,
      /(?:^|\s|return\s+)useLazyQuery\s*<?\s*(?:\{|$)/,
      /(?:^|\s|return\s+)useSubscription\s*<?\s*(?:\{|$)/,

      // Apollo-specific GraphQL template tag
      /gql\s*`[^`]*`/, // Matches complete gql template literals
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!(
          // Check for Apollo-specific global markers
          (
            window.__APOLLO_CLIENT__ ||
            window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__ ||
            window.__APOLLO_STATE__
          )
        );
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.3,
    scripts: [
      // Apollo-specific cache configuration
      /new\s+InMemoryCache\s*\(/,

      // Apollo-specific link configuration
      /new\s+HttpLink\s*\(\{[^}]{0,300}uri:/, // More specific HttpLink pattern
      /ApolloLink\.from\s*\(\s*\[/, // More specific link composition
      /new\s+WebSocketLink\s*\({/,

      // Apollo-specific cache operations
      /(?:client|cache)\s*\.\s*(?:read|write)(?:Query|Fragment)\s*\(/,

      // Apollo-specific error handling
      /onError\s*\(\s*\{\s*(?:graphQLErrors|networkError):/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Apollo-specific library files
      /@apollo\/client/i,
      /apollo-client(?:\.min)?\.js$/i,

      // Apollo configuration files
      /apollo\.config\.js$/i,

      // Common Apollo project patterns that are unlikely to conflict
      /\bapollo\.[a-f0-9]{8}\.js$/i, // Build hash pattern
    ],
  },
];
