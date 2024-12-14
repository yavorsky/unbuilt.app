import { Page } from 'playwright';

export const urql = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core imports
      /["']urql["']/,
      /["']@urql\/\w+["']/,
      /["']@urql\/(?:core|preact|svelte|exchange|vue)["']/,

      // Client creation and provider
      /createClient\s*\(/,
      /Client\s*\(/,
      /Provider\b.*\bclient=/,
      /URQLProvider/,

      // Core hooks and operations
      /useQuery\s*\(/,
      /useMutation\s*\(/,
      /useSubscription\s*\(/,
      /useClient\s*\(/,

      // Exchange configuration
      /exchanges:\s*\[/,
      /fetchExchange/,
      /cacheExchange/,
      /dedupExchange/,
      /retryExchange/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Urql client
          hasUrql: !!window.urql || !!window.__URQL_DATA__,

          // Check for devtools
          hasDevTools: !!window.__URQL_DEVTOOLS_HOOK__,

          // Check for exchanges
          hasExchanges: Object.keys(window).some(
            (key) =>
              key.includes('Exchange') && typeof window[key] === 'function'
          ),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Request policies
      /requestPolicy:/,
      /(?:cache-first|cache-only|network-only|cache-and-network)/,

      // Cache operations
      /cache\.(?:resolve|invalidate|updateQuery)/,
      /cache\.(?:read|write)Fragment/,

      // Common patterns in queries
      /\.executeQuery\s*\(/,
      /\.executeMutation\s*\(/,
      /\.executeSubscription\s*\(/,

      // Error handling
      /error\.graphQLErrors/,
      /error\.networkError/,
      /error\.message/,

      // Exchange patterns
      /forward\s*\(/,
      /operations\$/,
      /\.pipe\s*\(/,

      // Common configurations
      /url:\s*["'].*?graphql["']/,
      /suspense:\s*true/,
      /preferGetMethod:/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Library files
      /urql(?:\.min)?\.js$/i,
      /@urql\/\w+/i,
      /urql-\w+\.js$/i,

      // Common integration patterns
      /urql(?:-)?client\.js$/i,
      /urql(?:-)?config\.js$/i,
      /graphql(?:-)?client\.js$/i,

      // Exchange files
      /exchanges?\//i,
      /\.exchange\.js$/i,

      // Common project patterns
      /graphql\/client/i,
      /graphql\/queries/i,
      /graphql\/mutations/i,
      /\.graphql$/i,

      // Build output patterns
      /\burql\.[a-f0-9]+\.js$/i,
      /\bgraphql\.[a-f0-9]+\.js$/i,
      /\bexchanges\.[a-f0-9]+\.js$/i,
    ],
  },
];
