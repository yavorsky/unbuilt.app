import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const i18next: Meta = {
  name: 'i18Next',
  website: 'https://www.i18next.com/',
  tags: ['Translations'],
  description:
    "i18next is an internationalization-framework written in and for JavaScript. But it's much more than that.",
  Icon: lazy(() => import('./icons/i18next.jsx')),
};
