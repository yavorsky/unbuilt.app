import { esbuild } from '../../bundler/meta/esbuild.js';
import { swc } from '../../transpiler/meta/swc.js';
import { babelMinify } from './babel-minify.js';
import { closure } from './closure.js';
import { prepack } from './prepack.js';
import { terser } from './terser.js';
import { uglify } from './uglify.js';

export const meta = {
  babelMinify,
  closure,
  esbuild,
  prepack,
  terser,
  swc,
  uglify,
} as const;
