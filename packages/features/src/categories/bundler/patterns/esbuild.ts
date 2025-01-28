import { Page } from 'playwright';

export const esbuild = [
  {
    name: 'core' as const,
    score: 0.3,
    scripts: [
      // Optimized esbuild's unique module initialization pattern
      /function\s+\w+\(\w+\)\s*{\s*var\s+\w+\s*=\s*\w+\[\w+\];\s*if\s*\(void\s*0\s*!==\s*\w+\)\s*return\s*\w+\.exports/,

      // Improved performance by reducing unnecessary optional matches
      /\b\w+\s*=\s*Object\.getPrototypeOf\s*\?\s*\(\w+\)\s*=>\s*Object\.getPrototypeOf\(\w+\)\s*:\s*\(\w+\)\s*=>\s*\w+\.\_\_proto\_\_/,

      // Refined prototype chain handling for better detection
      /for\s*\(var\s+\w+\s*=\s*2\s*&\s*\w+\s*&&\s*\w+;\s*\"object\"\s*===\s*typeof\s+\w+\s*&&\s*!~\w+\.indexOf\(\w+\);\s*\w+\s*=\s*\w+\(\w+\)\)/,
    ],
  },
  {
    name: 'imports' as const,
    score: 0.3,
    scripts: [
      // Improved detection for multi-variable declarations pattern
      /var\s+[a-z](?:,\s*[a-z]){6},\s+\w+\s*=\s*{}/,

      // Enhanced chunk naming pattern
      /from\s+["']\.\/((?!chunks\/)[^"']+)\.[A-Za-z0-9]{8}\.js["']/,

      // Optimized import grouping detection
      /import\s*{\s*[_$]\s+as\s+[a-z],\s*[_$]\s+as\s+[a-z].*?}\s*from/,
    ],
  },
  {
    name: 'moduleSystem' as const,
    score: 0.2,
    scripts: [
      // Performance optimization for getter pattern with cache
      /\b\w+\.n\s*=\s*\(\w+\)\s*=>\s*{\s*var\s+\w+\s*=\s*\w+\s*&&\s*\w+\.\_\_esModule\s*\?\s*\(\)\s*=>\s*\w+\.default\s*:\s*\(\)\s*=>\s*\w+;\s*\w+\.d\(\w+,\s*{\s*a:\s*\w+\s*}\);\s*\w+\s*}/,

      // Better matching for require implementation
      /\b\w+\.o\s*=\s*function\s*\(\w+,\s*\w+\)\s*{\s*return\s*Object\.prototype\.hasOwnProperty\.call\s*\(\w+,\s*\w+\)\s*;?\s*}/,

      // Optimized version getter
      /\b\w+\.rv\s*=\s*function\s*\(\)\s*{\s*return\s*['"]\d+\.\d+(\.\d+)?['"]\s*;?\s*}/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const evidence = {
          // Optimized detection for esbuild module system
          hasEsbuildModuleSystem: Object.keys(window).some((key) => {
            const obj = window[key];
            return (
              obj &&
              typeof obj.n === 'function' &&
              typeof obj.o === 'function' &&
              typeof obj.rv === 'function'
            );
          }),
        };

        return Object.values(evidence).some(Boolean);
      });
    },
  },
];
