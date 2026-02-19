export const motionOne = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\@motionone\//, /motion\/one/],
    filenames: [/motionone/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.8,
    scripts: [/animate\s*\(/, /timeline\s*\(/, /stagger\s*\(/, /inView\s*\(/],
  },
];
