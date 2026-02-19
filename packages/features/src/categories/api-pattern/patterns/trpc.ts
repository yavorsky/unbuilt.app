// tRPC — unique package names and URL patterns
export const trpc = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/@trpc\/client[.\-@/]/, /@trpc\/server[.\-@/]/, /@trpc\/react-query[.\-@/]/, /@trpc\/next[.\-@/]/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"@trpc\/client"/, // Package self-reference
      /"@trpc\/server"/,
      /"@trpc\/react-query"/,
      /"TRPCClientError"/, // Error class name as string
    ],
  },
  {
    name: 'urlPatterns' as const,
    score: 0.8,
    // tRPC batch requests have a unique URL pattern
    documents: [/\/api\/trpc\//, /trpc\/\?batch/],
    scripts: [/\/api\/trpc\//],
  },
];
