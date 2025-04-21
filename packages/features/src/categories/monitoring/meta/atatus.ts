import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const atatus: Meta = {
  name: 'Atatus',
  website: 'https://www.atatus.com/',
  description: 'Application performance monitoring and analytics.',
  Icon: lazy(() => import('./icons/atatus.jsx')),
};
