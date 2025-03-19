export const tanstackQuery = [
  {
    name: 'core' as const,
    score: 1,
    scripts: [
      /ensureInfiniteQueryData\s*\(/,
      /prefetchInfiniteQuery\s*\(/,
      /fetchInfiniteQuery\s*\(/,
      /observers\.find\([^)]+\.shouldFetchOnReconnect\(\)\)/,
      /\w+\.defaultMutationOptions\s*\(/,
      /\w+\.options\.refetchIntervalInBackground/,
    ],
  },
  {
    name: 'experimental' as const,
    score: 0.8,
    scripts: [
      /_experimental_beforeQuery/,
      /_experimental_afterQuery/,
      /experimental_prefetchInRender/,
    ],
  },
  {
    name: 'react' as const,
    score: 1,
    scripts: [/[Nn]o\s*QueryClient\s*set,\s*use\s*QueryClientProvider/],
  },
];
