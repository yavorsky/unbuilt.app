export const graphqlRelay = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/relay-runtime/, /react-relay/],
    filenames: [/relay/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.8,
    scripts: [/useFragment\s*\(/, /useLazyLoadQuery\s*\(/, /usePreloadedQuery\s*\(/, /RelayEnvironmentProvider/],
  },
];
