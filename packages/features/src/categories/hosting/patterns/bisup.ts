export const bisup = [
  {
    name: 'hostingHeader' as const,
    score: 1,
    headers: {
      'x-bisup-hosting': /^Bisup(?:,\s*Bisup)*$/i,
    },
  },
];
