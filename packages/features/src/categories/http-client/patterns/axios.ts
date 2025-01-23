import { Page } from 'playwright';

export const axios = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // Unique to Axios's internals, not generic HTTP messages
      /"transitional option built-in validator"/,

      // Axios's specific serialization error pattern
      /"Don't know how to serialize '[^']+'"/,

      // Axios's specific error transformation message (unique to its implementation)
      /"maxBodyLength size of -1 is not supported"/,
    ],
  },
  {
    name: 'uniqueMarkers' as const,
    score: 0.9,
    scripts: [
      // Unique Axios error identifier
      /\.isAxiosError\(/,
      /instanceof\s+AxiosError/,

      // Unique Axios cancel token implementation
      /CancelToken\.source\(\)/,
      /\.CancelToken\s*\.\s*source\s*\(\)/,
    ],
  },
  {
    name: 'interceptors' as const,
    score: 0.7,
    scripts: [
      // Axios-specific interceptor patterns
      /\.interceptors\.(request|response)\.(use|eject)\([^)]*\)/,
      /\.interceptors\.(request|response)\.handlers/,
    ],
  },
  {
    name: 'typeAnnotations' as const,
    score: 0.6,
    scripts: [
      // Axios-specific type signatures
      /AxiosRequestConfig(?![a-zA-Z])/,
      /AxiosResponse(?![a-zA-Z])/,
      /AxiosInstance(?![a-zA-Z])/,
      /AxiosError(?![a-zA-Z])/,
    ],
  },
  {
    name: 'runtimeDetection' as const,
    score: 0.8,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return (
          typeof window.AxiosError === 'function' &&
          typeof window.isAxiosError === 'function'
        );
      });
    },
  },
  {
    name: 'headerSignatures' as const,
    score: 0.5,
    headers: {
      // Axios-specific header patterns
      'x-requested-with': /XMLHttpRequest/i,
    },
  },
];
