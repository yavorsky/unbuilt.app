import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const bootstrap: Meta = {
  name: 'Bootstrap',
  website: 'https://getbootstrap.com/',
  description:
    'The most popular HTML, CSS, and JS library in the world for building responsive, mobile-first projects on the web.',
  Icon: lazy(() => import('./icons/bootstrap.jsx')),
};
