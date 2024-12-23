import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const chakra: Meta = {
  name: 'Chakra UI',
  website: 'https://chakra-ui.com/',
  description:
    'Simple, modular and accessible component library that gives you the building blocks you need to build your React applications.',
  Icon: lazy(() => import('./icons/chakra.jsx')),
};
