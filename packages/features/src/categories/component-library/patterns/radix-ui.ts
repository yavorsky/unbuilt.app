export const radixUi = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\@radix-ui\//, /radix-ui/],
    filenames: [/radix-ui/],
  },
  {
    name: 'domMarkers' as const,
    score: 0.9,
    documents: [/data-radix-/, /data-radix-collection-item/, /data-radix-popper-content/, /data-state="open".*data-radix/],
  },
  {
    name: 'classPatterns' as const,
    score: 0.6,
    scripts: [/RadixDialog/, /RadixPopover/, /RadixDropdownMenu/, /RadixSelect/],
  },
];
