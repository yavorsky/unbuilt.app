import { lazy } from 'react';
import { Meta } from '../../../../types/meta.js';

export const stitches: Meta = {
  name: 'Stitches',
  website: 'https://stitches.dev',
  tags: ['CSS-in-JS'],
  description:
    'Utility-first CSS-in-JS framework that allows you to build design systems with minimal effort. It is a low-level framework that provides a set of utility functions to help you build your own design system.',
  Icon: lazy(() => import('./icons/stitches.jsx')),
};
