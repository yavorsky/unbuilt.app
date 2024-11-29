import { Page } from "playwright";

export const sass = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Sass specific functions and mixins
      /\@include\s+[\w-]+/,
      /\@extend\s+[\w-]+/,
      /\@mixin\s+[\w-]+/,
      /\@use\s+["'][\w-\/]+["']/,
      /\@forward\s+["'][\w-\/]+["']/,
      // Variables and nested syntax
      /\$[\w-]+:/,
      /&[\-:_]/,
      // Sass operations and functions
      /\$[\w-]+\s*[\+\-\*\/]/,
      /darken\(|lighten\(|rgba\(|mix\(/,
      /\@function\s+[\w-]+/,
      /\@return\s+/,
    ],
    // TODO: Consider removing it if runtime patterns will be enough
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const styles = Array.from(document.styleSheets);
        return styles.some((sheet) => {
          try {
            const rules = Array.from(sheet.cssRules);
            return rules.some(
              (rule) =>
                rule.cssText.includes('$') ||
                rule.cssText.includes('@include') ||
                rule.cssText.includes('@mixin')
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
      /\.scss$/,
      /\.sass$/,
      /\.module\.scss$/,
      /\.[a-f0-9]{8}\.scss\.js$/, // Compiled module
      /styles\.[a-f0-9]{8}\.css$/, // Compiled output
    ],
  },
];
