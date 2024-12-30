import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const umd: Meta = {
  name: 'UMD',
  website: 'https://github.com/umdjs/umd',
  tags: ['Module System'],
  description:
    'Universal Module Definition (UMD) is a way to define modules that work in both CommonJS and AMD environments.',
  Icon: lazy(() => import('./icons/umd.jsx')),
};
