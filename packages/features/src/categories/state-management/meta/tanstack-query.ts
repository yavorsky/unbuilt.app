import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const tanstackQuery: Meta = {
  name: 'TanStack Query',
  website: 'https://tanstack.com/query',
  description: 'Query-based state management.',
  Icon: lazy(() => import('../../router/meta/icons/tanstack-router.jsx')),
};
