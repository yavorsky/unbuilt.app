import { Page } from 'playwright';

export const lucide = [
  {
    name: 'compilation' as const,
    score: 0.6,
    scripts: [
      // Import patterns - captures both default and named imports
      /(?:from\s+["']lucide|import\s*\{[^}]{1,200}\}\s*from\s*["']lucide)(?:-react|-vue|-svelte|-angular)?\b/,

      // Icon component patterns - focusing on unique Lucide naming conventions
      /\<(?:LucideIcon|Icon(?:Base|Props|Context)|createLucideIcon)\b/,

      // Lucide-specific icon names with semantic boundaries
      /\b(?:ArrowRight(?:Circle|Square)|ChevronDown(?:Circle|Square)|FileText|MessageCircle|MoreVertical|Settings2|UserCircle2)\b/,

      // Lucide-specific class naming patterns
      /lucide-icon-[a-zA-Z0-9-]{1,40}\b/,

      // Lucide configuration patterns
      /\.setDefault\(\{[^}]*strokeLinecap:\s*["']round["']/,

      // Concat classes pattern
      /"lucide-"\.concat\(/,

      // Lucie unique prop
      /absoluteStrokeWidth:\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/,
    ],
  },
  {
    name: 'browserLucideClasses' as const,
    score: 0.9,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return (
          document.querySelector('.lucide,.lucide-icon,[class*="lucide-"]') !==
          null
        );
      });
    },
  },
  {
    name: 'browserLucideDataAttributes' as const,
    score: 0.9,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return document.querySelector('[data-lucide]') !== null;
      });
    },
  },
  {
    name: 'similarAttributes' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const svgs = document.querySelectorAll('svg[stroke="currentColor"]');
        return Array.from(svgs).some(
          (svg) =>
            svg.getAttribute('stroke-width') === '2' &&
            svg.getAttribute('stroke-linecap') === 'round' &&
            svg.getAttribute('stroke-linejoin') === 'round' &&
            svg.getAttribute('fill') === 'none'
        );
      });
    },
  },

  {
    name: 'styles' as const,
    score: 0.2,
    stylesheets: [
      // Lucide-specific CSS class patterns
      /\.lucide(?:-icon)?(?:\[[^\]]+\]|\.[a-zA-Z0-9-]+)?\s*\{[^}]*\}/,

      // Lucide animation classes
      /\.lucide-(?:spin|pulse|rotate-\d+)/,

      // Icon-specific styling
      /(?:\.lucide|\[data-lucide\])\s*>\s*\*/,
    ],
  },
];
