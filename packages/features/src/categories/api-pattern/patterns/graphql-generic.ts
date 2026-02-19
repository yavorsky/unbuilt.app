// Generic GraphQL detection — match unique GraphQL identifiers, not just generic query syntax
export const graphqlGeneric = [
  {
    name: 'endpointPatterns' as const,
    score: 0.8,
    // graphql-request and graphql-tag are package names (survive in filenames/comments)
    filenames: [/graphql-request[.\-@/]/, /graphql-tag[.\-@/]/],
    // /graphql endpoint in document links or fetch calls
    documents: [/\/graphql/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.7,
    scripts: [
      /"graphql"/, // Package name as string
      /"__typename"/, // GraphQL's unique field name — always a string literal
      /"__schema"/, // Introspection field
      /"\$[a-zA-Z]+":.*"kind":"Variable"/, // GraphQL AST patterns
    ],
  },
  {
    name: 'networkPatterns' as const,
    score: 0.6,
    // Content-Type header for GraphQL
    headers: {
      'content-type': /application\/graphql/,
    },
  },
];
