// AutoAnimate — focus on package references
export const autoAnimate = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/@formkit\/auto-animate[.\-@/]/, /auto-animate/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"@formkit\/auto-animate"/, // Package self-reference
      /"autoAnimate"/, // Named export as string
    ],
  },
];
