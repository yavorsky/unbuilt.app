import { Meta } from '../../../types/meta.js';
import { lazy } from 'react';

export const tailwindCSS: Meta = {
  name: 'Tailwind CSS',
  website: 'https://tailwindcss.com',
  description:
    'A utility-first CSS framework for rapidly building custom designs.',
  Icon: lazy(() => import('./icons/tailwind-css.jsx')),
};
