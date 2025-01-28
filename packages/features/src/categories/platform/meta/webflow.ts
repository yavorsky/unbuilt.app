import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const webflow: Meta = {
  name: 'Webflow',
  website: 'https://www.webflow.com/',
  tags: ['Website Builder'],
  description:
    'Webflow is a website builder platform that allows you to create and deploy websites quickly and easily.',
  Icon: lazy(() => import('./icons/webflow.jsx')),
};
