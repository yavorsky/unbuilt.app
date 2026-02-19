export const reactVirtuoso = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/react-virtuoso/],
    filenames: [/react-virtuoso/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.8,
    scripts: [/\bVirtuoso\b/, /\bGroupedVirtuoso\b/, /\bTableVirtuoso\b/, /\bVirtuosoGrid\b/],
  },
];
