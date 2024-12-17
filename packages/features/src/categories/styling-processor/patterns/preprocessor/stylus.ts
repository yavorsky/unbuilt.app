import { Page } from 'playwright';

export const stylus = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Stylus variables and mixins
      /\$[\w-]+\s*=/,
      /\+[\w-]+\(/,
      // Stylus nesting and selectors
      /^\s+[\w-\.#]\w+$/m,
      /\^[0-9]+/,
      // Functions and operations
      /\s[\+\-\*\/]\s/,
      /typeof\s*\(/,
      /unit\s*\(/,
      // Property lookup
      /\@[\w-]+/,
      // Conditional assignment
      /\?=/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const styles = Array.from(document.styleSheets);
        return styles.some((sheet) => {
          try {
            const rules = Array.from(sheet.cssRules);
            return rules.some(
              (rule) =>
                rule.cssText.includes('$') ||
                rule.cssText.includes('+') ||
                rule.cssText.match(/^\s+[\w-.#]/)
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
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /\.styl$/,
      /\.module\.styl$/,
      /\.[a-f0-9]{8}\.styl\.js$/, // Compiled module
      /styles\.[a-f0-9]{8}\.css$/, // Compiled output
    ],
  },
];
