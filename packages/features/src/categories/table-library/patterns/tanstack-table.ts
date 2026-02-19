// TanStack Table — match package references and unique string identifiers
export const tanstackTable = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [
      /@tanstack\/table-core[.\-@/]/,
      /@tanstack\/react-table[.\-@/]/,
      /@tanstack\/vue-table[.\-@/]/,
      /@tanstack\/solid-table[.\-@/]/,
      /@tanstack\/svelte-table[.\-@/]/,
    ],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"@tanstack\/table-core"/, // Package self-reference
      /"@tanstack\/react-table"/,
      /"getCoreRowModel"/, // Unique API name as string key
      /"getSortedRowModel"/, // Unique API name
      /"getFilteredRowModel"/,
      /"getPaginationRowModel"/,
      /"flexRender"/, // TanStack Table's unique render helper
    ],
  },
];
