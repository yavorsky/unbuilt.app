import { Page } from 'playwright';

export const vercelSpeedInsights = [
  {
    name: 'speedInsights' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasVercelSpeedInsights:
            typeof window.si === 'function' &&
            /['"']beforeSend['"']/.test(window.si.toString()),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'speedInsightsInited' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasVercelSpeedInsights: window.sil === true,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'hasVercelSpeedInsightsScript' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasVercelSpeedInsights: !!document.querySelector(
            '[data-sdkn="@vercel/speed-insights/next"]'
          ),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'core' as const,
    score: 1,
    scripts: [
      /['"']_vercel\/speed-insights\/vitals['"']/,
      /vitals\.vercel-insights\.com\/v2\/vitals\?dsn=/,
      /['"']\[Vercel Speed Insights] Failed to load script/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [
      /_vercel_speed_insights\.js/,
      /vitals\.vercel-insights\.com/,
      /v1\/speed-insights/,
    ],
  },
];
