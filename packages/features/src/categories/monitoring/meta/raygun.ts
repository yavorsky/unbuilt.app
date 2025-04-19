import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const raygun: Meta = {
  name: 'Raygun',
  website: 'https://raygun.com/',
  description:
    'Auto-prompt your chosen LLM with crucial error context from your stack trace, environment, and affected code to get fast and accurate solutions.',
  Icon: lazy(() => import('./icons/raygun.jsx')),
};
