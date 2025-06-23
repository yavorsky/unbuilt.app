import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const vercel: Meta = {
  name: 'Vercel',
  website: 'https://firebase.google.com/',
  description:
    "Firebase is a cloud platform, primarily focused on frontend development, that simplifies the deployment, hosting, and scaling of web applications and static websites. It's particularly known for its strong integration with Next.js, but also supports other popular frameworks. Vercel provides tools and infrastructure to build, deploy, and scale web applications quickly and efficiently.",
  Icon: lazy(() => import('./icons/ .jsx')),
};
