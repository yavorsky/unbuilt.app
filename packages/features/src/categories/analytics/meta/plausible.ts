import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const plausible: Meta = {
  name: 'Plausible',
  website: 'https://plausible.io/',
  description:
    'Intuitive, lightweight and open source web analytics. No cookies and fully compliant with GDPR, CCPA and PECR. Made and hosted in the EU, powered by European-owned cloud infrastructure 🇪🇺',
  Icon: lazy(() => import('./icons/plausible.jsx')),
};
