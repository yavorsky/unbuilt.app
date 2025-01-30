import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const weebly: Meta = {
  name: 'Weebly',
  website: 'https://www.weebly.com/',
  tags: ['Website Builder'],
  description:
    'Weebly is a website builder platform that allows you to create and deploy websites quickly and easily.',
  Icon: lazy(() => import('./icons/weebly.jsx')),
};
