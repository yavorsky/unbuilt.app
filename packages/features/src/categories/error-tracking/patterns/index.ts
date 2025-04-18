import { sentry } from './sentry.js';
import { rollbar } from './rollbar.js';
import { newrelic } from './newrelic.js';
import { raygun } from './raygun.js';

export const patterns = {
  sentry,
  rollbar,
  newrelic,
  raygun,
} as const;
