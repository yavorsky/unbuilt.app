import { Page } from 'playwright';
import { AnalysisFeatures } from '../../../types/analysis.js';

export const vite = [
  {
    name: 'modulepreload-polyfill' as const,
    score: 1,
    scripts: [
      // Vite's modulepreload polyfill - highly specific to Vite
      /const\s+\w+=document\.createElement\("link"\)\.relList;if\(\w+&&\w+\.supports&&\w+\.supports\("modulepreload"\)\)return;/,

      // Look for Vite's unique ep flag setting
      /if\(\w+\.ep\)return;\w+\.ep=!0/,
    ],
  },
  {
    name: 'core' as const,
    score: 1.0,
    scripts: [
      /import\.meta\.env\.VITE_/,
      // Core Vite markers - highly specific
      /\/@vite\/client/,
      /vite\/dist\/client/,
      /vite\/modulepreload-polyfill/,
      /\[vite\]/,
      /__vite__bundler/,
      /__vite__xhr/,
      /__vite__log/,
      /__vite__cjsImport/,
      /__vite__baseUrl/,
      /__vite_ws/,
      /__vite__loadChunk/,
      /__vite__moveToHead/,
      /__vite__injectRef/,
      /__vite__mapDeps/,

      /\b\w+\.vitePluginDetected\b/,
    ],
  },
  {
    name: 'errors' as const,
    score: 1.4,
    scripts: [
      /\[vite\]\s+Failed\s+to\s+load/i,
      /new\s+Event\(\s*["']vite:preloadError["']/,
    ],
  },
  {
    // Esbuild usually doesnt't have comments. This will help to give other bundlers like rollup priority
    name: 'noComments' as const,
    score: -0.5,
    scripts: [/\/\*![^*]+\*\//],
  },
  {
    name: 'styles' as const,
    score: 0.2,
    stylesheets: [
      // Vite-specific error overlay
      /\.vite-error-overlay/,

      // Vite-specific HMR indicator
      /\[vite-hmr-indicator\]/,
    ],
  },
  // This is shared between Rollup and Vite
  {
    score: 0.4,
    name: 'imports' as const,
    scripts: [
      // Here's a version which will ignore comments. Enable it in case we'll have matches with commented code
      // /(?<![\/\*])\s*import\s*{\s*[a-zA-Z]+\s+as\s+[a-zA-Z]+\s*}\s*from/,
      // /(?<![\/\*])\s*import\s*{\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+as\s+[a-z]\s*}/,
      // /(?<![\/\*])\s*import\s*{\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+as\s+[a-zA-Z$_][a-zA-Z0-9$_]*\s*(?:,\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+as\s+[a-zA-Z$_][a-zA-Z0-9$_]*\s*)*}\s*from\s*["'][^"']+["']/,
      /import\s*{\s*[a-zA-Z]+\s+as\s+[a-zA-Z]+\s*}\s*from/,
      /import\s*{\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+as\s+[a-z]\s*}/,
      /import\s*{\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+as\s+[a-zA-Z$_][a-zA-Z0-9$_]*\s*(?:,\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+as\s+[a-zA-Z$_][a-zA-Z0-9$_]*\s*)*}\s*from\s*["'][^"']+["']/,
      // Dynamic imports
      /__import__\s*\(\s*["']\.\/chunk/,
      /from\s*["']\.\/chunk-[A-Z0-9]{8}\.js["']/,
      /from\s*["']\.\/chunk-[a-z0-9]{8}\.js["']/,
    ],
  },
  // This is shared between Rollup and Vite
  {
    score: 0.5,
    name: 'exports' as const,
    scripts: [
      /export\s*{\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+as\s+[a-z]\s*}/,
      /export\s*{\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+(?:as\s+[a-zA-Z$_][a-zA-Z0-9$_]*)?\s*(?:,\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+(?:as\s+[a-zA-Z$_][a-zA-Z0-9$_]*)?\s*)*}\s*(?:from\s*["'][^"']+["'])?/g,
    ],
  },
  {
    name: 'envVariables',
    score: 0.8,
    scripts: [
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
    scripts: [
      // Vite-specific HMR patterns
      /vite-hmr/,
      /vite-hot-data/,
      /@vite\/env/,
    ],
  },
  {
    name: 'module-resolution' as const,
    score: 0.7,
    scripts: [
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
    scripts: [
      // Vite-specific error handling
      /vite-error-overlay/,
      /__vite__error/,
      /vite-plugin-error/,
    ],
  },
  {
    name: 'plugins' as const,
    score: 0.5,
    scripts: [
      // Vite-specific plugins
      /vite-plugin-/,
    ],
  },
  {
    name: 'ssr' as const,
    score: 0.8,
    scripts: [
      // Vite-specific SSR
      /__vite_ssr_/,
      /__vite_ssr_dynamic_import__/,
      /__vite_ssr_import__/,
    ],
  },
  {
    name: 'runtime-check' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Vite's specific ep property on modulepreload links
          hasViteEpProperty: (() => {
            const modulePreloadLinks = document.querySelectorAll(
              'link[rel="modulepreload"]'
            );
            if (modulePreloadLinks.length === 0) return false;
            return Array.from(modulePreloadLinks).some((link) => 'ep' in link);
          })(),

          // Check for specific crossorigin module script setup
          hasViteModuleStructure: (() => {
            const scripts = document.querySelectorAll(
              'script[type="module"][crossorigin]'
            );
            return scripts.length > 0;
          })(),
        };

        // Require multiple markers to be present to avoid false positives
        return markers.hasViteEpProperty && markers.hasViteModuleStructure;
      });
    },
  },
  {
    name: 'deps' as const,
    score: 1,
    dependencies: (analysis: AnalysisFeatures) => {
      return analysis.framework.name === 'vitepress';
    },
  },
];
