import { Page } from 'playwright';

export const sass = [
  {
    name: 'sassStructure' as const,
    score: 1,
    stylesheets: [
      // Sass-specific module system (not in Less/Stylus)
      /@use\s+["'][\w-\/]+["']\s+(?:with\s*\(\s*\$[\w-]+\s*:\s*[^)]+\))?/,
      /@forward\s+["'][\w-\/]+["']\s+(?:hide|show|as)\s+[\w-\s,]+/,

      // Sass-specific mixin patterns with content blocks
      /@mixin\s+[\w-]+\s*\([^)]*\)\s*{\s*@content\s*;?\s*}/,

      // Sass-specific map functions
      /map-get\(\s*\$[\w-]+,\s*["'][\w-]+["']\s*\)/,
      /map-merge\(\s*\$[\w-]+,\s*\(\s*["'][\w-]+["']\s*:\s*[^)]+\)\s*\)/,
    ],
  },
  {
    name: 'sassOperations' as const,
    score: 1,
    stylesheets: [
      // Sass-specific list operations
      /nth\(\s*\$[\w-]+,\s*\$[\w-]+\s*\)/,
      /list\.nth\(\s*\$[\w-]+,\s*\$[\w-]+\s*\)/,

      // Sass-specific string interpolation
      /#{[\s\S]*?\$[\w-]+[\s\S]*?}/,

      // Sass-specific color operations
      /adjust-hue\(\s*\$[\w-]+,\s*\d+deg\s*\)/,
      /color\.adjust\(\s*\$[\w-]+,\s*\$[\w-]+:\s*[-\d.]+[%]?\s*\)/,
    ],
  },
  {
    name: 'sassFlowControl' as const,
    score: 1,
    stylesheets: [
      // Sass-specific control structures
      /@each\s+\$[\w-]+(?:\s*,\s*\$[\w-]+)*\s+in\s+\$[\w-]+/,
      /@for\s+\$[\w-]+\s+from\s+.+\s+through\s+.+/,

      // Sass-specific function declarations
      /@function\s+[\w-]+\s*\(\s*\$[\w-]+\s*:[\s\S]*?\)\s*{\s*@return/,

      // Sass-specific conditionals
      /@if\s+(?:not\s+)?(?:type-of\(\$[\w-]+\)|function-exists\([\w-]+\)|variable-exists\(\$[\w-]+\))/,
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
                const text = rule.cssText;
                // Look for compiled Sass artifacts
                return (
                  text.includes('/*! generated by Sass */') ||
                  text.includes('/* Sass::Script::Tree::') ||
                  /--[\w-]+-[\da-f]{6,}/.test(text)
                ); // Sass unique hash pattern
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
      // Sass-specific partials
      /_[\w-]+\.(scss|sass)$/,

      // Sass-specific config files
      /\.sass-lint\.(yml|json)$/,
      /\.sasslintrc$/,
      /\.sass-cache\//,

      // Sass module files
      /\.module\.(scss|sass)$/,
    ],
  },
  {
    name: 'imports' as const,
    score: 0.8,
    stylesheets: [
      // Sass-specific import rules
      /@import\s+["'](?!http|\/\/)[\w\-\/]+\.(scss|sass)["']/,

      // Sass-specific module loading
      /@use\s+["']sass:[\w-]+["']/,

      // Sass-specific namespace imports
      /@use\s+["'][\w-\/]+["']\s+as\s+\*/,
    ],
  },
];
