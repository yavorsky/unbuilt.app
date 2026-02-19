export const graphqlUrql = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\burql\b/, /\@urql\//],
    filenames: [/urql/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.8,
    scripts: [/useQuery\s*\(.*urql/, /urqlClient/, /createClient\s*\(.*url.*exchanges/],
  },
];
