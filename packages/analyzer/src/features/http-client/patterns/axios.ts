import { Page } from 'playwright';

export const axios = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core imports and instances
      /["']a?xios["']/,
      /axios\.create\(/,
      /axios\.request\(/,

      // Core methods and props
      /\.[gp][eou][ts]t?\(/, // Matches .get( .post( .put( etc
      /\.defaults\./,
      /\.interceptors\./,

      // Request config signatures
      /baseURL:/,
      /withCredentials:/,
      /responseType:/,
      /Authorization:\s*['"](Bearer|Basic)/,

      // Response signatures
      /\.response\.data/,
      /\.response\.status/,
      /\.response\.headers/,

      // Error handling
      /isAxiosError/,
      /\.isCancel/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return (
          !!window.axios || // Global axios instance
          !!window.Axios || // Constructor exposed
          !!window.$http || // Vue axios alias
          // Check for common axios properties on any global axios-like object
          Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'function' &&
              'interceptors' in obj &&
              'defaults' in obj &&
              'get' in obj &&
              'post' in obj
          )
        );
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Common axios config patterns
      /headers:\s*\{/,
      /params:\s*\{/,
      /data:\s*\{/,
      /timeout:\s*\d+/,

      // Transformers
      /transformRequest/,
      /transformResponse/,

      // Error handling patterns
      /catch\s*\(\s*(?:error|err|e)\s*\)\s*{\s*(?:if\s*\()?.*?[Aa]xios/,
      /if\s*\(\s*error\.response\)/,

      // Interceptors
      /\.interceptors\.[^.]+\.(use|eject)/,
      /request\.use\(/,
      /response\.use\(/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Standard filenames
      /axios(?:\.min)?\.js$/i,
      /axios-\w+\.js$/i,

      // Common project patterns
      /api(?:-)?client\.js$/i,
      /http(?:-)?client\.js$/i,
      /axios(?:-)?instance\.js$/i,
      /axios(?:-)?config\.js$/i,

      // Common chunk names
      /\baxios\.[a-f0-9]+\.js$/i,
      /\bapi\.[a-f0-9]+\.js$/i,
      /\bhttp\.[a-f0-9]+\.js$/i,
    ],
  },
];
