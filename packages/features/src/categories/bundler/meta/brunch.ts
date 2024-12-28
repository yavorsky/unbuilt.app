import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const brunch: Meta = {
  name: 'Brunch',
  website: 'https://brunch.io/',
  description: 'Fast, reliable, and modern build tool for web applications',
  Icon: lazy(() => import('./icons/brunch.jsx')),
};
