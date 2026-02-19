import { graphqlApollo } from './apollo-graphql.js';
import { graphqlUrql } from './urql.js';
import { graphqlRelay } from './relay.js';
import { graphqlGeneric } from './graphql.js';
import { trpc } from './trpc.js';
import { websocket } from './websocket.js';
import { sse } from './sse.js';

export const meta = {
  graphqlApollo,
  graphqlUrql,
  graphqlRelay,
  graphqlGeneric,
  trpc,
  websocket,
  sse,
} as const;
