import { sentry } from './sentry.js';
import { rollbar } from './rollbar.js';
import { newrelic } from './newrelic.js';
import { raygun } from './raygun.js';
import { trackjs } from './trackjs.js';
import { datadog } from './datadog.js';
import { airbrake } from './airbrake.js';

export const patterns = {
  sentry,
  rollbar,
  newrelic,
  trackjs,
  airbrake,
  raygun,
  datadog,
} as const;
