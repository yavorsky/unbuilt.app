import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const babel: Meta = {
  name: 'Babel',
  website: 'https://babel.dev/',
  description:
    'A JavaScript compiler that allows developers to use next-generation JavaScript, today.',
  Icon: lazy(() => import('./icons/babel.jsx')),
};
