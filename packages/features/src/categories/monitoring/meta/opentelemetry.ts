import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const opentelemetry: Meta = {
  name: 'OpenTelemetry',
  website: 'https://opentelemetry.io/',
  description:
    'OpenTelemetry is a vendor-neutral open standard for observability data collection.',
  Icon: lazy(() => import('./icons/opentelemetry.jsx')),
};
