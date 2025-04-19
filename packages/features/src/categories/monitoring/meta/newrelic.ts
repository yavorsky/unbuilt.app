import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const newrelic: Meta = {
  name: 'New Relic',
  website: 'https://newrelic.com/',
  description:
    'Application performance monitoring and observability platform for software analytics.',
  Icon: lazy(() => import('./icons/newrelic.jsx')),
};
