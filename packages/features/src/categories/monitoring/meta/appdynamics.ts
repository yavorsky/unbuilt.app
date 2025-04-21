import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const appdynamics: Meta = {
  name: 'AppDynamics',
  website: 'https://docs.appdynamics.com/',
  description: 'Application performance monitoring and analytics.',
  Icon: lazy(() => import('./icons/appdynamics.jsx')),
};
