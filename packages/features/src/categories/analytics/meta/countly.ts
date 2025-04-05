import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const countly: Meta = {
  name: 'Countly',
  website: 'https://countly.com/',
  description:
    'Privacy-centric product analytics solution providing insights into how your users interact with your digital products, from acquisition to advocacy.',
  Icon: lazy(() => import('./icons/countly.jsx')),
};
