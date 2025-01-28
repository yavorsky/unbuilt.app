import { Page } from 'playwright';

export const shadcn = [
  {
    name: 'compilation' as const,
    score: 0.6,
    scripts: [
      // shadcn/ui specific data attributes
      /data-\[tw-(?:accordion|alert|aspect|avatar|badge|calendar|card|carousel|checkbox|collapsible|command|context|dialog|dropdown|hover|input|label|menubar|navigation|popover|progress|radio|scroll|select|separator|sheet|skeleton|slider|switch|table|tabs|textarea|toggle|tooltip)\]/,

      // shadcn/ui's specific variant patterns
      /class=["'](?:[^"']{0,100}?\s)?(?:destructive|outline|secondary|ghost|link)(?:\s[^"']{0,100})?["']/,

      // shadcn/ui's unique component file structure
      /from\s+["']@\/components\/ui\/(?:accordion|alert-dialog|aspect-ratio|avatar|badge|calendar|card|carousel|checkbox|collapsible|command|context-menu|dialog|dropdown-menu|hover-card|input|label|menubar|navigation-menu|popover|progress|radio-group|scroll-area|select|separator|sheet|skeleton|slider|switch|table|tabs|textarea|toggle|tooltip)["']/,

      // shadcn/ui specific theme imports
      /from\s+["']@\/components\/ui\/themes\/(?:light|dark)["']/,

      // shadcn/ui's variant configuration
      /\{[^}]{0,500}variant:\s*['"](?:destructive|outline|secondary|ghost|link)["']/,

      // shadcn/ui specific component configuration
      /cn\(\s*buttonVariants\(\{[^}]*variant:/,
      /cn\(\s*alertVariants\(\{[^}]*variant:/,
      /cn\(\s*cardVariants\(\{[^}]*variant:/,

      // shadcn/ui's specific className patterns with cn utility
      /cn\(\s*["'](?:fixed|absolute)\s+(?:inset-0|inset-x-0|inset-y-0)\s+z-50\s+flex\s+items-center\s+justify-center["']/,
    ],
  },
  {
    name: 'browser' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for shadcn/ui specific variants
          hasVariants:
            document.querySelector(
              '.destructive[class*="hover:bg-destructive"]'
            ) !== null,

          // Check for shadcn/ui theme configuration
          hasThemeConfig:
            document.querySelector('[data-shadcn-theme]') !== null,

          // Check for shadcn/ui specific class combinations
          hasShadcnStyles:
            document.querySelector(
              '[class*="rounded-md bg-background p-4 text-foreground"]'
            ) !== null,
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
];
