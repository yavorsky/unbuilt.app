import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const wix: Meta = {
  name: 'Wix',
  website: 'https://wix.com/',
  tags: ['Website Builder'],
  description:
    'Wix is a website builder platform that allows you to create and deploy websites quickly and easily.',
  Icon: lazy(() => import('./icons/wix.jsx')),
};
