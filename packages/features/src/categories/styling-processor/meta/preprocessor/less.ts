import { lazy } from 'react';
import { Meta } from '../../../../types/meta.js';

export const less: Meta = {
  name: 'Less',
  website: 'http://lesscss.org/',
  tags: ['Preprocessor'],
  description:
    'Less is a CSS preprocessor that extends CSS with dynamic behavior such as variables, mixins, operations and functions. It allows for more maintainable and reusable style sheets.',
  Icon: lazy(() => import('./icons/less.jsx')),
};
