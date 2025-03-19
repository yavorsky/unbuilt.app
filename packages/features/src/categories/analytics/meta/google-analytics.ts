import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const googleAnalytics: Meta = {
  name: 'Google Analytics',
  website: 'https://analytics.google.com/',
  description: 'World-class analytics for every business',
  Icon: lazy(() => import('./icons/google-analytics.jsx')),
};
