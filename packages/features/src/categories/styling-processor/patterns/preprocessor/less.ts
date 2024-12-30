import { Page } from 'playwright';

export const less = [
  {
    name: 'lessMixins' as const,
    score: 1,
    stylesheets: [
      // Less-specific mixin patterns with namespace
      /#[\w-]+\s*>\s*\.[a-zA-Z][\w-]*\s*\([^)]*\)\s*;/,

      // Less-specific parametric mixins
      /\.[a-zA-Z][\w-]*\s*\(@[^:]+:\s*[^)]+\)\s*{/,

      // Less-specific guard expressions (unique to Less)
      /when\s*\(\s*(?:default|not|and|,|\s*@[\w-]+\s*(?:[<>]=?|=)\s*[@\d]+\s*)+\)/,

      // Less-specific mixin references
      /#[\w-]+[^{]*\{\s*\.[a-zA-Z][\w-]*\s*\([^)]*\)\s*;/,
    ],
  },
  {
    name: 'lessOperations' as const,
    score: 1,
    stylesheets: [
      // Less-specific color operations (not in Sass/Stylus)
      /tint\(\s*@[\w-]+\s*,\s*[\d.]+%?\s*\)/,
      /shade\(\s*@[\w-]+\s*,\s*[\d.]+%?\s*\)/,

      // Less-specific units and calculations
      /@[\w-]+\s*\+\s*\(\s*\d+\s*\*\s*@[\w-]+\s*\)/,

      // Less-specific string operations
      /~["']\s*@{[\w-]+}\s*["']/,
    ],
  },
  {
    name: 'lessVariables' as const,
    score: 1,
    stylesheets: [
      // Less-specific variable interpolation (different from Sass)
      /@\{[\w-]+\}\s*(?:\/|\.|\+|-|\*)/,

      // Less-specific variable definition pattern
      /@[\w-]+:\s*\s*~["'][^"']+["']/,

      // Less-specific property variable usage
      /\[@[\w-]+\]:\s*[^;]+;/,
    ],
  },
  {
    name: 'browser' as const,
    score: 1.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const evidence = {
          // Check for Less-specific comments
          hasLessComments: Array.from(document.styleSheets).some((sheet) => {
            try {
              return Array.from(sheet.cssRules).some(
                (rule) =>
                  rule.cssText.includes('/* Less') ||
                  rule.cssText.includes('// Less')
              );
            } catch {
              return false;
            }
          }),

          // Check for Less-specific variable patterns in CSS
          hasLessVariables: Array.from(document.styleSheets).some((sheet) => {
            try {
              return Array.from(sheet.cssRules).some((rule) => {
                if (rule instanceof CSSStyleRule) {
                  // Look for Less variable interpolation artifacts
                  return /@\{[\w-]+\}/.test(rule.cssText);
                }
                return false;
              });
            } catch {
              return false;
            }
          }),

          // Check for Less-specific mixin artifacts
          hasLessMixins: Array.from(document.styleSheets).some((sheet) => {
            try {
              return Array.from(sheet.cssRules).some((rule) => {
                if (rule instanceof CSSStyleRule) {
                  return /#[\w-]+\s*>\s*\.[\w-]+/.test(rule.selectorText);
                }
                return false;
              });
            } catch {
              return false;
            }
          }),
        };

        return Object.values(evidence).some(Boolean);
      });
    },
  },
  {
    name: 'imports' as const,
    score: 0.8,
    stylesheets: [
      // Less-specific import statements
      /@import\s+\(\s*reference\s*\)\s*["'][^"']+\.less["']/,

      // Less-specific import options
      /@import\s+\([\w\s,]*once[\w\s,]*\)/,

      // Less-specific import with namespace
      /@import\s+\([\w\s,]*multiple[\w\s,]*\)/,
    ],
  },
];
