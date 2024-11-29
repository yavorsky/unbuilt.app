import { next } from './next.js';
import { nuxt } from './nuxt.js';
import { gatsby } from './gatsby.js';
import { remix } from './remix.js';

export const patterns = {
  next,
  // nuxt,
  // remix,
  // gatsby,
} as const;