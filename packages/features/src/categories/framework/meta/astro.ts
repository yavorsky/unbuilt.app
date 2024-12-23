import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const astro: Meta = {
  name: 'Astro',
  website: 'https://astro.build',
  tags: ['Static Site Generator'],
  description:
    'A new kind of static site builder. Astro combines the simplicity of static site generation with the power of server-rendered sites.',
  Icon: lazy(() => import('./icons/astro.jsx')),
};
