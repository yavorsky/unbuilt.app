import { Page } from 'playwright';

export const postCSS = [
  {
    name: 'plugins' as const,
    score: 1,
    stylesheets: [
      // PostCSS unique plugin markers
      /\/\*\s*postcss-[\w-]+:\s*[^*]*\*\//,

      // Specific PostCSS usage comments
      /\/\*\s*@postcss\s+[\w-]+\s*\*\//,

      // PostCSS-specific custom properties set/apply
      /@property\s+--[\w-]+\s*{\s*syntax:\s*['"][^'"]+['"]/,

      // PostCSS nesting plugin specific syntax
      /@nest\s+&(?::[\w-]+|\[.+?\]|\s*>)/,

      // PostCSS custom media syntax
      /@custom-media\s+--[\w-]+\s+(?:\([^)]+\)|\band\b|\bor\b|>=?|<=?|\bscreen\b)/,
    ],
  },
  {
    name: 'transforms' as const,
    score: 1,
    stylesheets: [
      // PostCSS unique transformation markers
      /\/\*\s*replace:\s*{\s*"[\w-]+"\s*:\s*"[^"]+"\s*}\s*\*\//,

      // PostCSS-specific source map format
      /\/\*# sourceMappingURL=data:application\/json;charset=utf-8;base64,[A-Za-z0-9+/=]+\*\/\s*\/\*\s*generated by postcss/i,

      // PostCSS custom selectors (unique syntax)
      /@custom-selector\s+:--[\w-]+\s+(?::\w+\([^)]*\)|\.[\w-]+|\[.+?\])+/,
    ],
  },
  {
    name: 'browser' as const,
    score: 1.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        try {
          // Look for PostCSS-specific markers in stylesheets
          return Array.from(document.styleSheets).some((sheet) => {
            try {
              const rules = Array.from(sheet.cssRules);
              return rules.some(
                (rule) =>
                  // Check for unique PostCSS features
                  rule.cssText.includes('/* postcss-') ||
                  rule.cssText.includes('@nest') ||
                  (rule.cssText.includes('/* @postcss') &&
                    rule.cssText.includes('generated by postcss')) ||
                  /@custom-selector\s+:--[\w-]+/.test(rule.cssText)
              );
            } catch {
              return false;
            }
          });
        } catch {
          return false;
        }
      });
    },
  },
  {
    name: 'dependencies' as const,
    score: 0.8,
    stylesheets: [
      // PostCSS specific import comments
      /\/\*\s*@import-glob\s+[^*]+\*\//,

      // PostCSS specific dependency resolution
      /\/\*\s*@requires\s+[^*]+\*\//,

      // PostCSS custom imports
      /\@import-normalize\s*;/,

      // PostCSS specific module resolution
      /\@value\s+[\w-]+\s+from\s+["'][^"']+["']\s*;/,
    ],
  },
];
