import { sentry } from './sentry.js';
import { rollbar } from './rollbar.js';
import { newrelic } from './newrelic.js';
import { trackjs } from './trackjs.js';

export const meta = {
  sentry,
  rollbar,
  newrelic,
  trackjs,
} as const;
