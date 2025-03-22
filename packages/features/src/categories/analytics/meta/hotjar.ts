import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const hotjar: Meta = {
  name: 'Hotjar',
  website: 'https://www.hotjar.com/',
  description:
    'Free product that captures how people use your site. Setup is easy and you will start getting data in minutes.',
  Icon: lazy(() => import('./icons/hotjar.jsx')),
};
