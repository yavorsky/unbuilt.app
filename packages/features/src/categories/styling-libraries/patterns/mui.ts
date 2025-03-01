import { Page } from 'playwright';

export const mui = [
  {
    name: 'core' as const,
    score: 1.0, // Highest confidence - unique to MUI
    scripts: [
      // MUI error URL pattern
      /https:\/\/mui\.com\/production-error\/\?code=/,

      // MUI specific symbol
      /Symbol\.for\(["']mui\.nested["']\)/,

      // MUI component name assignments
      /\.muiName\s*=\s*["'](Button|Slider|TextField|Checkbox|Radio|Switch|Select|Autocomplete|Tooltip|Modal|Dialog|Drawer|AppBar|IconButton)["']/,

      // MUI component name declarations
      /name:\s*["'](Mui[A-Z][a-zA-Z0-9]*)["']/,

      // MUI internal process styles
      /\.\s*__mui_systemSx\b/,

      // MUI theme provider specific import
      /from\s+["']@mui\/material(?:\/styles)?["']\s*;/,
    ],
  },
  {
    name: 'importsExports' as const,
    score: 0.7,
    scripts: [
      // MUI component style overrides specific pattern
      /import\s+\{\s*(?:[^{}]*,\s*)?(?:styled|alpha|createTheme|ThemeProvider)(?:\s*,\s*[^{}]*)?\s*\}\s+from\s+["']@mui\/material(?:\/styles)?["']/,

      // MUI component exports
      /import\s+\{\s*(?:[^{}]*,\s*)?(?:Button|TextField|Checkbox|Radio|Select|Switch|Slider|Dialog|Drawer|AppBar|Toolbar|IconButton|Typography|Box|Grid|Paper|Card|Divider|List|Avatar)(?:\s*,\s*[^{}]*)?\s*\}\s+from\s+["']@mui\/material(?:\/[a-zA-Z0-9]+)?["']/,

      // MUI component icons imports
      /from\s+["']@mui\/icons-material(?:\/[a-zA-Z0-9]+)?["']/,
    ],
  },
  {
    name: 'compilation' as const,
    score: 0.2,
    scripts: [
      // Optimized component classnames - combined patterns with boundaries
      /MuiButtonBase-(?:root|focusVisible|disabled|color(?:Primary|Secondary))\b/,
      /MuiButton-(?:contained(?:Primary)|outlined(?:Secondary)|text(?:Success)|size(?:Large)|fullWidth)\b/,

      // Optimized attributes - bounded with length limits
      /data-mui-(?:color-scheme="(?:light|dark)"|internal-clone-element="true")/,

      // Optimized emotion patterns - consolidated
      /(?:private-mui-(?:x-id|focusVisible|hidden|root|colorAction)|StyledEngineProvider\s+injectFirst)\b/,

      // Optimized theme tokens - added length limit
      /var\(--mui-(?:palette|typography|spacing|shadows|shape|zIndex|transitions)-[^)]{1,50}\)/,

      // Optimized imports - bounded length
      /import\s+\{[^}]{1,200}\}\s+from\s+["']@mui\/(?:material|system|base|joy-ui|icons-material)["']/,

      // Optimized style overrides - added length limits
      /components:\s*\{\s*MuiButton:\s*\{[^}]{1,500}\}\s*\}/,

      // Optimized system props - combined patterns
      /data-mui-base-(?:button|select|slider|switch|tabs|input)\b/,
      /aria-(?:owns|controls|haspopup|expanded)="mui-[^"]{1,50}"/,

      // Optimized portal patterns - added length limits
      /id="(?:modal|menu)-[^"]{1,30}"\s+role="(?:presentation|menu)"\s+class="Mui(?:Modal-root|Menu-list)/,

      // Optimized theme customization - added limits
      /createTheme\(\{\s*palette:\s*\{\s*primary:\s*\{[^}]{1,500}\}\s*\}\s*\}/,

      // Optimized error messages - combined
      /(?:Material-UI|MUI):\s/,

      // Optimized CSS injection - combined with boundary
      /data-(?:mui-inject-first="true"|emotion="mui(?:-[a-z]+)?")\b/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Optimized component check - single query
          hasMuiComponents:
            document.querySelector(
              '.MuiButtonBase-root[tabindex="0"], ' +
                '.MuiButton-containedPrimary, ' +
                '.MuiMenuItem-dense, ' +
                '.MuiInputBase-input'
            ) !== null,

          hasMuiClasses: (() => {
            const muiClassPatterns = [
              /^MuiButton/,
              /^MuiTextField/,
              /^MuiPaper/,
              /^MuiAppBar/,
              /^MuiToolbar/,
              /^MuiTypography/,
              /^MuiBox/,
              /^MuiCard/,
            ];

            const allClassNames = Array.from(
              document.querySelectorAll('*')
            ).flatMap((el) => Array.from(el.classList));

            return muiClassPatterns.some((pattern) =>
              allClassNames.some((className) => pattern.test(className))
            );
          })(),

          // Check for MUI data attributes
          hasMuiDataAttributes: (() => {
            return !!document.querySelector(
              '[data-mui-color-scheme], [data-mui-internal-clone-element], [data-mui-internal-clone-element]'
            );
          })(),

          // Check for hidden MUI style elements
          hasMuiStyleElements: (() => {
            const styleElements = document.querySelectorAll('style');
            for (const style of styleElements) {
              if (style.textContent && style.textContent.includes('.Mui')) {
                return true;
              }
            }
            return false;
          })(),

          // Optimized emotion check - single query
          hasEmotionStructure:
            document.querySelector(
              'style[data-emotion="mui"], ' +
                'style[data-emotion="mui-baseButton"], ' +
                '[data-mui-internal-clone-element]'
            ) !== null,

          // Optimized portal check - single query
          hasPortals:
            document.querySelector(
              '#modal-root [role="presentation"].MuiModal-root, ' +
                '#menu-root [role="menu"].MuiMenu-list, ' +
                '#popover-root [role="tooltip"].MuiTooltip-popper'
            ) !== null,

          // Optimized theme check - cache computed style
          hasThemeTokens:
            document.documentElement.style.cssText?.includes('--mui-'),
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
];
