export const vite = [
  {
    name: 'core' as const,
    score: 1.0,
    runtime: [
      /import\.meta\.env\.VITE_/,
      /new\s+URL\((?:["'`])[@\w\/-]+["'`],\s*import\.meta\.url\)/,
      // Core Vite markers - highly specific
      /\/@vite\/client/,
      /vite\/dist\/client/,
      /vite\/modulepreload-polyfill/,
      /__vite_/,
      /__vite__bundler/,
      /__vite__xhr/,
      /__vite__log/,
      /__vite__cjsImport/,
      /__vite__baseUrl/,
      /__vite_ws/,
      /__vite__loadChunk/,
    ],
  },
  // This is shared between Rollup and Vite
  {
    score: 0.7,
    name: 'imports' as const,
    runtime: [
      /import\s*{\s*[a-zA-Z]+\s+as\s+[a-zA-Z]+\s*}\s*from/,
      /import\s*{\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+as\s+[a-z]\s*}/,
      // Dynamic imports
      /__import__\s*\(\s*["']\.\/chunk/,
      /from\s*["']\.\/chunk-[A-Z0-9]{8}\.js["']/,
      /from\s*["']\.\/chunk-[a-z0-9]{8}\.js["']/,
    ],
  },
  // This is shared between Rollup and Vite
  {
    score: 0.6,
    name: 'exports' as const,
    runtime: [/export\s*{\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+as\s+[a-z]\s*}/],
  },
  {
    name: 'envVariables',
    score: 0.8,
    runtime: [
      // Vite's env variables declarations
      /const\s+\w+\s*=\s*{"VITE_[A-Z0-9_]+":/,
      /process\.env\.VITE_/,
      /import\.meta\.env\.VITE_[A-Z0-9_]+/,

      // Vite's default env variables
      /import\.meta\.env\.MODE/,
      /import\.meta\.env\.PROD/,
      /import\.meta\.env\.DEV/,
      /import\.meta\.env\.SSR/,

      // Vite's env object spread
      /\.\.\.(import\.meta\.env)/,
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
