import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const elasticapm: Meta = {
  name: 'Elastic APM',
  website: 'https://www.elastic.co/apm',
  description:
    'Elastic APM is a distributed tracing and metrics collection system that helps you monitor and troubleshoot your applications.',
  Icon: lazy(() => import('./icons/elasticapm.jsx')),
};
