export const tanstackVirtual = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\@tanstack\/virtual-core/, /\@tanstack\/react-virtual/, /\@tanstack\/vue-virtual/, /\@tanstack\/solid-virtual/],
    filenames: [/tanstack.*virtual/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.8,
    scripts: [/useVirtualizer\s*\(/, /useWindowVirtualizer\s*\(/, /Virtualizer\s*\(/],
  },
];
