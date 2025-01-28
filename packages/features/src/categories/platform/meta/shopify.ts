import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const shopify: Meta = {
  name: 'Shopify',
  website: 'https://shopify.com/',
  tags: ['E-Commerce'],
  description:
    'Shopify is a platform for building e-commerce websites and apps.',
  Icon: lazy(() => import('./icons/shopify.jsx')),
};
