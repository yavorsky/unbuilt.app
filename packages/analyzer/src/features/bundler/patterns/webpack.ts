export const webpack = [{
  name: 'compilation' as const,
  score: 0.2,
  runtime: [
    // Webpack runtime and core
    /webpackJsonp/,
    /__webpack_require__/,
    /__webpack_exports__/,
    /__webpack_public_path__/,
    /webpack\/runtime/,
    /webpack\/bootstrap/,

    // Chunk loading
    /webpackChunk/,
    /__webpack_chunk_load__/,
    /webpackChunkName/,
    /chunkId/,
    /loadScript/,

    // Module system
    /__webpack_modules__/,
    /__webpack_module_cache__/,
    /module\.exports/,
    /__webpack_dynamic_require__/,
    /__non_webpack_require__/,

    // Hot Module Replacement
    /webpackHotUpdate/,
    /__webpack_require__\.hmr/,
    /module\.hot/,
    /webpack\/hot/,
    /accept\(\s*\[\s*['"]/,

    // Async chunks
    /webpackAsyncContext/,
    /webpackMode:\s*["']lazy["']/,
    /import\(\s*\/\*\s*webpackChunkName/,

    // Harmony modules
    /__webpack_require__\.r/,
    /__webpack_require__\.d/,
    /__webpack_require__\.o/,
    /__webpack_require__\.t/,

    // Assets and resources
    /__webpack_require__\.p/,
    /asset\/resource/,
    /asset\/source/,
    /asset\/inline/,

    // Common minified patterns
    /\[\s*"[\w-]+"\s*\]\s*=\s*__webpack_require__/,
    /window\["webpackJsonp"\]/,
    /chunk-[a-zA-Z0-9]+\./,

    // Source maps
    /\/\/# sourceURL=webpack/,
    /\/\/# sourceMappingURL=.*\.js\.map/,

    // Development tools
    /webpack:\/\//,
    /webpack-dev-server/,
    /webpackDevServer/
  ]
},
{
  name: 'chunks' as const,
  score: 0.2,
  filenames: [
    // Main bundles
    /main\.[a-f0-9]{8,}\.js$/,
    /bundle\.[a-f0-9]{8,}\.js$/,
    /\[\w+\]\.bundle\.js$/,

    // Chunks
    /\d+\.[a-f0-9]{8,}\.chunk\.js$/,
    /chunk-\w+\.[a-f0-9]{8,}\.js$/,
    /chunks\/\w+\.[a-f0-9]{8,}\.js$/,

    // Vendors
    /vendors[\-~]\w+\.[a-f0-9]{8,}\.js$/,
    /vendor\.[a-f0-9]{8,}\.js$/,

    // Runtime
    /runtime[\-~]\w+\.js$/,
    /runtime\.[a-f0-9]{8,}\.js$/
  ]
}]
