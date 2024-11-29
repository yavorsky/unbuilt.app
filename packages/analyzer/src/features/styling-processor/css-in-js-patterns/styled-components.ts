import { Page } from 'playwright';

export const styledComponents = [
  {
    name: 'compilation' as const,
    score: 0.3,
    runtime: [
      // Core styled-components markers
      /styled\.[\w]+`/,
      /styled\([^)]+\)`/,
      // Generated class names
      /sc-[a-zA-Z0-9]{5,}/,
      /styled-components/,
      // ThemeProvider and related
      /ThemeProvider/,
      /withTheme/,
      // Babel plugin markers
      /css-[\w-]+/,
      /_templateObject/,
      // Global styles
      /createGlobalStyle/,
      /GlobalStyle/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!(
          // Check for styled-components generated classes
          (
            document.querySelector('[class*="sc-"]') ||
            // Check for style tags with styled-components data attr
            document.querySelector('style[data-styled]') ||
            document.querySelector('style[data-styled-components]')
          )
        );
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /styled-components/,
      /\.styled\.[jt]sx?$/,
      /styles\.[jt]sx?$/
    ],
  }
];
