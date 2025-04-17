import { sentry } from './sentry.js';
import { rollbar } from './rollbar.js';
import { raygun } from './raygun.js';

export const patterns = {
  sentry,
  rollbar,
  raygun,
} as const;
