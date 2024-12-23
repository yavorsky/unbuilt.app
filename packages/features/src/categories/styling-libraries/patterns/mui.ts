import { Page } from 'playwright';

export const mui = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // MUI's specific component classnames
      /MuiButtonBase-(?:root|focusVisible|disabled|colorPrimary|colorSecondary)/,
      /MuiButton-(?:containedPrimary|outlinedSecondary|textSuccess|sizeLarge|fullWidth)/,

      // MUI's unique component structure attributes
      /data-mui-color-scheme="(?:light|dark)"/,
      /data-mui-internal-clone-element="true"/,

      // MUI's emotion-based specific patterns
      /private-mui-(?:x-id|focusVisible|hidden|root|colorAction)/,
      /StyledEngineProvider\s+injectFirst/,

      // MUI's specific theme tokens
      /var\(--mui-(?:palette|typography|spacing|shadows|shape|zIndex|transitions)-[^)]+\)/,

      // MUI's specific component imports
      /import\s+{\s*(?:\w+\s*,\s*)*\w+\s*}\s+from\s+["']@mui\/(?:material|system|base|joy-ui|icons-material)["']/,

      // MUI's specific style overrides
      /components:\s*{\s*MuiButton:\s*{[^}]+}\s*}/,
      /styleOverrides:\s*{\s*root:\s*{[^}]+}\s*}/,

      // MUI's specific system props
      /data-mui-base-(?:button|select|slider|switch|tabs|input)/,
      /aria-(?:owns|controls|haspopup|expanded)="mui-[^"]+"/,

      // MUI's specific Portal implementation
      /id="modal-[^"]+"\s+role="presentation"\s+class="MuiModal-root/,
      /id="menu-[^"]+"\s+role="menu"\s+class="MuiMenu-list/,

      // MUI's specific theme customization
      /createTheme\(\{\s*palette:\s*{\s*primary:\s*{[^}]+}\s*}\s*\}/,
      /ThemeProvider\s+theme=\{(?:darkTheme|lightTheme|customTheme)\}/,

      // MUI's specific error messages
      /Material-UI:/,
      /MUI: /,

      // MUI's specific CSS injection order
      /data-mui-inject-first="true"/,
      /data-emotion="mui(?:-[a-z]+)?"/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for MUI's specific component structure
          hasMuiComponents: [
            '.MuiButtonBase-root[tabindex="0"]',
            '.MuiButton-containedPrimary',
            '.MuiMenuItem-dense',
            '.MuiInputBase-input',
          ].some((selector) => document.querySelector(selector) !== null),

          // Check for MUI's emotion implementation
          hasEmotionStructure: [
            'style[data-emotion="mui"]',
            'style[data-emotion="mui-baseButton"]',
            '[data-mui-internal-clone-element]',
          ].some((selector) => document.querySelector(selector) !== null),

          // Check for MUI's portal implementation
          hasPortals: [
            '#modal-root [role="presentation"].MuiModal-root',
            '#menu-root [role="menu"].MuiMenu-list',
            '#popover-root [role="tooltip"].MuiTooltip-popper',
          ].some((selector) => document.querySelector(selector) !== null),

          // Check for MUI's theme tokens
          hasThemeTokens: getComputedStyle(
            document.documentElement
          ).cssText.includes('--mui-'),
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // MUI core package files
      /@mui\/(?:material|system|base|joy-ui)\/(?:esm|umd|cjs)\//,
      /@mui\/material(?:@[\d.]+)?\/(?:Button|Modal|Menu|Tabs|TextField)/,

      // MUI build artifacts
      /mui-(?:production|development)-bundle\.[a-f0-9]{8}\.js$/,
      /mui-base-(?:auto|manual)\.(?:esm|umd)\.js$/,

      // MUI icon package files
      /@mui\/icons-material\/(?:[A-Z][a-zA-Z]+Icon)$/,

      // MUI theme files
      /mui-theme\.(?:js|ts)$/,
      /theme\.mui\.(?:js|ts)$/,

      // MUI style injection
      /emotion-(?:cache|element)-mui\.js$/,
      /StyledEngine-mui\.[a-f0-9]{8}\.js$/,

      // MUI specific chunks
      /chunk-mui-(?:core|utils|icons)-[a-f0-9]{8}\.js$/,
      /vendors-mui-[a-z-]+\.[a-f0-9]{8}\.js$/,
    ],
  },
];
