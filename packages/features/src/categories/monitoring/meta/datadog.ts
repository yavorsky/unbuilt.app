import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const datadog: Meta = {
  name: 'Datadog',
  website: 'https://www.datadoghq.com/',
  description:
    'Modern monitoring & security. See inside any stack, any app, at any scale, anywhere.',
  Icon: lazy(() => import('./icons/datadog.jsx')),
};
