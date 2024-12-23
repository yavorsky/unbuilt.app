import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const antDesign: Meta = {
  name: 'Ant Design',
  website: 'https://ant.design/',
  description:
    'A design system with values of Nature and Determinacy for better user experience of enterprise applications',
  Icon: lazy(() => import('./icons/ant-design.jsx')),
};
