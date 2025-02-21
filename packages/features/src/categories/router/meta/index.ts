import { angularRouter } from './angular-router.js';
import { emberRouter } from './ember-router.js';
import { gatsbyRouter } from './gatsby-router.js';
import { nextRouter } from './next-router.js';
import { qwikRouter } from './qwik-router.js';
import { reactRouter } from './react-router.js';
import { remixRouter } from './remix-router.js';
import { solidRouter } from './solid-router.js';
import { tanstackRouter } from './tanstack-router.js';
import { vitepressRouter } from './vitepress-router.js';
import { vueRouter } from './vue-router.js';
import { vuepressRouter } from './vuepress-router.js';

export const meta = {
  tanstackRouter,
  angularRouter,
  nextRouter,
  gatsbyRouter,
  emberRouter,
  qwikRouter,
  vitepressRouter,
  vuepressRouter,
  vueRouter,
  reactRouter,
  remixRouter,
  solidRouter,
} as const;
