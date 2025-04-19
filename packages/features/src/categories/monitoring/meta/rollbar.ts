import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const rollbar: Meta = {
  name: 'Rollbar',
  website: 'https://rollbar.com/',
  description:
    'Real-time error monitoring and debugging tool with detailed error reporting.',
  Icon: lazy(() => import('./icons/rollbar.jsx')),
};
