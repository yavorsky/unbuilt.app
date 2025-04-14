import { sentry } from './sentry.js';
import { rollbar } from './rollbar.js';

export const patterns = {
  sentry,
  rollbar,
} as const;
