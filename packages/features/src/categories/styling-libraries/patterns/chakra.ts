import { Page } from 'playwright';

export const chakra = [
  {
    name: 'compilation' as const,
    score: 0.6,
    runtime: [
      // Optimized component attributes - combined with length limits
      /data-chakra-component="(?:Button|Modal|Tooltip|Popover|Menu|Drawer|Alert|Toast)"/,
      /data-popper-(?:reference-hidden|escaped|placement)="chakra-[^"]{1,50}"/,

      // Optimized theme attributes - bounded
      /data-theme-color="chakra-[^"]{1,30}"/,
      /data-theme="chakra-ui-(?:light|dark)"/,

      // Optimized class prefixes - consolidated with length limits
      /chakra-(?:button|modal|menu|popover|toast|drawer|alert|form)__[a-zA-Z-]{1,30}\b/,
      /chakra-(?:stack|wrap|container|box|text|heading|link)(?:-[a-zA-Z]{1,20})?\b/,

      // Optimized animation classes - combined pattern
      /chakra-(?:fade|scale|slide)-(?:bottom|top|left|right)(?:-(?:enter|exit)(?:-active)?)?\b/,

      // Optimized portal classes - consolidated
      /chakra-(?:portal-(?:zIndex|overlay|content)|modal-(?:overlay|content-wrapper|body|header|footer))\b/,

      // Optimized error boundaries - already optimal
      /chakra-(?:error-boundary|strict-mode-warning)\b/,

      // Optimized theme tokens - bounded search
      /var\(--chakra-(?:colors|sizes|fonts|space|radii|shadows)-[^)]{1,50}\)/,

      // Optimized hooks - combined pattern
      /useChakra(?:Context|ColorMode|Theme|Toast|Disclosure|Modal|Menu|Tabs)\b/,

      // Optimized style props - added length limits
      /_(?:hover|active|focus|disabled|invalid|checked|expanded|selected)="chakra-[^"]{1,50}"/,
      /sx=\{[^}]{0,500}?_(?:hover|focus|active):/,

      // Optimized imports - bounded search
      /import\s+\{[^}]{1,200}\}\s+from\s+["']@chakra-ui\/(?:react|core|icons|system|theme|hooks)["']/,

      // Optimized theme customization - added length limits
      /ChakraProvider\s+theme=\{[^}]{1,500}\}/,
      /extendTheme\(\{[^}]{1,500}\}\)/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.7,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Optimized component checks - single query
          hasChakraComponents:
            document.querySelector(
              '[data-chakra-component], [class^="chakra-"][role], .chakra-portal'
            ) !== null,

          // Optimized modal structure - single query
          hasModalStructure:
            document.querySelector(
              '.chakra-modal-overlay, .chakra-modal-content-wrapper, .chakra-modal__content-container'
            ) !== null,

          // Optimized theme check - cache computed style
          hasChakraTheming:
            document.documentElement.style.cssText?.includes('--chakra-'),

          // Optimized portal check - more specific selector
          hasChakraPortals:
            document.querySelector(
              '#chakra-toast-portal, #chakra-modal-portal'
            ) !== null,
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
      /@chakra-ui\/(?:react|core|icons|system|theme|hooks)\b/,
      /chakra-ui-core(?:@[\d.]{1,10})?(?:\.min)?\.js$/,

      // Optimized build outputs - added length limits
      /chakra-(?:components|theme|utils)\.[a-f0-9]{8}\.js$/,

      // Optimized theme files - combined patterns
      /(?:chakra-theme|theme\.chakra)\.(?:js|ts)$/,

      // Optimized component chunks - added length limits
      /chunk-chakra-[a-z-]{1,30}\.[a-f0-9]{8}\.js$/,
      /chakra-[a-z-]{1,30}-[a-f0-9]{8}\.js$/,

      // Optimized icon files - added version length limit
      /@chakra-ui\/icons(?:-[a-z]+)?(?:@[\d.]{1,10})?\b\.js$/,

      // Optimized emotion integration - combined pattern
      /emotion-(?:cache|element)-chakra\b/,
    ],
  },
];
