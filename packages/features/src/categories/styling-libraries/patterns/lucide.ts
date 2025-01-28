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

      // Unique Lucide icon attribute combinations
      /(?:strokeLinecap|strokeLinejoin|strokeWidth)="(?:round|2)"/,

      // Lucide-specific icon names with semantic boundaries
      /\b(?:ArrowRight(?:Circle|Square)|ChevronDown(?:Circle|Square)|FileText|MessageCircle|MoreVertical|Settings2|UserCircle2)\b/,

      // Lucide-specific class naming patterns
      /lucide-icon-[a-zA-Z0-9-]{1,40}\b/,

      // Lucide configuration patterns
      /\.setDefault\(\{[^}]*strokeLinecap:\s*["']round["']/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.8,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Lucide's unique SVG structure and attributes
          hasLucideSVGPattern: (() => {
            const svgs = document.querySelectorAll(
              'svg[stroke="currentColor"]'
            );
            return Array.from(svgs).some(
              (svg) =>
                svg.getAttribute('stroke-width') === '2' &&
                svg.getAttribute('stroke-linecap') === 'round' &&
                svg.getAttribute('stroke-linejoin') === 'round' &&
                svg.getAttribute('fill') === 'none'
            );
          })(),

          // Check for Lucide-specific data attributes
          hasLucideDataAttrs:
            document.querySelector('[data-lucide],[data-feather]') !== null,

          // Check for Lucide's global namespace objects
          hasLucideGlobals: !!(
            window.lucide ||
            window.LucideIcon ||
            window.createLucideIcon
          ),

          // Check for Lucide's unique class patterns
          hasLucideClasses:
            document.querySelector(
              '.lucide,.lucide-icon,[class*="lucide-"]'
            ) !== null,

          // Check for Lucide's unique element structure
          hasLucideElements:
            document.querySelector(
              'svg > [stroke-linecap="round"][stroke-linejoin="round"]'
            ) !== null,
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'files' as const,
    score: 0.3,
    filenames: [
      // Package files with hash patterns
      /lucide(?:-react|-vue|-svelte|-angular)?(?:\.[a-f0-9]{8,12})?\.(?:js|mjs|cjs)$/,

      // Chunk files with Lucide-specific naming
      /chunk-lucide-[a-zA-Z0-9-]{1,40}\.js$/,

      // Icon-specific chunk patterns
      /icons-lucide\.[a-f0-9]{8,12}\.js$/,

      // Vendor bundles containing Lucide
      /vendor\.(?:lucide|icons)\.[a-f0-9]{8,12}\.js$/,

      // ESM module patterns
      /lucide\.esm\.[a-f0-9]{8,12}\.js$/,
    ],
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
