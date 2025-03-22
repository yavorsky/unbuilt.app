import { amplitude } from './amplitude.js';
import { fathom } from './fathom.js';
import { googleAnalytics } from './google-analytics.js';
import { matomo } from './matomo.js';
import { mixpanel } from './mixpanel.js';
import { plausible } from './plausible.js';
import { umami } from './umami.js';
import { vercelAnalytics } from './vercel-analytics.jsx';

export const patterns = {
  amplitude,
  fathom,
  googleAnalytics,
  matomo,
  mixpanel,
  plausible,
  umami,
  vercelAnalytics,
} as const;
