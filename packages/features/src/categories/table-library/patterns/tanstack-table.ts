export const tanstackTable = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [
      /\@tanstack\/table-core/,
      /\@tanstack\/react-table/,
      /\@tanstack\/vue-table/,
      /\@tanstack\/solid-table/,
      /\@tanstack\/svelte-table/,
    ],
    filenames: [/tanstack.*table/, /react-table/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.8,
    scripts: [
      /useReactTable\s*\(/,
      /getCoreRowModel\s*\(/,
      /getSortedRowModel\s*\(/,
      /getFilteredRowModel\s*\(/,
      /getPaginationRowModel\s*\(/,
      /flexRender\s*\(/,
    ],
  },
];
