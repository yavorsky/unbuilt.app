import { Page } from 'playwright';

export const amplitude = [
  {
    name: 'globals' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasAmplitude: !!window.amplitude,
          hasAmplitudeClient: !!window.amplitudeClient,
          hasAmplitudeInstance: !!window.amplitudeInstance,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'script' as const,
    score: 0.9,
    scripts: [
      /this\.amplitudeInstance/,
      /automaticFetchOnAmplitudeIdentityChange/,
      /["']amplitude_unsent_identify["']/,
      /["']amplitude_lastEventId["']/,
      /["']amplitude_sessionId["']/,
    ],
  },
  {
    name: 'cookies' as const,
    score: 1,
    browser: async (page: Page) => {
      const amplitudeCookieRegex = /^AMP_[A-Za-z0-9]+$/;
      const cookies = await page.context().cookies();
      return cookies.some((cookie) => amplitudeCookieRegex.test(cookie.name));
    },
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/cdn\.amplitude\.com|api\.(lab)?\.amplitude\.com/],
  },
];
