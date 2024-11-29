import { Page } from 'playwright';

export const less = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Less variables and mixins
      /\@[\w-]+\s*:/,
      /\@\{[\w-]+\}/,
      // Less operations and functions
      /fade\(|shade\(|tint\(|average\(/,
      // Guards
      /when\s*\([^)]+\)/,
      /and\s*\([^)]+\)/,
      // Imports and paths
      /\@import\s+\([^)]+\)/,
      /\.{2}\//,
      // Namespace
      /#[\w-]+\s*>\s*/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const styles = Array.from(document.styleSheets);
        return styles.some((sheet) => {
          try {
            const rules = Array.from(sheet.cssRules);
            return rules.some(
              (rule) =>
                rule.cssText.includes('@{') ||
                rule.cssText.includes('#namespace') ||
                rule.cssText.match(/when\s*\(/)
            );
          } catch (e) {
            return false;
          }
        });
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /\.less$/,
      /\.module\.less$/,
      /\.[a-f0-9]{8}\.less\.js$/, // Compiled module
      /styles\.[a-f0-9]{8}\.css$/, // Compiled output
    ],
  },
];
