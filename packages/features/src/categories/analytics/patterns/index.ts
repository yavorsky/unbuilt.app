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
import { splitbee } from './splitbee.js';
import { umami } from './umami.js';
import { vercelAnalytics } from './vercel-analytics.jsx';

export const patterns = {
  amplitude,
  fathom,
  googleAnalytics,
  posthog,
  countly,
  splitbee,
  matomo,
  mixpanel,
  hotjar,
  heap,
  plausible,
  clarity,
  umami,
  vercelAnalytics,
} as const;
