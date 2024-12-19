import { apollo } from './apollo.js';
import { axios } from './axios.js';
import { got } from './got.js';
import { ky } from './ky.js';
import { relay } from './relay.js';
import { superagent } from './superagent.js';
import { urql } from './urql.js';

export const patterns = {
  apollo,
  axios,
  got,
  ky,
  relay,
  superagent,
  urql,
} as const;
