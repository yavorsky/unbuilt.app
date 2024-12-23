import { Paintbrush } from 'lucide-react';
import { LogoProps, Meta } from '../../../types/meta.js';
import { FC } from 'react';

export const foundation: Meta = {
  name: 'Foundation',
  website: 'https://foundation.zurb.com/',
  description: 'The most advanced responsive front-end framework in the world.',
  Icon: Paintbrush as FC<LogoProps>,
};
