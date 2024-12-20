import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const tanstackRouter: Meta = {
  name: 'TanStack Router',
  website: 'https://tanstack.com/router',
  description:
    'Tanstack has a file-system based router built on the concept of pages.',
  Icon: lazy(() => import('./icons/tanstack-router.jsx')),
};
