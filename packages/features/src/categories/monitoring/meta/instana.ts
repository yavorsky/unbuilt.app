import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const instana: Meta = {
  name: 'Instana',
  website: 'https://www.instana.com/',
  description:
    'Harness the power of AI and automation to proactively solve issues across the application stack.',
  Icon: lazy(() => import('./icons/instana.jsx')),
};
