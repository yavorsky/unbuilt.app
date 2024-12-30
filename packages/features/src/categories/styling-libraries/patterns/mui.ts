import { Page } from 'playwright';

export const mui = [
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
      /styleOverrides:\s*\{\s*root:\s*\{[^}]{1,500}\}\s*\}/,

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
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Optimized core files - added boundaries
      /@mui\/(?:material|system|base|joy-ui)\/(?:esm|umd|cjs)\/\b/,
      /@mui\/material(?:@[\d.]{1,10})?\/(?:Button|Modal|Menu|Tabs|TextField)\b/,

      // Optimized build artifacts - added hash length limit
      /mui-(?:production|development)-bundle\.[a-f0-9]{8}\.js$/,
      /mui-base-(?:auto|manual)\.(?:esm|umd)\.js$/,

      // Optimized icon files - added boundary
      /@mui\/icons-material\/[A-Z][a-zA-Z]{1,30}Icon$/,

      // Optimized theme files - combined pattern
      /(?:mui-theme|theme\.mui)\.(?:js|ts)$/,

      // Optimized style injection - added hash length limit
      /(?:emotion-(?:cache|element)|StyledEngine)-mui\.[a-f0-9]{8}\.js$/,

      // Optimized chunks - consolidated with length limits
      /(?:chunk|vendors)-mui-[a-z-]{1,30}\.[a-f0-9]{8}\.js$/,
    ],
  },
];
