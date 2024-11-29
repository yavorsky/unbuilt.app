import { Page } from 'playwright';

export const cssModules = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // CSS Modules specific patterns
      /(?:["'])(?:\w+_)?[\w-]+_[A-Za-z0-9-_]{5,}(?:["'])/,  // Class name hashes
      /\.[\w-]+___[\w-]+/,  // CSS Modules class composition
      /compose:\s*[\w\s]+\s+from/,
      /composes:\s*[\w\s]+\s+from/,
      // Import statements in JS
      /import\s+styles\s+from\s+["'].*\.module\.css["']/,
      /require\(["'].*\.module\.css["']\)/,
      // Generated selectors
      /\[local\]/,
      /\[hash:[\w-]+\]/
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Check for CSS Modules naming pattern in classes
        const modulePattern = /(?:^|\s)([\w-]+_[A-Za-z0-9-_]{5,})(?:\s|$)/;

        // Check elements for CSS Modules class names
        const hasModuleClasses = Array.from(document.querySelectorAll('*')).some(el =>
          Array.from(el.classList).some(className => modulePattern.test(className))
        );

        // Check stylesheets for CSS Modules patterns
        const hasModuleStyles = Array.from(document.styleSheets).some(sheet => {
          try {
            const rules = Array.from(sheet.cssRules);
            return rules.some(rule => {
              if (rule instanceof CSSStyleRule) {
                return modulePattern.test(rule.selectorText) ||
                       rule.cssText.includes('compose:') ||
                       rule.cssText.includes('composes:');
              }
              return false;
            });
          } catch (e) {
            return false;
          }
        });

        return hasModuleClasses || hasModuleStyles;
      });
    }
  },
  {
    name: 'files' as const,
    score: 0.2,
    filenames: [
      /\.module\.css$/,
      /\.module\.[a-f0-9]{8}\.css$/,
      /[A-Za-z0-9-_]+_[A-Za-z0-9-_]+__[a-z0-9]{5,}\.css$/,  // CSS Modules naming pattern
      /styles\.[a-f0-9]{8}\.css$/  // Build output
    ]
  }
 ]