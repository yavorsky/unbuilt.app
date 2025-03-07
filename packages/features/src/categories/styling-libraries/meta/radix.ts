import { Meta } from '../../../types/meta.js';
import { lazy } from 'react';

export const radix: Meta = {
  name: 'Radix UI',
  website: 'https://www.radix-ui.com/',
  description:
    'An open source component library optimized for fast development, easy maintenance, and accessibility. Just import and go—no configuration required.',
  Icon: lazy(() => import('./icons/radix.jsx')),
};
