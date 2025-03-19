import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const matomo: Meta = {
  name: 'Matomo',
  website: 'https://matomo.org/',
  description:
    'Google Analytics alternative that protects your data and your customers privacy',
  Icon: lazy(() => import('./icons/matomo.jsx')),
};
