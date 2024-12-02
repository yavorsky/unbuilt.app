import { Page } from 'playwright';

export const lucide = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Lucide imports and package names
      /lucide-react/,
      /from\s+["']lucide/,
      /import\s*\{[^}]*\}\s*from\s*["']lucide/,

      // Common icon usage patterns
      /\<(Camera|User|Settings|ChevronDown|Menu|Search|Bell|Home|Plus|X|Check)/,

      // Lucide specific props and attributes
      /strokeWidth=["|']\d+["|']/,
      /size=["|']\d+["|']/,
      /color=["|'][^"']+["|']/,

      // Common class pattern with icons
      /lucide-icon/,
      /lucide-[a-zA-Z-]+/,

      // SVG patterns specific to Lucide
      /currentColor/,
      /stroke-[2-3]/,
      /stroke-linecap="round"/,
      /stroke-linejoin="round"/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Lucide SVG attributes
          hasLucideAttributes: !!(
            document.querySelector('svg[stroke="currentColor"]') &&
            document.querySelector('svg[fill="none"]') &&
            document.querySelector('svg[stroke-width="2"]')
          ),

          // Check for common Lucide class names
          hasLucideClasses:
            document.querySelector('[class*="lucide-"]') !== null,

          // Check for Lucide SVG structure
          hasLucideSVGStructure: Array.from(
            document.querySelectorAll('svg')
          ).some(
            (svg) =>
              svg.getAttribute('stroke-linecap') === 'round' &&
              svg.getAttribute('stroke-linejoin') === 'round'
          ),

          // Check global Lucide object
          hasLucideGlobal: !!window.lucide,
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'files' as const,
    score: 0.2,
    filenames: [
      // Package files
      /lucide(?:-react)?/,
      /lucide\.[a-f0-9]+\.js$/,

      // Chunk names
      /chunk-lucide-[\w-]+\.js$/,
      /icons\.[a-f0-9]+\.js$/,

      // Common build outputs
      /vendor\.lucide\.[a-f0-9]+\.js$/,
    ],
  },
];
