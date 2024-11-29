import { Page } from 'playwright';

export const chakra = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Core Chakra classes and attributes
      /chakra-/,
      /data-theme/,
      /css-[a-zA-Z0-9]+/,  // Emotion-based classes

      // Component patterns
      /(?:^|\s)(?:chakra-(?:button|text|stack|flex|box|container|input|select|modal))/,

      // Common Chakra hooks and imports
      /ChakraProvider/,
      /useTheme/,
      /useColorMode/,
      /useDisclosure/,
      /extendTheme/,

      // Styling props and patterns
      /_hover|_focus|_active/,
      /colorScheme=/,
      /variant=/,
      /size=/,

      // Theme tokens
      /--chakra-[\w-]+/,
      /var\(--chakra-/,

      // Emotion-based patterns (used by Chakra)
      /emotion-cache/,
      /emotion-element/,
      /emotion-styled/,

      // Portal and modal patterns
      /chakra-portal/,
      /chakra-modal/,
      /chakra-toast/,

      // Common minified patterns
      /css-[\w]{6,}/,
      /\[data-theme\]/,
      /\[data-placement\]/
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Core class checks
          hasChakraClasses: document.querySelector('[class*="chakra-"]') !== null,

          // CSS custom properties
          hasChakraTokens: !!document.querySelector('style[data-emotion]'),

          // Theme attributes
          hasThemeAttributes: document.querySelector('[data-theme], [data-placement]') !== null,

          // Component structure checks
          hasComponents: !!(
            document.querySelector('.chakra-button') ||
            document.querySelector('.chakra-text') ||
            document.querySelector('.chakra-stack') ||
            document.querySelector('.chakra-container')
          ),

          // Portal checks
          hasPortals: !!document.querySelector('.chakra-portal, .chakra-modal__content-container'),

          // Emotion integration
          hasEmotionClasses: document.querySelector('[class^="css-"]') !== null,

          // Color mode script
          hasColorModeScript: !!document.querySelector('script[id="chakra-script"]')
        };

        return Object.values(markers).some(Boolean);
      });
    }
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Package files
      /@chakra-ui/,
      /chakra-ui/,

      // Common build outputs
      /chakra\.[\w-]+\.js$/,
      /chakra-ui\.[a-f0-9]+\.js$/,

      // Chunk names
      /vendors~chakra\.[a-f0-9]+\.js$/,
      /chunk-chakra-[\w-]+\.js$/,

      // Theme files
      /theme\.[a-f0-9]+\.js$/,
      /chakra-theme\.js$/
    ]
  }
]
