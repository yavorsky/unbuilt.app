export const graphqlGeneric = [
  {
    name: 'endpointPatterns' as const,
    score: 0.8,
    scripts: [/\/graphql/, /graphql-request/, /graphql-tag/],
    documents: [/\/graphql/],
  },
  {
    name: 'queryPatterns' as const,
    score: 0.7,
    scripts: [/\bquery\s*\{/, /\bmutation\s*\{/, /\bsubscription\s*\{/, /gql`/],
  },
];
