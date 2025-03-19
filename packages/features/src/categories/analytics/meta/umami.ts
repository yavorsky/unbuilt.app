import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const umami: Meta = {
  name: 'Umami',
  website: 'https://umami.is/',
  description:
    'Open source alternative to Google Analytics that provides a powerful and intuitive interface for tracking your website traffic.',
  Icon: lazy(() => import('./icons/umami.jsx')),
};
