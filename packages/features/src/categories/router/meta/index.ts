import { angularRouter } from './angular-router.js';
import { gatsbyRouter } from './gatsby-router.js';
import { nextRouter } from './next-router.js';
import { qwikRouter } from './qwik-router.js';
import { reactRouter } from './react-router.js';
import { remixRouter } from './remix-router.js';
import { solidRouter } from './solid-router.js';
import { tanstackRouter } from './tanstack-router.js';
import { vueRouter } from './vue-router.js';

export const meta = {
  tanstackRouter,
  angularRouter,
  nextRouter,
  gatsbyRouter,
  qwikRouter,
  vueRouter,
  reactRouter,
  remixRouter,
  solidRouter,
} as const;
