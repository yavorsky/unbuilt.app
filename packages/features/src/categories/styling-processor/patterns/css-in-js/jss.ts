import { Page } from 'playwright';

export const jss = [
  {
    name: 'runtime' as const,
    score: 1,
    scripts: [
      // JSS specific sheet creation
      /insertRule\("JSS_[A-Z0-9]+_[0-9]+"/,

      // JSS unique class naming
      /jss-[0-9]+-[0-9]+/,

      // JSS specific plugin system
      /jss\.use\(\[/,

      // JSS specific sheet management
      /sheets\.add\(\w+,\s*{\s*meta:\s*"[^"]+"\s*}\)/,

      // JSS unique ID generation
      /generateId\(\w+,\s*sheet\)/,

      // JSS specific rule management
      /createRule\(\s*name,\s*decl,\s*options\)/,

      // JSS specific style processing
      /processStyles\(sheet,\s*rule,\s*style\)/,
    ],
  },
  {
    name: 'reactJss' as const,
    score: 1,
    scripts: [
      // React-JSS specific patterns
      /withStyles\(\s*\(/,

      // JSS theming
      /ThemeProvider.*?jss-theme-/,

      // JSS specific hooks
      /useStyles\(\s*\)/,
      /makeStyles\(\s*\(/,
      /createUseStyles\(/,

      // JSS specific component decoration
      /injectSheet\(\s*styles\)\(/,
    ],
  },
  {
    name: 'browser' as const,
    score: 1.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const evidence = {
          // Check for JSS specific style tags
          hasJssStyles: !!document.querySelector('style[data-jss]'),

          // Check for JSS unique class pattern
          hasJssClasses: Array.from(document.querySelectorAll('[class]')).some(
            (el) => el.className?.match?.(/jss-[0-9]+-[0-9]+/)
          ),

          // Check for JSS specific data attributes
          hasJssAttributes: !!document.querySelector('[data-meta="jss-"]'),

          // Check for JSS registry in window
          hasJssRegistry:
            !!window.jss ||
            Object.keys(window).some(
              (key) =>
                key.startsWith('__JSS_') || key.includes('_JSS_REGISTRY_')
            ),

          // Check for JSS specific sheet structure
          hasJssSheets: Array.from(document.styleSheets).some((sheet) => {
            try {
              const rules = Array.from(sheet.cssRules);
              return rules.some((rule) => {
                if (rule instanceof CSSStyleRule) {
                  return rule.selectorText.includes('jss-');
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
    scripts: [
      // JSS specific imports
      /from\s+['"]jss['"]|require\(['"]jss['"]\)/,
      /from\s+['"]react-jss['"]|require\(['"]react-jss['"]\)/,
      /from\s+['"]jss-preset-default['"]|require\(['"]jss-preset-default['"]\)/,

      // JSS plugin imports
      /from\s+['"]jss-plugin-[\w-]+['"]|require\(['"]jss-plugin-[\w-]+['"]\)/,
    ],
  },
  {
    name: 'setup' as const,
    score: 1,
    scripts: [
      // JSS setup patterns
      /create\(\s*{\s*plugins:\s*\[/,

      // JSS specific initialization
      /jss\.setup\(\s*{\s*insertionPoint:/,

      // JSS plugin configuration
      /preset\(\)\s*\.concat\(\[/,

      // JSS specific options
      /{\s*generateId:\s*createGenerateId\(\)/,

      // JSS specific error patterns
      /Production SessionID missing/,
    ],
  },
];
