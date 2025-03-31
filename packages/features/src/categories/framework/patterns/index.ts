import { next } from './next.js';
import { nuxt } from './nuxt.js';
import { gatsby } from './gatsby.js';
import { remix } from './remix.js';
import { docusaurus } from './docusaurus.js';
import { vitepress } from './vitepress.js';
import { vuepress } from './vuepress.js';
import { storybook } from './storybook.js';
import { sveltekit } from './sveltekit.js';
import { astro } from './astro.js';
import { tanstackStart } from './tanstack-start.js';

export const patterns = {
  astro,
  next,
  nuxt,
  remix,
  gatsby,
  docusaurus,
  tanstackStart,
  vitepress,
  vuepress,
  storybook,
  sveltekit,
} as const;
