// Relay — unique package names and runtime identifiers
export const graphqlRelay = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/relay-runtime[.\-@/]/, /react-relay[.\-@/]/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"relay-runtime"/, // Package self-reference
      /"react-relay"/, // Package reference
      /"RelayEnvironmentProvider"/, // Component name as string
      /"RelayModernEnvironment"/, // Internal class name
      /"RelayNetwork"/, // Internal class name
    ],
  },
];
