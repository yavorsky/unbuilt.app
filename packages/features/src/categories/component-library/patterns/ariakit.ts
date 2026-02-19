export const ariakit = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\@ariakit\/react/, /\@ariakit\/core/],
    filenames: [/ariakit/],
  },
  {
    name: 'domMarkers' as const,
    score: 0.8,
    documents: [/data-command/, /data-disclosure/],
  },
];
