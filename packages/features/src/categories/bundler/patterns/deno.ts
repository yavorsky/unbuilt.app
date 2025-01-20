import { Page } from 'playwright';

export const denoBundler = [
  {
    name: 'moduleWrapping' as const,
    score: 0.3,
    scripts: [
      // Deno's specific bundle initialization
      /\(\s*\{\s*const\s+\w+\s*=\s*new\s+Map\(\[\[["']deno:[\w\/-]+["']/,
      /\[\s*["']deno:\/\/[\w\/-]+["']\s*\]/,

      // Deno's module registration
      /Deno\.core\.ops\.op_register_module\(/,
      /Deno\.core\.registerImport\(/,

      // Deno's internal module system
      /\["deno:internal"\]/,
      /\["deno:cli\/js"\]/,

      // Deno's dynamic imports
      /Deno\.core\.ops\.op_import_module\(/,
      /Deno\.core\.ops\.op_lazy_load_module\(/,

      // Deno's URL resolution for modules
      /new\s+URL\(\s*["'][^"']+["']\s*,\s*Deno\.mainModule\)/,
      /Deno\.resolveUrl\(/,
    ],
  },
  {
    name: 'bundleFeatures' as const,
    score: 0.3,
    scripts: [
      // Deno's bundle metadata
      /\/\/\s*@deno-bundle-[a-z-]+\s/,
      /\/\/\s*@deno-types=["'][^"']+["']/,
      /\/\/\s*@deno-version=["']\d+\.\d+\.\d+["']/,

      // Import map integration
      /Deno\.core\.ops\.op_apply_import_map\(/,
      /Deno\.core\.ops\.op_get_import_map\(/,

      // Module caching
      /Deno\.core\.cache\.modules\.set\(/,
      /Deno\.core\.cache\.modules\.get\(/,

      // Resource loading
      /Deno\.core\.ops\.op_load_resource\(/,
      /Deno\.core\.ops\.op_load_async\(/,
    ],
  },
  {
    name: 'permissions' as const,
    score: 0.2,
    scripts: [
      // Deno's permission checks in bundles
      /Deno\.core\.ops\.op_check_permission\(/,
      /Deno\.permissions\.query\(/,

      // Permission states
      /PermissionState\.\w+/,
      /PermissionDescriptor\{["']name["']:/,

      // Permission denied errors
      /throw\s+new\s+Deno\.errors\.PermissionDenied\(/,
      /PermissionStatus\.prototype/,
    ],
  },
  {
    name: 'bundleOptimizations' as const,
    score: 0.2,
    scripts: [
      // Deno's specific code optimizations
      /\/\/\s*@deno-inline\b/,
      /\/\/\s*@deno-no-check\b/,

      // Dead code elimination markers
      /\/\/\s*@deno-pure\b/,
      /\/\*\s*@__PURE__\s*\*\/\s*Deno\./,

      // Source map handling
      /Deno\.core\.ops\.op_apply_source_map\(/,
      /\/\/# sourceMappingURL=data:application\/json;base64,\w+/,
    ],
  },
  {
    name: 'webWorkers' as const,
    score: 0.2,
    scripts: [
      // Deno's web worker handling
      /Deno\.core\.ops\.op_create_worker\(/,
      /Deno\.core\.ops\.op_host_terminate_worker\(/,
      /Deno\.core\.ops\.op_host_post_worker_message\(/,

      // Worker initialization
      /new\s+Worker\(new\s+URL\([^)]+\),\s*\{\s*type:\s*["']module["']\s*\}\)/,
      /worker\.postMessage\(\{type:\s*["']init["']/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Only check for Deno bundler-specific globals
        return (
          typeof window.Deno?.mainModule === 'string' &&
          typeof window.Deno?.core?.ops?.op_register_module === 'function'
        );
      });
    },
  },
];
