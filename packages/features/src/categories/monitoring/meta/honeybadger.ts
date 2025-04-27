import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const honeybadger: Meta = {
  name: 'Honeybadger',
  website: 'https://www.honeybadger.io/',
  description:
    'Ship better software faster with full-stack application monitoring that works like you think it should.',
  Icon: lazy(() => import('./icons/honeybadger.jsx')),
};
