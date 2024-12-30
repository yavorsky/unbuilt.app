import { lazy } from 'react';
import { Meta } from '../../../../types/meta.js';

export const stylus: Meta = {
  name: 'Stylus',
  website: 'http://stylus-lang.com',
  tags: ['Preprocessor'],
  description:
    'Stylus is a preprocessor that allows you to write CSS with a syntax that is more concise and easier to read. It supports variables, nesting, and mixins.',
  Icon: lazy(() => import('./icons/stylus.jsx')),
};
