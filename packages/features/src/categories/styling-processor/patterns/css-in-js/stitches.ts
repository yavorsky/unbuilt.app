import { Page } from 'playwright';

export const stitches = [
  {
    name: 'core' as const,
    score: 1,
    scripts: [
      // Stitches specific component creation
      /createStitches\s*\(\s*{\s*theme:\s*{/,

      // Stitches unique prefix handling
      /prefix:\s*['"][a-z]+['"]\s*,/,

      // Stitches specific theme definition
      /\$theme:\s*createTheme\(\s*{\s*['"]\w+['"]/,

      // Stitches unique styled pattern with hash
      /styled\(\s*\w+,\s*{\s*[^}]+hash:\s*['"][a-zA-Z0-9]+['"]/,

      // Stitches specific CSS property handling
      /\$\w+:\s*\{\s*[^}]+cssProperty:\s*['"]\w+['"]/,

      // Stitches utils definition
      /utils:\s*{\s*\w+:\s*\([^)]+\)\s*=>\s*\({/,
    ],
  },
  {
    name: 'components' as const,
    score: 1,
    scripts: [
      // Stitches specific variant pattern
      /variants:\s*{\s*\w+:\s*{\s*[^}]+:\s*{\s*[^}]+}}\s*}/,

      // Stitches unique compound variants
      /compoundVariants:\s*\[\s*{\s*variants:\s*{\s*\w+:/,

      // Stitches specific defaultVariants
      /defaultVariants:\s*{\s*\w+:\s*['"]\w+['"]\s*}/,

      // Stitches unique component composition
      /const\s+\w+\s*=\s*styled\(\s*\w+\s*,\s*{\s*extend:\s*\w+/,
    ],
  },
  {
    name: 'browser' as const,
    score: 1.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const evidence = {
          // Check for Stitches specific class naming pattern
          hasStitchesClasses: Array.from(
            document.querySelectorAll('[class]')
          ).some((el) => {
            const classNames = Array.from(el.classList);
            // Stitches unique hash format
            return classNames.some((className) =>
              /^[a-z]{1,6}-[a-zA-Z0-9]{6,8}$/.test(className)
            );
          }),

          // Check for Stitches data attributes
          hasStitchesAttrs: Array.from(document.querySelectorAll('*')).some(
            (el) =>
              el
                .getAttributeNames()
                .some((attr) => attr.startsWith('data-stitches'))
          ),

          // Check for Stitches style tags
          hasStitchesTags: !!document.querySelector('style[data-stitches]'),

          // Check for Stitches runtime
          hasStitchesRuntime: !!(
            window.__stitches__ || window.__STITCHES_CONTEXT__
          ),

          // Check for Stitches specific style rules
          hasStitchesRules: Array.from(document.styleSheets).some((sheet) => {
            try {
              const rules = Array.from(sheet.cssRules);
              return rules.some((rule) => {
                if (rule instanceof CSSStyleRule) {
                  // Stitches specific selector pattern
                  return /\.[a-z]{1,6}-[a-zA-Z0-9]{6,8}(?![a-zA-Z0-9-])/.test(
                    rule.selectorText
                  );
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
    name: 'tokens' as const,
    score: 1,
    scripts: [
      // Stitches specific token format
      /\$colors:\s*{\s*\$\w+:/,
      /\$space:\s*{\s*\$\w+:/,
      /\$sizes:\s*{\s*\$\w+:/,
      /\$fonts:\s*{\s*\$\w+:/,

      // Stitches unique token reference
      /\$theme\.\$\w+\.\$\w+/,

      // Stitches token composition
      /createThemeMap\(\s*{\s*\w+:\s*\$\w+/,
    ],
  },
];
