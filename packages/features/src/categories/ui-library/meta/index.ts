import { angular } from './angular.js';
import { ember } from './ember.js';
import { inferno } from './inferno.js';
import { jQuery } from './jQuery.js';
import { preact } from './preact.js';
import { qwik } from './qwik.js';
import { react } from './react.js';
import { solid } from './solid.js';
import { svelte } from './svelte.js';
import { vue } from './vue.js';
import { webComponents } from './web-components.js';

export const meta = {
  react,
  preact,
  qwik,
  solid,
  svelte,
  angular,
  ember,
  inferno,
  vue,
  jQuery,
  webComponents,
} as const;
