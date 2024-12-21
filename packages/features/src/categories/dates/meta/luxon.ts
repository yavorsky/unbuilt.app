import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const luxon: Meta = {
  name: 'Day.js',
  website: 'https://date-fns.org/',
  description: 'Modern JavaScript date utility library',
  Icon: lazy(() => import('./icons/luxon.jsx')),
};
