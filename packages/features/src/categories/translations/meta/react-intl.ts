import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const reactIntl: Meta = {
  name: 'React-Intl (formatjs)',
  website: 'https://www.i18next.com/',
  tags: ['Translations'],
  description:
    'Library for internationalization in React applications, providing components and an API to format dates, numbers, and strings, including pluralization and handling translations.',
  Icon: lazy(() => import('./icons/react-intl.jsx')),
};
