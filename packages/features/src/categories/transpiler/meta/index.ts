import { babel } from './babel.js';
import { esbuild } from './esbuild.js';
import { sucrase } from './sucrase.js';
import { swc } from './swc.js';
import { typescript } from './typescript.js';

export const meta = {
  babel,
  esbuild,
  sucrase,
  swc,
  typescript,
} as const;
