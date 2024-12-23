import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const storybook: Meta = {
  name: 'Storybook',
  website: 'https://storybook.js.org/',
  tags: ['DevTools Framework'],
  description:
    'An open-source tool for developing UI components in isolation for React, Vue, and Angular.',
  Icon: lazy(() => import('./icons/storybook.jsx')),
};
