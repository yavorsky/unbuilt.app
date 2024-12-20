import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const reactRouter: Meta = {
  name: 'React Router',
  website: 'https://reactrouter.com/',
  description:
    'Declarative routing for React applications that allows developers to build single-page applications with multiple views and share data between views.',
  Icon: lazy(() => import('./icons/react-router.jsx')),
};
