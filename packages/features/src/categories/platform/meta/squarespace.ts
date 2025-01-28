import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const squarespace: Meta = {
  name: 'Squarespace',
  website: 'https://www.squarespace.com/',
  tags: ['Website Builder'],
  description:
    'Squarespace is a website builder platform that allows you to create and deploy websites quickly and easily.',
  Icon: lazy(() => import('./icons/squarespace.jsx')),
};
