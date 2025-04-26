import { sentry } from './sentry.js';
import { rollbar } from './rollbar.js';
import { newrelic } from './newrelic.js';
import { trackjs } from './trackjs.js';
import { datadog } from './datadog.js';
import { airbrake } from './airbrake.js';
import { honeybadger } from './honeybadger.js';
import { appdynamics } from './appdynamics.js';
import { atatus } from './atatus.js';
import { elasticapm } from './elasticapm.js';
import { instana } from './instana.js';
import { raygun } from './raygun.js';
import { vercelSpeedInsights } from './vercel-speed-insights.js';

export const meta = {
  sentry,
  rollbar,
  newrelic,
  airbrake,
  vercelSpeedInsights,
  atatus,
  instana,
  raygun,
  honeybadger,
  appdynamics,
  elasticapm,
  trackjs,
  datadog,
} as const;
