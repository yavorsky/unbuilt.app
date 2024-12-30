import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const commonjs: Meta = {
  name: 'CommonJS',
  website:
    'https://en.wikipedia.org/wiki/CommonJS#:~:text=CommonJS%20is%20a%20project%20to,js.',
  tags: ['Module System'],
  description:
    'Project to standardize the module ecosystem for JavaScript outside of web browsers.',
  Icon: lazy(() => import('./icons/commonjs.jsx')),
};
