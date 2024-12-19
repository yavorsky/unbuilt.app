import { Page } from 'playwright';

export const relay = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    runtime: [
      // Relay-specific imports
      /import\s+(?:\* as\s+)?(?:Relay|Environment|Network)\s+from\s+['"]relay-runtime['"]/,
      /import\s+\{[^}]*(?:useFragment|usePaginationFragment|useRefetchableFragment)[^}]*\}\s+from\s+['"]react-relay['"]/,

      // Relay-specific environment setup
      /new\s+Environment\s*\(\s*\{[^}]*store:/,
      /RelayEnvironmentProvider\s+environment/,

      // Relay-specific hooks with type parameters
      /use(?:Fragment|LazyLoadQuery|PaginationFragment|RefetchableFragment)\s*<[^>]*>/,

      // Relay-specific directives in GraphQL
      /graphql\s*`[^`]*@(?:refetchable|pagination|argumentDefinitions|connection)\b[^`]*`/,

      // Relay-specific generated artifacts
      /\$\$\w+_fragment_ref$/,
      /\$\$\w+_ref$/,
      /\$\$\w+_graphql$/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const hasRelayMarkers =
          !!window.__RELAY_PAYLOADS__ ||
          !!window.__RELAY_STORE__ ||
          !!window.__RELAY_ENVIRONMENT__;

        const hasRelayStore = () => {
          try {
            // Check for Relay-specific store properties
            return Object.values(window).some(
              (obj) =>
                obj &&
                typeof obj === 'object' &&
                'holdGC' in obj &&
                'releasingGC' in obj &&
                'getStore' in obj &&
                'getNetwork' in obj
            );
          } catch {
            return false;
          }
        };

        return hasRelayMarkers || hasRelayStore();
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.3,
    runtime: [
      // Relay-specific store operations
      /(?:store|environment)\.(?:retain|publish|lookup|notify|subscribe|holdGC|releaseGC)\s*\(/,

      // Relay-specific network layer
      /Network\.create\s*\(\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{[^}]*\}\s*\)/,

      // Relay-specific mutation patterns
      /commitMutation\s*\(\s*environment\s*,\s*\{[^}]*optimisticResponse:/,
      /useMutation\s*<\s*\w+Mutation\s*>/,

      // Relay-specific compiler output
      /import\s+\w+\$data\s+from\s+['"]\.\/__generated__/,
      /type\s+\w+\$key\s*=/,

      // Relay-specific fragment patterns
      /@refetchable\s*\(\s*queryName:\s*["']\w+["']\s*\)/,
      /@connection\s*\(\s*key:\s*["']\w+["']\s*\)/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Relay-specific generated files
      /\/__generated__\/.*\.graphql\.ts$/i,
      /\.relay\.generated\.[jt]s$/i,

      // Relay-specific configuration
      /relay\.config\.[jt]s$/i,
      /relay-compiler\.json$/i,

      // Relay-specific build artifacts
      /relay-runtime(?:\.min)?\.js$/i,
      /react-relay(?:\.min)?\.js$/i,

      // Relay-specific file structure
      /(?:^|\/)relay\/(?:environment|network|store)/i,
    ],
  },
];
