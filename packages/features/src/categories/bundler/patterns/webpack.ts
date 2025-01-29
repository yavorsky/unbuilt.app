import { Page } from 'playwright';

export const webpack = [
  {
    name: 'core' as const,
    score: 1.0,
    scripts: [
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
    score: 1,
    scripts: [
      // Webpack-specific chunk patterns
      /webpackJsonp/,
      /webpackChunk/,
      /__webpack_require__\.e/,
      /(self|window)\.webpackChunk_[\w_]+=/,
      /installedChunks\[chunkId\]/,
    ],
  },
  {
    name: 'harmony' as const,
    score: 0.8,
    scripts: [
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
    scripts: [
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
    scripts: [
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
    scripts: [
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
    scripts: [
      // Webpack-specific asset patterns
      /__webpack_require__\.p/,
    ],
  },
  {
    name: 'development' as const,
    score: 0.2,
    scripts: [
      // Webpack-specific development patterns
      /webpack-dev-server/,
      /webpackDevServer/,
      /\/\/# sourceURL=webpack/,
      // Removing generic NODE_ENV checks
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
