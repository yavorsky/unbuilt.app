// Verified against minified bundle: cdn.jsdelivr.net/npm/@trpc/client@10.45.2/dist/index.min.mjs
// Survives: TRPCClientError, TRPCUntypedClient, createTRPCClient, httpBatchLink, etc.
export const trpc = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/@trpc\/client[.\-@/]/, /@trpc\/server[.\-@/]/, /@trpc\/react-query[.\-@/]/, /@trpc\/next[.\-@/]/],
  },
  {
    name: 'namedExports' as const,
    score: 0.9,
    scripts: [
      // Verified ESM exports in minified bundle
      /TRPCClientError/,
      /TRPCUntypedClient/,
      /createTRPCClient/,
      /createTRPCProxyClient/,
      /httpBatchLink/,
    ],
  },
  {
    name: 'urlPatterns' as const,
    score: 0.8,
    // tRPC batch requests have unique URL patterns
    documents: [/\/api\/trpc\//, /\/trpc\//],
  },
];
