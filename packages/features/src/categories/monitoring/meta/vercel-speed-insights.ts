import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const vercelSpeedInsights: Meta = {
  name: 'Vercel Speed Insights',
  website: 'https://vercel.com/docs/speed-insights',
  description:
    'Vercel Speed Insights provides you with a detailed view of your website performance metrics, based on Core Web Vitals, enabling you to make data-driven decisions for optimizing your site.',
  Icon: lazy(() => import('./icons/vercel-speed-insights.jsx')),
};
