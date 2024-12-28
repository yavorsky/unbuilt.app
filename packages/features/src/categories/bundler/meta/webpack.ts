import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const webpack: Meta = {
  name: 'Webpack',
  website: 'https://webpack.js.org/',
  description: 'A static module bundler for modern JavaScript applications',
  Icon: lazy(() => import('./icons/webpack.jsx')),
};
