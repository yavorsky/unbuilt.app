import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const heap: Meta = {
  name: 'Heap',
  website: 'https://www.heap.io/',
  description:
    'The only digital insights platform that gives you complete understanding of your customers digital journeys, so you can quickly improve conversion, retention, and customer delight.',
  Icon: lazy(() => import('./icons/heap.jsx')),
};
