import { sentry } from './sentry.js';
import { rollbar } from './rollbar.js';
import { newrelic } from './newrelic.js';
import { trackjs } from './trackjs.js';
import { datadog } from './datadog.js';

export const meta = {
  sentry,
  rollbar,
  newrelic,
  trackjs,
  datadog,
} as const;
