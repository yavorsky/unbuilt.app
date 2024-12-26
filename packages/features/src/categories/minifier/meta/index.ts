import { babelMinify } from './babel-minify.js';
import { closure } from './closure.js';
import { esbuild } from './esbuild.js';
import { prepack } from './prepack.js';
import { terser } from './terser.js';
import { uglify } from './uglify.js';

export const meta = {
  babelMinify,
  closure,
  esbuild,
  prepack,
  terser,
  uglify,
};
