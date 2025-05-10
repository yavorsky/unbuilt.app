import { Page } from 'playwright';

export const elasticapm = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasElasticApm: !!window.elasticApm,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'errorLogging' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!window.elasticApm?.serviceFactory?.instances?.ErrorLogging;
      });
    },
  },
  {
    name: 'logs' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!window.elasticApm?.serviceFactory?.instances?.LoggingService;
      });
    },
  },
  {
    name: 'performance' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!window.elasticApm?.serviceFactory?.instances
          ?.PerformanceMonitoring;
      });
    },
  },
  {
    name: 'transactions' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!window.elasticApm?.serviceFactory?.instances
          ?.TransactionService;
      });
    },
  },
  {
    name: 'cookie' as const,
    score: 1.2,
    browser: async (page: Page) => {
      const cookies = await page.context().cookies();
      return cookies.some((cookie) => /_clck|_clsk/.test(cookie.name));
    },
  },
  {
    name: 'core' as const,
    score: 1,
    scripts: [
      /prefix:\s*['"']\[Elastic APM] ['"']/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.log\(['"']\[Elastic APM] platform is not supported!['"']\)/,
      /distributedTracingHeaderName:['"']elastic-apm-traceparent['"']/,
      /getElasticScript:[a-zA-Z_$][a-zA-Z0-9_$]*/,
      /this\._configService\.get\(['"']similarSpanThreshold['"']\)/,
    ],
  },
];
