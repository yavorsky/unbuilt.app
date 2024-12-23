import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const vitepress: Meta = {
  name: 'VitePress',
  website: 'https://vitepress.dev',
  tags: ['Static Site Generator'],
  description:
    'VitePress is a Vue-powered static site generator from the creator of Vite.',
  Icon: lazy(() => import('./icons/vitepress.jsx')),
};
