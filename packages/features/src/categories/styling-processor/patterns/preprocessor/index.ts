import { less } from './less.js';
import { postCSS } from './postcss.js';
import { sass } from './sass.js';
import { stylus } from './stylus.js';

export const preprocessorPatterns = {
  less,
  postCSS,
  sass,
  stylus,
} as const;
