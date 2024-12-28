import { Page } from 'playwright';

export const webpack = [
  {
    name: 'core' as const,
    score: 1.0,
    runtime: [
      // Core webpack module system - highly specific patterns
      /__webpack_require__/,
      /__webpack_modules__/,
      /__webpack_module_cache__/,
      /__webpack_exports__/,
      /__webpack_public_path__/,
      // Removing module.exports as it's too generic
    ],
  },
  {
    name: 'chunks' as const,
    score: 1.2,
    runtime: [
      // Webpack-specific chunk patterns
      /webpackJsonp/,
      /webpackChunk/,
      /__webpack_require__\.e/,
      /(self|window)\.webpackChunk_N_E/,
      /installedChunks\[chunkId\]/,
    ],
  },
  {
    name: 'harmony' as const,
    score: 0.8,
    runtime: [
      // Webpack-specific ES Module compatibility
      /__webpack_require__\.[rdot]/,
      /__webpack_dynamic_require__/,
      /__non_webpack_require__/,
      // Removing generic module definition patterns
    ],
  },
  {
    name: 'hmr' as const,
    score: 0.7,
    runtime: [
      // Webpack-specific HMR patterns
      /webpackHotUpdate/,
      /__webpack_require__\.hmr/,
      // Removing generic .hot.accept pattern
      /webpack\/hot/,
      // Removing generic accept pattern
    ],
  },
  {
    name: 'async' as const,
    score: 0.6,
    runtime: [
      // Webpack-specific async patterns
      /webpackAsyncContext/,
      // Only webpack-specific chunk name comments
      /\/\*\s*webpackChunkName\s*:/,
      // Removing generic lazy loading patterns
    ],
  },
  {
    name: 'runtime' as const,
    score: 0.5,
    runtime: [
      // Webpack-specific runtime patterns
      /webpack\/runtime/,
      /webpack\/bootstrap/,
      /webpack:\/\//,
      // Removing generic script creation patterns
    ],
  },
  {
    name: 'assets' as const,
    score: 0.3,
    runtime: [
      // Webpack-specific asset patterns
      /__webpack_require__\.p/,
      // These asset patterns might be too generic - consider removing
      /(asset\/resource|asset\/source|asset\/inline)/,
    ],
  },
  {
    name: 'development' as const,
    score: 0.2,
    runtime: [
      // Webpack-specific development patterns
      /webpack-dev-server/,
      /webpackDevServer/,
      /\/\/# sourceURL=webpack/,
      // Removing generic NODE_ENV checks
    ],
  },
  {
    name: 'output' as const,
    score: 0.2,
    filenames: [
      // Note: Most of these patterns are somewhat generic
      // and might match other bundlers' output
      // Consider using only when combined with other webpack-specific patterns
      /\d+\.[a-f0-9]{8,}\.chunk\.js$/,
      /chunk-\w+\.[a-f0-9]{8,}\.js$/,
      /chunks\/\w+\.[a-f0-9]{8,}\.js$/,
      // Removing most generic bundle patterns
    ],
  },
  {
    name: 'browser' as const,
    score: 1.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          webpackJsonp: !!window.webpackJsonp,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
];
