import { graphqlApollo } from './graphql-apollo.js';
import { graphqlUrql } from './graphql-urql.js';
import { graphqlRelay } from './graphql-relay.js';
import { graphqlGeneric } from './graphql-generic.js';
import { trpc } from './trpc.js';
import { websocket } from './websocket.js';
import { sse } from './sse.js';

export const patterns = {
  graphqlApollo,
  graphqlUrql,
  graphqlRelay,
  graphqlGeneric,
  trpc,
  websocket,
  sse,
} as const;
