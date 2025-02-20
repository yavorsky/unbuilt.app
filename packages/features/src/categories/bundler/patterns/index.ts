import { brunch } from './brunch.js';
import { bun } from './bun.js';
import { esbuild } from './esbuild.js';
import { rollup } from './rollup.js';
import { turbopack } from './turbopack.js';
import { vite } from './vite.js';
import { webpack } from './webpack.js';

export const patterns = {
  brunch,
  bun,
  esbuild,
  rollup,
  turbopack,
  vite,
  webpack,
} as const;
