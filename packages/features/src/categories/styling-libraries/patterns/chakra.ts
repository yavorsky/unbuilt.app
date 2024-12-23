import { Page } from 'playwright';

export const chakra = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Chakra's unique data attributes
      /data-chakra-component="(?:Button|Modal|Tooltip|Popover|Menu|Drawer|Alert|Toast)"/,
      /data-popper-(?:reference-hidden|escaped|placement)="chakra-[^"]+"/,

      // Chakra's specific styling attributes
      /data-theme-color="chakra-[^"]+"/,
      /data-theme="chakra-ui-(?:light|dark)"/,

      // Chakra's unique class prefixes for components
      /chakra-(?:button|modal|menu|popover|toast|drawer|alert|form)__[a-zA-Z-]+/,
      /chakra-(?:stack|wrap|container|box|text|heading|link)(?:-[a-zA-Z]+)?/,

      // Chakra's specific animation classes
      /chakra-(?:fade|scale|slide)-(?:bottom|top|left|right)(?:-enter|-exit|-enter-active|-exit-active)?/,

      // Chakra's portal and overlay specific classes
      /chakra-portal-(?:zIndex|overlay|content)/,
      /chakra-modal-(?:overlay|content-wrapper|body|header|footer)/,

      // Chakra's specific error boundaries
      /chakra-error-boundary/,
      /chakra-strict-mode-warning/,

      // Chakra's unique theming tokens
      /var\(--chakra-(?:colors|sizes|fonts|space|radii|shadows)-[^)]+\)/,

      // Chakra's specific hooks in React components
      /useChakra(?:Context|ColorMode|Theme|Toast|Disclosure|Modal|Menu|Tabs)/,

      // Chakra's style props patterns
      /_(?:hover|active|focus|disabled|invalid|checked|expanded|selected)="chakra-[^"]+"/,
      /sx=\{[\s\S]*?_(?:hover|focus|active):/,

      // Chakra's unique component imports
      /import\s+{\s*(?:\w+\s*,\s*)*\w+\s*}\s+from\s+["']@chakra-ui\/(?:react|core|icons|system|theme|hooks)["']/,

      // Chakra's theme customization
      /ChakraProvider\s+theme=\{[^}]+\}/,
      /extendTheme\(\{[^}]+\}\)/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Chakra's specific component structure
          hasChakraComponents: [
            '[data-chakra-component]',
            '[class^="chakra-"][role]',
            '.chakra-portal',
          ].some((selector) => document.querySelector(selector) !== null),

          // Check for Chakra's unique modal structure
          hasModalStructure: [
            '.chakra-modal-overlay',
            '.chakra-modal-content-wrapper',
            '.chakra-modal__content-container',
          ].some((selector) => document.querySelector(selector) !== null),

          // Check for Chakra's specific theme variables
          hasChakraTheming: getComputedStyle(
            document.documentElement
          ).cssText.includes('--chakra-'),

          // Check for Chakra's portal implementation
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
      // Core Chakra UI files
      /@chakra-ui\/(?:react|core|icons|system|theme|hooks)/,
      /chakra-ui-core(?:@[\d.]+)?(?:\.min)?\.js$/,

      // Chakra specific build outputs
      /chakra-(?:components|theme|utils)\.[a-f0-9]{8}\.js$/,

      // Theme files
      /chakra-theme\.(?:js|ts)$/,
      /theme\.chakra\.(?:js|ts)$/,

      // Component specific chunks
      /chunk-chakra-[a-z-]+\.[a-f0-9]{8}\.js$/,
      /chakra-[a-z-]+-[a-f0-9]{8}\.js$/,

      // Icon package specific files
      /@chakra-ui\/icons(?:-[a-z]+)?(?:@[\d.]+)?\.js$/,

      // Emotion (Chakra's styling engine) integration
      /emotion-cache-chakra/,
      /emotion-element-chakra/,
    ],
  },
];
