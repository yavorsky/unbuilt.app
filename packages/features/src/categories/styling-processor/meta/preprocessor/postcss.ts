import { lazy } from 'react';
import { Meta } from '../../../../types/meta.js';

export const postCSS: Meta = {
  name: 'PostCSS',
  website: 'https://postcss.org',
  tags: ['Preprocessor'],
  description:
    'PostCSS is a tool for transforming CSS with JavaScript plugins. These plugins can lint your CSS, support variables and mixins, transpile future CSS syntax, inline images, and more.',
  Icon: lazy(() => import('./icons/postcss.jsx')),
};
