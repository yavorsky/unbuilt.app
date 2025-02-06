import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const webComponents: Meta = {
  name: 'Web Components',
  website: 'https://webcomponents.org/',
  description:
    'Suite of different technologies allowing you to create reusable custom elements — with their functionality encapsulated away from the rest of your code — and utilize them in your web apps.',
  Icon: lazy(() => import('./icons/web-components.jsx')),
};
