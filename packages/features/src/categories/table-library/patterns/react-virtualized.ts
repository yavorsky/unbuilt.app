export const reactVirtualized = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/react-virtualized/],
    filenames: [/react-virtualized/],
  },
  {
    name: 'domMarkers' as const,
    score: 0.9,
    documents: [/class="ReactVirtualized__/, /ReactVirtualized__Grid/, /ReactVirtualized__List/, /ReactVirtualized__Table/],
  },
];
