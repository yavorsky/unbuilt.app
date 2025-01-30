import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const i18next: Meta = {
  name: 'i18next',
  website: 'https://i18next.com/',
  tags: ['Translations'],
  description:
    'i18next is a server-side and browser-side JavaScript library that makes it easy to do internationalization in your apps.',
  Icon: lazy(() => import('./icons/i18next.jsx')),
};
