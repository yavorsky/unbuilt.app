import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const turbopack: Meta = {
  name: 'Turbopack',
  website: 'https://turbopack.dev/',
  description: 'A bundler for modern web applications',
  Icon: lazy(() => import('./icons/turbopack.jsx')),
};
