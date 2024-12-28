import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const esbuild: Meta = {
  name: 'ESBuild',
  website: 'https://esbuild.github.io/',
  description: 'An extremely fast JavaScript bundler and minifier',
  Icon: lazy(() => import('../../bundler/meta/icons/esbuild.jsx')),
};
