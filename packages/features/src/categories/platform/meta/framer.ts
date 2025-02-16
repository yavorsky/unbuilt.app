import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const framer: Meta = {
  name: 'Framer',
  website: 'https://framer.com/',
  tags: ['Website Builder'],
  description:
    'Framer is a platform for building interactive websites and apps.',
  Icon: lazy(() => import('./icons/framer.jsx')),
};
