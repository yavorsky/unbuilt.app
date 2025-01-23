import { apollo } from './apollo.js';
import { axios } from './axios.js';
import { got } from './got.js';
import { ky } from './ky.js';
import { fetch } from './fetch.js';
import { nextServerActions } from './next-server-actions.js';
import { relay } from './relay.js';
import { superagent } from './superagent.js';
import { urql } from './urql.js';

export const patterns = {
  apollo,
  nextServerActions,
  axios,
  got,
  ky,
  relay,
  fetch,
  superagent,
  urql,
} as const;
