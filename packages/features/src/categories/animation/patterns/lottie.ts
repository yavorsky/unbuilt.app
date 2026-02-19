export const lottie = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/lottie-web/, /lottie-player/, /\@lottiefiles\//],
    filenames: [/lottie/],
  },
  {
    name: 'domMarkers' as const,
    score: 0.8,
    documents: [/lottie-player/, /dotlottie-player/],
    scripts: [/lottie\.loadAnimation\s*\(/, /bodymovin/],
  },
];
