import { astro } from './astro.js';
import { docusaurus } from './docusaurus.js';
import { gatsby } from './gatsby.js';
import { next } from './next.js';
import { nuxt } from './nuxt.js';
import { remix } from './remix.js';
import { storybook } from './storybook.js';
import { sveltekit } from './sveltekit.js';
import { tanstackStart } from './tanstack-start.js';
import { vitepress } from './vitepress.js';
import { vuepress } from './vuepress.js';

export const meta = {
  astro,
  docusaurus,
  storybook,
  sveltekit,
  vitepress,
  tanstackStart,
  vuepress,
  nuxt,
  next,
  remix,
  gatsby,
} as const;
