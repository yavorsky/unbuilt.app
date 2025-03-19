import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const amplitude: Meta = {
  name: 'Amplitude',
  website: 'https://amplitude.com/',
  description: 'Powerful analytics for every business',
  Icon: lazy(() => import('./icons/amplitude.jsx')),
};
