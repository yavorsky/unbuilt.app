import { sentry } from './sentry.js';
import { rollbar } from './rollbar.js';
import { newrelic } from './newrelic.js';
import { raygun } from './raygun.js';
import { trackjs } from './trackjs.js';
import { datadog } from './datadog.js';

export const patterns = {
  sentry,
  rollbar,
  newrelic,
  trackjs,
  raygun,
  datadog,
} as const;
