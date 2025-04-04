import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const posthog: Meta = {
  name: 'Posthog',
  website: 'https://posthog.com/',
  description:
    'The single platform to analyze, test, observe, and deploy new features',
  Icon: lazy(() => import('./icons/posthog.jsx')),
};
