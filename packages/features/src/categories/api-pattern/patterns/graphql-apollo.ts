export const graphqlApollo = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\@apollo\/client/, /apollo-client/, /apollo-boost/],
    filenames: [/apollo/],
  },
  {
    name: 'runtimeMarkers' as const,
    score: 0.9,
    scripts: [/__APOLLO_STATE__/, /__APOLLO_CLIENT__/, /ApolloProvider/, /useQuery\s*\(/, /useMutation\s*\(/, /gql`/],
    documents: [/__APOLLO_STATE__/],
  },
];
