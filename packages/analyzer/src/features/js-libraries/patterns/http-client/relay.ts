import { Page } from 'playwright';

export const relay = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core imports
      /["']relay-runtime["']/,
      /["']react-relay["']/,
      /["']relay-compiler["']/,
      /from\s+["']relay-compiler["']/,

      // Environment setup
      /RelayEnvironment\b/,
      /createEnvironment/,
      /new\s+Environment\s*\(/,
      /RelayEnvironmentProvider/,

      // Core hooks and HOCs
      /useFragment\s*\(/,
      /useLazyLoadQuery\s*\(/,
      /usePaginationFragment\s*\(/,
      /useRefetchableFragment\s*\(/,
      /useSubscription\s*\(/,
      /useMutation\s*\(/,

      // Relay specific patterns
      /graphql\s*`[^`]*\b(?:fragment|query|mutation|subscription)\b/,
      /@refetchable\b/,
      /@pagination\b/,
      /@argumentDefinitions\b/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Relay runtime
          hasRelay:
            !!window.__RELAY_PAYLOADS__ ||
            !!window.__RELAY_DEBUG__ ||
            !!window.Relay,

          // Check for store
          hasStore: !!window.__RELAY_STORE__ || !!window.RelayModernStore,

          // Check for environment
          hasEnvironment: !!window.__RELAY_ENVIRONMENT__,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Store operations
      /commitPayload\s*\(/,
      /commitUpdate\s*\(/,
      /getStore\s*\(/,
      /invalidateStore\s*\(/,

      // Network layer
      /Network\.create\s*\(/,
      /fetchQuery\s*\(/,
      /requestSubscription\s*\(/,

      // Common patterns in fragments
      /@connection\b/,
      /@relay\b/,
      /@inline\b/,
      /@skip\b/,
      /@include\b/,

      // Error handling and updates
      /onCompleted\s*:/,
      /onError\s*:/,
      /optimisticResponse\s*:/,
      /optimisticUpdater\s*:/,
      /updater\s*:/,

      // Compiler artifacts
      /\$refType\b/,
      /\$fragmentType\b/,
      /\$fragmentRef\b/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Library and config files
      /relay(?:\.min)?\.js$/i,
      /relay-compiler\b/,
      /relay\.config\.js$/i,
      /\.graphql\.js$/i,
      /\.relay\.js$/i,

      // Generated files
      /__generated__\//,
      /\.graphql\.ts$/i,
      /\.relay\.generated/i,

      // Common project patterns
      /relay\/environment/i,
      /relay\/network/i,
      /mutations\//i,
      /fragments\//i,
      /queries\//i,

      // Build outputs
      /\brelay\.[a-f0-9]+\.js$/i,
      /\bgraphql\.[a-f0-9]+\.js$/i,
      /\bqueries\.[a-f0-9]+\.js$/i,
    ],
  },
];
