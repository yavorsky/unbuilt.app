import { apollo } from './apollo.js';
import { axios } from './axios.js';
import { got } from './got.js';
import { ky } from './ky.js';
import { relay } from './relay.js';
import { superagent } from './superagent.js';
import { swr } from './swr.js';
import { urql } from './urql.js';

export const meta = {
  apollo,
  axios,
  swr,
  got,
  ky,
  relay,
  superagent,
  urql,
} as const;
