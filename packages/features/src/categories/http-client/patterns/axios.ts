import { Page } from 'playwright';

export const axios = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    scripts: [
      /["']axios["']/,
      /axios\.create\(\s*\{/,
      /axios\.request\(\s*\{/,

      // Axios-specific error handling
      /isAxiosError\s*\(/,
      /axios\.isCancel\s*\(/,

      // Axios-specific interceptors
      /axios\.interceptors\.[^.]+\.(request|response)/,

      // Axios response specific patterns
      /\.(?:response|data|status|headers|config)(?:\s*as\s+AxiosResponse)?/,

      // CancelToken specific to Axios
      /axios\.CancelToken\.source\(\)/,
      /new\s+axios\.CancelToken\s*\(/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- No need to type-check axios object
        const findAxios = (obj: any): boolean => {
          return (
            obj &&
            typeof obj === 'function' &&
            obj.interceptors &&
            obj.defaults &&
            obj.create &&
            obj.isAxiosError &&
            obj.CancelToken
          );
        };

        return !!(
          // Check for axios-specific signatures
          (
            (window.axios && findAxios(window.axios)) ||
            Object.values(window).some(findAxios)
          )
        );
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.3,
    scripts: [
      // Axios-specific config patterns with type annotations
      /(?:AxiosRequestConfig|AxiosResponse|AxiosInstance|AxiosError)[<\s]/,

      // Axios-specific interceptor patterns
      /\.interceptors\.request\.use\(\s*(?:async\s*)?\([^)]*\)\s*=>/,
      /\.interceptors\.response\.use\(\s*(?:async\s*)?\([^)]*\)\s*=>/,

      // Axios-specific error handling
      /catch\s*\(\s*(?:error|err|e)\s*\)\s*{\s*(?:if\s*\()?error\.isAxiosError/,
      /if\s*\(\s*error\.isAxiosError\s*\)/,

      // Axios-specific request patterns
      /axios\s*\(\s*\{\s*(?:method|url|baseURL|headers|data|params):/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Axios-specific library files
      /\/axios(?:\.min)?\.js$/i,

      // Axios-specific configuration files
      /axios\.config\.js$/i,
      /axios-instance\.js$/i,

      // Build output specific to axios
      /\baxios\.[a-f0-9]{8}\.js$/i, // Build hash pattern
    ],
  },
];
