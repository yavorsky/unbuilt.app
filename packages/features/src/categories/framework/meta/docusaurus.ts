import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const docusaurus: Meta = {
  name: 'Docusaurus',
  website: 'docusaurus.io',
  tags: ['Static Site Generator'],
  description:
    'A modern static site generator that makes it easy to build documentation websites.',
  Icon: lazy(() => import('./icons/docusaurus.jsx')),
};
