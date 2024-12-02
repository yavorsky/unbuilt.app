import { Page } from 'playwright';

export const apollo = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core Apollo imports
      /["']@apollo\/client["']/,
      /["']apollo-client["']/,
      /["']apollo-boost["']/,

      // Client creation
      /new\s+ApolloClient\s*\(/,
      /createApolloClient/,
      /ApolloProvider\b/,

      // Core operations
      /useQuery\s*\(/,
      /useMutation\s*\(/,
      /useLazyQuery\s*\(/,
      /useSubscription\s*\(/,

      // GraphQL patterns
      /gql\s*`/,
      /gql\s*\(/,
      /graphql\s*`/,
      /fragments:/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Apollo Client
          hasApollo:
            !!window.__APOLLO_CLIENT__ ||
            !!window.apollo ||
            !!window.ApolloClient,

          // Check for dev tools
          hasDevTools: !!window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__,

          // Check for state
          hasState: !!window.__APOLLO_STATE__,

          // Check for client initialization
          hasCache: !!window.InMemoryCache || !!window.ApolloCache,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Cache configuration
      /InMemoryCache\s*\(/,
      /typePolicies:/,
      /possibleTypes:/,
      /dataIdFromObject:/,

      // Link configuration
      /HttpLink\s*\(/,
      /ApolloLink\.from\s*\(/,
      /WebSocketLink\s*\(/,
      /errorLink/,
      /authLink/,
      /retryLink/,

      // Error handling
      /onError\s*\(\s*\{/,
      /errorPolicy:/,
      /networkError:/,
      /graphQLErrors:/,

      // Common operations
      /client\.query\s*\(/,
      /client\.mutate\s*\(/,
      /client\.subscribe\s*\(/,

      // Cache operations
      /writeQuery\s*\(/,
      /readQuery\s*\(/,
      /writeFragment\s*\(/,
      /readFragment\s*\(/,

      // Field policies
      /merge:\s*function/,
      /read:\s*function/,
      /keyArgs:/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Library files
      /apollo(?:-client)?(?:\.min)?\.js$/i,
      /@apollo\/client/i,
      /apollo-\w+\.js$/i,

      // Common integration patterns
      /apollo(?:-)?config\.js$/i,
      /apollo(?:-)?client\.js$/i,
      /graphql(?:-)?client\.js$/i,

      // Common project patterns
      /graphql\/client/i,
      /graphql\/queries/i,
      /graphql\/mutations/i,
      /\.(?:graphql|gql)$/i,

      // Build output patterns
      /\bapollo\.[a-f0-9]+\.js$/i,
      /\bgraphql\.[a-f0-9]+\.js$/i,
      /\bqueries\.[a-f0-9]+\.js$/i,

      // Common folder structures
      /services\/apollo/i,
      /lib\/apollo/i,
      /config\/apollo/i,
    ],
  },
];
