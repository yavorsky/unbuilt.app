import { Meta } from '../../../types/meta.js';
import { lazy } from 'react';

export const shadcn: Meta = {
  name: 'shadcn/ui',
  website: 'https://ui.shadcn.com',
  description:
    'A set of high-quality React components out of the box. It is written in TypeScript with predictable static types.',
  Icon: lazy(() => import('./icons/shadcn.jsx')),
};
