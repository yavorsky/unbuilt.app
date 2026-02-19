export const headlessUi = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\@headlessui\/react/, /\@headlessui\/vue/],
    filenames: [/headlessui/],
  },
  {
    name: 'domMarkers' as const,
    score: 0.9,
    documents: [/data-headlessui-state/, /data-headlessui-focus/],
  },
];
