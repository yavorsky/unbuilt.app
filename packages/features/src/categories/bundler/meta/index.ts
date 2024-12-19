import { brunch } from './brunch.js';
import { esbuild } from './esbuild.js';
import { rollup } from './rollup.js';
import { turbopack } from './turbopack.js';
import { vite } from './vite.js';
import { webpack } from './webpack.js';

export const meta = {
  brunch,
  esbuild,
  rollup,
  turbopack,
  vite,
  webpack,
} as const;
