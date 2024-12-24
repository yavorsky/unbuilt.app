import { Page } from 'playwright';

export const lucide = [
  {
    name: 'compilation' as const,
    score: 0.6,
    runtime: [
      // Optimized imports - combined patterns with length limits
      /(?:from\s+["']lucide|import\s*\{[^}]{1,200}\}\s*from\s*["']lucide)(?:-react)?\b/,

      // Optimized icon usage - consolidated common icons with boundary
      /\<(?:Camera|User|Settings|ChevronDown|Menu|Search|Bell|Home|Plus|X|Check)\b/,

      // Optimized class patterns - combined with boundary
      /lucide-[a-zA-Z-]{1,30}\b/,

      // Optimized SVG patterns - consolidated with boundaries
      /(?:stroke-(?:[23]|linecap="round"|linejoin="round")|currentColor)\b/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.7,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Optimized attribute check - single query with multiple attributes
          hasLucideAttributes:
            document.querySelector(
              'svg[stroke="currentColor"][fill="none"][stroke-width="2"]'
            ) !== null,

          // Class check - already optimal
          hasLucideClasses:
            document.querySelector('[class*="lucide-"]') !== null,

          // Optimized SVG structure check - more efficient query
          hasLucideSVGStructure:
            document.querySelector(
              'svg[stroke-linecap="round"][stroke-linejoin="round"]'
            ) !== null,

          // Global check - simplified
          hasLucideGlobal: typeof window.lucide === 'object',
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'files' as const,
    score: 0.2,
    filenames: [
      // Optimized package files - combined patterns with boundaries
      /lucide(?:-react)?(?:\.[a-f0-9]{8})?\.js$/,

      // Optimized chunk names - added length limits
      /chunk-lucide-[\w-]{1,30}\.js$/,
      /icons\.[a-f0-9]{8}\.js$/,

      // Optimized build outputs - added hash length limit
      /vendor\.lucide\.[a-f0-9]{8}\.js$/,
    ],
  },
];
