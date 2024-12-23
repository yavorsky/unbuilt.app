import { Page } from 'playwright';

export const shadcn = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // shadcn-specific component naming conventions
      /data-\[tw-(?:accordion|alert-dialog|aspect-ratio|avatar|badge|calendar|card|carousel|checkbox|collapsible|command|context-menu|dialog|dropdown-menu|hover-card|input|label|menubar|navigation-menu|popover|progress|radio-group|scroll-area|select|separator|sheet|skeleton|slider|switch|table|tabs|textarea|toggle|tooltip)\]/,

      // shadcn's unique class naming pattern for variants
      /class=["'](?:[^"']*\s)?(?:destructive|outline|secondary|ghost|link)(?:\s[^"']*)?["']/,

      // shadcn's specific React imports (only matches shadcn's component structure)
      /from\s+["']@\/components\/ui\/(?:accordion|alert-dialog|aspect-ratio|avatar|badge|calendar|card|carousel|checkbox|collapsible|command|context-menu|dialog|dropdown-menu|hover-card|input|label|menubar|navigation-menu|popover|progress|radio-group|scroll-area|select|separator|sheet|skeleton|slider|switch|table|tabs|textarea|toggle|tooltip)["']/,

      // shadcn's theme configuration imports
      /from\s+["']@\/components\/ui\/themes\/(?:light|dark)["']/,

      // shadcn's specific hook patterns
      /use(?:Toast|Dialog|Sheet|Command|Dropdown|HoverCard|Tabs)Context/,

      // shadcn's specific component configuration
      /\{[\s\S]*variant:\s*(?:"(?:destructive|outline|secondary|ghost|link)"|'(?:destructive|outline|secondary|ghost|link)')/,

      // shadcn's component registry patterns
      /registry\.json/,
      /components\.json/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check only for shadcn's specific data attributes and structures
          hasShadcnComponents: [
            '[data-tw-accordion]',
            '[data-tw-alert-dialog]',
            '[data-tw-hover-card]',
            '[data-tw-dropdown-menu]',
          ].some((selector) => document.querySelector(selector) !== null),

          // Check for shadcn's specific variant classes
          hasVariants:
            document.querySelector(
              '[class*="destructive"][class*="hover:bg-destructive/90"]'
            ) !== null,

          // Check for shadcn's specific theme attributes
          hasThemeConfig:
            document.querySelector('[data-shadcn-theme]') !== null,
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // shadcn's specific component files
      /(?:^|\/)@shadcn\/ui\/(?:accordion|alert-dialog|aspect-ratio|avatar|badge|calendar|card|carousel|checkbox|collapsible|command|context-menu|dialog|dropdown-menu|hover-card|input|label|menubar|navigation-menu|popover|progress|radio-group|scroll-area|select|separator|sheet|skeleton|slider|switch|table|tabs|textarea|toggle|tooltip)$/,

      // shadcn's configuration files
      /components\.json$/,
      /registry\.json$/,
      /shadcn\.config\.ts$/,

      // shadcn's specific build outputs
      /shadcn-ui\.registry\.[a-f0-9]{8}\.js$/,
      /shadcn-components\.[a-f0-9]{8}\.js$/,
    ],
  },
];
