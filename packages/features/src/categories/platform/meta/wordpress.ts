import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const wordpress: Meta = {
  name: 'WordPress',
  website: 'https://wordpress.com/',
  tags: ['Website Builder'],
  description:
    'WordPress is a website builder platform that allows you to create and deploy websites quickly and easily.',
  Icon: lazy(() => import('./icons/wordpress.jsx')),
};
