import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const closureMinifier: Meta = {
  name: 'Closure',
  website: 'https://developers.google.com/closure/compiler',
  description: 'JavaScript minifier and optimizer',
  Icon: lazy(() => import('../meta/icons/google.jsx')),
};
