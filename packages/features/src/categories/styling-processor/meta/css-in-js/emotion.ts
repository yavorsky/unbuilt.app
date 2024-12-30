import { lazy } from 'react';
import { Meta } from '../../../../types/meta.js';

export const emotion: Meta = {
  name: 'Emotion',
  website: 'https://emotion.sh/docs/introduction',
  tags: ['CSS-in-JS'],
  description:
    'Emotion is a performant and flexible CSS-in-JS library. Building on many other CSS-in-JS libraries, it allows you to style apps quickly with string or object styles. It has predictable composition to avoid specificity issues with CSS.',
  Icon: lazy(() => import('./icons/emotion.jsx')),
};
