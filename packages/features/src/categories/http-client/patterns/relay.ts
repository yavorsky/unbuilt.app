export const relay = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // Relay's unique internal directive strings
      /"RelayRequiredFields"/,
      /"RelayLiveResolvers"/,
      /"RelayDefaultMask"/,
      /"RelayConnectionHandler"/,

      // Relay's specific record source implementation details
      /"getRootField: Expected id/,
      /"getLinkedRecords: Expected array of records"/,

      // Relay's unique error messages for missing fields
      /"Expected id for record .* missing field/,
      /"Expected record .* to have a .* selection/,

      // Relay's garbage collection messages
      /"Relay: Expected .* to be registered before cleaning up"/,
    ],
  },
  {
    name: 'storeImplementation' as const,
    score: 0.8,
    scripts: [
      // Relay's store implementation messages
      /"RelayModernStore: Mutation",\s*"RetainQuery"/,
      /"RelayModernStore: Operation",\s*"CommitPayload"/,

      // Relay's unique store field patterns
      /"__id",\s*"__typename",\s*"__isNode"/,

      // Relay's specific data masking messages
      /"RelayReader: Expected .* to be a scalar"/,
    ],
  },
  {
    name: 'connectionImplementation' as const,
    score: 0.8,
    scripts: [
      // Relay's specific connection key format
      /"connection:.*\$.*\$.*connections"/,

      // Relay's unique connection metadata
      /"__connection_next_edge_index"/,

      // Relay's specific connection handler messages
      /"Connection handler .* cannot handle undefined"/,
    ],
  },
  {
    name: 'buildPatterns' as const,
    score: 0.7,
    scripts: [
      // Relay's unique compiler output format
      /"RelayConcreteNode\.(?:LinkedField|ScalarField|Fragment)"/,

      // Relay's operation consistency check messages
      /"RelayModernEnvironment: Operation",\s*".*"\s*already exists"/,

      // Relay's fragment spread validation
      /"RelayValidator: Fragment spread .* unused"/,
    ],
  },
];
