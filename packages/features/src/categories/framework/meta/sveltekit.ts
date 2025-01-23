import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const sveltekit: Meta = {
  name: 'SvelteKit',
  website: 'https://kit.svelte.dev/',
  tags: ['Svelte-based Framework'],
  description:
    'Framework for building web applications of all sizes, with a beautiful development experience and flexible filesystem-based routing.',
  Icon: lazy(() => import('../../ui-library/meta/icons/svelte.jsx')),
};
