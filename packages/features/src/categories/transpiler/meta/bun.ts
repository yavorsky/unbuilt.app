import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const bun: Meta = {
  name: 'Bun',
  website: 'https://bun.sh/',
  description:
    'Modern JavaScript/TypeScript bundler with a focus on performance and developer experience.',
  Icon: lazy(() => import('./icons/bun.jsx')),
};
