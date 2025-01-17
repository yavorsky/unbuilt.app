import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const typescript: Meta = {
  name: 'TypeScript',
  website: 'https://www.typescriptlang.org/',
  description:
    'Typed superset of JavaScript that compiles to plain JavaScript.',
  Icon: lazy(() => import('./icons/typescript.jsx')),
};
