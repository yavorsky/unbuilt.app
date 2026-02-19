export const nextui = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\@nextui-org\//, /nextui/],
    filenames: [/nextui/],
  },
  {
    name: 'domMarkers' as const,
    score: 0.8,
    documents: [/data-nextui/, /class="nextui-/],
  },
];
