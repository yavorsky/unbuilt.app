import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const sass: Meta = {
  name: 'Sass',
  website: 'https://sass-lang.com/',
  tags: ['Preprocessor'],
  description:
    'Sass is a CSS preprocessor that extends CSS with features like variables, nesting, and mixins. It allows for more maintainable and reusable style sheets.',
  Icon: lazy(() => import('./icons/sass.jsx')),
};
