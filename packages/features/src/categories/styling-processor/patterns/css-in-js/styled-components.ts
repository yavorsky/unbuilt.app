import { Page } from 'playwright';

export const styledComponents = [
  {
    name: 'runtime' as const,
    score: 1,
    scripts: [
      // Styled-components specific class naming with hash
      /sc-[a-zA-Z0-9]+-[a-zA-Z0-9]{8}/,

      // Styled-components unique component wrapping pattern
      /StyledComponent\[\$\$typeof\]\s*=\s*REACT_STYLED_COMPONENT/,

      // Styled-components specific template object handling
      /_styledComponents\$\$createStyledComponent/,

      // Styled-components unique generated identifiers
      /__WEBPACK_IMPORTED_MODULE_[0-9]+_styled_components__/,

      // Styled-components specific theme context
      /__WEBPACK_DEFAULT_EXPORT__\.withTheme/,

      // Styled-components unique runtime registration
      /registeredComponents\.push\(this\)/,
    ],
  },
  {
    name: 'styles' as const,
    score: 1,
    scripts: [
      // Styled-components specific CSS processing
      /css(?:From|To|For)\s*:\s*function\s*\(\s*strings,\s*[^)]+\)\s*{/,

      // Styled-components keyframes handling
      /keyframes\s*:\s*function\s*\(\s*strings,\s*[^)]+\)\s*{/,

      // Styled-components unique style construction
      /constructWithOptions\s*\(\s*componentConstructor,\s*tag,\s*options\)/,

      // Styled-components specific style tag management
      /makeStyleTag\s*\(\s*target,\s*tagEl,\s*insertBefore\)/,
    ],
  },
  {
    name: 'browser' as const,
    score: 1.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const evidence = {
          // Check for styled-components specific style tags
          hasStyledTags: !!(
            document.querySelector('style[data-styled]') ||
            document.querySelector('style[data-styled-components]') ||
            document.querySelector('style[data-styled-version]')
          ),

          // Check for styled-components unique class pattern
          hasStyledClasses: Array.from(
            document.querySelectorAll('[class]')
          ).some((el) =>
            el.className?.match?.(/sc-[a-zA-Z0-9]+-[a-zA-Z0-9]{8}/)
          ),

          // Check for styled-components specific data attributes
          hasStyledAttrs: Array.from(document.querySelectorAll('*')).some(
            (el) =>
              el
                .getAttributeNames()
                .some(
                  (attr) =>
                    attr.startsWith('sc-') || attr.startsWith('data-styled-')
                )
          ),

          // Check for styled-components runtime in window
          hasStyledRuntime: !!(
            window.__styled_components__ || window.__STYLED_COMPONENTS_CONTEXT__
          ),

          // Check for styled-components specific sheet structure
          hasStyledSheets: Array.from(document.styleSheets).some((sheet) => {
            try {
              return Array.from(sheet.cssRules).some((rule) => {
                if (rule instanceof CSSStyleRule) {
                  return rule.selectorText.includes('.sc-');
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
    name: 'ssr' as const,
    score: 1,
    scripts: [
      // Styled-components SSR specific patterns
      /ServerStyleSheet/,
      /StyleSheetManager/,
      /sheet\.collectStyles/,
      /sheet\.getStyleElement/,
      /sheet\.seal/,

      // Styled-components streaming specific patterns
      /interleaveWithNodeStream/,
      /sheet\.interleaveWithNodeStream/,
    ],
  },
];
