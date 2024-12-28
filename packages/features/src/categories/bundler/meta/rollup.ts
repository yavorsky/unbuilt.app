import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const rollup: Meta = {
  name: 'rollup',
  website: 'https://rollupjs.org/',
  description:
    'A module bundler for JavaScript which compiles small pieces of code into something larger and more complex',
  Icon: lazy(() => import('./icons/rollup.jsx')),
};
