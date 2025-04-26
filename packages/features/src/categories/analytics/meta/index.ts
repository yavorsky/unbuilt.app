import { amplitude } from './amplitude.js';
import { clarity } from './clarity.js';
import { countly } from './countly.js';
import { fathom } from './fathom.js';
import { googleAnalytics } from './google-analytics.js';
import { heap } from './heap.js';
import { hotjar } from './hotjar.js';
import { matomo } from './matomo.js';
import { mixpanel } from './mixpanel.js';
import { plausible } from './plausible.js';
import { posthog } from './posthog.js';
import { umami } from './umami.js';
import { vercelAnalytics } from './vercel-analytics.js';

export const meta = {
  amplitude,
  fathom,
  googleAnalytics,
  umami,
  vercelAnalytics,
  posthog,
  countly,
  hotjar,
  heap,
  clarity,
  matomo,
  mixpanel,
  plausible,
} as const;
