import { gatsby } from './gatsby.js';
import { next } from './next.js';
import { nuxt } from './nuxt.js';
import { remix } from './remix.js';

export const meta = {
  nuxt,
  next,
  remix,
  gatsby,
} as const;
