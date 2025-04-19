import { Page } from 'playwright';

export const trackjs = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasTrackJs: !!window.trackJs,
          hasTrackJsConstructor: !!window.TrackJS,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'cookie' as const,
    score: 1.2,
    browser: async (page: Page) => {
      const cookies = await page.context().cookies();
      return cookies.some((cookie) => /TRACKJS_/.test(cookie.name));
    },
  },
  {
    name: 'trackjs-runtime' as const,
    score: 1.2,
    scripts: [
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.__trackjs_state__/,
      /['"']trackjs-correlation-id['"']/,
      /this\._trackJs\.logId/,
      /this\._trackJs\.method/,
      /Error\(['"']TrackJS Caught: /,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.__trackjs_element_text/,
      /console\.warn\(['"']\[TrackJS] invalid config['"']\)/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/trackjs\.com/],
  },
];
