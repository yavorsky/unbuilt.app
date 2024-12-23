import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const prepack: Meta = {
  name: 'Prepack',
  website: 'https://prepack.io/',
  description: 'Partial evaluator for JavaScript',
  Icon: lazy(() => import('./icons/prepack.jsx')),
};
