import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const bisup: Meta = {
  name: 'Bisup',
  website: 'https://www.bisup.com/',
  tags: ['Hosting'],
  description: 'Bisup provides web hosting and cloud infrastructure services.',
  Icon: lazy(() => import('./icons/bisup.jsx')),
};
