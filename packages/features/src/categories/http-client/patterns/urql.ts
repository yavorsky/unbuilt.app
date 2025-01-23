export const urql = [
  {
    name: 'coreImplementation' as const,
    score: 0.7,
    scripts: [
      // Urql's core error prefix
      /"@urql\/core: /,

      // Urql's specific exchange error messages
      /"No exchange has handled this operation"/,
      /"The exchanges have been set up incorrectly"/,

      // Urql's operation errors
      /"No more operations can be spawned"/,
    ],
  },
  {
    name: 'exchangeImplementation' as const,
    score: 0.9,
    scripts: [
      // Urql's exchange-specific error messages
      /"fetchExchange: Network request failed"/,
      /"cacheExchange: Invalid undefined value"/,
      /"subscriptionExchange: Failed to connect"/,
    ],
  },
  {
    name: 'clientUsage' as const,
    score: 0.8,
    scripts: [
      // Urql's unique client setup with exchanges array
      /\{(?:[^}]*exchanges:\s*\[[^]]+\],[^}]*url:|url:[^,]+,exchanges:\s*\[[^]]+\])/,

      // Urql's unique pausable operation pattern
      /\{query:[^,]+,variables:[^,]+,pause:/,
    ],
  },
  {
    name: 'headerSignatures' as const,
    score: 0.6,
    headers: {
      // Urql's subscription-specific headers
      'x-graphql-event-stream': /true/,
      'x-graphql-transport-ws': /true/,
    },
  },
];
