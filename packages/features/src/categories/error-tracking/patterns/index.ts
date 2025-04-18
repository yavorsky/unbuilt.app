import { sentry } from './sentry.js';
import { rollbar } from './rollbar.js';
import { newrelic } from './newrelic.js';
import { raygun } from './raygun.js';
import { trackjs } from './trackjs.js';
import { logrocket } from './logrocket.js';

export const patterns = {
  sentry,
  rollbar,
  newrelic,
  trackjs,
  raygun,
  logrocket,
} as const;
