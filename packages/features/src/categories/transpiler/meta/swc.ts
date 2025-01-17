import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const swc: Meta = {
  name: 'SWC',
  website: 'https://swc.rs/',
  description:
    'Extensible Rust-based platform for the next generation of fast developer tools.',
  Icon: lazy(() => import('./icons/swc.jsx')),
};
