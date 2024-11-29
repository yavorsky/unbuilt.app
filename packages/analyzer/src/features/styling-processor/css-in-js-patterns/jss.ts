import { Page } from 'playwright';

export const jss = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // JSS specific
      /jss-[\w-]+/,
      /createUseStyles/,
      /makeStyles/,
      // Generated class names
      /jss[0-9]+-[a-zA-Z0-9]+/,
      // Theme usage
      /withStyles/,
      /withTheme/,
      // JSS syntax
      /createGenerateClassName/
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!(
          // Check for JSS generated classes
          document.querySelector('[class*="jss"]') ||
          // Check for JSS style tags
          document.querySelector('style[data-jss]')
        );
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /react-jss/,
      /\.styles\.[jt]sx?$/,
      /jss\.config\.[jt]s$/
    ]
  }
];
