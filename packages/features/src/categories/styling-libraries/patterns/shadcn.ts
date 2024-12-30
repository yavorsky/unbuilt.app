import { Page } from 'playwright';

export const shadcn = [
  {
    name: 'compilation' as const,
    score: 0.6,
    scripts: [
      // Optimized data attribute pattern - consolidated into a single regex with non-capturing groups
      /data-\[tw-(?:accordion|alert|aspect|avatar|badge|calendar|card|carousel|checkbox|collapsible|command|context|dialog|dropdown|hover|input|label|menubar|navigation|popover|progress|radio|scroll|select|separator|sheet|skeleton|slider|switch|table|tabs|textarea|toggle|tooltip)\]/,

      // Optimized class variant pattern - reduced backtracking
      /class=["'](?:[^"']{0,100}?\s)?(?:destructive|outline|secondary|ghost|link)(?:\s[^"']{0,100})?["']/,

      // Optimized component imports - consolidated pattern
      /from\s+["']@\/components\/ui\/(?:accordion|alert-dialog|aspect-ratio|avatar|badge|calendar|card|carousel|checkbox|collapsible|command|context-menu|dialog|dropdown-menu|hover-card|input|label|menubar|navigation-menu|popover|progress|radio-group|scroll-area|select|separator|sheet|skeleton|slider|switch|table|tabs|textarea|toggle|tooltip)["']/,

      // Optimized theme imports - more specific boundary
      /from\s+["']@\/components\/ui\/themes\/(?:light|dark)["']/,

      // Optimized hook pattern - consolidated
      /use(?:Toast|Dialog|Sheet|Command|Dropdown|HoverCard|Tabs)Context\b/,

      // Optimized variant configuration - bounded search
      /\{[^}]{0,500}variant:\s*['"](?:destructive|outline|secondary|ghost|link)["']/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.7,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Optimized selectors - using more specific attribute selectors
          hasShadcnComponents: [
            '[data-tw-accordion]',
            '[data-tw-alert-dialog]',
            '[data-tw-hover-card]',
            '[data-tw-dropdown-menu]',
          ].some((selector) => document.querySelector(selector)),

          // Optimized variant class check - more specific selector
          hasVariants:
            document.querySelector(
              '.destructive[class*="hover:bg-destructive"]'
            ) !== null,

          // Theme config check remains the same as it's already optimal
          hasThemeConfig:
            document.querySelector('[data-shadcn-theme]') !== null,
        };

        try {
          return Object.values(markers).some(Boolean);
        } catch (error) {
          console.warn(error);
          return false;
        }
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Optimized component files pattern - removed unnecessary capturing groups
      /(?:^|\/)@shadcn\/ui\/(?:accordion|alert-dialog|aspect-ratio|avatar|badge|calendar|card|carousel|checkbox|collapsible|command|context-menu|dialog|dropdown-menu|hover-card|input|label|menubar|navigation-menu|popover|progress|radio-group|scroll-area|select|separator|sheet|skeleton|slider|switch|table|tabs|textarea|toggle|tooltip)$/,

      // Configuration files - already optimal
      /components\.json$/,
      /registry\.json$/,
      /shadcn\.config\.ts$/,

      // Build outputs - added length limits
      /shadcn-ui\.registry\.[a-f0-9]{8}\.js$/,
      /shadcn-components\.[a-f0-9]{8}\.js$/,
    ],
  },
];
