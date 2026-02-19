// React Table (v7 legacy) — package references
export const reactTableLegacy = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/react-table[.\-@/]/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"react-table"/, // Package self-reference
      // React Table v7 hook names — these are likely preserved as displayName strings
      /"useTable"/,
      /"useSortBy"/,
      /"useFilters"/,
      /"usePagination"/,
      /"useGroupBy"/,
    ],
  },
];
