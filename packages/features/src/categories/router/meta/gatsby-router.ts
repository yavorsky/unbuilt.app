import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const gatsbyRouter: Meta = {
  name: 'Gatsby Router',
  website:
    'https://www.gatsbyjs.com/docs/reference/routing/file-system-route-api/',
  description:
    'Free and open-source framework based on React that helps developers build blazing-fast websites and apps. Gatsby uses a file-based routing system that allows developers to create pages and routes by creating files in the pages directory.',
  Icon: lazy(() => import('../../framework/meta/icons/gatsby.jsx')),
};
