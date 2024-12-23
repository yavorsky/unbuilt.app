import { Minimize } from 'lucide-react';
import { LogoProps, Meta } from '../../../types/meta.js';
import { FC } from 'react';

export const uglify: Meta = {
  name: 'Uglify',
  website: 'https://lisperator.net/uglifyjs/',
  description: 'JavaScript parser, mangler, compressor, and beautifier toolkit',
  Icon: Minimize as FC<LogoProps>,
};
