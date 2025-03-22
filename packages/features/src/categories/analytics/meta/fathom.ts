import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const fathom: Meta = {
  name: 'Fathom',
  website: 'https://usefathom.com/',
  description:
    'Ditch complex, intrusive web analytics for Fathom - a better Google Analytics alternative. Experience ease of use, forever data retention, and complete, worry-free GDPR compliance - all while protecting your time and your visitor digital privacy.',
  Icon: lazy(() => import('./icons/fathom.jsx')),
};
