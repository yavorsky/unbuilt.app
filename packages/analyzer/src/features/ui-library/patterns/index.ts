import { react } from './react.js';
import { preact } from './preact.js';
import { angular } from './angular.js';
import { ember } from './ember.js';
import { inferno } from './inferno.js';
import { nuxt } from './nuxt.js';
import { qwik } from './qwik.js';
import { solid } from './solid.js';
import { svelte } from './svelte.js';
import { vue } from './vue.js';
import { jQuery } from './jquery.js';

export const patterns = {
  react,
  preact,
  angular,
  ember,
  inferno,
  nuxt,
  qwik,
  solid,
  svelte,
  jQuery,
  vue,
} as const;
