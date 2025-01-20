import { babel } from './babel.js';
import { esbuild } from './esbuild.js';
import { bun } from './bun.js';
import { sucrase } from './sucrase.js';
import { swc } from './swc.js';
import { typescript } from './typescript.js';
import { deno } from './deno.js';

export const meta = {
  babel,
  esbuild,
  sucrase,
  bun,
  deno,
  swc,
  typescript,
} as const;
