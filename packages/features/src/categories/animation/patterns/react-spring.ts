export const reactSpring = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\@react-spring\//, /react-spring/],
    filenames: [/react-spring/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.8,
    scripts: [/useSpring\s*\(/, /useSprings\s*\(/, /useTrail\s*\(/, /useTransition\s*\(/, /animated\./],
  },
];
