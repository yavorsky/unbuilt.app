import { effector } from './effector.js';
import { jotai } from './jotai.js';
import { mobx } from './mobx.js';
import { ngrx } from './ngrx.js';
import { pinia } from './pinia.js';
import { recoil } from './recoil.js';
import { redux } from './redux.js';
import { tanstackQuery } from './tanstack-query.js';
import { valtio } from './valtio.js';
import { xState } from './x-state.js';
import { zustand } from './zustand.js';

export const meta = {
  effector,
  jotai,
  mobx,
  ngrx,
  xState,
  pinia,
  recoil,
  tanstackQuery,
  redux,
  valtio,
  zustand,
} as const;
