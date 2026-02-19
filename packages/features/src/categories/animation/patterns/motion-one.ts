// Motion One — focus on package references (the API names like animate(), timeline() are too generic)
export const motionOne = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/@motionone\//, /motion-one/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"@motionone\/dom"/, // Package self-reference
      /"@motionone\/animation"/,
      /"@motionone\/utils"/,
    ],
  },
];
