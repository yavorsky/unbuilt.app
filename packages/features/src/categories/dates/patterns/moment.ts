import { Page } from 'playwright';

export const moment = [
  {
    name: 'coreImplementation' as const,
    score: 0.5,
    scripts: [
      // Moment's internal object check
      /obj\._isAMomentObject/,
      /instanceof\s+Moment/,

      // Moment's specific version checks
      /moment\.version\s*===\s*undefined\s*&&\s*moment\.default/,
      /typeof\s+moment\.version\s*!==\s*['"]string['"]/,

      // Moment's specific error messages
      /'Moment Timezone requires Moment\.js\. See https:\/\/momentjs\.com\/timezone\/docs\/#\/use-it\/browser\/'/,
      /"Moment Timezone setDefault\(\) requires Moment\.js >= [0-9.]+/,
    ],
  },
  {
    name: 'hooksSystem' as const,
    score: 0.6,
    scripts: [
      // Moment's hooks system - highly specific to moment.js
      /hooks\.version\s*=\s*['"][0-9.]+['"]/,
      /hooks\.fn\s*=\s*proto/,
      /hooks\.(?:min|max|now|utc|unix|months|isDate)\s*=\s*/,

      // Moment's specific hook callback setup
      /setHookCallback\(createLocal\)/,
    ],
  },
  {
    name: 'userUsage' as const,
    score: 0.7,
    scripts: [
      // Common moment.js usage patterns
      /moment\(["'][^'"]+["']\)/,
      /moment\.locale\(["'][a-zA-Z-]+["']\)/,

      // Moment timezone specific usage
      /moment\.tz\(["'][^'"]+["']\)/,
      /moment\.tz\.zone\(/,
    ],
  },
  {
    // Runtime detection through browser globals
    name: 'runtime-check' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasMoment: typeof window.moment !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
];
