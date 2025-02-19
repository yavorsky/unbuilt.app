import { Page } from 'playwright';

export const esbuild = [
  {
    name: 'combined' as const,
    score: 1,
    scripts: [
      // Combined detection
      /^(?:var\s+[A-Za-z]+\s*=\s*Object\.[A-Za-z]+;\s*){2,}.*?(?:=>[\s\S]*?\{exports:\{\}\})/m,
    ],
  },
  {
    // Esbuild usually doesnt't have comments. This will help to give other bundlers like rollup priority
    name: 'noComments' as const,
    score: -0.5,
    scripts: [/\/\*![^*]+\*\//],
  },
  {
    name: 'helpers' as const,
    score: 0.7,
    scripts: [
      // Header helpers
      /^var\s+[A-Za-z]+\s*=\s*Object\.create;\s*var\s+[A-Za-z]+\s*=\s*Object\.defineProperty;\s*var\s+[A-Za-z]+\s*=\s*Object\.getOwnPropertyDescriptor/,

      // Prop getter
      /(?:var|let|const)\s+[A-Za-z]+\s*=\s*\{\s*__proto__:\s*null\s*(?:,[\s\S]*?)?\}/,

      // Module Wrapper Function Pattern
      /var\s+[A-Za-z]+\s*=\s*\([^)]+\)\s*=>\s*\(\)\s*=>\s*\(.*?\{exports:\{\}\}.*?\)/,
    ],
  },
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
      /import\s*{\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+as\s+[a-zA-Z$_][a-zA-Z0-9$_]*\s*(?:,\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+as\s+[a-zA-Z$_][a-zA-Z0-9$_]*\s*)*}\s*from\s*["'][^"']+["']/,
    ],
  },
  {
    name: 'exports' as const,
    score: 0.3,
    scripts: [
      // Export pattern
      /export\s*{\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+(?:as\s+[a-zA-Z$_][a-zA-Z0-9$_]*)?\s*(?:,\s*[a-zA-Z$_][a-zA-Z0-9$_]*\s+(?:as\s+[a-zA-Z$_][a-zA-Z0-9$_]*)?\s*)*}\s*(?:from\s*["'][^"']+["'])?/g,
    ],
  },
  {
    name: 'moduleSystem' as const,
    score: 0.7,
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
