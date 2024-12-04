import { Page } from 'playwright';

export const postCSS = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // PostCSS comments and features
      /\/\*\s*postcss:\s*[^*]*\*\//,
      /\/\*\s*autoprefixer:\s*[^*]*\*\//,
      // Custom properties and @apply
      /--[\w-]+:\s*[^;]+;/,
      /\@apply\s+--[\w-]+/,
      // Custom media queries
      /\@custom-media\s+--[\w-]+/,
      /\@custom-selector\s+:--[\w-]+/,
      // Nesting syntax
      /&:\w+/,
      /&\s*>/,
      // CSS Grid and modern syntax
      /grid-template-areas:/,
      /grid-area:/,
      // Vendor prefixes (autoprefixer)
      /-(webkit|moz|ms|o)-[\w-]+/,
      // Source maps
      /\/\*# sourceMappingURL=data:application\/json;base64,.*?postcss/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const styles = Array.from(document.styleSheets);
        return styles.some((sheet) => {
          try {
            const rules = Array.from(sheet.cssRules);
            return rules.some(
              (rule) =>
                rule.cssText.includes('/*# sourceMappingURL') ||
                rule.cssText.includes('/* postcss') ||
                rule.cssText.match(/--[\w-]+:/) ||
                rule.cssText.match(/@apply\s+/)
            );
          } catch (e) {
            console.error(e);
            return false;
          }
        });
      });
    },
  },
  {
    name: 'files' as const,
    score: 0.2,
    filenames: [
      /\.pcss$/,
      /\.postcss$/,
      /\.[a-f0-9]{8}\.css$/, // Processed output
      /\.css\?used$/, // PostCSS-specific query param
      /\.css\?v=[a-f0-9]{8}$/, // Cache busting with hash
    ],
  },
];
