import { Page } from 'playwright';

export const esbuild = [
  {
    name: 'core' as const,
    score: 0.3,
    scripts: [
      // esbuild's unique module initialization with void 0 (unique to esbuild)
      /function\s+\w+\(\w+\)\s*{\s*var\s+\w+\s*=\s*\w+\[\w+\];\s*if\s*\(void\s*0\s*!==\s*\w+\)\s*return\s*\w+\.exports/,

      // esbuild's specific module facade pattern (not used by other bundlers)
      /\w+\s*=\s*Object\.getPrototypeOf\s*\?\s*function\(\w+\)\s*{\s*return\s*Object\.getPrototypeOf\(\w+\)\s*}\s*:\s*function\(\w+\)\s*{\s*return\s*\w+\.__proto__\s*}/,

      // esbuild's unique prototype chain handling
      /for\s*\(var\s+\w+\s*=\s*2\s*&\s*\w+\s*&&\s*\w+;\s*"object"\s*==\s*typeof\s+\w+\s*&&\s*!~\w+\.indexOf\(\w+\);\s*\w+\s*=\s*\w+\(\w+\)\)/,
    ],
  },
  {
    name: 'imports' as const,
    score: 0.3,
    scripts: [
      // esbuild's multi-variable declarations pattern (unique)
      /var\s+[a-z],\s+[a-z],\s+[a-z],\s+[a-z],\s+[a-z],\s+[a-z],\s+[a-z],\s+\w+\s*=\s*{}/,

      // esbuild's unique chunk naming pattern
      /from\s+["']\.\/((?!chunks\/)[^"']+)\.[A-Za-z0-9]{8}\.js["']/,

      // esbuild's characteristic import grouping
      /import\s*{\s*[_$]\s+as\s+[a-z],\s*[_$]\s+as\s+[a-z].*?}\s*from/,
    ],
  },
  {
    name: 'moduleSystem' as const,
    score: 0.2,
    scripts: [
      // esbuild's unique getter pattern with cache
      /\w+\.n\s*=\s*function\(\w+\)\s*{\s*var\s+\w+\s*=\s*\w+\s*&&\s*\w+\.__esModule\s*\?\s*function\(\)\s*{\s*return\s*\w+\.default\s*}\s*:\s*function\(\)\s*{\s*return\s*\w+\s*};\s*return\s*\w+\.d\(\w+,\s*{\s*a:\s*\w+\s*}\),\s*\w+\s*}/,

      // esbuild's specific require implementation with hasOwnProperty
      /\w+\.o\s*=\s*function\(\w+,\s*\w+\)\s*{\s*return\s*Object\.prototype\.hasOwnProperty\.call\(\w+,\s*\w+\)\s*}/,

      // esbuild's unique version getter (not present in other bundlers)
      /\w+\.rv\s*=\s*function\(\)\s*{\s*return\s*["'][0-9.]+["']\s*}/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const evidence = {
          // Check for esbuild's unique module system functions
          hasEsbuildModuleSystem: Object.keys(window).some((key) => {
            const obj = window[key];
            return (
              obj &&
              typeof obj.n === 'function' &&
              typeof obj.o === 'function' &&
              typeof obj.rv === 'function' &&
              obj?.o
                ?.toString()
                ?.includes('Object.prototype.hasOwnProperty.call')
            );
          }),

          // Check for esbuild's specific file naming
          hasEsbuildChunks: Array.from(
            document.querySelectorAll('script')
          ).some(
            (s) =>
              /\.[A-Za-z0-9]{8}\.js$/.test(s.src) && !s.src.includes('chunk-')
          ),

          // Check for esbuild's unique module initialization
          hasVoid0Check: Array.from(document.querySelectorAll('script')).some(
            (s) =>
              s.textContent?.includes('if(void 0!==') ||
              s.textContent?.includes('if (void 0!==')
          ),
        };

        return Object.values(evidence).some(Boolean);
      });
    },
  },
];
