import { babel } from './babel.js';
import { esbuild } from './esbuild.js';
import { sucrase } from './sucrase.js';
import { swc } from './swc.js';
import { bun } from './bun.js';
import { typescript } from './typescript.js';
import { deno } from './deno.js';

export const patterns = {
  babel,
  esbuild,
  bun,
  deno,
  sucrase,
  swc,
  typescript,
} as const;
