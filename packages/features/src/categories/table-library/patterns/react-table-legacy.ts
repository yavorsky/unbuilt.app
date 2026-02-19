export const reactTableLegacy = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/react-table/, /useTable\s*\(\s*\{/],
    filenames: [/react-table/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.7,
    scripts: [/useSortBy/, /useFilters/, /usePagination/, /useGroupBy/, /useExpanded/],
  },
];
