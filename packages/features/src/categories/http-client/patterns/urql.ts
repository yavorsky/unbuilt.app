import { Page } from 'playwright';

export const urql = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    scripts: [
      // urql-specific imports
      /import\s+\{[^}]*(?:createClient|Provider|useQuery|Client)[^}]*\}\s+from\s+['"]urql['"]/,
      /import\s+[^'"\n]+from\s+['"]@urql\/(?:core|exchange-[^'"]+)['"]/,

      // urql-specific client creation and provider
      /createClient\s*\(\s*\{[^}]*url:/,
      /(?:Provider|URQLProvider)\s+value=\{\{?\s*client\s*\}?\}/,

      // urql-specific hooks with type parameters
      /use(?:Query|Mutation|Subscription)\s*<[^>]*>\s*\(\s*graphql`/,

      // urql-specific exchanges
      /exchanges:\s*\[\s*(?:dedupExchange|cacheExchange|fetchExchange|retryExchange|subscriptionExchange)/,
      /from\s+['"]@urql\/exchange-[^'"]+['"]/,

      // urql-specific request policies
      /requestPolicy:\s*['"](?:cache-first|cache-only|network-only|cache-and-network)['"]/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const hasUrqlMarkers =
          !!window.__URQL_DATA__ || !!window.__URQL_DEVTOOLS_HOOK__;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- No need to type-check urql object
        const isUrqlClient = (obj: any) => {
          return (
            obj &&
            typeof obj === 'object' &&
            'executeQuery' in obj &&
            'executeMutation' in obj &&
            'createRequestOperation' in obj
          );
        };

        return (
          hasUrqlMarkers ||
          Object.values(window).some((obj) => isUrqlClient(obj))
        );
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.3,
    scripts: [
      // urql-specific client operations
      /client\.(?:executeQuery|executeMutation|executeSubscription)\s*\(\s*createRequest\s*\(/,

      // urql-specific exchange patterns
      /(?:forward|operations\$)\.pipe\s*\(\s*map\s*\(\s*\{\s*operation\s*\}\s*=>/,

      // urql-specific cache operations
      /cache\.(?:resolveRequestInformation|invalidate|updateQuery)\s*\(/,
      /cache\.(?:read|write)Fragment\s*\(\s*\{[^}]*id:/,

      // urql-specific error handling
      /error\.(?:graphQLErrors|networkError|response)\?/,

      // urql-specific subscription handling
      /subscriptionExchange\s*\(\s*\{\s*forwardSubscription/,

      // urql-specific operation context
      /context:\s*\{\s*(?:requestPolicy|url|preferGetMethod):/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // urql-specific library files
      /(?:^|\/)urql(?:\.min)?\.js$/i,
      /@urql\/(?:core|exchange-[^/]+)(?:\.min)?\.js$/i,

      // urql-specific configuration
      /urql\.config\.[jt]s$/i,
      /urql-client\.[jt]s$/i,

      // urql-specific exchanges
      /(?:^|\/)exchanges?\/[^/]+\.(?:js|ts)$/i,
      /\.exchange\.[jt]s$/i,

      // Build output specific to urql
      /\burql\.[a-f0-9]{8}\.js$/i,
    ],
  },
];
