import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const vercelAnalytics: Meta = {
  name: 'Vercel Analytics',
  website: 'https://vercel.com/analytics',
  description: 'Powerful analytics for every business',
  Icon: lazy(() => import('./icons/vercel-analytics.jsx')),
};
