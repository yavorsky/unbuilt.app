import { amd } from './amd.js';
import { commonjs } from './commonjs.js';
import { esm } from './esm.js';
import { umd } from './umd.js';

export const patterns = {
  amd,
  commonjs,
  esm,
  umd,
} as const;
