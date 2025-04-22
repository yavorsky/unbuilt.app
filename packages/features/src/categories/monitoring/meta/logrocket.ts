import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const logrocket: Meta = {
  name: 'LogRocket',
  website: 'https://logrocket.com/',
  description:
    'Session replay, performance monitoring, and error tracking for web applications.',
  Icon: lazy(() => import('./icons/logrocket.jsx')),
};
