import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const vite: Meta = {
  name: 'vite',
  website: 'https://vitejs.dev/',
  description:
    'A build tool that aims to provide a faster and leaner development experience for modern web projects',
  Icon: lazy(() => import('./icons/vite.jsx')),
};
