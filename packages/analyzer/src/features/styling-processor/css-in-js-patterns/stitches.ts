import { Page } from 'playwright';

export const stitches = [
  {
    name: 'compilation' as const,
    score: 0.3,
    runtime: [
      // Stitches specific
      /@stitches\/react/,
      /createStitches/,
      /styled\(/,
      // Generated class names
      /[a-zA-Z0-9]{5,}-[a-zA-Z0-9]{5,}/,
      // Theme tokens
      /\$[\w-]+/,
      // Variants
      /variants:/,
      /compoundVariants:/
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Stitches uses specific class naming pattern
        const stitchesPattern = /[a-zA-Z0-9]{5,}-[a-zA-Z0-9]{5,}/;
        return Array.from(document.querySelectorAll('*')).some(el =>
          Array.from(el.classList).some(className => stitchesPattern.test(className))
        );
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /@stitches\/react/,
      /\.stitches\.[jt]sx?$/,
      /stitches\.config\.[jt]s$/
    ],
  }
];
