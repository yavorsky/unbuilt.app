export const vite = [
  {
    name: 'core' as const,
    score: 1.0,
    runtime: [
      // Core Vite markers - highly specific
      /\/@vite\/client/,
      /vite\/dist\/client/,
      /vite\/modulepreload-polyfill/,
      /__vite_/,
      /__vite__bundler/,
      /__vite__xhr/,
      /__vite__log/,
      /__vite__cjsImport/,
    ],
  },
  {
    name: 'hmr' as const,
    score: 0.8,
    runtime: [
      // Vite-specific HMR patterns
      /vite-hmr/,
      /vite-hot-data/,
      /@vite\/env/,
    ],
  },
  {
    name: 'module-resolution' as const,
    score: 0.7,
    runtime: [
      // Vite-specific module resolution
      /\/@fs\//,
      /\/@id\//,
      /@modules\//,
      /resolveVirtualModule/,
      /virtual:\/\//,
    ],
  },
  {
    name: 'error-overlay' as const,
    score: 0.6,
    runtime: [
      // Vite-specific error handling
      /vite-error-overlay/,
      /__vite__error/,
      /vite-plugin-error/,
    ],
  },
  {
    name: 'plugins' as const,
    score: 0.5,
    runtime: [
      // Vite-specific plugins
      /vite-plugin-/,
      /virtual:ssr-/,
    ],
  },
  {
    name: 'query-params' as const,
    score: 0.4,
    runtime: [
      // Vite-specific query parameters
      /\?v=[a-zA-Z0-9]+/, // Vite's cache busting
      /\?used&v=[a-zA-Z0-9]+/,
      /\?import&v=[a-zA-Z0-9]+/,
    ],
  },
];
