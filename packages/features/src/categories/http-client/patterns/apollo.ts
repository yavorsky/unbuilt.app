export const apollo = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // Apollo's unique cache implementation error messages
      /"Cache data may be lost when replacing the \w+ field of a Query object\./,

      // Apollo's specific cache metadata messages - unique to Apollo's implementation
      /"Missing selection set for object of type [^"]+ returned for query field [^"]+"/,

      // Internal cache field metadata - unique to Apollo's field policy system
      /"keyArgs":\["sort","limit"\],"merge":function/,
    ],
  },
  {
    name: 'cacheImplementation' as const,
    score: 0.9,
    scripts: [
      // Apollo's specific cache key format - unique to Apollo Client's cache
      /\["ROOT_QUERY"\]|\["ROOT_MUTATION"\]/,

      // Apollo's unique cache reference format
      /"__ref":"[^"]+:\{"/,

      // Apollo's cache normalization format
      /"storeFactory","cacheKeyRoot"/,
    ],
  },
  {
    name: 'devToolsMarkers' as const,
    score: 0.8,
    scripts: [
      // Apollo DevTools specific connection string
      /"__APOLLO_CLIENT__"/,
    ],
  },
  {
    name: 'headerSignatures' as const,
    score: 0.6,
    headers: {
      // Apollo specific operation headers
      'apollo-operation-name': /.*/,
      'apollo-preflight': /true/,
      'apollo-federation-include-trace': /.*/,
      'apollo-require-preflight': /true/,
    },
  },
];
