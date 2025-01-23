import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const nextServerActions: Meta = {
  name: 'Next.js Server Actions',
  website:
    'https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations',
  description:
    'Asynchronous functions that are executed on the server. They can be called in Server and Client Components to handle form submissions and data mutations in Next.js applications.',
  tags: ['Next.js essentials'],
  Icon: lazy(() => import('../../framework/meta/icons/next.jsx')),
};
