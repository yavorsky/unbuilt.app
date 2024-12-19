import { react } from './react.js';
import { preact } from './preact.js';
import { angular } from './angular.js';
import { ember } from './ember.js';
import { inferno } from './inferno.js';
import { qwik } from './qwik.js';
import { solid } from './solid.js';
import { svelte } from './svelte.js';
import { vue } from './vue.js';
import { jQuery } from './jQuery.js';

export const patterns = {
  react,
  preact,
  angular,
  ember,
  inferno,
  qwik,
  solid,
  svelte,
  jQuery,
  vue,
} as const;
