import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const bugsnag: Meta = {
  name: 'Bugsnag (Insight Hub)',
  website: 'https://www.bugsnag.com/',
  description:
    'Application insights your developers need without the noise. Data means nothing without context. Get the full picture with secure, scalable error tracking and performance monitoring.',
  Icon: lazy(() => import('./icons/bugsnag.jsx')),
};
