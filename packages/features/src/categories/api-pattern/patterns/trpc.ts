export const trpc = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\@trpc\/client/, /\@trpc\/server/, /\@trpc\/react-query/, /\@trpc\/next/],
    filenames: [/trpc/],
  },
  {
    name: 'networkPatterns' as const,
    score: 0.9,
    scripts: [/trpc\..*useQuery/, /trpc\..*useMutation/, /\.trpc\./],
    documents: [/\/api\/trpc/, /trpc\/\?batch/],
  },
];
