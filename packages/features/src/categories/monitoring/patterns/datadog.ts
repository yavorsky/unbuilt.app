import { Page } from 'playwright';

export const datadog = [
  {
    name: 'globalsRum' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasDDRum: !!window.DD_RUM,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'globalsLogs' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasDDLogs: !!window.DD_LOGS,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'globals' as const,
    score: 1.2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasDDSyntheticsPublicId: !!window._DATADOG_SYNTHETICS_PUBLIC_ID,
          hasDDSyntheticsResultId: !!window._DATADOG_SYNTHETICS_RESULT_ID,
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
      return cookies.some((cookie) =>
        /_dd_s|_dd_device_id|dd\-utm/.test(cookie.name)
      );
    },
  },
  {
    name: 'core' as const,
    score: 1,
    scripts: [
      /['"']\/real_user_monitoring\/browser\/troubleshooting['"']/,
      /['"']Datadog Browser SDK:['"']/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\(\)\.DatadogEventBridge/,
      /String\([a-zA-Z_$][a-zA-Z0-9_$]*\.dd_fingerprint\)/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.warn\(['"']PCI compliance for Logs is only available for Datadog organizations in the US1 site\. Default intake will be used\.['"']\)/,
    ],
  },
  {
    name: 'events' as const,
    score: 1,
    scripts: [/[a-zA-Z_$][a-zA-Z0-9_$]*\(\)\.DatadogEventBridge/],
  },
  {
    name: 'rum' as const,
    score: 1,
    scripts: [
      /[a-zA-Z_$][a-zA-Z0-9_$]*\(['"']DD_RUM['"'], [a-zA-Z_$][a-zA-Z0-9_$]*\);/,
      /['"']x-datadog-origin['"']\s*:\s*['"']rum['"']/,
    ],
  },
  {
    name: 'sessionReplay' as const,
    score: 1,
    scripts: [
      /[a-zA-Z_$][a-zA-Z0-9_$]*\([a-zA-Z_$][a-zA-Z0-9_$]*, ['"']Datadog Session Replay/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [
      /datad0g\.com/,
      /dd0g-gov\.com/,
      /datadoghq\.com/,
      /browser-intake-datadoghq\.com/,
    ],
  },
];
