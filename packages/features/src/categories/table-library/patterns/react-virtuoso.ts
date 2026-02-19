// React Virtuoso — package references and unique component names
export const reactVirtuoso = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/react-virtuoso[.\-@/]/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"react-virtuoso"/, // Package self-reference
      /"Virtuoso"/, // Component display names
      /"GroupedVirtuoso"/,
      /"TableVirtuoso"/,
      /"VirtuosoGrid"/,
    ],
  },
];
