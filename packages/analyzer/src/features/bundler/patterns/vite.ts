export const vite = [{
  name: 'compilation' as const,
  score: 0.2,
  runtime: [
    // Core Vite markers
    /\/@vite\/client/,
    /vite\/dist\/client/,
    /vite\/modulepreload-polyfill/,
    /__vite_/,
    /\?v=[a-zA-Z0-9]+/,  // Vite's cache busting pattern

    // Vite HMR system
    /@vite\/env/,
    /import\.meta\.hot/,
    /import\.meta\.url/,
    /\/\@vite\/client\//,
    /vite-hmr/,
    /vite-hot-data/,
    /hot\._acceptedDependencies/,

    // Development mode specifics
    /__vite__bundler/,
    /__vite__xhr/,
    /__vite__log/,
    /__vite__cjsImport/,
    /\/\/@fs\//,
    /\/@id\//,

    // Asset handling
    /\?raw/,
    /\?url/,
    /\?worker/,
    /\?sharedworker/,
    /new URL\(.*,\s*import\.meta\.url\)/,

    // Module resolution
    /@modules\//,
    /resolveVirtualModule/,
    /vite-plugin-/,
    /virtual:\/\//,

    // Error overlay
    /vite-error-overlay/,
    /__vite__error/,
    /vite-plugin-error/,

    // Build optimization
    /\?used/,
    /\?import/,
    /\?commonjs-proxy/,
    /\?commonjs-module/,

    // React fast refresh (Vite specific)
    /@react-refresh/,
    /\/react-refresh-runtime/,
    /__vite__injectQuery/,

    // Source maps
    /\/\/# sourceMappingURL=data:application\/json;base64,.*vite/,

    // Common build artifacts
    /assets\/\w+\.[a-f0-9]+\./,
    /assets\/index\.[a-f0-9]+\./,
    /\/@fs\//,

    // Env replacement
    /import\.meta\.env\./,
    /"process\.env\.[^"]+"/,
    /'process\.env\.[^']+'/,

    // SSR specific
    /virtual:ssr-/,
    /ssr-window/,
    /ssr-handler/
  ],
}, {
  name: 'chunks' as const,
  score: 0.2,
  filenames: [
    // Main & chunks
    /assets\/\w+\.[a-f0-9]{8}\.js$/,
    /assets\/index\.[a-f0-9]{8}\.js$/,
    /assets\/vendor\.[a-f0-9]{8}\.js$/,
    /assets\/polyfills\.[a-f0-9]{8}\.js$/,

    // Dynamic imports
    /assets\/\w+\.\w+\.[a-f0-9]{8}\.js$/,

    // Development mode
    /\?v=[a-f0-9]{8}$/,
    /[@\w/-]+\.js\?t=\d+$/
  ]
}];
