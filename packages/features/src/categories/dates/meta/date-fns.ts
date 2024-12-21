import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const dateFns: Meta = {
  name: 'date-fns',
  website: 'https://date-fns.org/',
  description: 'Modern JavaScript date utility library',
  Icon: lazy(() => import('./icons/date-fns.jsx')),
};
