import { lazy } from 'react';
import { Meta } from '../../../../types/meta.js';

export const styledComponents: Meta = {
  name: 'Styled Components',
  website: 'https://styled-components.com',
  tags: ['CSS-in-JS'],
  description:
    'CSS-in-JS library that allows you to write actual CSS to style your components. It removes the mapping between components and styles, and lets you write actual CSS augmented with JavaScript.',
  Icon: lazy(() => import('./icons/styled-components.jsx')),
};
