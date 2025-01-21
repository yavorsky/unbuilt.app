import { emotion } from './emotion.js';
import { jss } from './jss.js';
import { less } from './less.js';
import { postCSS } from './postcss.js';
import { sass } from './sass.js';
import { stitches } from './stitches.js';
import { styledComponents } from './styled-components.js';
import { stylus } from './stylus.js';

export const meta = {
  emotion,
  jss,
  stitches,
  styledComponents,
  less,
  postCSS,
  sass,
  stylus,
} as const;
