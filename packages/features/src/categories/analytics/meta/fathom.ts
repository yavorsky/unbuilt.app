import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const fathom: Meta = {
  name: 'Fathom',
  website: 'https://fathom.com/',
  description: 'Powerful analytics for every business',
  Icon: lazy(() => import('./icons/fathom.jsx')),
};
