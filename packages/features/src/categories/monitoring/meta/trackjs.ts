import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const trackjs: Meta = {
  name: 'TrackJS',
  website: 'https://trackjs.com/',
  description:
    'TrackJS makes finding and fixing JavaScript errors simple. The library automatically detects and captures errors from your web application with a clear story of how it happened.',
  Icon: lazy(() => import('./icons/trackjs.jsx')),
};
