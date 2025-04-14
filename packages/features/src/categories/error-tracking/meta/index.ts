import { sentry } from './sentry.js';
import { rollbar } from './rollbar.js';

export const meta = {
  sentry,
  rollbar,
} as const;
