import { Page } from 'playwright';

export const bunBundler = [
  {
    name: 'bundleInitialization' as const,
    score: 0.3,
    scripts: [
      // Bun's specific bundle initialization
      /\$b\$_import\$\(["'][^"']+["']\)/,
      /\bBun\.appdir\s*=/,
      /\bBun\.main\s*=\s*import\.meta\.path/,

      // Bun's module registration (unique to Bun's bundler)
      /\$b\$_registry\s*=\s*new\s+Map/,
      /\$b\$_modules\s*=\s*new\s+Map/,

      // Bun's entry point pattern
      /\$b\$_entry\s*\(\s*["'][^"']+["']\s*\)/,
    ],
  },
  {
    name: 'moduleLoading' as const,
    score: 0.3,
    scripts: [
      // Bun's unique module loading system
      /\$b\$_load\(\s*\{\s*id:\s*["'][^"']+["']/,
      /\$b\$_hmr\$\w+/,
      /\$b\$_interop\$default/,

      // Bun's require implementation
      /\$b\$_require\s*\(\s*["'][^"']+["']\s*\)/,

      // Asset loading
      /\$b\$_asset\$url\(/,
      /\$b\$_asset\$inline\(/,
    ],
  },
  {
    name: 'optimizations' as const,
    score: 0.2,
    scripts: [
      // Bun's specific optimizations
      /\/\*\s*@bun-plugin\s*\*\//,
      /\/\*\s*@bun-chunk\s*\*\//,

      // Tree shaking markers
      /\/\*\s*@bun-pure\s*\*\//,

      // Asset optimizations
      /\$b\$_css\$optimize/,
      /\$b\$_js\$optimize/,
    ],
  },
  {
    name: 'macroSystem' as const,
    score: 0.2,
    scripts: [
      // Bun's macro system in bundles
      /\$b\$_macro\$env\(/,
      /\$b\$_macro\$path\(/,
      /\$b\$_macro\$dirname\(/,

      // Macro imports
      /\$b\$_macro\$import\(/,
      /\$b\$_macro\$require\(/,
    ],
  },
  {
    name: 'hotReloading' as const,
    score: 0.2,
    scripts: [
      // Bun's HMR implementation
      /\$b\$_hmr\$accept\(/,
      /\$b\$_hmr\$self\(/,
      /\$b\$_hmr\$data\s*=/,

      // HMR runtime
      /\$b\$_hmr\$runtime\s*=/,
      /\$b\$_hmr\$update\(/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Check for Bun-specific bundler globals
        return (
          typeof window.$b$_registry === 'object' &&
          typeof window.$b$_modules === 'object'
        );
      });
    },
  },
];
