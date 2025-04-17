import { sentry } from './sentry.js';
import { rollbar } from './rollbar.js';
import { newrelic } from './newrelic.js';

export const patterns = {
  sentry,
  rollbar,
  newrelic,
} as const;
