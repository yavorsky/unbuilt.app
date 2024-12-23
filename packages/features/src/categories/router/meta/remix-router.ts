import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const remixRouter: Meta = {
  name: 'Remix Router',
  website: 'https://remix.run/docs/en/main/guides/accessibility#routing',
  description:
    'Remix has a file-system based router built on the concept of pages.',
  Icon: lazy(() => import('../../framework/meta/icons/remix.jsx')),
};
