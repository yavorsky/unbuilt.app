import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const sentry: Meta = {
  name: 'Sentry',
  website: 'https://sentry.io/',
  description:
    'Application monitoring software considered "not bad" by 4 million developers.',
  Icon: lazy(() => import('./icons/sentry.jsx')),
};
