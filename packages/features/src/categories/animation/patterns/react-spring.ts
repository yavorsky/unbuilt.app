// React Spring — focus on package references and unique string identifiers
export const reactSpring = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/react-spring[.\-@/]/, /@react-spring\//],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"react-spring"/, // Package self-reference
      /"@react-spring\/web"/, // Scoped package name
      /"@react-spring\/core"/,
      /"SpringValue"/, // Internal class name (preserved as string in React DevTools)
      /"SpringRef"/, // Internal class name
    ],
  },
];
