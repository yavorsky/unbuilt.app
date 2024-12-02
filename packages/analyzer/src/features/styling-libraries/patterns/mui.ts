import { Page } from 'playwright';

export const mui = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Core class patterns (minified-friendly)
      /(?:mui|Mui)[A-Z][\w-]*/,
      /(?:[^a-zA-Z]|^)Mui(?:Button|Box|Grid|Paper|Card|Dialog|Menu|List|Tab)/,

      // Common minified patterns
      /[a-zA-Z]\.mui/,
      /\.mui-[\w-]+/,
      /css-[\w-]+/,

      // Emotion-based classnames (MUI v5)
      /css-[\w-]{5,}/,
      /private-[\w-]{5,}/,

      // Theme and styling (minified-friendly)
      /createTheme|useTheme|makeStyles/,
      /ThemeProvider/,
      /withStyles/,
      /sx:/,

      // MUI internals that survive minification
      /__mui/,
      /mui-[a-z0-9]{5,}/,
      /\[\&_\.Mui/,
      /\[data-mui-/,

      // Common props that survive minification
      /component=/,
      /variant=/,
      /elevation=/,
      /severity=/,
      /color=/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for any MUI-like classes (including minified)
          hasMuiClasses:
            document.querySelector('*[class*="mui-"], *[class*="Mui"]') !==
            null,

          // Emotion classes (survives minification)
          hasEmotionClasses:
            document.querySelector('*[class^="css-"]') !== null,

          // Data attributes (often preserved in minification)
          hasMuiAttributes:
            document.querySelector('[data-mui], [aria-labelledby]') !== null,

          // Common MUI DOM structures
          hasCommonStructures: !!(
            document.querySelector('button.MuiButton') ||
            document.querySelector('div.MuiPaper') ||
            document.querySelector('div.MuiGrid') ||
            document.querySelector('div[role="presentation"]') ||
            document.querySelector('div[role="dialog"]')
          ),

          // Style tags (Emotion/MUI specific)
          hasStyleTags: !!(
            document.querySelector('style[data-emotion]') ||
            document.querySelector('style[data-mui-color-scheme]')
          ),
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // These patterns usually survive minification in imports
      /mui/,
      /material/,
      /\.mui\./,
      /mui\.[a-f0-9]+\.js$/,
      /material\.[a-f0-9]+\.js$/,
      /chunk\.[\w-]+\.js$/, // Check content for MUI patterns
    ],
  },
];
