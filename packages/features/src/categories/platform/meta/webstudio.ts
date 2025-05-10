import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const webstudio: Meta = {
  name: 'Webstudio',
  website: 'https://webstudio.is/',
  tags: ['Website Builder'],
  description:
    'Webstudio is an open source website builder that empowers creators to build highly maintainable and fast websites using modern web standards.',
  Icon: lazy(() => import('./icons/webstudio.jsx')),
};
