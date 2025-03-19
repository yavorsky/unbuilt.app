import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const mixpanel: Meta = {
  name: 'Mixpanel',
  website: 'https://mixpanel.com/',
  description:
    'Analytics that makes it easy to get answers, make decisions, and show the impact of your product and marketing investments.',
  Icon: lazy(() => import('./icons/mixpanel.jsx')),
};
