import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const deno: Meta = {
  name: 'Deno',
  website: 'https://deno.com/',
  description:
    'A secure runtime for JavaScript and TypeScript with a focus on simplicity and security.',
  Icon: lazy(() => import('./icons/deno.jsx')),
};
