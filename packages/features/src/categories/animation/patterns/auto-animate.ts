export const autoAnimate = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\@formkit\/auto-animate/, /autoAnimate/],
    filenames: [/auto-animate/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.8,
    scripts: [/useAutoAnimate\s*\(/, /autoAnimate\s*\(/],
  },
];
