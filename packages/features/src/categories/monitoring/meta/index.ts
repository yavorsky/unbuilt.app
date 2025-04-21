import { sentry } from './sentry.js';
import { rollbar } from './rollbar.js';
import { newrelic } from './newrelic.js';
import { trackjs } from './trackjs.js';
import { datadog } from './datadog.js';
import { airbrake } from './airbrake.js';
import { honeybadger } from './honeybadger.js';
import { appdynamics } from './appdynamics.js';

export const meta = {
  sentry,
  rollbar,
  newrelic,
  airbrake,
  honeybadger,
  appdynamics,
  trackjs,
  datadog,
} as const;
