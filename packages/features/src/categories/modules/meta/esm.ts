import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const esm: Meta = {
  name: 'ES Modules',
  website:
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules',
  tags: ['Bundled'],
  description:
    'A way to structure your JavaScript code in separate files that can be imported where needed.',
  Icon: lazy(() => import('./icons/esm.jsx')),
};
