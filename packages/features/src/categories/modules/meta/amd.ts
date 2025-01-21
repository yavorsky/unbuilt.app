import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const amd: Meta = {
  name: 'AMD',
  website: 'https://en.wikipedia.org/wiki/Asynchronous_module_definition',
  tags: ['Bundled'],
  description:
    'Asynchronous Module Definition (AMD) is a JavaScript API for defining modules such that the module and its dependencies can be asynchronously loaded.',
  Icon: lazy(() => import('./icons/amd.jsx')),
};
