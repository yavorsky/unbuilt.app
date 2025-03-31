import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const tanstackStart: Meta = {
  name: 'TanStack Start',
  website: 'https://tanstack.com/start',
  tags: ['React/Solid based Framework'],
  description:
    'Start building your app with TanStack Start.Full-stack React and Solid framework powered by TanStack Router',
  Icon: lazy(() => import('../../router/meta/icons/tanstack-router.jsx')),
};
