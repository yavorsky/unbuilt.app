import { swc } from './swc.js';
import { babelMinify } from './babel-minify.js';
import { closure } from './closure.js';
import { esbuild } from './esbuild.js';
import { prepack } from './prepack.js';
import { terser } from './terser.js';
import { uglify } from './uglify.js';

export const patterns = {
  babelMinify,
  swc,
  closure,
  prepack,
  esbuild,
  terser,
  uglify,
};
