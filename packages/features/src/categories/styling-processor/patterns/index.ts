import { less } from './less.js';
import { postCSS } from './postcss.js';
import { sass } from './sass.js';
import { stylus } from './stylus.js';
import { emotion } from './emotion.js';
import { jss } from './jss.js';
import { stitches } from './stitches.js';
import { styledComponents } from './styled-components.js';

export const patterns = {
  emotion,
  jss,
  stitches,
  styledComponents,
  less,
  postCSS,
  sass,
  stylus,
} as const;
