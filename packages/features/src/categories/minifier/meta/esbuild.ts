import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const esbuild: Meta = {
  name: 'Closure',
  website: 'https://developers.google.com/closure/compiler',
  description: 'JavaScript minifier and optimizer',
  Icon: lazy(() => import('../../bundler/meta/icons/esbuild.jsx')),
};
