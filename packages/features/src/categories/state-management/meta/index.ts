import { effector } from './effector.js';
import { jotai } from './jotai.js';
import { mobx } from './mobx.js';
import { ngrx } from './ngrx.js';
import { pinia } from './pinia.js';
import { recoil } from './recoil.js';
import { redux } from './redux.js';
import { valtio } from './valtio.js';
import { zustand } from './zustand.js';

export const meta = {
  effector,
  jotai,
  mobx,
  ngrx,
  pinia,
  recoil,
  redux,
  valtio,
  zustand,
} as const;
