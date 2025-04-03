import { amplitude } from './amplitude.js';
import { clarity } from './clarity.js';
import { fathom } from './fathom.js';
import { googleAnalytics } from './google-analytics.js';
import { hotjar } from './hotjar.js';
import { matomo } from './matomo.js';
import { mixpanel } from './mixpanel.js';
import { plausible } from './plausible.js';
import { posthog } from './posthog.js';
import { umami } from './umami.js';
import { vercelAnalytics } from './vercel-analytics.jsx';

export const patterns = {
  amplitude,
  fathom,
  googleAnalytics,
  posthog,
  matomo,
  mixpanel,
  hotjar,
  plausible,
  clarity,
  umami,
  vercelAnalytics,
} as const;
