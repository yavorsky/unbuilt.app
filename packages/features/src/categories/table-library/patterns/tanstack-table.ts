// Verified against minified bundle: cdn.jsdelivr.net/npm/@tanstack/table-core@8.20.5/build/lib/index.min.mjs
// Property names on row model survive as string keys: "getCoreRowModel", "getSortedRowModel", etc.
// ESM exports survive: flexRender, useReactTable
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
    name: 'apiPropertyNames' as const,
    score: 0.9,
    scripts: [
      // Verified: these survive as string property keys in minified bundles
      /"getCoreRowModel"/,
      /"getSortedRowModel"/,
      /"getFilteredRowModel"/,
      /"getPaginationRowModel"/,
      /"getExpandedRowModel"/,
      /"getGroupedRowModel"/,
      /"columnSizingInfo"/,
      /"columnPinning"/,
      /"debugTable"/,
      /"debugHeaders"/,
      /"debugColumns"/,
    ],
  },
  {
    name: 'esmExports' as const,
    score: 0.8,
    scripts: [
      // Verified ESM export names
      /\bflexRender\b/,
      /\buseReactTable\b/,
    ],
  },
];
