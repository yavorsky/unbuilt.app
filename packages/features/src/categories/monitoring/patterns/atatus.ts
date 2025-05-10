import { Page } from 'playwright';

export const atatus = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasAtatus: !!window.atatus,
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
      return cookies.some((cookie) => /atatus\-/.test(cookie.name));
    },
  },
  {
    name: 'core' as const,
    score: 1.4,
    scripts: [
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.log\(['"']Atatus Reset User['"'], [a-zA-Z_$][a-zA-Z0-9_$]*\)/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.log\(['"']Atatus Set User: Invalid JSON object in LocalStorage['"'], [a-zA-Z_$][a-zA-Z0-9_$]*\)/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.log\(['"']Atatus: Caught unhandled promise rejection:['"'], [a-zA-Z_$][a-zA-Z0-9_$]*\)/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.log\(['"']Atatus API key has not been configured, make sure you call atatus\.config\(yourApiKey\)/,
      /['"']atatusjs=['"']\s*\+\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\+\s*['"']=['"']\s*\+\s*[a-zA-Z_$][a-zA-Z0-9_$]*\.getRandomInt\(\)/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.endsWith\([a-zA-Z_$][a-zA-Z0-9_$]*\.url, ['"']\/atatus\.js['"']\)/,
      /['"']&callback=atatus\._setFeatures&['"']/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.atatus\s*=\s*[a-zA-Z_$][a-zA-Z0-9_$]*/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.postMessage\(['"']RUM_EPISODES:done['"'], [a-zA-Z_$][a-zA-Z0-9_$]*\.targetOrigin\)/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.indexOf\([a-zA-Z_$][a-zA-Z0-9_$]*\.atatusHost\)/,
      /distributedTracingHeaderName:\s*['"']atatus-apm-traceparent['"']/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/atatus\.js/, /atatus\.com/],
  },
];
