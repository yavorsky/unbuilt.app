import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const moment: Meta = {
  name: 'Moment.js',
  website: 'https://momentjs.com/',
  description: 'Parse, validate, manipulate, and display dates in JavaScript',
  Icon: lazy(() => import('./icons/moment.jsx')),
};
