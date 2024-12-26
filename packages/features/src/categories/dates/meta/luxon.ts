import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const luxon: Meta = {
  name: 'Luxon',
  website: 'https://moment.github.io/luxon/',
  description: 'Modern JavaScript date utility library',
  Icon: lazy(() => import('./icons/luxon.jsx')),
};
