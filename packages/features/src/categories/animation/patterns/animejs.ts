export const animejs = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/animejs/, /anime\.js/],
    filenames: [/animejs/, /anime\.js/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.8,
    scripts: [/anime\s*\(\s*\{/, /anime\.timeline\s*\(/, /anime\.stagger\s*\(/],
  },
];
