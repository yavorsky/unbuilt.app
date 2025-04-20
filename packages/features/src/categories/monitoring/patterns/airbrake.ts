import { Page } from 'playwright';

export const sentry = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasAirbrake: !!window.Airbrake,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'core' as const,
    score: 1,
    scripts: [
      /console\.error\(['"']airbrake: span=%s does not exist/,
      /new Error\(['"']airbrake: unauthorized: project id or key are wrong['"']\)/,
      /new Error\(['"']airbrake: IP is rate limited['"']\)/,
      /throw new Error\(['"']airbrake: fetch: unexpected response: code=/,
      /new Error\(['"']airbrake: request: response statusCode is/,
      /['"']airbrake-js\/browser['"']/,
      /\{\s*name:\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*,\s*version:\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*,\s*url:\s*['"']https:\/\/github\.com\/airbrake\/airbrake-js\/tree\/master\/packages\/browser['"']\s*\},/,
      /new Error\(['"']airbrake: not sending this error, errorNotifications is disabled err=/,
      /new Error\(['"']airbrake: error is filtered['"']\)/,
      /new Error\(['"']airbrake: notice exceeds max length and can't be truncated['"']\)/,
      /console\.warn\(['"']airbrake: options\.reporter must be a function['"']\)/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\._airbrake\s*=/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/api\.airbrake\.io/, /notifier\-configs\.airbrake\.io/],
  },
];
