import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const vuepress: Meta = {
  name: 'VuePress',
  website: 'https://vuepress.vuejs.org/',
  tags: ['Static Site Generator'],
  description:
    'VuePress is a Vue-powered static site generator from the creator of Vite.',
  Icon: lazy(() => import('./icons/vuepress.jsx')),
};
