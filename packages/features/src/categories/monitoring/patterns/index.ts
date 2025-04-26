import { sentry } from './sentry.js';
import { rollbar } from './rollbar.js';
import { newrelic } from './newrelic.js';
import { raygun } from './raygun.js';
import { trackjs } from './trackjs.js';
import { datadog } from './datadog.js';
import { airbrake } from './airbrake.js';
import { honeybadger } from './honeybadger.js';
import { appdynamics } from './appdynamics.js';
import { atatus } from './atatus.js';
import { instana } from './instana.js';
import { elasticapm } from './elasticapm.js';
import { vercelSpeedInsights } from './vercel-speed-insights.js';

export const patterns = {
  sentry,
  rollbar,
  newrelic,
  trackjs,
  airbrake,
  honeybadger,
  vercelSpeedInsights,
  elasticapm,
  instana,
  atatus,
  appdynamics,
  raygun,
  datadog,
} as const;
