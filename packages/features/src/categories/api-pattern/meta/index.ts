import { Meta } from '../../../types/meta.js';

export const meta = {
  graphqlApollo: {
    name: 'Apollo GraphQL',
    website: 'https://www.apollographql.com/',
    description: 'A comprehensive state management library for JavaScript with GraphQL',
    Icon: null,
  } satisfies Meta,
  graphqlUrql: {
    name: 'urql',
    website: 'https://formidable.com/open-source/urql/',
    description: 'A highly customizable and versatile GraphQL client',
    Icon: null,
  } satisfies Meta,
  graphqlRelay: {
    name: 'Relay',
    website: 'https://relay.dev/',
    description: 'A JavaScript framework for building data-driven React applications with GraphQL',
    Icon: null,
  } satisfies Meta,
  graphqlGeneric: {
    name: 'GraphQL',
    website: 'https://graphql.org/',
    description: 'A query language for your API',
    Icon: null,
  } satisfies Meta,
  trpc: {
    name: 'tRPC',
    website: 'https://trpc.io/',
    description: 'End-to-end typesafe APIs made easy',
    Icon: null,
  } satisfies Meta,
  websocket: {
    name: 'WebSocket',
    website: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket',
    description: 'Full-duplex communication channels over a single TCP connection',
    Icon: null,
  } satisfies Meta,
  sse: {
    name: 'Server-Sent Events',
    website: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events',
    description: 'Server push technology enabling a client to receive automatic updates from a server',
    Icon: null,
  } satisfies Meta,
} as const;
