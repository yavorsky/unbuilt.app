import { Page } from 'playwright';

export const stylus = [
  {
    name: 'stylusMixins' as const,
    score: 1,
    stylesheets: [
      // Stylus-specific mixin definition (unique from Less/Sass)
      /[\w-]+\([^)]*\)\s*\n\s+(?!@|\$|:)/,

      // Stylus-specific block mixins
      /\+[\w-]+\([^)]*\)\s*\n\s+[^@\$:+]/,

      // Stylus-specific rest params in mixins
      /\+[\w-]+\([^)]*\.\.\.\)/,

      // Stylus-specific transparent mixins
      /^(?![\s\S]*[@\$])[a-zA-Z][\w-]*\s*\{[^}]*\}/m,
    ],
  },
  {
    name: 'stylusOperations' as const,
    score: 1,
    stylesheets: [
      // Stylus-specific property lookup (unique syntax)
      /@[\w-]+\s*\[\d+\]/,

      // Stylus-specific unit operations
      /unit\(\s*[@\$\w-]+\s*,\s*(['"])?[a-z%]+\1\s*\)/,

      // Stylus-specific color operations
      /adjust\(\s*[@\$\w-]+\s*,\s*['"]?(?:red|green|blue|alpha)['"]?\s*,\s*[-\d.]+\s*\)/,

      // Stylus-specific type checking
      /typeof\(\s*[@\$\w-]+\s*\)\s*==\s*['"](?:ident|unit|rgba?|hsla?|string)["']/,
    ],
  },
  {
    name: 'stylusFeatures' as const,
    score: 1,
    stylesheets: [
      // Stylus-specific conditional assignment
      /[\w-]+\s*\?=\s*[^;\n]+/,

      // Stylus-specific hash syntax
      /{[\w-]+:\s*\$[\w-]+}/,

      // Stylus-specific selector interpolation
      /\{(\$[\w-]+|\([\s\S]+?\))\}/,

      // Stylus-specific parent reference with index
      /\^[0-9]+(?!\w)/,
    ],
  },
  {
    name: 'browser' as const,
    score: 1.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        try {
          return Array.from(document.styleSheets).some((sheet) => {
            try {
              const rules = Array.from(sheet.cssRules);
              return rules.some((rule) => {
                // Look for Stylus-specific compilation artifacts
                return (
                  rule.cssText.includes('/* stylus */') ||
                  /\-\-stylus\-[\w\-]+\-[\da-f]{6,}/.test(rule.cssText) ||
                  rule.cssText.includes('/* @stylus */')
                );
              });
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
    name: 'files' as const,
    score: 0.9,
    filenames: [
      // Stylus-specific extensions
      /\.styl$/,

      // Stylus config files
      /\.stylintrc$/,
      /stylint\.json$/,
      /\.stylus-supremacy\.json$/,

      // Stylus build artifacts
      /\.styl\.js$/,
    ],
  },
  {
    name: 'imports' as const,
    score: 0.8,
    stylesheets: [
      // Stylus-specific import syntax
      /(?:^|\n)\s*@(?:import|require)\s+['"](?!~|\.\/|\.\.|\/)/m,

      // Stylus-specific inline imports
      /@import\s+['"][^'"]+['"]\s+inline/,

      // Stylus-specific reference imports
      /@import\s+['"][^'"]+['"]\s+reference/,
    ],
  },
];
