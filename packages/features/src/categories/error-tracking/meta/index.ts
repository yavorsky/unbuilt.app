import { sentry } from './sentry.js';
import { rollbar } from './rollbar.js';
import { newrelic } from './newrelic.js';
import { trackjs } from './trackjs.js';
import { logrocket } from './logrocket.js';

export const meta = {
  sentry,
  rollbar,
  newrelic,
  trackjs,
  logrocket,
} as const;
