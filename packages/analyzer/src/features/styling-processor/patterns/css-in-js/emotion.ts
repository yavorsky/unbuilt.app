import { Page } from 'playwright';

export const emotion = [
  {
    name: 'compilation' as const,
    score: 0.3,
    runtime: [
      // Emotion core patterns
      /css`/,
      /css\({/,
      // Generated class names
      /css-[a-zA-Z0-9]{5,}/,
      /@emotion\/styled/,
      /@emotion\/react/,
      // JSX Pragma
      /\/\*\s*@jsx\s+jsx\s*\*\//,
      // Theme usage
      /ThemeProvider/,
      /useTheme/,
      // Babel plugin markers
      /_css\$[0-9]+/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!(
          // Check for Emotion generated classes
          (
            document.querySelector('[class*="css-"]') ||
            // Check for Emotion style tags
            document.querySelector('style[data-emotion]')
          )
        );
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [/@emotion\/styled/, /@emotion\/react/, /\.emotion\.[jt]sx?$/],
  },
];
