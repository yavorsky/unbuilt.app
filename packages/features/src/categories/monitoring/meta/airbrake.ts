import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const airbrake: Meta = {
  name: 'Airbrake',
  website: 'https://www.airbrake.io/',
  description:
    'Frictionless error monitoring and performance insights for your entire app stack.',
  Icon: lazy(() => import('./icons/airbrake.jsx')),
};
