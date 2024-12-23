import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const remix: Meta = {
  name: 'Remix',
  website: 'https://remix.run/',
  tags: ['Application Framework'],
  description:
    'Framework for building web applications with React, server rendering, and zero build configuration.',
  Icon: lazy(() => import('./icons/remix.jsx')),
};
