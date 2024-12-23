import { Meta } from '../../../types/meta.js';
import { lazy } from 'react';

export const lucide: Meta = {
  name: 'Lucide',
  website: 'https://lucide.dev/',
  description: 'Simply beautiful open-source icons',
  Icon: lazy(() => import('./icons/lucide.jsx')),
};
