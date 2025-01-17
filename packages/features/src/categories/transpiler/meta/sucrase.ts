import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const sucrase: Meta = {
  name: 'Sucrase',
  website: 'https://sucrase.io/',
  description:
    'A JavaScript compiler that allows developers to use next-generation JavaScript, today.',
  Icon: lazy(() => import('./icons/sucrase.jsx')),
};
