import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const esbuild: Meta = {
  name: 'esbuild',
  website: 'https://esbuild.github.io/',
  description: 'An extremely fast JavaScript bundler and minifier',
  Icon: lazy(() => import('./icons/esbuild.jsx')),
};
