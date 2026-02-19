// urql — focus on unique package references, not generic hook names
export const graphqlUrql = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/urql[.\-@/]/, /@urql\//],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"urql"/, // Package self-reference
      /"@urql\/core"/, // Scoped package
      /"@urql\/exchange-graphcache"/, // urql-specific exchange
      /"urqlClient"/, // Common variable name in string form
    ],
  },
];
