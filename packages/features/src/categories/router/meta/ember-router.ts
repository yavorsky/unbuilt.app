import { lazy } from 'react';
import { Meta } from '../../../types/meta.js';

export const emberRouter: Meta = {
  name: 'Ember Router',
  website: 'https://api.emberjs.com/ember/release/classes/emberrouter/',
  description:
    'Ember Router provides a declarative, component-based way to navigate between views in your Ember application.',
  Icon: lazy(() => import('../../ui-library/meta/icons/ember.jsx')),
};
