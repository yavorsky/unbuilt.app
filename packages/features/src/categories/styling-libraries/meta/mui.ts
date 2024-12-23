import { Meta } from '../../../types/meta.js';
import { lazy } from 'react';

export const mui: Meta = {
  name: 'MUI',
  website: 'https://mui.com/',
  description: "React components that implement Google's Material Design",
  Icon: lazy(() => import('./icons/mui.jsx')),
};
