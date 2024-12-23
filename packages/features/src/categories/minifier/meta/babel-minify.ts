import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const babelMinify: Meta = {
  name: 'Babel Minify',
  website: 'https://babeljs.io/docs/en/babel-minify',
  description: 'Minify JavaScript using Babel',
  Icon: lazy(() => import('../../transpiler/meta/icons/babel.jsx')),
};
