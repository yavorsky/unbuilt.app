import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const terser: Meta = {
  name: 'Terser',
  website: 'https://terser.org/',
  description: 'JavaScript parser, mangler, compressor, and beautifier toolkit',
  Icon: lazy(() => import('./icons/terser.jsx')),
};
