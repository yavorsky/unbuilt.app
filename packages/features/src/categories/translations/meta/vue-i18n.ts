import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const vueI18n: Meta = {
  name: 'Vue I18n',
  website: 'https://vue-i18n.intlify.dev/',
  tags: ['Translations'],
  description:
    "i18next is an internationalization-framework written in and for JavaScript. But it's much more than that.",
  Icon: lazy(() => import('./icons/vue-I18n.jsx')),
};
