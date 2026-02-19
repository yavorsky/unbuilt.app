export const daisyui = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/daisyui/],
    filenames: [/daisyui/],
    stylesheets: [/daisyui/],
  },
  {
    name: 'classPatterns' as const,
    score: 0.9,
    documents: [/class="[^"]*\bbtn\b[^"]*".*class="[^"]*\bcard\b/, /class="[^"]*\bdaisy-/, /class="[^"]*\bdrawer\b/],
  },
];
